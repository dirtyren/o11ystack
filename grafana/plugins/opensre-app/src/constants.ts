import pluginJson from './plugin.json';
import { QuickPrompt } from './types';

export const PLUGIN_ID = pluginJson.id || 'opensre-app';
export const PLUGIN_BASE_URL = `/a/${PLUGIN_ID}`;

export enum ROUTES {
  Console = 'console',
  Traces = 'traces',
  Integrations = 'integrations',
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'rca',
    title: 'Incident RCA & Blast Radius',
    icon: 'shield-exclamation',
    prompt: 'Investigate the root cause of active system degradation or service alerts, analyze blast radius across containers, and recommend immediate remediation steps.',
  },
  {
    id: 'logs',
    title: 'VictoriaLogs Pattern Analysis',
    icon: 'search',
    prompt: 'Analyze VictoriaLogs for error bursts, panic stack traces, and correlate log streams across all running services over the last 15 minutes.',
  },
  {
    id: 'metrics',
    title: 'VictoriaMetrics TSDB Triage',
    icon: 'chart-line',
    prompt: 'Query VictoriaMetrics for CPU, memory, network I/O, and disk usage across host and containers to detect saturation spikes and performance anomalies.',
  },
  {
    id: 'grafana',
    title: 'Grafana Alerts & Datasources',
    icon: 'bell',
    prompt: 'Check active Grafana alert rules, firing alerts, and health of provisioned VictoriaMetrics and VictoriaLogs datasources.',
  },
  {
    id: 'audit',
    title: 'Comprehensive SRE Audit',
    icon: 'shield',
    prompt: 'Perform an autonomous end-to-end reliability audit across telemetry, container health, and LiteLLM model routing.',
  },
];

export interface IntegrationInfo {
  name: string;
  category: string;
  endpoint: string;
  protocol: string;
  description: string;
  icon: string;
  tools: string[];
  status: 'connected' | 'configured' | 'optional';
}

export const OPEN_SRE_INTEGRATIONS: IntegrationInfo[] = [
  {
    name: 'LiteLLM Proxy (Model Hub)',
    category: 'AI & Inference',
    endpoint: 'http://litellm:4000/v1',
    protocol: 'OpenAI API (aura-sre-model)',
    description: 'Centralized model routing with unified prompt caching, Redis rate limiting, and spend management.',
    icon: 'brain',
    tools: ['litellm-models', 'litellm-chat_completion', 'redis-prompt-cache'],
    status: 'connected',
  },
  {
    name: 'VictoriaLogs',
    category: 'Log Telemetry',
    endpoint: 'http://victorialogs:9428',
    protocol: 'LogSQL REST API',
    description: 'High-throughput structured log search and pattern correlation across all Docker container log streams.',
    icon: 'file-alt',
    tools: ['victorialogs-query', 'victorialogs-hits', 'victorialogs-streams'],
    status: 'connected',
  },
  {
    name: 'VictoriaMetrics',
    category: 'Metrics TSDB',
    endpoint: 'http://victoriametrics:8428',
    protocol: 'PromQL / TSDB API',
    description: 'Time-series monitoring, PromQL instant & range query execution, and anomaly trend detection.',
    icon: 'chart-line',
    tools: ['victoriametrics-instant_query', 'victoriametrics-range_query', 'victoriametrics-series'],
    status: 'connected',
  },
  {
    name: 'Grafana',
    category: 'Dashboards & Alerting',
    endpoint: 'http://grafana:3000/grafana',
    protocol: 'Grafana REST API / Service Account',
    description: 'Active alert rule inspections, datasource health validation, and dashboard panel visualization.',
    icon: 'tachometer-fast',
    tools: ['grafana-get_alert_rules', 'grafana-list_datasources', 'grafana-search_dashboards'],
    status: 'connected',
  },
  {
    name: 'Model Context Protocol (MCP)',
    category: 'Extensible Tooling',
    endpoint: 'http://litellm:4000/*/mcp',
    protocol: 'SSE / Streamable HTTP',
    description: 'Dynamic tool discovery and agentic tool invocation across observability microservices.',
    icon: 'cube',
    tools: ['mcp-discover', 'mcp-invoke', 'mcp-tools_list'],
    status: 'configured',
  },
  {
    name: 'ChatOps Gateway',
    category: 'Messaging & Incident Ops',
    endpoint: 'Slack Socket Mode / Telegram',
    protocol: 'Two-Way Gateway Daemon',
    description: 'Bi-directional team collaboration, incident alerts, and interactive multi-turn debugging in Slack.',
    icon: 'comments',
    tools: ['slack-socket_mode', 'telegram-webhook', 'alert-inbox'],
    status: 'optional',
  },
];
