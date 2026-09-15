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
