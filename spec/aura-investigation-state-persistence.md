# SPEC / SDD — Investigation State Persistence Across Grafana Navigation

- Status: Implemented (Phase 1 + Phase 2). Phase 2 uses A2A + the in-memory
  session store; the Redis backend is feature-gated out of the published image
  (see §7).
- Scope: `grafana/plugins/mezmo-aura-app` (Phase 1 + Phase 2) and
  `grafana/plugins/opensre-app` (Phase 1 only — different backend, no A2A)
- Backend: Mezmo AURA `mezmo/aura:0.2.17` (`aura webserver`), OpenAI-compatible
  API + A2A JSON-RPC
- Date: 2026-09-17

---

## 1. Problem statement

A user starts an investigation in the **Mezmo AURA SRE** Grafana app (Investigation
Console), then navigates to another screen in Grafana — another page of the plugin
(Reasoning Traces, MCP Specialists), the plugin's Configuration page, or any other
Grafana surface (a dashboard, Explore, an alert page, a different app plugin). When
they return, the investigation is gone: the conversation history is empty and any
in-progress investigation has been aborted.

The same defect exists in the **OpenSRE** app, which ships a byte-for-byte
duplicated `InvestigationConsole.tsx`.

---

## 2. Root cause

The investigation state is held **entirely in React local component state** and is
destroyed the moment the component unmounts.

Evidence in `src/pages/InvestigationConsole.tsx`:

- `messages`, `inputText`, `isInvestigating`, `activeModel`, `activeElapsedMs` are
  all plain `useState` hooks local to the `InvestigationConsole` component.
- The app's internal router (`src/components/App/App.tsx`) uses
  `react-router-dom` `<Routes>` with three sibling routes (`console`, `traces`,
  `specialists`). Switching routes unmounts `InvestigationConsole` and discards its
  state.
- Grafana itself unmounts the entire app-plugin React tree when the user navigates
  to any non-plugin URL (a dashboard, Explore, etc.). No in-plugin mechanism can
  survive that; only external persistence can.

A second, distinct failure mode is the **in-flight request**:

- `handleSend` does `await AuraApiClient.sendChat(apiMessages)` — a single,
  non-streaming `POST /v1/chat/completions` that returns the full reply once the
  multi-agent investigation completes (can take minutes).
- If the user navigates away before the promise resolves, the component unmounts.
  The backend keeps running the investigation to completion, but the client no
  longer has a listener, so the result is silently dropped and the history is lost.

The AURA backend is **stateless at the web API layer**:

- The webserver exposes only `GET /health`, `GET /v1/models`, and
  `POST /v1/chat/completions` (verified live against the running container). The
  chat endpoint takes the full `messages` array on every call and holds no
  conversation state of its own.
- `/a2a/v1/rpc` and `/.well-known/agent-card.json` return 404: the A2A (stateful
  task/session) interface is compiled in but **not enabled** (the compose command is
  `./aura webserver --verbose`, and `--enable-a2a` defaults to off).
- `session_store.backend` is `"memory"` (from `/health`). That store backs the
  *CLI client's* `--resume <conversation-id>` feature, not the web API, and memory
  backend means it does not survive a container restart anyway.

---

## 3. Goals and non-goals

### Goals

1. A user can navigate anywhere in Grafana and return to a **preserved**
   investigation (full conversation history, timestamps, elapsed durations).
2. An in-progress investigation is **not lost** when the user navigates away; the
   user can re-attach and see the completed result.
3. The solution must not require the operator to hold a browser tab open or avoid
   using Grafana normally.

### Non-goals (explicitly out of scope for v1)

- Cross-device / cross-browser roaming of a conversation.
- Multi-tenant, multi-user shared investigation history (can be layered later).
- Changing the AURA agent's 5-minute default lookback or its orchestration logic.

---

## 4. Requirements

Functional:

- R1. Conversation history survives navigation within the plugin (console ↔ traces
  ↔ specialists ↔ configuration).
