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
