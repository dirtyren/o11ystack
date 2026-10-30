# Changelog

All notable changes to the **o11ystack** (Observability & AI Stack) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-10-30

### Upgraded
- **Observability Core (Victoria Stack)**:
  - `victoriametrics/victoria-metrics`: Updated from `v1.152.0` to `v1.155.0` (query performance optimizations and stability improvements).
  - `victoriametrics/victoria-logs`: Updated from `v1.52.0` to `v1.53.0` (LogSQL filter speedups and automatic partition upgrades).
  - `victoriametrics/victoria-traces`: Updated from `v0.11.0` to `v0.12.1` (gRPC streaming latency fixes and enhanced trace duration calculation).
- **Visualization & UI**:
  - `grafana/grafana`: Updated from `13.2.1` to `13.3.0` (includes critical security patches for 10 CVEs: CVE-2026-100105, CVE-2026-13719, CVE-2026-13720, CVE-2026-15577, CVE-2026-33374, CVE-2026-81841, CVE-2026-88858, CVE-2026-88967, CVE-2026-93294, CVE-2026-95502).
- **Model Context Protocol (MCP)**:
  - `grafana/mcp-grafana`: Updated from `1.4.1` to `2.1.1` (migrated to official MCP Go SDK v2; added schema v1/v2 compatibility for Grafana 13.3 dashboards).
- **LLM Gateway & AI Agents**:
  - `ghcr.io/berriai/litellm`: Updated from `v1.100.1` to `v1.106.6` (latest provider model mappings, OTel v2 span optimizations, and automated Prisma migrations).
  - `mezmo/aura`: Updated from `0.2.17` to `0.2.19` (coordinator inspection bug fix for active run tools and globset tool-pattern matching).
  - `opensre`: Updated dependency constraint in `opensre/pyproject.toml` and `opensre/uv.lock` from `"litellm>=1.90.0,<1.101.0"` to `"litellm>=1.90.0,<1.107.0"` to align with LiteLLM 1.106.6.
- **Analytical & Cache Databases**:
  - `clickhouse/clickhouse-server`: Updated from `25.12` to `26.3.62.3` (aligned with upstream Langfuse v4 LTS specification; long-term support release).
  - `redis`: Updated from `7.4.11-alpine` to `7.4.12-alpine` (security point release within 7.4 LTS BSD-3 branch; 100% on-disk AOF compatibility).
- **Telemetry Collection & eBPF**:
  - `gcr.io/cadvisor/cadvisor`: Updated from `v0.49.1` to `v0.55.1` (modern cgroup v2 parsing, CPU throttling counters, and container working set telemetry).
  - `otel/opentelemetry-collector-contrib`: Updated from `0.160.0` to `0.164.0` (memory limiter and batch processor performance enhancements).
  - `grafana/beyla`: Updated from `3.35.0` to `3.40.0` (eBPF probes updated for Linux kernel 6.x compatibility and gRPC/HTTP span extraction).
  - `timberio/vector`: Updated from `0.58.0-alpine` to `0.61.0-alpine` (VRL transform performance enhancements and gzip HTTP compression to VictoriaLogs).
- **Infrastructure & Utilities**:
  - `nginx`: Updated from `1.31.5-alpine` to `1.31.8-alpine` (mainline security and stability point release).
  - `lscr.io/linuxserver/duckdns`: Pinned to latest stable digest release `version-8aabc87c` (was `version-73f1bc7d`).
  - `curlimages/curl`: Updated from `8.22.0` to `8.23.0` in `scripts/setup-grafana-mcp.sh`.

### Added
- **Automated Migration Script** (`scripts/migrate-stack.sh`):
  - Automates pre-upgrade database backups (MySQL for Grafana, PostgreSQL for LiteLLM & Langfuse, Redis BGSAVE).
  - Concurrently pulls updated images.
  - Performs an ordered rolling restart across layers (Databases -> Collectors & Gateways -> Applications & Agents -> Nginx Proxy & DuckDNS) with healthcheck readiness polling.
  - Automatically re-verifies Grafana MCP service account credentials.
- **Migration & Upgrade Documentation** (`docs/MIGRATION_GUIDE.md`):
  - Added full 28-service version matrix with previous and updated tags.
  - Added breaking change analyses for MySQL (8.0 vs 8.4/9 auth), PostgreSQL (16 vs 17 binary on-disk format), Redis (7.4 vs 8 dual-licensing), ClickHouse (26.3 LTS data format), Grafana (13.3 CVEs and schema v2), and MCP Grafana (v2 SDK).
  - Documented automated migration procedure, manual migration playbook, and step-by-step rollback procedure.

### Verified
- `mysql:8.0.46`: Verified already at the latest 8.0 LTS point release. Kept at 8.0.46 to prevent breaking changes with `caching_sha2_password` and InnoDB redo logs.
- `postgres:16.15-alpine`: Verified already at the latest 16 LTS point release. Kept at 16.15 to prevent binary datadir incompatibility with PostgreSQL 17+.
- `ghcr.io/victoriametrics/mcp-victoriametrics:v1.20.2`: Verified latest release.
- `ghcr.io/victoriametrics/mcp-victorialogs:v1.9.0`: Verified latest release.
- `ghcr.io/victoriametrics-community/mcp-victoriatraces:v1.5.0`: Verified latest release.
- `prom/node-exporter:v1.12.1`: Verified latest release.
- `ncabatoff/process-exporter:v0.8.7`: Verified latest release.
- `bitnamilegacy/minio:2025.7.23`: Verified latest release in bitnamilegacy repository.
