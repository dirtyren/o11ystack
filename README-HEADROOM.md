# Headroom Context Compression Integration

[![Headroom](https://img.shields.io/badge/Headroom-Context%20Compression-00F0B5.svg)](https://github.com/headroomlabs-ai/headroom)
[![LiteLLM](https://img.shields.io/badge/LiteLLM-Proxy%20%26%20MCP%20Gateway-black.svg)](https://litellm.ai/)
[![Grafana](https://img.shields.io/badge/Grafana-Latest-F46800.svg)](https://grafana.com/)

**Headroom** is a context-compression layer for LLM applications — it shrinks tool outputs, logs, files, and RAG chunks before they reach the model, cutting token usage (60–95% on JSON/logs) while preserving answers. In `o11ystack`, Headroom runs as both a **compression proxy** (observability + live dashboard) and an **MCP server registered in LiteLLM** so AURA and OpenSRE agents can compress, retrieve, and report savings on demand.

---

## Architecture

```
 agents (AURA / OpenSRE) ──► LiteLLM gateway (:4000) ──► providers
        │                        │
        │  MCP tools             │  /headroom/mcp (MCP gateway)
        │                        ▼
        │              headroom-mcp (:8788) ── headroom_compress / _retrieve / _stats
        │                        │ (proxy-url)
        │                        ▼
        └────────────► headroom proxy (:8787) ── /metrics · /stats · /dashboard · /health
```

- **`headroom`** (proxy, `ghcr.io/headroomlabs-ai/headroom:latest`): the compression runtime. Serves Prometheus `/metrics` (always on), `/stats`, `/stats-history`, and a live `/dashboard`. The anonymous usage beacon is disabled (`HEADROOM_BEACON=off`); nothing leaves the machine.
- **`headroom-mcp`** (`headroom mcp serve --transport http`): exposes `headroom_compress`, `headroom_retrieve`, and `headroom_stats` over Streamable HTTP, linked to the proxy via `--proxy-url`.
- **LiteLLM** registers `headroom` as an MCP server (`transport: http`), so every agent that talks to the LiteLLM MCP gateway (AURA, OpenSRE) gets the three Headroom tools.
- **AURA** (`aura/config.toml`) adds `[mcp.servers.headroom]`, routing through LiteLLM at `http://litellm:4000/headroom/mcp`.

### Access

- Live savings dashboard: `https://<server>/headroom/dashboard` (Basic Auth).
- Health: `https://<server>/headroom/health`.

---

## Metrics Scraping & Grafana Dashboards

The OTel Collector's Prometheus receiver scrapes these services every 15s and remote-writes to VictoriaMetrics. Each has a provisioned Grafana dashboard under the **Observability** folder.

| Service | Scrape target | Endpoint | Dashboard (uid) | Notes |
|---|---|---|---|---|
| **LiteLLM** | `litellm:4000` | `/metrics` | `litellm` | Prometheus callback enabled (`callbacks: [prometheus]`); `/metrics` requires the master key, supplied via `authorization` bearer in the scrape config. |
| **Headroom** | `headroom:8787` | `/metrics` | `headroom` | Always-on Prometheus endpoint; no auth needed on the internal network. |
| **OpenSRE** | `opensre:8000` | `/metrics` | `opensre` | New `/metrics` endpoint added to `opensre_server.py` (`prometheus-client`): requests, latency, investigations. |
| **AURA** | — | — | `aura` | AURA exposes **no native `/metrics`** (verified: `/metrics`, `/debug/metrics`, `/v1/metrics` all 404). Observed via cAdvisor container metrics (CPU/mem/network, already scraped) and its OTLP spans in VictoriaTraces. |

### LiteLLM metrics (selection)

`litellm_spend_metric_total`, `litellm_total_tokens_metric_total`, `litellm_input_tokens_metric_total`, `litellm_output_tokens_metric_total`, `litellm_deployment_total_requests_total`, `litellm_deployment_success_responses_total`, `litellm_deployment_failure_responses_total`, `litellm_request_total_latency_metric_bucket`, `litellm_llm_api_latency_metric_bucket`, `litellm_cache_hits_metric_total` / `litellm_cache_misses_metric_total`.

### Headroom metrics (selection)

Proxy-native counters — these only move when LLM traffic is routed *through* the proxy, so they remain 0 in an MCP-tools-only setup: `headroom_tokens_saved_total`, `headroom_persistent_savings_tokens_saved_total`, `headroom_requests_total`, `headroom_requests_failed_total`, `headroom_requests_cached_total`, `headroom_inbound_requests_total`.

> **Series-name drift:** the OTel prometheus receiver normalizes summary counters on the way into VictoriaMetrics, so what the proxy serves as `headroom_latency_ms_sum/_count` (likewise `_overhead_ms_`, `_ttfb_ms_`) is stored as `headroom_latency_ms_sum_total` / `headroom_latency_ms_count_total`. Build Grafana panels on the `_total` names.

MCP tool usage (the live path: agent → LiteLLM gateway → headroom-mcp) is counted by LiteLLM: `litellm_mcp_tool_calls_total{mcp_server_name="headroom", mcp_tool_name="headroom_compress"}`. Tokens saved by MCP compressions are reported by the `headroom_stats` tool output and are not exported to Prometheus.

### OpenSRE metrics

`opensre_requests_total{method,path,status}`, `opensre_request_duration_seconds`, `opensre_investigations_total`, `opensre_investigations_in_flight`.

---

## Applying Changes

```bash
# Rebuild OpenSRE (new prometheus-client dependency) and (re)create Headroom services
docker compose build opensre
docker compose up -d --remove-orphans
```

Verify:

```bash
# Metrics endpoints
docker exec otel-collector curl -s http://headroom:8787/metrics | head
docker exec otel-collector curl -s http://opensre:8000/metrics | head
# LiteLLM (requires master key)
source .env && docker exec otel-collector curl -s -H "Authorization: Bearer $LITELLM_MASTER_KEY" http://litellm:4000/metrics | head

# Headroom MCP tools reachable via LiteLLM gateway
curl -sS -X POST http://localhost:4000/headroom/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```