- R2. Conversation history survives navigation to any other Grafana screen and back.
- R3. Conversation history survives a full page refresh and a browser restart.
- R4. A completed or in-flight investigation can be resumed from a persisted state
  with no loss of user or assistant messages.
- R5. An in-flight investigation that completes while the console is not mounted is
  re-attached and its result displayed on return (or retrievable via a "Resume"
  affordance).
- R6. The user can explicitly clear a conversation (existing "Clear Console" button)
  and optionally discard a persisted session.

Non-functional:

- N1. Persistence must not leak secrets: messages are plaintext markdown of
  telemetry findings; do not store credentials or raw API keys.
- N2. Persistence is per Grafana user (and per org), so two operators do not see
  each other's investigations.
- N3. Reads/writes must be cheap — a write-through on every message must not block
  the UI thread.

---

## 5. Solution options

### Option A — Client-side persistence (localStorage) + hydration

Persist the conversation model to `localStorage` keyed by
`<orgId>:<userId>:<appId>:session`, hydrate on mount, and write-through on every
state change. Add a lightweight session list ("Investigations") with resume/clear.

- Pros: no backend changes; works immediately; survives refresh, navigation, and
  browser restart; simple.
- Cons: does not by itself solve R5 (in-flight result is still dropped unless a
  pending marker is replayed); per-browser only; not auditable server-side.

### Option B — Keep the component mounted (React context / module store)

Lift `messages` into a context or module-level store rendered at the app root so it
survives *in-plugin* route changes.

- Pros: trivial for R1.
- Cons: does **not** survive R2/R3 (Grafana unmounts the whole app tree when leaving
  the plugin); is not persistence, only in-memory sharing. Insufficient on its own.

### Option C — Server-side session persistence (AURA A2A / conversation API)

Enable AURA's A2A server (`--enable-a2a`, JSON-RPC at `/a2a/v1/rpc`), or add a
conversation endpoint, backed by a durable store (Redis or Postgres — **both are
already running in the stack**). The client sends a `session_id`; the server owns the
conversation and the in-flight task; the client re-attaches via poll/SSE.

- Pros: fully solves R1–R5 and adds auditability, multi-device, and true
  server-side continuation; leverages infra already present.
- Cons: requires backend/config changes and a durable session backend; the current
  `session_store.backend` is `"memory"`; larger change surface.

### Recommendation — phased

- **Phase 1 (now, client-side):** implement Option A. This is the smallest change
  that satisfies R1–R4 and the user's immediate pain ("keep my investigation when I
  change screens"). Include a persisted pending-investigation marker and a
  best-effort replay/abort handling for R5.
- **Phase 2 (follow-up, server-side):** implement Option C to make in-flight
  investigations genuinely resumable and auditable, using Redis as the session
  backend (already provisioned). A2A is the intended AURA mechanism for stateful
  agent tasks and should be enabled rather than re-implementing a session API.

---

## 6. Detailed design — Phase 1 (client-side persistence)

### 6.1 Storage model

New key namespace in `localStorage`, key format:

```
aura:investigation:<orgId>:<userId>:<appId>
```

`orgId` and `userId` are read from the Grafana plugin context
(`usePluginContext().meta` / `contextSrv`), `appId` is `mezmo-aura-app` or
`opensre-app` so the two apps do not collide.

Persisted shape (single JSON document):

```ts
interface PersistedSession {
  schemaVersion: 1;
  messages: ChatMessage[];        // full conversation, reuse existing type
  inputDraft: string;             // preserve un-submitted input
  activeModel: string;
  updatedAt: number;              // epoch ms, for list ordering
}

interface InvestigationIndex {
  schemaVersion: 1;
  activeSessionId: string | null; // which session is currently open
  sessions: Array<{
    id: string;
    title: string;                // first user message, truncated
    createdAt: number;
    updatedAt: number;
    messageCount: number;
  }>;
}
```

A **session list** (not just one conversation) is required so multiple investigations
can coexist and be resumed — otherwise a new prompt would overwrite the prior one.

### 6.2 In-flight handling (R5)

Extend the persisted document with an in-flight record:

