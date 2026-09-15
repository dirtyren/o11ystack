import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { PluginPage } from '@grafana/runtime';
import { Badge, Button, Icon, useStyles2 } from '@grafana/ui';
import { AuraApiClient } from '../api';
import { AuraHealthResponse } from '../types';
import { NavigationHeader } from '../components/NavigationHeader/NavigationHeader';

export const InvestigationTraces: React.FC = () => {
  const s = useStyles2(getStyles);
  const [health, setHealth] = useState<AuraHealthResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    AuraApiClient.getHealth().then((res) => {
      setHealth(res.data);
      setLatencyMs(res.latencyMs);
    }).catch(() => {});
  }, []);

  const openExplore = (query?: string) => {
    const q = query || 'aura';
    const exploreUrl = `/grafana/explore?left=%7B%22datasource%22%3A%22VictoriaTraces%22%2C%22queries%22%3A%5B%7B%22query%22%3A%22${encodeURIComponent(
      q
    )}%22%2C%22queryType%22%3A%22service%22%7D%5D%7D`;
    window.open(exploreUrl, '_blank');
  };

  return (
    <PluginPage>
      <div className={s.container}>
        <NavigationHeader health={health} latencyMs={latencyMs} />

        <div className={s.contentCard}>
          <div className={s.hero}>
            <div className={s.heroText}>
              <div className={s.badgeRow}>
                <Badge text="OPENTELEMETRY TRACES" color="blue" />
                <Badge text="VICTORIATRACES BACKEND" color="green" />
                <Badge text="GRAFANA TEMPO COMPATIBLE" color="purple" />
              </div>
              <h2 className={s.heroTitle}>Auditing AURA&apos;s AI Reasoning Waterfall</h2>
              <p className={s.heroDesc}>
                Every investigation initiated in the AURA console emits OpenTelemetry spans to{' '}
                <code>http://otel-collector:4317</code>. This enables SRE operators to trace <em>how the AI thought</em>,
                which subagents were invoked, the exact PromQL/LogSQL queries dispatched to MCP tools, and step latencies.
              </p>
              <div className={s.btnGroup}>
                <Button
                  size="md"
                  variant="primary"
                  icon="compass"
                  onClick={() => openExplore('aura')}
                >
                  Open VictoriaTraces in Grafana Explore
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  fill="outline"
                  icon="external-link-alt"
                  onClick={() => window.open('/vtraces/select/vmui/', '_blank')}
                >
                  Open VictoriaTraces VMUI
                </Button>
              </div>
            </div>
          </div>

          <div className={s.grid}>
            {/* Card 1: What Spans Represent */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <Icon name="sitemap" className={s.iconBlue} />
                <h4 className={s.cardTitle}>Span Hierarchy &amp; Multi-Agent Flow</h4>
              </div>
              <div className={s.waterfallMock}>
                <div className={s.spanRowRoot}>
                  <span className={s.spanName}>orchestrator.investigate</span>
                  <span className={s.spanDuration}>1.82s</span>
                </div>
                <div className={s.spanRowChild1}>
                  <span className={s.spanName}>coordinator.plan</span>
                  <span className={s.spanDuration}>210ms</span>
                </div>
                <div className={s.spanRowChild1}>
                  <span className={s.spanName}>delegate.metrics-analyst</span>
                  <span className={s.spanDuration}>420ms</span>
                </div>
                <div className={s.spanRowChild2}>
                  <span className={s.spanName}>mcp.victoriametrics-instant_query</span>
                  <span className={s.spanDuration}>14ms</span>
                </div>
                <div className={s.spanRowChild1}>
                  <span className={s.spanName}>delegate.log-analyst</span>
                  <span className={s.spanDuration}>510ms</span>
                </div>
                <div className={s.spanRowChild2}>
                  <span className={s.spanName}>mcp.victorialogs-hits</span>
                  <span className={s.spanDuration}>22ms</span>
                </div>
                <div className={s.spanRowChild1}>
                  <span className={s.spanName}>coordinator.synthesize</span>
                  <span className={s.spanDuration}>640ms</span>
                </div>
              </div>
            </div>

            {/* Card 2: How to inspect in Grafana */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <Icon name="search" className={s.iconGreen} />
                <h4 className={s.cardTitle}>How to Inspect in Grafana</h4>
              </div>
              <ol className={s.instructionList}>
                <li>
                  Click the <strong>Open VictoriaTraces in Grafana Explore</strong> button above.
                </li>
                <li>
                  Verify datasource is selected as <strong>VictoriaTraces</strong> (Tempo-compatible).
                </li>
                <li>
                  Set Service Name to <code>aura</code> and click <strong>Run Query</strong>.
                </li>
                <li>
                  Select any trace to expand the complete waterfall:
                  <ul>
                    <li>Coordinator turn depth &amp; planning reasoning.</li>
                    <li>Subagent worker task delegations.</li>
                    <li>Exact PromQL/LogSQL queries passed to MCP tools.</li>
                    <li>Tool execution latency and token generation speed.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </PluginPage>
  );
};

export default InvestigationTraces;

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
  `,
  contentCard: css`
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2.5)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(3)};
  `,
  hero: css`
    display: flex;
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-left: 4px solid #38bdf8;
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2.5)};
  `,
  heroText: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(1.25)};
  `,
  badgeRow: css`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  `,
  heroTitle: css`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
  `,
  heroDesc: css`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${theme.colors.text.secondary};
    margin: 0;
    max-width: 900px;
    code {
      background: ${theme.colors.background.canvas};
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid ${theme.colors.border.weak};
      font-family: ${theme.typography.fontFamilyMonospace};
    }
  `,
  btnGroup: css`
    display: flex;
    gap: ${theme.spacing(1.5)};
    margin-top: ${theme.spacing(1)};
  `,
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing(2)};
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `,
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
  `,
  cardHeader: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(1.5)};
  `,
  cardTitle: css`
    font-size: 1rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
  `,
  iconBlue: css`
    color: #38bdf8;
  `,
  iconGreen: css`
    color: #10b981;
  `,
  waterfallMock: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: ${theme.colors.background.canvas};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: 6px;
    padding: ${theme.spacing(1.5)};
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: 0.8rem;
  `,
  spanRowRoot: css`
    display: flex;
    justify-content: space-between;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.4);
    padding: 6px 10px;
    border-radius: 4px;
    color: #38bdf8;
    font-weight: 600;
  `,
  spanRowChild1: css`
    display: flex;
    justify-content: space-between;
    margin-left: 20px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 5px 8px;
    border-radius: 4px;
    color: #10b981;
  `,
  spanRowChild2: css`
    display: flex;
    justify-content: space-between;
    margin-left: 40px;
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    color: #f59e0b;
    font-size: 0.75rem;
  `,
  spanName: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  spanDuration: css`
    margin-left: 10px;
  `,
  instructionList: css`
    margin: 0 0 0 ${theme.spacing(2)};
    padding: 0;
    font-size: 0.875rem;
    line-height: 1.7;
    color: ${theme.colors.text.primary};
    li {
      margin-bottom: 8px;
    }
    ul {
      margin-top: 4px;
      margin-left: 16px;
    }
    code {
      background: ${theme.colors.background.canvas};
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid ${theme.colors.border.weak};
      font-family: ${theme.typography.fontFamilyMonospace};
    }
  `,
});
