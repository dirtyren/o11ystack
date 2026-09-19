# Langfuse integration into o11ystack — evaluation & implementation

Date: 2026-09-19. Sections 1–4 are the pre-implementation evaluation; section 5
documents what was actually built (self-hosted Langfuse v4, `/langfuse` behind
nginx, OTLP ingest from LiteLLM, Grafana ClickHouse datasource + dashboard).

Questions evaluated:
1. Can Langfuse be integrated with this OSS stack?
2. Can LiteLLM give complete observability of MCP tool calls and LLM calls?
3. Can Langfuse data be surfaced in Grafana?

---

## 1. Short answer

Yes to all three, with one architectural choice to make (self-host vs cloud) and one
capacity caveat (this host has ~5.9 GiB RAM available, 0 swap — Langfuse v4 self-host
needs 4 more containers).

- **LLM calls** → LiteLLM has a *native* Langfuse logger (`callbacks: ["langfuse"]`) and a
  richer OTel-based preset (`callbacks: ["langfuse_otel"]`). Verified present in the
  running image `ghcr.io/berriai/litellm:v1.100.1`.
- **MCP tool calls** → the gateway already counts them (`litellm_mcp_tool_calls_total`,
  live in VictoriaMetrics) and stores one spend-log row per call with
  `mcp_namespaced_tool_name`. Span-level MCP tracing (tools/call + tools/list with
  parent-context linking) exists in LiteLLM's v2 OTel logger, gated behind
  `LITELLM_OTEL_V2`. Import note: the *native* Langfuse SDK logger logs **LLM calls only** —
  MCP spans reach Langfuse via the OTel path, not the SDK path.
- **Grafana** → Langfuse has **no** Prometheus endpoint and **no** OTel metrics support
  (maintainer-confirmed), and there is no official Langfuse Grafana plugin. Three working
  routes: (a) Grafana ClickHouse datasource → Langfuse's ClickHouse (traces/observations/
  scores), (b) Langfuse Metrics API v2 (`GET /api/public/v2/metrics`, self-hosted v4+) via
  an exporter bridge into VictoriaMetrics — same pattern as the existing
  `headroom-exporter`, (c) ad-hoc Infinity/JSON datasource panels.

---

## 2. Current state (verified live, this session)

| Item | Evidence |
|---|---|
| LiteLLM | `ghcr.io/berriai/litellm:v1.100.1`, callbacks = `["prometheus"]` only, prometheus callback on |
| MCP call metrics | `litellm_mcp_tool_calls_total` series present in VictoriaMetrics, labels `mcp_server_name` + `mcp_tool_name`, e.g. victorialogs/query=75, stats_query=39, field_values=15, hits=10; grafana/query_prometheus=18; headroom/headroom_compress=8, headroom_stats=1; victoriametrics/metrics=6 — 17 distinct tool series |
| MCP spend logs | `LiteLLM_SpendLogs`: `call_mcp_tool`=557 rows, `list_mcp_tools`=197, `acompletion`=1158; column `mcp_namespaced_tool_name` exists |
| Prompt capture | `store_prompts_in_spend_logs: true`, 7-day retention (LiteLLM Postgres only) |
| MCP traffic path | **All** MCP traffic from AURA goes through the LiteLLM gateway (`aura/config.toml` → `http://litellm:4000/<server>/mcp`); OpenSRE → `litellm:4000/headroom/mcp`. Single choke point = single instrumentation point |
| OTel plumbing | `otel-collector` already receives OTLP (4317/4318); traces → VictoriaTraces, metrics → VictoriaMetrics (remote write), logs → VictoriaLogs |
| Grafana | 13.2.1, file-provisioned datasources: VictoriaMetrics (prom), VictoriaLogs, VictoriaTraces (tempo + jaeger) |
| Host capacity | 11 GiB RAM total, 6 vCPU, containers use ~4.5 GiB (litellm 1.09 GiB largest), 5.9 GiB available, **swap = 0 B**, 136 GB disk free |

What is *not* available today: no prompt/response-level LLM tracing, no MCP span traces
with latency, no per-trace drill-down, no evaluation/scores concept.

---

## 3. What LiteLLM can emit (verified in the installed package)

### 3.1 LLM + MCP spans — OTel v2 logger (`litellm/integrations/otel/`)

- Gate: `LITELLM_OTEL_V2=true`; callback name `"otel"` in `litellm_settings.callbacks`.
  When the flag is off, the legacy `OpenTelemetry` class is used, which does **not** emit
  MCP spans.
- Emits per request: FastAPI SERVER span (`POST /v1/chat/completions`), INTERNAL auth span,
  CLIENT spans for DB/redis, guardrail spans, **CLIENT span per LLM call**, and —
  explicitly — **MCP `tools/call` span**, **MCP `tools/list` span**, with
  `resolve_mcp_span_context()` linking the MCP span into the parent request trace
  (W3C context propagation through the MCP `_meta` field).
