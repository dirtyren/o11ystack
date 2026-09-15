import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PluginPage } from '@grafana/runtime';
import { Badge, Icon, useStyles2 } from '@grafana/ui';
import { AuraApiClient } from '../api';
import { SPECIALIST_WORKERS } from '../constants';
import { AuraHealthResponse } from '../types';
import { NavigationHeader } from '../components/NavigationHeader/NavigationHeader';

export const McpSpecialists: React.FC = () => {
  const s = useStyles2(getStyles);
  const [health, setHealth] = useState<AuraHealthResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    AuraApiClient.getHealth().then((res) => {
      setHealth(res.data);
      setLatencyMs(res.latencyMs);
    }).catch(() => {});
  }, []);

  return (
    <PluginPage>
      <div className={s.container}>
        <NavigationHeader health={health} latencyMs={latencyMs} />

        <div className={s.content}>
          {/* Header Info */}
          <div className={s.headerBanner}>
            <div className={s.badgeRow}>
              <Badge text="MODEL CONTEXT PROTOCOL" color="purple" />
              <Badge text="216 LIVE MCP TOOLS" color="blue" />
              <Badge text="AUTHENTICATED GATEWAY" color="green" />
            </div>
            <h2 className={s.bannerTitle}>Active Multi-Agent Specialists &amp; MCP Tool Registry</h2>
            <p className={s.bannerDesc}>
              Mezmo AURA coordinates investigations by decomposing user prompts and delegating sub-tasks to domain-specialist workers. Each specialist connects to observability backends via dedicated Model Context Protocol (MCP) servers streamable over HTTP.
            </p>
          </div>

          {/* 4 Specialists Cards */}
          <div className={s.specialistGrid}>
            {SPECIALIST_WORKERS.map((worker) => (
              <div key={worker.name} className={s.workerCard}>
                <div className={s.workerTop}>
                  <div className={s.workerTitleGroup}>
                    <div className={s.workerIconWrapper}>
                      <Icon name={worker.icon as any} className={s.workerIcon} />
                    </div>
                    <div>
                      <h4 className={s.workerName}>{worker.name}</h4>
                      <span className={s.workerRole}>{worker.role}</span>
                    </div>
                  </div>
                  <Badge text="ONLINE" color="green" />
                </div>

                <p className={s.workerDesc}>{worker.description}</p>

                <div className={s.workerMetaRow}>
                  <span className={s.metaLabel}>Backend:</span>
                  <span className={s.metaValue}>{worker.backend}</span>
                </div>

                <div className={s.workerMetaRow}>
                  <span className={s.metaLabel}>Query Dialect:</span>
                  <code className={s.langBadge}>{worker.queryLang}</code>
                </div>

                <div className={s.toolsSection}>
                  <span className={s.toolsHeader}>Connected MCP Tools:</span>
                  <div className={s.toolChips}>
                    {worker.tools.map((tool) => (
                      <span key={tool} className={s.toolChip}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Telemetry Time Window Policy */}
          <div className={s.policyCard}>
            <div className={s.policyHeader}>
              <Icon name="clock-nine" className={s.iconBlue} />
              <h3 className={s.policyTitle}>Telemetry Time Window Policy (5-Minute Default)</h3>
            </div>
            <p className={s.policyText}>
              To prevent LLM context overflows, reduce TSDB load, and focus immediately on active incidents, AURA enforces a strict <strong>last 5 minutes (<code>5m</code>)</strong> default lookback window across all telemetry domains:
            </p>
            <div className={s.policyGrid}>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>VictoriaMetrics</span>
                <span className={s.policyRule}>PromQL rates and range queries default to <code>[5m]</code> (<code>start=now-5m</code>)</span>
              </div>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>VictoriaLogs</span>
                <span className={s.policyRule}>LogSQL filters default to <code>_time:5m</code></span>
              </div>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>VictoriaTraces</span>
                <span className={s.policyRule}>Trace searches default to <code>lookback: 300000ms</code> (5m) and <code>limit: 20</code></span>
              </div>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>Grafana Alerts</span>
                <span className={s.policyRule}>Scoped to firing alerts and state transitions in the last 5 minutes</span>
              </div>
            </div>
            <div className={s.policyTip}>
              <strong>Custom Time Window Overrides:</strong> To investigate an earlier outage or broader historical trend, simply specify the timeframe in your prompt (e.g., <em>&quot;Diagnose elevated latency over the past 2 hours&quot;</em>). AURA will honor your explicit timeframe and override the 5-minute default.
            </div>
          </div>
        </div>
      </div>
    </PluginPage>
  );
};

export default McpSpecialists;

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  content: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2.5)};
  `,
  headerBanner: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-left: 4px solid #8b5cf6;
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  `,
  badgeRow: css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,
  bannerTitle: css`
    font-size: 1.35rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
  `,
  bannerDesc: css`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${theme.colors.text.secondary};
    margin: 0;
    max-width: 900px;
  `,
  specialistGrid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing(2)};
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,
  workerCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
    box-shadow: ${theme.shadows.z1};
  `,
  workerTop: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `,
  workerTitleGroup: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.25)};
  `,
  workerIconWrapper: css`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  workerIcon: css`
    color: #38bdf8;
  `,
  workerName: css`
    font-size: 0.95rem;
    font-weight: 700;
    font-family: ${theme.typography.fontFamilyMonospace};
    color: ${theme.colors.primary.text};
    margin: 0;
  `,
  workerRole: css`
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
  `,
  workerDesc: css`
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${theme.colors.text.primary};
    margin: 0;
  `,
  workerMetaRow: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    padding-top: 4px;
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  metaLabel: css`
    color: ${theme.colors.text.secondary};
  `,
  metaValue: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-weight: 600;
    color: ${theme.colors.text.primary};
  `,
  langBadge: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.75rem;
    background: rgba(56, 189, 248, 0.12);
    color: #38bdf8;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(56, 189, 248, 0.25);
  `,
  toolsSection: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
  `,
  toolsHeader: css`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  `,
  toolChips: css`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  `,
  toolChip: css`
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.7rem;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    padding: 3px 8px;
    border-radius: 4px;
    color: ${theme.colors.text.secondary};
  `,
  policyCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.5)};
  `,
  policyHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `,
  iconBlue: css`
    color: #38bdf8;
  `,
  policyTitle: css`
    font-size: 1.1rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
  `,
  policyText: css`
    font-size: 0.9rem;
    line-height: 1.6;
    color: ${theme.colors.text.primary};
    margin: 0;
    code {
      background: ${theme.colors.background.canvas};
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid ${theme.colors.border.weak};
      font-family: ${theme.typography.fontFamilyMonospace};
    }
  `,
  policyGrid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing(1.5)};
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,
  policyItem: css`
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 6px;
    padding: ${theme.spacing(1.25)};
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,
  policyDomain: css`
    font-size: 0.8rem;
    font-weight: 700;
    color: #38bdf8;
  `,
  policyRule: css`
    font-size: 0.8rem;
    color: ${theme.colors.text.secondary};
    code {
      background: ${theme.colors.background.secondary};
      padding: 1px 4px;
      border-radius: 3px;
      font-family: ${theme.typography.fontFamilyMonospace};
    }
  `,
  policyTip: css`
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: 6px;
    padding: ${theme.spacing(1.25, 1.5)};
    font-size: 0.85rem;
    line-height: 1.5;
    color: ${theme.colors.text.primary};
    strong {
      color: #38bdf8;
    }
  `,
});
