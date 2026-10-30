# Docker Container Version Pinning & Migration Guide

This guide documents the transition and maintenance of the **o11ystack** infrastructure across verified semantic version tags. It provides architectural rationale, breaking changes analysis, data migration requirements, an automated migration script, and a step-by-step procedure for rolling upgrades and deterministic rollbacks.

---

## 1. Pinned Version Matrix

All stack services, telemetry collectors, MCP servers, and auxiliary containers are pinned to verified stable release tags:

| Service | Previous Pinned Tag | Updated Release Tag | Digest / Architecture | Role & Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **victoriametrics** | `v1.152.0` | `victoriametrics/victoria-metrics:v1.155.0` | `amd64` | Single-node TSDB; verified `v1.155.0` binary running |
| **victorialogs** | `v1.52.0` | `victoriametrics/victoria-logs:v1.53.0` | `amd64` | Log database & LogSQL engine; verified `v1.53.0` binary running |
| **victoriatraces** | `v0.11.0` | `victoriametrics/victoria-traces:v0.12.1` | `amd64` | Distributed tracing TSDB; verified `v0.12.1` binary running |
| **grafana** | `13.2.1` | `grafana/grafana:13.3.0` | `amd64` | Observability UI; verified `13.3.0` healthy on MySQL backend (10 CVE fixes) |
| **mysql** | `8.0.46` | `mysql:8.0.46` | `amd64` | Grafana relational store; pinned to 8.0 LTS point release |
| **litellm** | `v1.100.1` | `ghcr.io/berriai/litellm:v1.106.6` | `amd64` | Multi-provider LLM gateway; verified `v1.106.6` healthy |
| **postgres** | `16.15-alpine` | `postgres:16.15-alpine` | `amd64` (Alpine) | LiteLLM & Langfuse DB backend; pinned to 16 LTS point release |
| **redis** | `7.4.11-alpine` | `redis:7.4.12-alpine` | `amd64` (Alpine) | LiteLLM cache & rate-limiter; pinned to 7.4 LTS point release |
| **aura** | `0.2.17` | `mezmo/aura:0.2.19` | `amd64` | Autonomous SRE agent; verified `0.2.19` healthy |
| **opensre** | `0.1` | Local build (`./opensre`) | `amd64` | OpenSRE AI Agent; updated `pyproject.toml` constraint `litellm<1.107.0` |
| **headroom** | `latest` | `ghcr.io/headroomlabs-ai/headroom:latest` | `amd64` | Semantic context compression proxy |
| **headroom-mcp** | `latest` | `ghcr.io/headroomlabs-ai/headroom:latest` | `amd64` | Headroom MCP server (HTTP transport) |
| **headroom-exporter** | `python:3.12-slim` | `python:3.12-slim` | `amd64` | Headroom Prometheus savings exporter |
| **langfuse-clickhouse**| `25.12` | `clickhouse/clickhouse-server:26.3.62.3` | `amd64` | Analytical database for Langfuse; pinned to upstream LTS release |
| **langfuse-minio** | `2025.7.23` | `bitnamilegacy/minio:2025.7.23` | `amd64` | S3-compatible event & media blob storage for Langfuse |
| **langfuse-web** | `4-langfuse-path` | `o11ystack/langfuse-web:4-langfuse-path` | `amd64` | Langfuse web UI built with `/langfuse` base path from v4 production branch |
| **langfuse-worker** | `4` | `docker.langfuse.com/langfuse/langfuse-worker:4` | `amd64` | Background trace & observation ingestion worker (v4) |
| **mcp-victoriametrics**| `v1.20.2` | `ghcr.io/victoriametrics/mcp-victoriametrics:v1.20.2` | `amd64` | VictoriaMetrics MCP server (SSE); verified `v1.20.2` |
| **mcp-victorialogs** | `v1.9.0` | `ghcr.io/victoriametrics/mcp-victorialogs:v1.9.0` | `amd64` | VictoriaLogs MCP server (SSE); verified `v1.9.0` |
| **mcp-victoriatraces**| `v1.5.0` | `ghcr.io/victoriametrics-community/mcp-victoriatraces:v1.5.0` | `amd64` | VictoriaTraces MCP server (SSE); verified `v1.5.0` |
| **mcp-grafana** | `1.4.1` | `grafana/mcp-grafana:2.1.1` | `amd64` | Grafana MCP server (SSE); updated to official MCP Go SDK v2 |
| **node-exporter** | `v1.12.1` | `prom/node-exporter:v1.12.1` | `amd64` | Host hardware & OS metrics collector |
| **process-exporter** | `v0.8.7` | `ncabatoff/process-exporter:v0.8.7` | `amd64` | Per-process CPU, memory, IO metrics collector |
| **cadvisor** | `v0.49.1` | `gcr.io/cadvisor/cadvisor:v0.55.1` | `amd64` | Container cgroups telemetry collector |
| **otel-collector** | `0.160.0` | `otel/opentelemetry-collector-contrib:0.164.0` | `amd64` | Telemetry pipeline; verified `0.164.0` running |
| **beyla** | `3.35.0` | `grafana/beyla:3.40.0` | `amd64` | Auto-instrumentation eBPF tracing agent |
| **vector** | `0.58.0-alpine` | `timberio/vector:0.61.0-alpine` | `amd64` (Alpine) | Docker log stream parser; verified `0.61.0` running |
| **nginx** | `1.31.5-alpine` | `nginx:1.31.8-alpine` | `amd64` (Alpine) | Reverse proxy & SSL gateway; verified `1.31.8` running |
| **duckdns** | `version-73f1bc7d` | `lscr.io/linuxserver/duckdns:version-8aabc87c` | `amd64` (Alpine) | Dynamic DNS updater; pinned to latest stable release |
| *curl (setup script)* | `8.22.0` | `curlimages/curl:8.23.0` | `amd64` | Service Account automation helper |

