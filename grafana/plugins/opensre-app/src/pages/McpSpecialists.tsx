import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PluginPage } from '@grafana/runtime';
import { Badge, Icon, useStyles2 } from '@grafana/ui';
import { OpenSreApiClient } from '../api';
import { OPEN_SRE_INTEGRATIONS } from '../constants';
import { OpenSreHealthResponse } from '../types';
import { NavigationHeader } from '../components/NavigationHeader/NavigationHeader';

export const McpSpecialists: React.FC = () => {
  const s = useStyles2(getStyles);
  const [health, setHealth] = useState<OpenSreHealthResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    OpenSreApiClient.getHealth().then((res) => {
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
              <Badge text="OPEN SOURCE AI SRE" color="green" />
              <Badge text="60+ VENDOR INTEGRATIONS" color="blue" />
              <Badge text="LITELLM PROXY ROUTING" color="purple" />
            </div>
            <h2 className={s.bannerTitle}>Active Observability Integrations &amp; SRE Tool Fleet</h2>
            <p className={s.bannerDesc}>
              OpenSRE connects directly to your existing production infrastructure — querying VictoriaLogs with LogSQL, VictoriaMetrics with PromQL, inspecting Grafana alerts and dashboards, and routing inference through your shared LiteLLM proxy.
            </p>
          </div>

          {/* Integrations Cards */}
          <div className={s.specialistGrid}>
            {OPEN_SRE_INTEGRATIONS.map((item) => (
              <div key={item.name} className={s.workerCard}>
                <div className={s.workerTop}>
                  <div className={s.workerTitleGroup}>
                    <div className={s.workerIconWrapper}>
                      <Icon name={item.icon as any} className={s.workerIcon} />
                    </div>
                    <div>
                      <h4 className={s.workerName}>{item.name}</h4>
                      <span className={s.workerRole}>{item.category}</span>
                    </div>
                  </div>
                  <Badge
                    text={item.status.toUpperCase()}
                    color={item.status === 'connected' ? 'green' : item.status === 'configured' ? 'blue' : 'orange'}
                  />
                </div>

                <p className={s.workerDesc}>{item.description}</p>

                <div className={s.workerMetaRow}>
                  <span className={s.metaLabel}>Endpoint:</span>
                  <span className={s.metaValue}>{item.endpoint}</span>
                </div>

                <div className={s.workerMetaRow}>
                  <span className={s.metaLabel}>Protocol:</span>
                  <code className={s.langBadge}>{item.protocol}</code>
                </div>

                <div className={s.toolsSection}>
                  <span className={s.toolsHeader}>Available Capabilities:</span>
                  <div className={s.toolChips}>
                    {item.tools.map((tool) => (
                      <span key={tool} className={s.toolChip}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SRE Investigation Philosophy */}
          <div className={s.policyCard}>
            <div className={s.policyHeader}>
              <Icon name="check-circle" className={s.iconCyan} />
              <h3 className={s.policyTitle}>OpenSRE Investigation &amp; Blast Radius Philosophy</h3>
            </div>
            <p className={s.policyText}>
              Unlike conventional query bots, OpenSRE performs multi-step root-cause analysis (RCA) across your full stack:
            </p>
            <div className={s.policyGrid}>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>VictoriaLogs Engine</span>
                <span className={s.policyRule}>Correlates error spikes and panic traces across microservices via LogSQL queries.</span>
              </div>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>VictoriaMetrics TSDB</span>
                <span className={s.policyRule}>Executes PromQL instant and range queries to isolate CPU/memory starvation.</span>
              </div>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>Grafana Dashboards</span>
                <span className={s.policyRule}>Verifies active alerts, provisioned datasources, and alert rule evaluation states.</span>
              </div>
              <div className={s.policyItem}>
                <span className={s.policyDomain}>Unified LiteLLM Routing</span>
                <span className={s.policyRule}>Leverages the exact same model (<code>aura-sre-model</code>) and Redis prompt cache as AURA.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PluginPage>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 80px);
    background: ${theme.colors.background.canvas};
  `,
  content: css`
    padding: ${theme.spacing(0, 3, 4)};
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  `,
  headerBanner: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(3)};
    margin-bottom: ${theme.spacing(3)};
  `,
  badgeRow: css`
    display: flex;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1.5)};
    flex-wrap: wrap;
  `,
  bannerTitle: css`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0 0 ${theme.spacing(1)} 0;
  `,
  bannerDesc: css`
    color: ${theme.colors.text.secondary};
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    max-width: 1000px;
  `,
  specialistGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: ${theme.spacing(2.5)};
    margin-bottom: ${theme.spacing(3)};
  `,
  workerCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2.5)};
    display: flex;
    flex-direction: column;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    &:hover {
      border-color: #00D2FF;
      box-shadow: 0 4px 16px rgba(0, 210, 255, 0.12);
    }
  `,
  workerTop: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${theme.spacing(1.5)};
  `,
  workerTitleGroup: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1.5)};
  `,
  workerIconWrapper: css`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(0, 210, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  workerIcon: css`
    color: #00D2FF;
    font-size: 1.25rem;
  `,
  workerName: css`
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    color: ${theme.colors.text.primary};
  `,
  workerRole: css`
    font-size: 0.8rem;
    color: ${theme.colors.text.secondary};
  `,
  workerDesc: css`
    font-size: 0.875rem;
    color: ${theme.colors.text.secondary};
    line-height: 1.4;
    margin-bottom: ${theme.spacing(2)};
    flex-grow: 1;
  `,
  workerMetaRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    padding: ${theme.spacing(0.5, 0)};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  metaLabel: css`
    color: ${theme.colors.text.secondary};
  `,
  metaValue: css`
    font-family: monospace;
    color: ${theme.colors.text.primary};
  `,
  langBadge: css`
    background: ${theme.colors.background.canvas};
    padding: ${theme.spacing(0.2, 0.6)};
    border-radius: 4px;
    font-size: 0.75rem;
    border: 1px solid ${theme.colors.border.weak};
  `,
  toolsSection: css`
    margin-top: ${theme.spacing(1.5)};
    padding-top: ${theme.spacing(1.5)};
    border-top: 1px solid ${theme.colors.border.weak};
  `,
  toolsHeader: css`
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${theme.spacing(1)};
  `,
  toolChips: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(0.75)};
  `,
  toolChip: css`
    background: rgba(0, 210, 255, 0.08);
    border: 1px solid rgba(0, 210, 255, 0.25);
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.72rem;
    padding: 2px 6px;
    color: #00D2FF;
  `,
  policyCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(3)};
  `,
  policyHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1)};
  `,
  iconCyan: css`
    color: #00D2FF;
    font-size: 1.25rem;
  `,
  policyTitle: css`
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    color: ${theme.colors.text.primary};
  `,
  policyText: css`
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: ${theme.spacing(2)};
  `,
  policyGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing(1.5)};
  `,
  policyItem: css`
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 6px;
    padding: ${theme.spacing(1.5)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
  `,
  policyDomain: css`
    font-size: 0.8rem;
    font-weight: 700;
    color: #00D2FF;
  `,
  policyRule: css`
    font-size: 0.78rem;
    color: ${theme.colors.text.secondary};
    line-height: 1.4;
  `,
});

export default McpSpecialists;
