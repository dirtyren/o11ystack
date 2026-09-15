import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Badge, Button, Icon, Tab, TabsBar, Tooltip, useStyles2 } from '@grafana/ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { prefixRoute } from '../../utils/utils.routing';
import { OpenSreHealthResponse } from '../../types';

interface Props {
  health?: OpenSreHealthResponse | null;
  latencyMs?: number | null;
  activeModel?: string;
  isPolling?: boolean;
}

export const NavigationHeader: React.FC<Props> = ({ health, latencyMs, activeModel }) => {
  const s = useStyles2(getStyles);
  const navigate = useNavigate();
  const location = useLocation();

  const isConsole = location.pathname.endsWith('/console') || location.pathname.endsWith(ROUTES.Console) || !location.pathname.includes('/');
  const isTraces = location.pathname.includes('/traces');
  const isIntegrations = location.pathname.includes('/integrations');

  const isHealthy = health?.status === 'healthy';
  const isDegraded = health?.status === 'degraded';

  return (
    <header className={s.header}>
      <div className={s.topRow}>
        <div className={s.brandGroup}>
          <div className={s.logoWrapper}>
            <svg viewBox="0 0 100 100" width="32" height="32">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="#080c14" stroke="#00D2FF" strokeWidth="4"/>
              <circle cx="50" cy="50" r="18" fill="none" stroke="#27E99F" strokeWidth="3.5"/>
              <line x1="50" y1="12" x2="50" y2="32" stroke="#00D2FF" strokeWidth="3"/>
              <line x1="50" y1="68" x2="50" y2="88" stroke="#00D2FF" strokeWidth="3"/>
              <line x1="16" y1="50" x2="32" y2="50" stroke="#00D2FF" strokeWidth="3"/>
              <line x1="68" y1="50" x2="84" y2="50" stroke="#00D2FF" strokeWidth="3"/>
              <circle cx="50" cy="50" r="6" fill="#27E99F"/>
            </svg>
          </div>
          <div>
            <div className={s.titleRow}>
              <span className={s.brandTitle}>OPENSRE</span>
              <span className={s.brandSub}>AI SRE AGENT</span>
              <Badge text="OPEN SOURCE SRE" color="green" />
            </div>
            <span className={s.tagline}>Autonomous Incident Investigation, TSDB &amp; Log Triage, and ChatOps</span>
          </div>
        </div>

        <div className={s.statusGroup}>
          {/* Health Indicator */}
          <div className={s.statusPill}>
            <span
              className={
                isHealthy
                  ? s.statusDotHealthy
                  : isDegraded
                  ? s.statusDotDegraded
                  : s.statusDotOffline
              }
            />
            <span className={s.statusText}>
              {health ? (isHealthy ? 'ONLINE (200)' : health.status.toUpperCase()) : 'CONNECTING...'}
            </span>
            {latencyMs !== null && latencyMs !== undefined && (
              <span className={s.latencyBadge}>{latencyMs} ms</span>
            )}
          </div>

          {/* Model Pill */}
          {activeModel && (
            <Tooltip content="Active LLM Model (routed via LiteLLM Proxy)">
              <div className={s.modelPill}>
                <Icon name="brain" size="sm" className={s.iconCyan} />
                <span>{activeModel}</span>
              </div>
            </Tooltip>
          )}

          {/* Switch to AURA app */}
          <Button
            size="sm"
            variant="secondary"
            fill="outline"
            icon="exchange-alt"
            onClick={() => window.location.href = '/grafana/a/mezmo-aura-app/console'}
          >
            Switch to AURA
          </Button>
        </div>
      </div>

      <div className={s.bottomRow}>
        <TabsBar>
          <Tab
            label="Investigation Console"
            active={isConsole}
            icon="code-branch"
            onChangeTab={() => navigate(prefixRoute(ROUTES.Console))}
          />
          <Tab
            label="Integrations & Fleet"
            active={isIntegrations}
            icon="apps"
            onChangeTab={() => navigate(prefixRoute(ROUTES.Integrations))}
          />
          <Tab
            label="Telemetry & Spans"
            active={isTraces}
            icon="sitemap"
            onChangeTab={() => navigate(prefixRoute(ROUTES.Traces))}
          />
        </TabsBar>

        <div className={s.quickLinks}>
          <Button
            size="xs"
            variant="secondary"
            fill="text"
            icon="file-alt"
            onClick={() => window.open('/vlogs/select/vmui/', '_blank')}
          >
            VictoriaLogs
          </Button>
          <Button
            size="xs"
            variant="secondary"
            fill="text"
            icon="chart-line"
            onClick={() => window.open('/vmetrics/vmui/', '_blank')}
          >
            VictoriaMetrics
          </Button>
          <Button
            size="xs"
            variant="secondary"
            fill="text"
            icon="brain"
            onClick={() => window.open('/litellm/ui/', '_blank')}
          >
            LiteLLM Hub
          </Button>
        </div>
      </div>
    </header>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  header: css`
    display: flex;
    flex-direction: column;
    background: ${theme.colors.background.secondary};
    border-bottom: 1px solid ${theme.colors.border.weak};
    padding: ${theme.spacing(1.5, 2, 0)};
    margin-bottom: ${theme.spacing(2)};
  `,
  topRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing(1.5)};
    flex-wrap: wrap;
    gap: ${theme.spacing(1)};
  `,
  brandGroup: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
  `,
  logoWrapper: css`
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.4));
  `,
  titleRow: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
  brandTitle: css`
    font-weight: 800;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
    color: #00D2FF;
  `,
  brandSub: css`
    font-weight: 600;
    font-size: 0.85rem;
    letter-spacing: 1px;
    color: ${theme.colors.text.secondary};
  `,
  tagline: css`
    display: block;
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    margin-top: 2px;
  `,
  statusGroup: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
  `,
  statusPill: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 16px;
    padding: ${theme.spacing(0.35, 1)};
    font-size: 0.75rem;
  `,
  statusDotHealthy: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px #10b981;
  `,
  statusDotDegraded: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 6px #f59e0b;
  `,
  statusDotOffline: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px #ef4444;
  `,
  statusText: css`
    font-family: monospace;
    font-weight: 600;
  `,
  latencyBadge: css`
    color: ${theme.colors.text.secondary};
    font-size: 0.7rem;
    padding-left: ${theme.spacing(0.5)};
    border-left: 1px solid ${theme.colors.border.weak};
  `,
  modelPill: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.5)};
    background: rgba(0, 210, 255, 0.08);
    border: 1px solid rgba(0, 210, 255, 0.3);
    border-radius: 16px;
    padding: ${theme.spacing(0.35, 1)};
    font-size: 0.75rem;
    font-family: monospace;
    color: #00D2FF;
  `,
  iconCyan: css`
    color: #00D2FF;
  `,
  bottomRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  quickLinks: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.5)};
    margin-bottom: ${theme.spacing(0.5)};
  `,
});