---

## 2. Deep Dive: Breaking Changes & Storage Migration Analysis

### 2.1 Database & Persistence Backends

#### MySQL: `mysql:8.0.46` (vs MySQL 8.4 LTS / MySQL 9)
- **Rationale**: MySQL 8.0 remains supported through standard LTS channels. Upgrading to MySQL 8.4 LTS or 9.0 introduces major breaking changes:
  1. **Authentication Plugin**: MySQL 8.4 disables `mysql_native_password` by default. Connecting clients and Grafana database connections configured with legacy auth will fail unless explicitly updated to `caching_sha2_password` or started with `--mysql-native-password=ON`.
  2. **Removed Server Variables**: Several legacy replication and InnoDB tuning flags were removed in 8.4.
  3. **InnoDB Redo Log**: File format requirements prevent rolling back once an 8.4 instance touches an 8.0 datadir.
- **Migration Path**:
  - Keep `mysql:8.0.46` for zero-risk, zero-schema conversion stability.
  - When planning a future move to MySQL 8.4 LTS, execute:
    ```sql
    ALTER USER 'grafana'@'%' IDENTIFIED WITH caching_sha2_password BY 'your_password';
    ```
  - Back up database before any major upgrade using:
    ```bash
    docker exec mysql mysqldump -u grafana -p${GRAFANA_DB_PASSWORD} grafana > ./backups/grafana_mysql.sql
    ```

#### PostgreSQL: `postgres:16.15-alpine` (vs PostgreSQL 17 / 18)
- **Rationale**: PostgreSQL major releases (e.g. 16 -> 17) are **not binary compatible** on disk. Changing the container image from `16-alpine` to `17-alpine` causes the container to immediately crash with:
  ```text
  FATAL: database files are incompatible with server
  DETAIL: The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 17.
  ```
- **Migration Path**:
  - Pinned to `postgres:16.15-alpine` guarantees security patches while preserving on-disk compatibility with the existing `postgres-data` Docker volume.
  - When upgrading to PostgreSQL 17+ in the future:
    1. Dump existing database: `docker exec -t postgres pg_dumpall -U litellm > ./backups/postgres_all.sql`
    2. Stop service and move old volume: `docker volume rm o11ystack_postgres-data`
    3. Update image to `postgres:17.x-alpine` and start service.
    4. Restore schema and data: `cat ./backups/postgres_all.sql | docker exec -i postgres psql -U litellm`

#### Redis: `redis:7.4.12-alpine` (vs Redis 8)
- **Rationale**: Redis 7.4.x is the final major version under the original open-source BSD-3 license before the transition to RSALv2/SSPLv1 dual licensing in Redis 8. Furthermore, Redis 8 alters command semantics and persistence serialization.
- **Migration Path**:
  - Updated to `redis:7.4.12-alpine` (latest point release of the 7.4 branch). Maintains full AOF (`appendonly yes`) compatibility on the `redis-data` volume without any risk of corruption or license impedance.

#### ClickHouse: `clickhouse/clickhouse-server:26.3.62.3` (vs 25.12)
- **Rationale**: Langfuse upstream officially transitioned its reference deployment to the ClickHouse 26.3 LTS series (`26.3.62.3`). Upgrading from 25.12 to 26.3 LTS provides long-term stability, bug fixes for distributed query optimizations, and reduced memory footprint.
- **Data Compatibility**: ClickHouse supports seamless forward data partition upgrades across consecutive LTS versions. On first startup, the 26.3 engine checks and mounts the existing `/var/lib/clickhouse` volume.
- **Migration Path**:
  - Pre-upgrade backup: Snapshot `/var/lib/clickhouse/metadata` if persistent volume is mounted on host.
  - The init script `langfuse/clickhouse-init/01-grafana-user.sh` uses standard SQL `CREATE USER IF NOT EXISTS ... IDENTIFIED WITH sha256_password`, which executes identically in 26.3.

