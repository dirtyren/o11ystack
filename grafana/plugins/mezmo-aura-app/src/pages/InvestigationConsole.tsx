import React, { useCallback, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PluginPage } from '@grafana/runtime';
import { Badge, Button, Icon, Spinner, useStyles2 } from '@grafana/ui';
import { AuraApiClient } from '../api';
import { PLUGIN_ID, QUICK_PROMPTS } from '../constants';
import {
  clearSession,
  INVESTIGATION_STORE_VERSION,
  InFlightRecord,
  loadSession,
  PersistedSession,
  saveSession,
} from '../state/investigationStore';
import { A2aTask, AuraHealthResponse, ChatMessage } from '../types';
import { NavigationHeader } from '../components/NavigationHeader/NavigationHeader';
import { LiveTelemetrySidebar } from '../components/LiveTelemetrySidebar/LiveTelemetrySidebar';
import { MarkdownRenderer } from '../components/MarkdownRenderer/MarkdownRenderer';

function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getCurrentTimestamp(): string {
  return new Date().toLocaleTimeString();
}

function getTimestampMs(): number {
  return Date.now();
}

// Extract the final assistant answer from a completed A2A task. AURA streams
// the reply as artifacts and records only the prompt in `history`; the complete
// answer lives in the artifact with `artifactId === "final"`.
function extractAssistantAnswer(task: A2aTask): string {
  const finalArtifact = task.artifacts?.find((a) => a.artifactId === 'final');
  if (finalArtifact) {
    const text = finalArtifact.parts
      .filter((p) => p.kind === 'text')
      .map((p) => p.text || '')
      .join('\n');
    if (text) {
      return text;
    }
  }
  const anyArtifactText = task.artifacts
    ?.flatMap((a) => a.parts)
    .filter((p) => p.kind === 'text')
    .map((p) => p.text || '')
    .join('\n');
  if (anyArtifactText) {
    return anyArtifactText;
  }
  const agentMsg = [...(task.history ?? [])].reverse().find((m) => m.role === 'agent');
  if (agentMsg) {
    return agentMsg.parts
      .filter((p) => p.kind === 'text')
      .map((p) => p.text || '')
      .join('\n');
  }
  return '';
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export const InvestigationConsole: React.FC = () => {
  const s = useStyles2(getStyles);

  // Persisted investigation session (localStorage), scoped per Grafana org/user/app.
  const [loadedSession] = useState<PersistedSession | null>(() => loadSession(PLUGIN_ID));
  const createdAtRef = useRef<number>(loadedSession?.createdAt ?? getTimestampMs());
  const isMountedRef = useRef<boolean>(true);

  // States
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadedSession?.messages ?? []);
  const [inputText, setInputText] = useState(() => loadedSession?.inputDraft ?? '');
  const [isInvestigating, setIsInvestigating] = useState<boolean>(() => !!loadedSession?.inFlight);
  const [health, setHealth] = useState<AuraHealthResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState<string>(
    () => loadedSession?.activeModel || 'Aura SRE Orchestrator'
  );
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [activeElapsedMs, setActiveElapsedMs] = useState<number>(0);
  const [inFlight, setInFlight] = useState<InFlightRecord | null>(() => loadedSession?.inFlight ?? null);
  const [contextId, setContextId] = useState<string | null>(() => loadedSession?.contextId ?? null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pollTimerRef = useRef<number | null>(null);

  // Track mount state so an investigation that finishes after the user navigates
  // away does not attempt to update an unmounted component.
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Persist the investigation session whenever any state that matters changes.
  // Writes synchronously on commit, so navigating away mid-investigation always
  // leaves the latest state (including an in-flight marker) in storage.
  useEffect(() => {
    saveSession(PLUGIN_ID, {
      schemaVersion: INVESTIGATION_STORE_VERSION,
      messages,
      inputDraft: inputText,
      activeModel,
      contextId,
      createdAt: createdAtRef.current,
      updatedAt: Date.now(),
      inFlight,
    });
  }, [messages, inputText, activeModel, contextId, inFlight]);

  // Live investigation duration timer, computed from the in-flight task's
  // startedAt so it remains correct after re-attaching to a background task.
  useEffect(() => {
    if (!isInvestigating) {
      return;
    }
    const startedAt = inFlight?.startedAt ?? getTimestampMs();
    const tick = () => {
      setActiveElapsedMs(getTimestampMs() - startedAt);
    };
    tick();
    const timer = setInterval(tick, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isInvestigating, inFlight?.startedAt]);

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId((current) => (current === id ? null : current));
    }, 2000);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isInvestigating]);

  // Initial Poll & Health Check
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const res = await AuraApiClient.getHealth();
        if (mounted) {
          setHealth(res.data);
          setLatencyMs(res.latencyMs);
        }
      } catch {
        if (mounted) {
          setHealth({ status: 'unreachable' });
          setLatencyMs(null);
        }
      }

      try {
        const models = await AuraApiClient.getModels();
        if (mounted && models.length > 0) {
          setActiveModel(models[0].id);
        }
      } catch {
        // ignore
      }
    };

    const initialTimer = setTimeout(fetchStatus, 0);
    const intervalTimer = setInterval(fetchStatus, 15000);

    return () => {
      mounted = false;
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  // Poll an A2A task until it completes, then append the result (or error).
  const pollTask = useCallback(async (taskId: string, startedAt: number) => {
    try {
      const task = await AuraApiClient.getA2aTask(taskId);
      if (!isMountedRef.current) {
        return;
      }
      const state = task.status.state;
      if (state === 'completed') {
        const answer = extractAssistantAnswer(task);
        const assistantMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: answer || '(Investigation completed with no text output.)',
          timestamp: getCurrentTimestamp(),
          elapsedMs: getTimestampMs() - startedAt,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setInFlight(null);
        setIsInvestigating(false);
        setActiveElapsedMs(0);
      } else if (state === 'failed' || state === 'canceled' || state === 'rejected') {
        const detail =
          task.status.message?.parts
            ?.filter((p) => p.kind === 'text')
            .map((p) => p.text || '')
            .join('\n') || `Investigation ${state}.`;
        const errorMsg: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: `🔴 **Investigation Error**: ${detail}`,
          timestamp: getCurrentTimestamp(),
          isError: true,
          elapsedMs: getTimestampMs() - startedAt,
        };
        setMessages((prev) => [...prev, errorMsg]);
        setInFlight(null);
        setIsInvestigating(false);
        setActiveElapsedMs(0);
      }
      // otherwise still working/submitted/unknown — keep polling
    } catch {
      // Transient poll error; keep polling. The task continues server-side.
    }
  }, []);

  const startPolling = useCallback(
    (taskId: string, startedAt: number) => {
      if (pollTimerRef.current) {
        window.clearInterval(pollTimerRef.current);
      }
      void pollTask(taskId, startedAt);
      pollTimerRef.current = window.setInterval(() => {
        void pollTask(taskId, startedAt);
      }, 2500);
    },
    [pollTask]
  );

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // Re-attach to a persisted in-flight task on mount (background continuation):
  // if the user navigated away mid-investigation, this resumes polling the same
  // task so it shows as "in progress" or "completed" instead of re-running.
  useEffect(() => {
    const persisted = loadedSession?.inFlight;
    if (!persisted) {
      return;
    }
    // Defer so the effect body does not call setState synchronously (pollTask
    // updates state after its async fetch resolves).
    const initialTimer = window.setTimeout(() => {
      startPolling(persisted.taskId, persisted.startedAt);
    }, 0);
    return () => {
      window.clearTimeout(initialTimer);
      stopPolling();
    };
    // Run once on mount; startPolling/stopPolling are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send message
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isInvestigating) {
      return;
    }

    const userMsg: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: text,
      timestamp: getCurrentTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsInvestigating(true);

    const startedAt = getTimestampMs();

    try {
      const task = await AuraApiClient.sendA2aMessage({
        messageId: userMsg.id,
        text,
        contextId,
      });
      if (!isMountedRef.current) {
        return;
      }
      const taskId = task.id;
      const taskContextId = task.contextId;
      if (taskContextId) {
        setContextId(taskContextId);
      }
      setInFlight({
        status: 'running',
        taskId,
        contextId: taskContextId,
        prompt: text,
        startedAt,
      });
      startPolling(taskId, startedAt);
    } catch (err: any) {
      if (!isMountedRef.current) {
        return;
      }
      const errorMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: `🔴 **Investigation Error**: ${err.message || 'Unable to start the AURA investigation.'}`,
        timestamp: getCurrentTimestamp(),
        isError: true,
        elapsedMs: getTimestampMs() - startedAt,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsInvestigating(false);
      setInFlight(null);
      setActiveElapsedMs(0);
    }
  };

  // Re-send the user prompt that preceded a failed investigation. The agent
  // fails fast on provider/MCP errors, so the user drives the retry explicitly.
  const handleRetry = (errorMsgId: string) => {
    if (isInvestigating) {
      return;
    }
    const errorIdx = messages.findIndex((m) => m.id === errorMsgId);
    const prompt = messages
      .slice(0, errorIdx)
      .reverse()
      .find((m) => m.role === 'user')?.content;
    if (prompt) {
      void handleSend(prompt);
    }
  };

  const handleClear = () => {
    stopPolling();
    clearSession(PLUGIN_ID);
    createdAtRef.current = getTimestampMs();
    setMessages([]);
    setInFlight(null);
    setContextId(null);
    setInputText('');
    setIsInvestigating(false);
    setActiveElapsedMs(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PluginPage>
      <div className={s.pageContainer}>
        {/* Navigation & Status Header */}
        <NavigationHeader
          health={health}
          latencyMs={latencyMs}
          activeModel={activeModel}
        />

        {/* Main Content Layout: Workspace + Sidebar */}
        <div className={s.layoutGrid}>
          {/* Main Investigation Chat Workspace */}
          <section className={s.workspace}>
            {/* Workspace Control Bar */}
            <div className={s.workspaceHeader}>
              <div className={s.workspaceTitleGroup}>
                <Icon name="code-branch" className={s.iconBlue} />
                <span className={s.workspaceTitle}>Autonomous SRE Investigation Console</span>
                <Badge text="LIVE GATEWAY" color="blue" />
              </div>
              <div className={s.workspaceActions}>
                <Button
                  size="sm"
                  variant="secondary"
                  fill="outline"
                  icon="trash-alt"
                  onClick={handleClear}
                  disabled={messages.length === 0 && !isInvestigating}
                >
                  Clear Console
                </Button>
              </div>
            </div>

            {/* Scrollable Message Feed */}
            <div className={s.messagesFeed}>
              {/* Default Welcome Message when empty */}
              {messages.length === 0 && (
                <div className={s.welcomeCard}>
                  <div className={s.welcomeHeader}>
                    <div className={s.avatarAI}>AI</div>
                    <div>
                      <span className={s.welcomeSender}>Mezmo AURA SRE Orchestrator &bull; Multi-Agent Gateway</span>
                      <h3 className={s.welcomeTitle}>System Online &amp; Autonomous Telemetry Connected</h3>
                    </div>
                  </div>
                  <div className={s.welcomeBody}>
                    <p>
                      I am your autonomous <strong>Site Reliability Engineering (SRE)</strong> partner. I investigate incidents by orchestrating tasks across <strong>216 live Model Context Protocol (MCP)</strong> tools:
                    </p>
                    <ul className={s.welcomeList}>
                      <li>
                        <strong>Metrics Analyst</strong>: PromQL telemetry queries against <code>VictoriaMetrics TSDB</code>.
                      </li>
                      <li>
                        <strong>Log Analyst</strong>: LogSQL pattern search &amp; error clustering in <code>VictoriaLogs</code>.
                      </li>
                      <li>
                        <strong>Trace Analyst</strong>: Distributed span and latency inspection in <code>VictoriaTraces</code>.
                      </li>
                      <li>
                        <strong>Incident Responder</strong>: Grafana alert rules, firing states, and dashboards.
                      </li>
                    </ul>
                    <p className={s.welcomeHint}>
                      Click one of the 1-click automated investigation prompts below, or type your custom incident query.
                    </p>
                  </div>
                </div>
              )}

              {/* Chat Message History */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={msg.role === 'user' ? s.messageRowUser : s.messageRowAssistant}
                >
                  <div className={msg.role === 'user' ? s.avatarUser : s.avatarAI}>
                    {msg.role === 'user' ? 'YOU' : 'AI'}
                  </div>
                  <div className={s.messageContent}>
                    <div className={s.messageMeta}>
                      <div className={s.metaLeft}>
                        <span className={s.msgSender}>
                          {msg.role === 'user' ? 'Operator' : 'Mezmo AURA SRE Orchestrator'}
                        </span>
                        <span className={s.msgTime}>{msg.timestamp}</span>
                        {msg.elapsedMs !== undefined && (
                          <span
                            className={s.elapsedBadge}
                            title={`Investigation completed in ${formatDuration(msg.elapsedMs)} (${msg.elapsedMs} ms)`}
                          >
                            <Icon name="clock-nine" size="xs" />
                            <span>{formatDuration(msg.elapsedMs)}</span>
                          </span>
                        )}
                      </div>
                      {msg.role === 'assistant' && (
                        <div className={s.metaActions}>
                          {msg.isError && (
                            <Button
                              size="xs"
                              variant="primary"
                              fill="outline"
                              icon="play"
                              onClick={() => handleRetry(msg.id)}
                              className={s.copyBtn}
                              disabled={isInvestigating}
                            >
                              Retry
                            </Button>
                          )}
                          <Button
                            size="xs"
                            variant="secondary"
                            fill="outline"
                            icon={copiedMessageId === msg.id ? 'check' : 'copy'}
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className={s.copyBtn}
                          >
                            {copiedMessageId === msg.id ? 'Copied' : 'Copy Investigation'}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className={msg.role === 'user' ? s.bubbleUser : s.bubbleAssistant}>
                      {msg.role === 'user' ? (
                        <p className={s.userText}>{msg.content}</p>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Active Thinking State Spinner */}
              {isInvestigating && (
                <div className={s.messageRowAssistant}>
                  <div className={s.avatarAI}>AI</div>
                  <div className={s.messageContent}>
                    <div className={s.messageMeta}>
                      <div className={s.metaLeft}>
                        <span className={s.msgSender}>Mezmo AURA SRE Orchestrator</span>
                        <span className={s.elapsedBadgeActive} title="Investigation in progress">
                          <Icon name="clock-nine" size="xs" />
                          <span>{formatDuration(activeElapsedMs)}</span>
                        </span>
                      </div>
                    </div>
                    <div className={s.thinkingBubble}>
                      <Spinner size={18} inline />
                      <span className={s.thinkingText}>
                        Investigation running in the background — you can navigate away and it will keep going...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 1-Click SRE Automated Investigations Chips */}
            <div className={s.quickChipsBar}>
              <span className={s.quickChipsLabel}>1-Click Automated Investigations:</span>
              <div className={s.chipsScroll}>
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.id}
                    className={s.quickChip}
                    onClick={() => handleSend(qp.prompt)}
                    disabled={isInvestigating}
                    title={qp.prompt}
                  >
                    <span>{qp.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className={s.inputBar}>
              <div className={s.inputWrapper}>
                <textarea
                  ref={textareaRef}
                  className={s.textarea}
                  rows={2}
                  value={inputText}
                  placeholder="Ask AURA to investigate an incident (defaults to last 5 minutes of telemetry unless specified)... [Press Enter to send, Shift+Enter for newline]"
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isInvestigating}
                />
              </div>
              <Button
                variant="primary"
                size="md"
                icon={isInvestigating ? undefined : 'arrow-right'}
                onClick={() => handleSend()}
                disabled={!inputText.trim() || isInvestigating}
              >
                {isInvestigating ? 'Investigating...' : 'Investigate'}
              </Button>
            </div>
          </section>

          {/* Right Sidebar */}
          <LiveTelemetrySidebar health={health} latencyMs={latencyMs} />
        </div>
      </div>
    </PluginPage>
  );
};

export default InvestigationConsole;

const getStyles = (theme: GrafanaTheme2) => ({
  pageContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 120px);
  `,
  layoutGrid: css`
    display: flex;
    gap: ${theme.spacing(2)};
    align-items: flex-start;
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  `,
  workspace: css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    box-shadow: ${theme.shadows.z1};
    overflow: hidden;
  `,
  workspaceHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing(1, 2)};
    background: ${theme.colors.background.secondary};
    border-bottom: 1px solid ${theme.colors.border.weak};
  `,
  workspaceTitleGroup: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
  workspaceTitle: css`
    font-size: 0.95rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
  `,
  iconBlue: css`
    color: #3b82f6;
  `,
  workspaceActions: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
  messagesFeed: css`
    flex: 1;
    min-height: 480px;
    max-height: 620px;
    overflow-y: auto;
    padding: ${theme.spacing(2)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    background: ${theme.colors.background.canvas};
  `,
  welcomeCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
    box-shadow: ${theme.shadows.z1};
  `,
  welcomeHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(1.5)};
  `,
  welcomeSender: css`
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  welcomeTitle: css`
    font-size: 1.1rem;
    font-weight: 700;
    color: #38bdf8;
    margin: 2px 0 0 0;
  `,
  welcomeBody: css`
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${theme.colors.text.primary};
  `,
  welcomeList: css`
    margin: ${theme.spacing(1, 0, 1.5, 2.5)};
    padding: 0;
    li {
      margin-bottom: 6px;
    }
  `,
  welcomeHint: css`
    font-size: 0.8rem;
    color: ${theme.colors.text.secondary};
    margin: 0;
  `,
  messageRowUser: css`
    display: flex;
    gap: ${theme.spacing(1.5)};
    align-self: flex-end;
    max-width: 85%;
    flex-direction: row-reverse;
  `,
  messageRowAssistant: css`
    display: flex;
    gap: ${theme.spacing(1.5)};
    align-self: flex-start;
    max-width: 95%;
  `,
  avatarAI: css`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: linear-gradient(135deg, #1e3a8a, #0284c7);
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 800;
    font-family: ${theme.typography.fontFamilyMonospace};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
  `,
  avatarUser: css`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    color: ${theme.colors.text.primary};
    font-size: 0.7rem;
    font-weight: 700;
    font-family: ${theme.typography.fontFamilyMonospace};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  messageContent: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    width: 100%;
  `,
  messageMeta: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    min-height: 24px;
  `,
  metaLeft: css`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  `,
  metaActions: css`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  `,
  elapsedBadge: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(59, 130, 246, 0.12);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: 12px;
    padding: 1px 7px;
    font-size: 0.7rem;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: 600;
  `,
  elapsedBadgeActive: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(245, 158, 11, 0.12);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 12px;
    padding: 1px 7px;
    font-size: 0.7rem;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: 600;
  `,
  copyBtn: css`
    font-size: 0.7rem;
    padding: 2px 8px;
    height: 22px;
  `,
  msgSender: css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
  `,
  msgTime: css`
    font-size: 0.7rem;
    color: ${theme.colors.text.disabled};
  `,
  bubbleUser: css`
    background: ${theme.colors.primary.main};
    color: ${theme.colors.primary.contrastText};
    padding: ${theme.spacing(1, 1.5)};
    border-radius: ${theme.shape.radius.default};
    border-top-right-radius: 0;
    font-size: 0.9rem;
    box-shadow: ${theme.shadows.z1};
  `,
  userText: css`
    margin: 0;
    white-space: pre-wrap;
  `,
  bubbleAssistant: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    padding: ${theme.spacing(1.5)};
    border-radius: ${theme.shape.radius.default};
    border-top-left-radius: 0;
    box-shadow: ${theme.shadows.z1};
  `,
  thinkingBubble: css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-left: 3px solid #38bdf8;
    padding: ${theme.spacing(1.25, 1.5)};
    border-radius: ${theme.shape.radius.default};
  `,
  thinkingText: css`
    font-size: 0.85rem;
    color: #38bdf8;
    font-family: ${theme.typography.fontFamilyMonospace};
  `,
  quickChipsBar: css`
    padding: ${theme.spacing(1, 2)};
    background: ${theme.colors.background.secondary};
    border-top: 1px solid ${theme.colors.border.weak};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  `,
  quickChipsLabel: css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  chipsScroll: css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,
  quickChip: css`
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    color: ${theme.colors.text.primary};
    padding: 4px 10px;
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover:not(:disabled) {
      border-color: #38bdf8;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  inputBar: css`
    display: flex;
    align-items: flex-end;
    gap: ${theme.spacing(1.5)};
    padding: ${theme.spacing(1.5, 2)};
    background: ${theme.colors.background.secondary};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  inputWrapper: css`
    flex: 1;
  `,
  textarea: css`
    width: 100%;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1)};
    color: ${theme.colors.text.primary};
    font-family: ${theme.typography.fontFamily};
    font-size: 0.9rem;
    line-height: 1.4;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    &:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 1px #38bdf8;
    }
  `,
});
