import React, { useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Badge, Button, Icon, useStyles2 } from '@grafana/ui';
import { OpenSreHealthResponse } from '../../types';
import { OPEN_SRE_INTEGRATIONS } from '../../constants';

interface Props {
  health?: OpenSreHealthResponse | null;
  latencyMs?: number | null;
}

export const LiveTelemetrySidebar: React.FC<Props> = ({ health, latencyMs }) => {
  const s = useStyles2(getStyles);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const copyCli = () => {
    navigator.clipboard.writeText('docker exec -it opensre opensre ask "Check cluster health"');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const copyCurl = () => {
    const host = window.location.host;
    const cmd = `curl -k -s -u admin:<BASIC_AUTH_PASSWORD> \\
  -X POST https://${host}/opensre/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Investigate stack health"}]}'`;
    navigator.clipboard.writeText(cmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const isHealthy = health?.status === 'healthy';

  return (
    <aside className={s.sidebar}>
      {/* Live Agent Telemetry Card */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <Icon name="heart-rate" className={s.iconBlue} />
          <span className={s.cardTitle}>Live Agent Telemetry</span>
        </div>
        <div className={s.statList}>
          <div className={s.statRow}>
            <span className={s.statLabel}>Agent State</span>
            <span className={isHealthy ? s.statValueGreen : s.statValueAmber}>
              {health?.status ? health.status.toUpperCase() : 'CONNECTING'}
            </span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>OpenSRE Version</span>
            <span className={s.statValue}>{health?.version ? `v${health.version}` : 'v0.1.0'}</span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>Active LLM</span>
            <span className={s.statValue}>{health?.model || 'aura-sre-model'}</span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>Model Gateway</span>
            <span className={s.statValue}>LiteLLM :4000</span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>API Latency</span>
            <span className={s.statValue}>
              {latencyMs !== null && latencyMs !== undefined ? `${latencyMs} ms` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Observability Integrations Card */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <Icon name="apps" className={s.iconBlue} />
          <span className={s.cardTitle}>Connected Stack Modules</span>
          <Badge text="6 MODULES" color="blue" />
        </div>
        <div className={s.workersList}>
          {OPEN_SRE_INTEGRATIONS.map((item) => (
            <div key={item.name} className={s.workerItem}>
              <span className={item.status === 'connected' ? s.workerDot : s.workerDotOptional} />
              <div className={s.workerDetails}>
                <div className={s.workerNameRow}>
                  <span className={s.workerName}>{item.name}</span>
                  <span className={s.workerLang}>{item.category}</span>
                </div>
                <span className={s.workerDesc}>{item.protocol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual SRE Agent Notice */}
      <div className={s.cardGlow}>
        <div className={s.cardHeader}>
          <Icon name="exchange-alt" className={s.iconCyan} />
          <span className={s.cardTitle}>Dual SRE Architecture</span>
        </div>
        <p className={s.glowDesc}>
          OpenSRE and Mezmo AURA run concurrently on the same stack. Both share the unified <code>aura-sre-model</code> routed through LiteLLM with Redis caching.
        </p>
        <div className={s.btnGroupVertical}>
          <Button
            size="xs"
            variant="secondary"
            icon="external-link-alt"
            onClick={() => window.open('/grafana/a/mezmo-aura-app/console', '_self')}
          >
            Launch Mezmo AURA App
          </Button>
          <Button
            size="xs"
            variant="secondary"
            fill="outline"
            icon="compass"
            onClick={() => window.open('/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaMetrics%22%7D', '_blank')}
          >
            Explore VictoriaMetrics
          </Button>
        </div>
      </div>

      {/* Terminal & API Shortcuts */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <Icon name="terminal" className={s.iconBlue} />
          <span className={s.cardTitle}>Developer CLI &amp; API</span>
        </div>
        <div className={s.btnGroupVertical}>
          <Button
            size="xs"
            variant="secondary"
            fill="outline"
            icon={copiedCli ? 'check' : 'copy'}
            onClick={copyCli}
          >
            {copiedCli ? 'Copied CLI Command!' : 'Copy Docker CLI Command'}
          </Button>
          <Button
            size="xs"
            variant="secondary"
            fill="outline"
            icon={copiedCurl ? 'check' : 'copy'}
            onClick={copyCurl}
          >
            {copiedCurl ? 'Copied curl Command!' : 'Copy /v1/chat/completions curl'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  sidebar: css`
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  `,
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
  `,
  cardGlow: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid rgba(0, 210, 255, 0.4);
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
    box-shadow: 0 0 16px rgba(0, 210, 255, 0.08);
  `,
  cardHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1.5)};
  `,
  cardTitle: css`
    font-size: 0.9rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    flex-grow: 1;
  `,
  iconBlue: css`
    color: #00D2FF;
  `,
  iconCyan: css`
    color: #27E99F;
  `,
  statList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
  statRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
  `,
  statLabel: css`
    color: ${theme.colors.text.secondary};
  `,
  statValue: css`
    font-family: monospace;
    color: ${theme.colors.text.primary};
    font-weight: 600;
  `,
  statValueGreen: css`
    font-family: monospace;
    color: #10b981;
    font-weight: 700;
  `,
  statValueAmber: css`
    font-family: monospace;
    color: #f59e0b;
    font-weight: 700;
  `,
  workersList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  `,
  workerItem: css`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(0.75)};
    border-radius: 6px;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
  `,
  workerDot: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 4px #10b981;
    margin-top: 5px;
    flex-shrink: 0;
  `,
  workerDotOptional: css`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #f59e0b;
    margin-top: 5px;
    flex-shrink: 0;
  `,
  workerDetails: css`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  `,
  workerNameRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  workerName: css`
    font-size: 0.78rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
  `,
  workerLang: css`
    font-size: 0.7rem;
    color: #00D2FF;
    font-family: monospace;
  `,
  workerDesc: css`
    font-size: 0.72rem;
    color: ${theme.colors.text.secondary};
    line-height: 1.3;
  `,
  glowDesc: css`
    font-size: 0.8rem;
    color: ${theme.colors.text.secondary};
    line-height: 1.4;
    margin-bottom: ${theme.spacing(1.5)};
  `,
  btnGroupVertical: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
});
