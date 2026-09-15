import React, { useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Badge, Button, Icon, useStyles2 } from '@grafana/ui';
import { AuraHealthResponse } from '../../types';
import { SPECIALIST_WORKERS } from '../../constants';

interface Props {
  health?: AuraHealthResponse | null;
  latencyMs?: number | null;
}

export const LiveTelemetrySidebar: React.FC<Props> = ({ health, latencyMs }) => {
  const s = useStyles2(getStyles);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const copyCli = () => {
    navigator.clipboard.writeText('docker exec -it aura ./aura');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const copyCurl = () => {
    const host = window.location.host;
    const cmd = `curl -k -s -u admin:<BASIC_AUTH_PASSWORD> \\
  -X POST https://${host}/aura/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Check system health"}]}'`;
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
              {health?.status ? health.status.toUpperCase() : 'UNKNOWN'}
            </span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>AURA Version</span>
            <span className={s.statValue}>{health?.aura_version ? `v${health.aura_version}` : '0.2.17'}</span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>Session Store</span>
            <span className={s.statValue}>{health?.session_store?.backend || 'memory'}</span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>MCP Gateway</span>
            <span className={s.statValue}>LiteLLM :4000</span>
          </div>
          <div className={s.statRow}>
            <span className={s.statLabel}>Health Latency</span>
            <span className={s.statValue}>
              {latencyMs !== null && latencyMs !== undefined ? `${latencyMs} ms` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Active MCP Specialist Workers Card */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <Icon name="apps" className={s.iconBlue} />
          <span className={s.cardTitle}>Active MCP Specialists</span>
          <Badge text="216 TOOLS" color="purple" />
        </div>
        <div className={s.workersList}>
          {SPECIALIST_WORKERS.map((worker) => (
            <div key={worker.name} className={s.workerItem}>
              <span className={s.workerDot} />
              <div className={s.workerDetails}>
                <div className={s.workerNameRow}>
                  <span className={s.workerName}>{worker.name}</span>
                  <span className={s.workerLang}>{worker.queryLang}</span>
                </div>
                <span className={s.workerDesc}>{worker.backend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OpenTelemetry AI Reasoning Card */}
      <div className={s.cardGlow}>
        <div className={s.cardHeader}>
          <Icon name="sitemap" className={s.iconCyan} />
          <span className={s.cardTitle}>Reasoning Traces in Grafana</span>
        </div>
        <p className={s.cardText}>
          AURA streams its reasoning steps, subagent delegations, and PromQL/LogSQL queries to VictoriaTraces via OTel spans.
        </p>
        <Button
          size="sm"
          variant="primary"
          icon="compass"
          fullWidth
          onClick={() => {
            window.open(
              '/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%2C%22queries%22%3A%5B%7B%22query%22%3A%22aura%22%2C%22queryType%22%3A%22service%22%7D%5D%7D',
              '_blank'
            );
          }}
        >
          Explore Reasoning Traces
        </Button>
      </div>

      {/* Terminal & API Snippets Card */}
      <div className={s.card}>
        <div className={s.cardHeader}>
          <Icon name="code-branch" className={s.iconBlue} />
          <span className={s.cardTitle}>Terminal CLI &amp; API</span>
        </div>
        <span className={s.subLabel}>Direct REPL client in container:</span>
        <div className={s.snippetBox}>
          <code className={s.snippetCode}>docker exec -it aura ./aura</code>
          <Button
            size="xs"
            variant="secondary"
            fill="outline"
            icon={copiedCli ? 'check' : 'copy'}
            onClick={copyCli}
          >
            {copiedCli ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <span className={s.subLabel} style={{ marginTop: '12px' }}>
          OpenAI-compatible REST API:
        </span>
        <div className={s.snippetBox}>
          <code className={s.snippetCode}>POST /aura/v1/chat/completions</code>
          <Button
            size="xs"
            variant="secondary"
            fill="outline"
            icon={copiedCurl ? 'check' : 'copy'}
            onClick={copyCurl}
          >
            {copiedCurl ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </aside>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  sidebar: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
    width: 320px;
    flex-shrink: 0;
    @media (max-width: 1024px) {
      width: 100%;
    }
  `,
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1.5)};
  `,
  cardGlow: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid #38bdf8;
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1.5)};
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
  `,
  cardHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1.25)};
  `,
  cardTitle: css`
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${theme.colors.text.primary};
    flex: 1;
  `,
  cardText: css`
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    line-height: 1.5;
    margin-bottom: ${theme.spacing(1.25)};
  `,
  iconBlue: css`
    color: #3b82f6;
  `,
  iconCyan: css`
    color: #38bdf8;
  `,
  statList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.75)};
  `,
  statRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    padding-bottom: 4px;
    border-bottom: 1px solid ${theme.colors.border.weak};
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  `,
  statLabel: css`
    color: ${theme.colors.text.secondary};
  `,
  statValue: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  statValueGreen: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: 600;
    color: #10b981;
  `,
  statValueAmber: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: 600;
    color: #f59e0b;
  `,
  workersList: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1)};
  `,
  workerItem: css`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 6px;
    padding: ${theme.spacing(1)};
  `,
  workerDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    margin-top: 5px;
    flex-shrink: 0;
    box-shadow: 0 0 6px #10b981;
  `,
  workerDetails: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow: hidden;
  `,
  workerNameRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  workerName: css`
    font-size: 0.8rem;
    font-weight: 600;
    font-family: ${theme.typography.fontFamilyMonospace};
    color: ${theme.colors.primary.text};
  `,
  workerLang: css`
    font-size: 0.65rem;
    background: rgba(59, 130, 246, 0.15);
    color: #38bdf8;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: ${theme.typography.fontFamilyMonospace};
  `,
  workerDesc: css`
    font-size: 0.7rem;
    color: ${theme.colors.text.secondary};
  `,
  subLabel: css`
    display: block;
    font-size: 0.7rem;
    color: ${theme.colors.text.secondary};
    margin-bottom: 4px;
  `,
  snippetBox: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 6px;
    padding: 6px 10px;
    gap: 8px;
  `,
  snippetCode: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.75rem;
    color: ${theme.colors.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
});