---

### 2.2 Observability Storage & Query Engines

#### VictoriaMetrics (`v1.155.0`), VictoriaLogs (`v1.53.0`), VictoriaTraces (`v0.12.1`)
- **Data Compatibility**:
  - VictoriaMetrics storage engine (`/var/lib/vmetrics`) is backward and forward compatible across 1.x releases.
  - VictoriaLogs storage format (`/var/lib/vlogs`) automatically handles block partitions with automatic partition upgrade on mount.
  - VictoriaTraces (`/var/lib/vtraces`) supports OTLP trace structures and Jaeger/Tempo query API protocols. Version 0.12.1 improves gRPC streaming and query lookback optimizations.
- **Upgrade Path**:
  - Upgrades within VictoriaMetrics v1.x and VictoriaLogs v1.x are drop-in: update the version tag, run `docker compose up -d <service>`, and the new binary will automatically verify and mount the data partition.

---

### 2.3 Application & Agent Services

#### Grafana (`13.3.0` vs `13.2.1`)
- **Security Updates**:
  - Grafana 13.3.0 addresses **10 CVE vulnerabilities** (including CVE-2026-100105, CVE-2026-13719, CVE-2026-15577).
- **Database Migrations**:
  - Grafana automatically runs relational database schema migrations against MySQL on startup.
  - The healthcheck in `docker-compose.yml` (`wget -q --spider http://localhost:3000/grafana/api/health`) ensures downstream services wait until Grafana reports HTTP 200.

#### MCP Grafana Server (`2.1.1` vs `1.4.1`)
- **SDK Upgrade**:
  - Migrated from legacy `mark3labs/mcp-go` to the official MCP Go SDK (`modelcontextprotocol/go-sdk`).
  - Command line flags `-t sse -address 0.0.0.0:8000 -allowed-hosts *` and environment variable `GRAFANA_URL` are preserved.
- **Dashboard Schema Compatibility**:
  - Version 2.1.1 resolves a critical issue where Grafana 13.3 default grid layouts could cause dashboard updates to fail. It correctly handles both classic v1 and v2 dashboard schemas.

#### LiteLLM Proxy (`v1.106.6` vs `v1.100.1`)
- **Prisma Schema Migrations**:
  - LiteLLM uses Prisma ORM against PostgreSQL (`DATABASE_URL`).
  - Prisma automatically verifies and applies schema updates during startup.
  - The extended `start_period: 60s` in `docker-compose.yml` ensures health checks pass smoothly during migrations.

#### Mezmo AURA (`0.2.19` vs `0.2.17`)
- **Coordinator & Tool Inspection**:
  - Resolves coordinator inspection of active run tools during multi-worker orchestration.
  - Strict tool-name pattern matching introduced in 0.2.18 verified compatible with `aura/config.toml`.

#### OpenSRE AI Agent
- **Dependency Range Relaxation**:
  - `opensre/pyproject.toml` updated from `"litellm>=1.90.0,<1.101.0"` to `"litellm>=1.90.0,<1.107.0"`.
  - Ensures local builds from Dockerfile resolve dependencies cleanly against LiteLLM 1.106.6.

#### cAdvisor (`v0.55.1` vs `v0.49.1`)
- **Kernel & Cgroups Compatibility**:
  - Upgraded to modern `v0.55.1` from Google Container Registry (`gcr.io/cadvisor/cadvisor`).
  - Enhances cgroup v2 metrics parsing, CPU throttling counters, and memory working set metrics.

#### OTel Collector Contrib (`0.164.0`), Beyla (`3.40.0`), Vector (`0.61.0-alpine`)
- **Pipeline Stability**:
  - Vector 0.61.0 provides improved memory management for Docker log collection and HTTP gzip compression to VictoriaLogs.
  - OTel Collector Contrib 0.164.0 updates batching and resource detection processors.
  - Grafana Beyla 3.40.0 brings updated eBPF probes for kernel 6.x compatibility.

---

## 3. Automated Migration Script

An automated, non-destructive migration script is provided at `scripts/migrate-stack.sh`. It performs safety pre-checks, database backups, image pulls, and an ordered rolling restart:

```bash
# Execute automated migration
./scripts/migrate-stack.sh
```

