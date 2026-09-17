export interface AppPluginSettings {
  apiUrl?: string;
  defaultLookback?: string;
  pollIntervalSec?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
  elapsedMs?: number;
}

export interface OpenSreHealthResponse {
  status: 'healthy' | 'degraded' | 'unreachable' | string;
  service?: string;
  version?: string;
  llm_provider?: string;
  model?: string;
  base_url?: string;
  timestamp?: string;
}

export interface OpenSreModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export type AuraHealthResponse = OpenSreHealthResponse;
export type AuraModel = OpenSreModel;

export interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

// ── A2A (Agent-to-Agent) v0.3 wire types ──────────────────────────────────
// The OpenSRE server exposes a legacy JSON-RPC binding at the server root (`/`),
// with method names `message/send` and `tasks/get`, matching mezmo/aura.

export interface A2aTextPart {
  kind: 'text';
  text: string;
}

export interface A2aPart {
  kind: string;
  text?: string;
  data?: unknown;
}

export interface A2aMessage {
  kind?: string;
  messageId: string;
  role: 'user' | 'agent' | '';
  parts: A2aPart[];
  contextId?: string;
}

export interface A2aTaskStatus {
  state: 'submitted' | 'working' | 'completed' | 'failed' | 'canceled' | 'input-required' | 'rejected' | 'auth-required' | 'unknown' | string;
  message?: A2aMessage;
  timestamp?: string;
}

export interface A2aArtifact {
  artifactId: string;
  parts: A2aPart[];
  name?: string;
  description?: string;
}

export interface A2aTask {
  kind: string;
  id: string;
  contextId: string;
  status: A2aTaskStatus;
  history?: A2aMessage[];
  artifacts?: A2aArtifact[];
}

export interface A2aJsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export interface A2aJsonRpcResponse<T> {
  jsonrpc: string;
  id: string | number;
  result?: T;
  error?: A2aJsonRpcError;
}
