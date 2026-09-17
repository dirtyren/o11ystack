import { config } from '@grafana/runtime';
import { ChatMessage } from '../types';

/**
 * Client-side persistence for the investigation console.
 *
 * The console's investigation state (conversation history, draft input, active
 * model, A2A conversation context, and in-flight task marker) is persisted to
 * `localStorage` so a user can navigate anywhere in Grafana and come back
 * without losing the investigation.
 *
 * The actual investigation runs server-side as an A2A task; the in-flight
 * record holds the task id so the client can re-attach and poll for completion
 * after navigating away (no re-run).
 *
 * Storage is scoped per Grafana org + user + app so operators never see each
 * other's conversations.
 */

export const INVESTIGATION_STORE_VERSION = 1;

export interface InFlightRecord {
  status: 'running';
  /** A2A task id — used to poll `tasks/get` and re-attach after navigation. */
  taskId: string;
  /** A2A conversation context id (thread), reused across turns. */
  contextId: string;
  /** The user prompt that triggered the in-flight investigation. */
  prompt: string;
  /** Epoch ms when the task was submitted. */
  startedAt: number;
}

export interface PersistedSession {
  schemaVersion: number;
  messages: ChatMessage[];
  inputDraft: string;
  activeModel: string;
  /** A2A conversation context id, persisted across turns for multi-turn chat. */
  contextId: string | null;
  createdAt: number;
  updatedAt: number;
  inFlight: InFlightRecord | null;
}

function scope(appId: string): string {
  const user = config.bootData.user;
  return `${user.orgId}:${user.id}:${appId}`;
}

function storageKey(appId: string): string {
  return `investigation:${scope(appId)}`;
}

export function loadSession(appId: string): PersistedSession | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(storageKey(appId));
  } catch {
    return null;
  }
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as PersistedSession;
    if (
      !parsed ||
      parsed.schemaVersion !== INVESTIGATION_STORE_VERSION ||
      !Array.isArray(parsed.messages)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(appId: string, session: PersistedSession): void {
  try {
    window.localStorage.setItem(storageKey(appId), JSON.stringify(session));
  } catch {
    // Storage unavailable (private browsing / quota exceeded) — degrade silently
    // so the console still works without persistence.
  }
}

export function clearSession(appId: string): void {
  try {
    window.localStorage.removeItem(storageKey(appId));
  } catch {
    // ignore
  }
}

export function createEmptySession(): PersistedSession {
  const now = Date.now();
  return {
    schemaVersion: INVESTIGATION_STORE_VERSION,
    messages: [],
    inputDraft: '',
    activeModel: '',
    contextId: null,
    createdAt: now,
    updatedAt: now,
    inFlight: null,
  };
}