### Script Execution Sequence:
1. **Safety Pre-Check**: Verifies `.env` presence and active Docker daemon.
2. **Database Backups**:
   - Dumps Grafana MySQL database into `backups/<timestamp>/grafana_mysql.sql`.
   - Dumps LiteLLM and Langfuse PostgreSQL databases into `backups/<timestamp>/litellm_postgres.sql`.
   - Triggers Redis in-memory snapshot (`bgsave`).
3. **Image Pulling**: Pulls all updated images concurrently via `docker compose pull`.
4. **Ordered Rolling Restart**:
   - Storage layer first: MySQL, PostgreSQL, Redis, VictoriaMetrics, VictoriaLogs, VictoriaTraces, ClickHouse, MinIO.
   - Wait for database healthchecks to report `healthy`.
   - Telemetry collectors and gateways: OTel Collector, Vector, Node Exporter, Process Exporter, cAdvisor, Beyla, LiteLLM, Headroom.
   - Wait for LiteLLM healthcheck to report `healthy`.
   - Application layer: Grafana, MCP servers, Langfuse Web/Worker, Mezmo AURA, OpenSRE.
   - Wait for Grafana healthcheck to report `healthy`.
   - Re-sync Grafana MCP service account token via `scripts/setup-grafana-mcp.sh`.
   - Ingress layer: Nginx reverse proxy and DuckDNS.
5. **Health Verification**: Outputs `docker compose ps` status table.

---

## 4. Manual Safe Migration Playbook

To perform the migration manually step-by-step:

### Step 1: Pre-Upgrade State Verification & Backup
```bash
# 1. Verify current stack health
docker compose ps

# 2. Create backup directory
mkdir -p ./backups/pre_upgrade

# 3. Backup Grafana MySQL database
docker exec mysql mysqldump -u grafana -p${GRAFANA_DB_PASSWORD} grafana > ./backups/pre_upgrade/grafana_mysql.sql

# 4. Backup LiteLLM & Langfuse PostgreSQL database
docker exec postgres pg_dump -U litellm litellm > ./backups/pre_upgrade/litellm_postgres.sql
docker exec postgres pg_dump -U litellm langfuse > ./backups/pre_upgrade/langfuse_postgres.sql

# 5. Trigger Redis background save
docker exec redis redis-cli -a ${REDIS_PASSWORD} bgsave
```

### Step 2: Pull Updated Images
```bash
docker compose pull
```

### Step 3: Rolling Restart in Dependency Order
```bash
# 1. Storage & Databases
docker compose up -d --no-deps mysql postgres redis victoriametrics victorialogs victoriatraces langfuse-clickhouse langfuse-minio

# 2. Collectors & Gateways
docker compose up -d --no-deps otel-collector vector node-exporter process-exporter cadvisor beyla litellm headroom headroom-mcp headroom-exporter

# 3. Application & Agent Services
docker compose up -d --no-deps mcp-victoriametrics mcp-victorialogs mcp-victoriatraces mcp-grafana grafana aura opensre langfuse-web langfuse-worker

# 4. Proxy & DNS
docker compose up -d --no-deps nginx duckdns
```

### Step 4: Verify Health Status
```bash
docker compose ps
docker compose logs -f --tail=50 grafana litellm aura
```

---

## 5. Rollback Plan

If any container fails after an upgrade:
1. Revert `docker-compose.yml` to the previous version tags:
   - `victoriametrics/victoria-metrics:v1.152.0`
   - `victoriametrics/victoria-logs:v1.52.0`
   - `victoriametrics/victoria-traces:v0.11.0`
   - `grafana/grafana:13.2.1`
   - `redis:7.4.11-alpine`
   - `ghcr.io/berriai/litellm:v1.100.1`
   - `mezmo/aura:0.2.17`
   - `clickhouse/clickhouse-server:25.12`
   - `grafana/mcp-grafana:1.4.1`
   - `gcr.io/cadvisor/cadvisor:v0.49.1`
   - `otel/opentelemetry-collector-contrib:0.160.0`
   - `grafana/beyla:3.35.0`
   - `timberio/vector:0.58.0-alpine`
   - `nginx:1.31.5-alpine`
   - `lscr.io/linuxserver/duckdns:version-73f1bc7d`

2. Re-create the services:
   ```bash
   docker compose up -d
   ```

3. If database restore is required:
   - **MySQL**:
     ```bash
     cat ./backups/pre_upgrade/grafana_mysql.sql | docker exec -i mysql mysql -u grafana -p${GRAFANA_DB_PASSWORD} grafana
     ```
   - **PostgreSQL**:
     ```bash
     cat ./backups/pre_upgrade/litellm_postgres.sql | docker exec -i postgres psql -U litellm litellm
     ```