- Config env vars: `OTEL_EXPORTER` / `OTEL_EXPORTER_OTLP_PROTOCOL`, `OTEL_ENDPOINT` /
  `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_HEADERS` / `OTEL_EXPORTER_OTLP_HEADERS`,
  `OTEL_SERVICE_NAME`, `LITELLM_OTEL_INTEGRATION_ENABLE_METRICS`,
  `LITELLM_OTEL_INTEGRATION_ENABLE_EVENTS`,
  `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` (content capture in spans —
  leave off or on deliberately; cost/privacy knob).
- Multiple exporter specs are supported (one span processor per destination), so one
  callback can fan out.

### 3.2 Langfuse presets / callbacks

- `langfuse_otel` preset → `PRESET_BY_CALLBACK["langfuse_otel"] = langfuse_preset`, reads
  `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, host from `LANGFUSE_OTEL_HOST` or
  `LANGFUSE_HOST`, sends to `<host>/api/public/otel` with Basic auth and header
  `x-langfuse-ingestion-version: 4`. This is an OTel export → **includes the MCP spans**.
- Native `langfuse` callback → Langfuse Python SDK logger: generations, tokens, cost,
  latency, session/user/trace-id affinity via `metadata` (`trace_id`, `session_id`,
  `trace_name`, `tags`) or headers (`langfuse_trace_id`, `langfuse_trace_user_id`,
  `langfuse_trace_metadata`). **LLM calls only — no MCP logging** (no `mcp` references in
  `litellm/integrations/langfuse/`).
- Do **not** enable both for LLM data at once — Langfuse would receive each generation
  twice (once as SDK trace, once as OTel span).

---

## 4. Proposed target architecture

```
                       ┌────────────────────────────────────────────┐
AURA ── LLM calls ───► │  LiteLLM gateway  (8000 calls/mo ~ today)   │
OpenSRE ─ MCP tools ─► │   callbacks: ["otel"]  LITELLM_OTEL_V2=true│
                       └───────┬───────────────────────┬────────────┘
                               │ OTLP (4317)            │ /metrics (scrape)
                               ▼                        ▼
                     ┌──────────────────┐        ┌──────────────────┐
                     │ otel-collector   │        │ VictoriaMetrics  │  (already there:
                     │  traces pipeline │        │  litellm_mcp_*   │   MCP counters)
                     └───┬─────────┬────┘        └────────┬─────────┘
       otlp/traces (existing)   otlphttp/langfuse (new)   │
                         ▼              ▼                 │
                VictoriaTraces    langfuse-web:3000        │
                (Grafana traces)  /api/public/otel         │
                                        │                  │
                                        ▼                  │
                              ┌──────────────────┐         │
                              │  Langfuse v4     │◄────────┘  (optional exporter bridge:
                              │  web+worker      │            Metrics API v2 → Prometheus)
                              │  clickhouse      │
                              │  minio (or S3)   │
                              │  postgres, redis │ ← can reuse existing containers (new DB / new logical db)
                              └──────────────────┘
```

Single producer config in LiteLLM, one egress point (otel-collector) that fans out to the
existing VictoriaTraces **and** to Langfuse. VictoriaTraces stays the SRE source of truth
(trace search + logs correlation in Grafana); Langfuse is the LLM/tool deep-dive and
evaluation surface. Alternative (simpler): point LiteLLM straight at Langfuse with
`callbacks: ["langfuse_otel"]` and skip the collector hop — one fewer moving part but
nothing else gets into Langfuse, and VictoriaTraces stops receiving LLM/MCP spans.

---

## 5. Concrete change list (for approval — NOT applied)

### 5.1 LiteLLM (litellm/config.yaml + docker-compose env)
- `litellm_settings.callbacks: ["prometheus", "otel"]`
- New env on the `litellm` service: `LITELLM_OTEL_V2=true`,
  `OTEL_ENDPOINT=http://otel-collector:4317` (or 4318/http), `OTEL_SERVICE_NAME=litellm`,
  optionally `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=span_and_event`,
  `LITELLM_OTEL_INTEGRATION_ENABLE_METRICS=true`.
- Optional, if Langfuse is used: `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` /
  `LANGFUSE_HOST=http://langfuse-web:3000` (only needed for the direct-preset variant).

### 5.2 otel-collector
- Add exporter:
  `otlphttp/langfuse: endpoint: http://langfuse-web:3000/api/public/otel`,
  header `Authorization: Basic <base64(pk:sk)>` and `x-langfuse-ingestion-version: 4`
  (env-substituted from .env), add to the `traces` pipeline exporters.
- Consider a filter processor if only `litellm` service spans should go to Langfuse
  (Beyla and AURA spans share the pipeline).

### 5.3 Langfuse v4 self-host (docker-compose, 4 new services)
- `langfuse-web:4`, `langfuse-worker:4` (docker.langfuse.com), `clickhouse:25.12`,
  `minio` — plus **reuse** existing `postgres` (new `langfuse` DB + role) and existing
  `redis` (separate logical DB) OR dedicated small redis if queue isolation is preferred.
- Required secrets: `NEXTAUTH_SECRET`, `SALT`, `ENCRYPTION_KEY` (`openssl rand -hex 32`),
  `CLICKHOUSE_PASSWORD`, MinIO creds.
