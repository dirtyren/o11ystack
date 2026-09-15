import pluginJson from './plugin.json';
import { QuickPrompt } from './types';

export const PLUGIN_ID = pluginJson.id || 'mezmo-aura-app';
export const PLUGIN_BASE_URL = `/a/${PLUGIN_ID}`;

export enum ROUTES {
  Console = 'console',
  Traces = 'traces',
  Specialists = 'specialists',
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'logs',
    title: 'Log Triage (Last 5m)',
    icon: 'search',
    prompt: 'Analyze error logs and container restarts across the entire stack over the last 5 minutes using VictoriaLogs.',
  },
  {
    id: 'metrics',
    title: 'CPU & RAM (Last 5m)',
    icon: 'chart-line',
    prompt: 'Query VictoriaMetrics for host and container CPU and memory utilization over the last 5 minutes, and report any resource bottlenecks.',
  },
  {
    id: 'traces',
    title: 'Trace Latency (Last 5m)',
    icon: 'bolt',
    prompt: 'Inspect VictoriaTraces for slowest distributed spans and trace latency bottlenecks over the last 5 minutes.',
  },
  {
    id: 'alerts',
    title: 'Firing Alerts (Last 5m)',
    icon: 'bell',
    prompt: 'Check Grafana alert rules, active firing alerts, and provisioned datasource health in the last 5 minutes.',
  },
  {
    id: 'audit',
    title: 'Full SRE Audit (Last 5m)',
    icon: 'shield',
    prompt: 'Perform a comprehensive cross-domain observability health check across metrics, logs, and distributed traces over the last 5 minutes.',
  },
];

export interface WorkerInfo {
  name: string;
  role: string;
  backend: string;
  queryLang: string;
  description: string;
  icon: string;
  tools: string[];
}

export const SPECIALIST_WORKERS: WorkerInfo[] = [
  {
    name: 'metrics-analyst',
    role: 'Metrics Analyst',
    backend: 'VictoriaMetrics TSDB (:8428)',
    queryLang: 'PromQL',
    description: 'Queries VictoriaMetrics instant & range queries to evaluate CPU/RAM/Disk, detect spikes, and calculate resource saturation trends.',
    icon: 'chart-line',
    tools: ['victoriametrics-instant_query', 'victoriametrics-range_query', 'victoriametrics-series'],
  },
  {
    name: 'log-analyst',
    role: 'Log Analyst',
    backend: 'VictoriaLogs Engine (:9428)',
    queryLang: 'LogSQL',
    description: 'Searches logs for error bursts, stack traces, and correlates events across microservices and containers.',
    icon: 'file-alt',
    tools: ['victorialogs-query', 'victorialogs-hits', 'victorialogs-streams'],
  },
  {
    name: 'trace-analyst',
    role: 'Trace Analyst',
    backend: 'VictoriaTraces Engine (:10428)',
    queryLang: 'OTel Spans / Beyla eBPF',
    description: 'Inspects distributed spans captured by Grafana Beyla eBPF, computes p95/p99 latency percentiles, and isolates bottleneck services.',
    icon: 'sitemap',
    tools: ['victoriatraces-search_traces', 'victoriatraces-get_trace', 'victoriatraces-services'],
  },
  {
    name: 'incident-responder',
    role: 'Incident Responder',
    backend: 'Grafana MCP (:8000)',
    queryLang: 'Grafana Alerting & Dashboards API',
    description: 'Inspects active Grafana alert rules, firing states, datasource health statuses, and provisioned dashboard panels.',
    icon: 'shield-exclamation',
    tools: ['grafana-get_alert_rules', 'grafana-list_datasources', 'grafana-check_datasources_health', 'grafana-search_dashboards'],
  },
];
