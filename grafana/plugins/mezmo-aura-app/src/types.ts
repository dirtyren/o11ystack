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

export interface AuraHealthResponse {
  status: 'healthy' | 'degraded' | 'unreachable' | string;
  aura_version?: string;
  a2a_server?: { version: string };
  session_store?: { backend: string; ping?: { latency_ms?: number; ok?: boolean } };
  timestamp?: string;
}

export interface AuraModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export interface QuickPrompt {
  id: string;
  title: string;
  prompt: string;
  icon: string;
}

// ── A2A (Agent-to-Agent) v0.3 wire types ──────────────────────────────────
// AURA serves a legacy JSON-RPC binding at the server root (`/`), with method
// names `message/send` and `tasks/get`.

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