- First boot: create org/project → API keys (`pk-lf-…`, `sk-lf-…`).
- nginx: Langfuse is not subpath-friendly; either a dedicated port/hostname behind basic
  auth (`/etc/nginx/conf.d` server block) or accept `NEXTAUTH_URL` on its own name.
  Known friction point — needs a decision on exposure.

### 5.4 Grafana (Langfuse data)
- **Route A (recommended first):** add `grafana-clickhouse-datasource` to
  `GF_INSTALL_PLUGINS`, provision a `Langfuse-ClickHouse` datasource pointing at
  `clickhouse:8123` with a **read-only** ClickHouse user, build a dashboard off
  `traces` / `observations` / `scores` (latency p95 per model, tokens, cost, error rate,
  tool-call breakdown by server/tool, latency per MCP tool). Add data links from panels to
  the Langfuse UI trace ("Grafana finds it, Langfuse explains it").
- **Route B (optional, alerting-friendly):** `langfuse-exporter` container (same shape as
  the existing `headroom-exporter`) polling `GET /api/public/v2/metrics` with Basic auth and
  serving Prometheus text → new scrape job in otel-collector → VictoriaMetrics. This puts
  LLM/MCP KPIs next to every other SRE metric and into Grafana alerting.
- **Route C:** Infinity/JSON datasource for ad-hoc Metrics-API panels (no new infra, weakest
  alerting story).

---

## 6. Capacity and risk

| Risk | Detail | Mitigation |
|---|---|---|
| RAM | Langfuse v4 adds web+worker+clickhouse+minio ≈ 2.5–3.5 GiB realistic (docs "minimum" for production is far higher: 4+4+8+4 GiB). Host: 5.9 GiB available, **no swap** | set explicit container memory limits, lean ClickHouse settings, or run Langfuse Cloud free tier for the PoC; consider adding swap |
| ClickHouse disk growth | observability rows + MinIO blobs, TTL not configured by default | set ClickHouse TTL, MinIO bucket quota |
| Subpath routing | Grafana/LiteLLM are path-routed on this nginx; Langfuse wants its own origin | dedicated port/server block or subdomain |
| Duplicate traces | native `langfuse` + `otel`/`langfuse_otel` both on → double LLM records | pick one path (recommended: OTel only) |
| Content capture | `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` puts prompts/completions into spans and Langfuse | decide explicitly; this stack already stores prompts in LiteLLM spend logs (7d) |
| Span volume | every request → server+auth+DB+LLM+MCP spans; Beyla/AURA share the collector | filter processor for the Langfuse exporter |
| Version drift | LiteLLM OTel v2 is gated and evolving; `LITELLM_OTEL_V2` may change semantics on image bumps | pin the Litellm image (already pinned) and re-verify after bumps |

---

## 7. Phased plan

Phase 1 — **LiteLLM OTel traces into the existing stack** (no Langfuse): 0.5–1 h.
Value: span-level LLM *and* MCP tracing in VictoriaTraces, visible in Grafana Explore/Traces
today. Proves the MCP span path end-to-end before adding Langfuse.

Phase 2 — **Langfuse self-host** (or cloud keys): 2–4 h. Compose + secrets + first project +
nginx exposure + collector exporter with Langfuse auth header. Value: LLM/MCP traces,
sessions, prompt inspection, playground, scores/evaluations.

Phase 3 — **Langfuse → Grafana**: 2–4 h. ClickHouse datasource + dashboard (+ optional
exporter bridge for alerting), data links back into Langfuse.

## 8. Acceptance probes (run at execution time, per hop)

1. `curl litellm:4000/health/readiness` healthy after restart; `/metrics` still serves.
2. A synthetic completion through the proxy produces a trace retrievable from
   VictoriaTraces (`/select/tempo/api/traces/<id>` renderable in Grafana).
3. An MCP tool call through the gateway (`/victorialogs/mcp`) produces a span with
   `gen_ai.operation.name=tools/call` inside the *same* trace as the triggering LLM call.
4. Langfuse `/api/public/traces` (Basic auth) returns the same trace id; MCP observation
   visible under it.
5. Grafana: datasource health check green, dashboard panel returns non-empty data,
   data link opens the Langfuse trace.
6. `docker stats` after deploy: total host memory under agreed ceiling.

## 9. Open decisions

1. **Self-host Langfuse vs Langfuse Cloud free tier** — self-host keeps data local, costs
   4 containers and ~3 GiB RAM on an 11 GiB / 0-swap host.
2. **Direct `langfuse_otel` from LiteLLM vs fan-out via otel-collector** —
   collector = single egress + keeps VictoriaTraces in the loop; direct = fewer components.
3. **Content capture on/off** (prompts+completions in spans/Langfuse).
4. **Exposure** of the Langfuse UI (port vs subdomain; basic auth in nginx).
5. Whether AURA/OpenSRE should stamp `langfuse_trace_id`/session metadata per investigation
   (nice grouping, small change in each agent's request headers).