```ts
interface InFlight {
  requestId: string;         // matches the request id recorded before send
  startedAt: number;
  prompt: string;            // the user message that triggered it
  status: 'running' | 'complete' | 'error';
  result?: { content: string; elapsedMs: number };  // set on completion
  error?: { message: string; elapsedMs: number };
}
```

Behavior:

- Before `sendChat`, write the user message + an `InFlight{status:'running'}` entry
  synchronously to storage.
- Because the backend is stateless and the request already carries the full history,
  a **navigated-away client can safely re-send the same prompt** to obtain the
  result: on return, if `status === 'running'`, the UI shows "Investigation in
  progress / re-attaching…" and re-issues the identical request (idempotent at the
  AURA layer — it re-runs the investigation and returns an equivalent report).
- Simpler v1 alternative: on unmount during an in-flight request, mark the prompt as
  "pending — re-run on return". The user sees the preserved conversation and a
  one-click "Resume" that re-sends the last user message. This avoids silent
  duplicate runs while the user is away.

Note: a true "continue without re-running" requires server-side state (Phase 2). v1
accepts a re-run as the cost of staying on the stateless OpenAI endpoint.

### 6.3 Component changes (`InvestigationConsole.tsx`)

1. Replace the direct `useState<ChatMessage[]>([])` initializer with a lazy
   initializer that hydrates from the persisted session (guarded against corrupt
   JSON — fall back to empty).
2. Add a `useEffect` (or a small `usePersistedSession` hook) that write-throughs
   `messages`, `inputText`, `activeModel` on change (debounced for the input draft).
3. On mount, if an in-flight record exists, restore the "re-attach/resume" UI.
4. Update `handleClear` to also remove the persisted session and its index entry.
5. Add a minimal "Investigations" menu in the workspace header: list persisted
   sessions, switch, and clear — preserving the existing single-conversation UX by
   default.

### 6.4 New module

`src/hooks/useInvestigationStore.ts` (or `src/state/investigationStore.ts`):

- `loadSession(orgId, userId, appId): PersistedSession | null`
- `saveSession(...)`, `clearSession(...)`
- `listSessions(...)`, `activateSession(id)`, `deleteSession(id)`
- Wrap all `localStorage` access in `try/catch` (private-browsing / storage-quota
  safety), with a no-op fallback so the console still works when storage is blocked.
- Version the schema (`schemaVersion`) and ignore/clear documents from other versions.

### 6.5 Secrets & privacy

- Persist only `ChatMessage` content and metadata. The AURA requests flow through the
  Grafana plugin-proxy (`api/plugin-proxy/.../aura/...`) and never place the LiteLLM
  master key or MCP bearer tokens in the browser; nothing sensitive enters
  `localStorage`.
- Provide the existing "Clear Console" as the user-facing delete, and document that
  clearing also removes the persisted copy.

---

## 7. Detailed design — Phase 2 (server-side, implemented)

Implemented. The AURA server runs with `--enable-a2a`; the console sends the user
message as an A2A `message/send` task (the server forces `returnImmediately`, so
the task is queued and the HTTP call returns at once), persists the returned
`taskId`/`contextId` in `localStorage`, and polls `tasks/get` every ~2.5s while
mounted. On return after navigating away, the console re-attaches to the same
task: it shows **"in progress"** (with elapsed time) while the task is still
`working`, or **"completed"** and appends the result — no re-run. The final
answer is extracted from the task's `artifactId === "final"` artifact.

Wire facts confirmed live against the running container:

- A2A v0.3 JSON-RPC binding is served at the server root `/` (not the versioned
  `/a2a/v1/rpc` mount, whose method names differ): methods `message/send`,
  `tasks/get`, `tasks/cancel`, `message/stream`.
- `message/send` returns `{id, contextId, status:{state:"working"}, history}`;
  `tasks/get` returns the same shape with `state` progressing to
  `completed`/`failed` and `artifacts` (the reply in an `artifactId:"final"`
  artifact) on completion.

