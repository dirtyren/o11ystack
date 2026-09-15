import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { Badge, Button, Icon, Tab, TabsBar, Tooltip, useStyles2 } from '@grafana/ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { prefixRoute } from '../../utils/utils.routing';
import { AuraHealthResponse } from '../../types';

interface Props {
  health?: AuraHealthResponse | null;
  latencyMs?: number | null;
  activeModel?: string;
  isPolling?: boolean;
}

export const NavigationHeader: React.FC<Props> = ({ health, latencyMs, activeModel, isPolling }) => {
  const s = useStyles2(getStyles);
  const navigate = useNavigate();
  const location = useLocation();

  const isConsole = location.pathname.endsWith('/console') || location.pathname.endsWith(ROUTES.Console) || !location.pathname.includes('/');
  const isTraces = location.pathname.includes('/traces');
  const isSpecialists = location.pathname.includes('/specialists');

  const isHealthy = health?.status === 'healthy';
  const isDegraded = health?.status === 'degraded';

  return (
    <header className={s.header}>
      <div className={s.topRow}>
        <div className={s.brandGroup}>
          <div className={s.logoWrapper}>
            <svg viewBox="0 0 100 100" width="32" height="32">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="#080c14" stroke="#3b82f6" strokeWidth="4"/>
              <path d="M25 45 C25 38, 42 34, 48 45 C48 56, 30 56, 25 45 Z" fill="#38bdf8"/>
              <path d="M75 45 C75 38, 58 34, 52 45 C52 56, 70 56, 75 45 Z" fill="#38bdf8"/>
              <line x1="48" y1="44" x2="52" y2="44" stroke="#38bdf8" strokeWidth="3"/>
              <text x="50" y="78" fill="#38bdf8" fontFamily="'JetBrains Mono', monospace" fontWeight="bold" fontSize="14" textAnchor="middle" letterSpacing="1">AURA</text>
            </svg>
          </div>
          <div>
            <div className={s.titleRow}>
              <span className={s.brandTitle}>MEZMO AURA</span>
              <span className={s.brandSub}>SRE AGENT</span>
              <Badge text="AUTONOMOUS TELEMETRY" color="blue" />
            </div>
            <span className={s.tagline}>Autonomous Multi-Agent Observability &amp; Incident Investigation</span>
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
            <Tooltip content="Active LLM Orchestrator Model">
              <div className={s.modelPill}>
                <Icon name="brain" size="sm" className={s.iconBlue} />
                <span>{activeModel}</span>
              </div>
            </Tooltip>
          )}

          {/* Quick Hub Jump */}
          <Button
            size="sm"
            variant="secondary"
            fill="outline"
            icon="external-link-alt"
            onClick={() => window.open('/', '_blank')}
          >
            Platform Hub
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
            label="Reasoning Traces"
            active={isTraces}
            icon="sitemap"
            onChangeTab={() => navigate(prefixRoute(ROUTES.Traces))}
          />
          <Tab
            label="MCP Specialists"
            active={isSpecialists}
            icon="apps"
            onChangeTab={() => navigate(prefixRoute(ROUTES.Specialists))}
          />
        </TabsBar>

        <div className={s.quickLinks}>
          <Button
            size="xs"
            variant="secondary"
            fill="text"
            icon="compass"
            onClick={() => window.open('/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%7D', '_blank')}
          >
            VictoriaTraces
          </Button>
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
            onClick={() => window.open('/vmetrics/select/vmui/', '_blank')}
          >
            VictoriaMetrics
          </Button>
          <Button
            size="xs"
            variant="secondary"
            fill="text"
            icon="cog"
            onClick={() => window.location.href = '/grafana/plugins/mezmo-aura-app'}
          >
            Config
          </Button>
        </div>
      </div>
    </header>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  header: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1.5, 2, 0, 2)};
    margin-bottom: ${theme.spacing(2)};
    box-shadow: ${theme.shadows.z1};
  `,
  topRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${theme.spacing(2)};
    padding-bottom: ${theme.spacing(1.5)};
    border-bottom: 1px solid ${theme.colors.border.weak};
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
    background: #080c14;
    padding: 6px;
    border-radius: 8px;
    border: 1px solid #1e293b;
  `,
  titleRow: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    flex-wrap: wrap;
  `,
  brandTitle: css`
    font-size: 1.25rem;
    font-weight: 800;
    font-family: ${theme.typography.fontFamilyMonospace};
    color: #38bdf8;
    letter-spacing: 0.05em;
  `,
  brandSub: css`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${theme.colors.text.secondary};
    letter-spacing: 0.08em;
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
    gap: 8px;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,
  statusDotHealthy: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  `,
  statusDotDegraded: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  `,
  statusDotOffline: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
  `,
  statusText: css`
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  latencyBadge: css`
    color: ${theme.colors.text.secondary};
    font-size: 0.75rem;
    border-left: 1px solid ${theme.colors.border.weak};
    padding-left: 6px;
  `,
  modelPill: css`
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-family: ${theme.typography.fontFamilyMonospace};
    color: ${theme.colors.text.primary};
  `,
  iconBlue: css`
    color: #38bdf8;
  `,
  bottomRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${theme.spacing(0.5)};
  `,
  quickLinks: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
});
