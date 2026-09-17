import { config } from '@grafana/runtime';
import { ChatMessage } from '../types';

/**
 * Client-side persistence for the investigation console.
 *
 * The console's entire investigation state (conversation history, draft input,
 * active model, in-flight marker) is persisted to `localStorage` so that a user
 * can navigate anywhere in Grafana — another plugin page, a dashboard, Explore —
 * and come back without losing the investigation.
 *
 * Storage is scoped per Grafana org + user + app so operators never see each
 * other's conversations, and the AURA and OpenSRE apps do not collide.
 */

export const INVESTIGATION_STORE_VERSION = 1;

export interface InFlightRecord {
  status: 'running';
  /** The user prompt that triggered the in-flight investigation. */
  prompt: string;
  startedAt: number;
}

export interface PersistedSession {
  schemaVersion: number;
  messages: ChatMessage[];
  inputDraft: string;
  activeModel: string;
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
    createdAt: now,
    updatedAt: now,
    inFlight: null,
  };
}