Redis note (important correction to the original §7 step 2): the published
`mezmo/aura:0.2.17` image does **not** compile the `session-store-redis` cargo
feature, so `AURA_SESSION_STORE=redis` crashes the server at boot
(`session store backend 'redis' requires the 'session-store-redis' cargo
feature`). The in-memory session store is always compiled and is what ships.
Redis/Valkey (env `AURA_SESSION_STORE=redis` + `AURA_SESSION_STORE_URL`) is only
available by building a custom image with `--features session-store-redis`.
For the single-instance deployment the in-memory backend fully delivers the
functional requirement (background continuation + re-attach); tasks are lost only
if AURA itself restarts mid-investigation. Redis remains a future enhancement for
cross-restart durability / multi-instance sharing.

---

## 8. Testing plan

- Unit (Jest, existing `jest.config.js`):
  - hydrate from valid, malformed, and missing storage payloads.
  - write-through on message append; clear removes doc + index entry.
  - per-user/per-org key isolation (two `orgId:userId` pairs never collide).
- E2E (`@grafana/plugin-e2e`, Playwright — config already present):
  - start an investigation, navigate to a dashboard, return → history intact.
  - navigate console → traces → specialists → back → history intact.
  - full page refresh → history intact.
  - "Clear Console" → storage empty.
  - two sessions coexist; resume picks the right one.
- Manual: confirm no regression in the identical OpenSRE console after the change is
  ported (the two files are currently duplicated — see §10).

---

## 9. Acceptance criteria

1. Navigate anywhere in Grafana and back: investigation conversation is fully
   restored (R1, R2).
2. Hard-refresh the browser tab: conversation restored (R3).
3. Close and reopen the browser: conversation restorable from the Investigations list
   (R3, R6).
4. An investigation that was running when the user left is either re-attached with
   its result or offered as a one-click "Resume" that reproduces it (R5).
5. "Clear Console" permanently removes the persisted session (R6).
6. No credentials or API keys are present in `localStorage` (N1).
7. Two different Grafana users do not observe each other's sessions (N2).

---

## 10. Risks and open questions

- **Duplicated console code:** `mezmo-aura-app` and `opensre-app` ship the same
  `InvestigationConsole.tsx`. The fix must be applied to both, or the shared logic
  extracted into a common module/package to avoid divergence. (Out of scope to
  deduplicate here, but flagged.)
- **Re-run semantics:** v1's "resume = re-send the prompt" re-runs the investigation
  and can produce slightly different wording/telemetry snapshots (time window is
  relative "last 5m"). Acceptable for v1; Phase 2 removes this caveat.
- **localStorage quota:** conversations are text; typical investigations are well
  under the ~5 MB origin quota, but a very long session plus other Grafana state
  could approach it. The store must degrade gracefully (drop oldest sessions) and
  never throw.
- **AURA session-store backends:** the exact keys to point AURA's session store at
  Redis/Postgres in 0.2.17 must be confirmed from the image's config schema before
  Phase 2 is implemented; do not assume key names.
- **A2A enablement:** `--enable-a2a` changes the exposed surface (JSON-RPC + agent
  card). Needs a review of the nginx route and any auth implications before rolling
  out (Phase 2).

---

## 11. Appendix — live evidence gathered

- `docker compose ps`: `aura` Up (healthy); `redis` Up (healthy); `postgres` Up.
- `GET /health` → `{"aura_version":"0.2.17","session_store":{"backend":"memory",...},
  "a2a_server":{"version":"1.0"},"status":"healthy"}`.
- `GET /v1/models` → 200 (model `Aura SRE Orchestrator`).
- `POST`-only `GET /v1/chat/completions` → 405 (stateless OpenAI-compatible).
- `/a2a/v1/rpc`, `/.well-known/agent-card.json`, `/v1/conversations`, `/v1/sessions`
  → 404 (A2A and session endpoints not exposed).
- `aura webserver --help` confirms `--enable-a2a` (disabled by default), streaming
  SSE events, and `session_store`; `aura --help` confirms CLI `--resume
  <conversation-id>` (the session store is used by the CLI client, not the web API).
