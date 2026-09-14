# Docker Container Version Pinning & Migration Guide

This guide documents the transition of the **o11ystack** infrastructure from floating tags (`:latest`, `:alpine`, `:8.0`, `:16-alpine`, `:7-alpine`) to **explicit, verified semantic version tags**. It provides architectural rationale, breaking changes analysis, data migration requirements, and a step-by-step procedure for future upgrades.

---

## 1. Pinned Version Matrix

All 21 services and auxiliary utility containers are pinned to verified stable release tags:

| Service | Previous Image Tag | Pinned Image Tag | Digest / Architecture | Role & Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **victoriametrics** | `victoriametrics/victoria-metrics:latest` | `victoriametrics/victoria-metrics:v1.152.0` | `amd64` | Single-node TSDB; verified `v1.152.0` binary running |
| **victorialogs** | `victoriametrics/victoria-logs:latest` | `victoriametrics/victoria-logs:v1.52.0` | `amd64` | Log database & LogSQL engine; verified `v1.52.0` binary running |
| **victoriatraces** | `victoriametrics/victoria-traces:latest` | `victoriametrics/victoria-traces:v0.11.0` | `amd64` | Distributed tracing TSDB; verified `v0.11.0` binary running |
| **grafana** | `grafana/grafana:latest` | `grafana/grafana:13.2.1` | `amd64` | Observability UI; verified `13.2.1` healthy on MySQL backend |
| **mysql** | `mysql:8.0` | `mysql:8.0.46` | `amd64` | Grafana relational store; pinned to 8.0 LTS point release |
| **litellm** | `ghcr.io/berriai/litellm:main-latest` | `ghcr.io/berriai/litellm:v1.100.1` | `amd64` | Multi-provider LLM gateway; verified `v1.100.1` healthy |
| **postgres** | `postgres:16-alpine` | `postgres:16.15-alpine` | `amd64` (Alpine) | LiteLLM DB backend; pinned to 16 LTS point release |
| **redis** | `redis:7-alpine` | `redis:7.4.11-alpine` | `amd64` (Alpine) | LiteLLM cache & rate-limiter; pinned to 7.4 LTS point release |
| **aura** | `mezmo/aura:latest` | `mezmo/aura:0.2.17` | `amd64` | Autonomous SRE agent; verified `0.2.17` healthy |
| **mcp-victoriametrics** | `ghcr.io/victoriametrics/mcp-victoriametrics:latest` | `ghcr.io/victoriametrics/mcp-victoriametrics:v1.20.2` | `amd64` | VictoriaMetrics MCP server (SSE); verified `v1.20.2` |
| **mcp-victorialogs** | `ghcr.io/victoriametrics/mcp-victorialogs:latest` | `ghcr.io/victoriametrics/mcp-victorialogs:v1.9.0` | `amd64` | VictoriaLogs MCP server (SSE); verified `v1.9.0` |
| **mcp-victoriatraces** | `ghcr.io/victoriametrics-community/mcp-victoriatraces:latest` | `ghcr.io/victoriametrics-community/mcp-victoriatraces:v1.5.0` | `amd64` | VictoriaTraces MCP server (SSE); verified `v1.5.0` |
| **mcp-grafana** | `grafana/mcp-grafana:latest` | `grafana/mcp-grafana:1.4.1` | `amd64` | Grafana MCP server (SSE); verified `1.4.1` |
| **node-exporter** | `prom/node-exporter:latest` | `prom/node-exporter:v1.12.1` | `amd64` | Host hardware & OS metrics collector |
| **process-exporter** | `ncabatoff/process-exporter:latest` | `ncabatoff/process-exporter:v0.8.7` | `amd64` | Per-process CPU, memory, IO metrics collector |
| **cadvisor** | `gcr.io/cadvisor/cadvisor:v0.49.1` | `gcr.io/cadvisor/cadvisor:v0.49.1` | `amd64` | Container cgroups telemetry collector |
| **otel-collector** | `otel/opentelemetry-collector-contrib:latest` | `otel/opentelemetry-collector-contrib:0.160.0` | `amd64` | Telemetry pipeline; verified `0.160.0` running |
| **beyla** | `grafana/beyla:latest` | `grafana/beyla:3.35.0` | `amd64` | Auto-instrumentation eBPF tracing agent |
| **vector** | `timberio/vector:latest-alpine` | `timberio/vector:0.58.0-alpine` | `amd64` (Alpine) | Docker log stream parser; verified `0.58.0` running |
| **nginx** | `nginx:alpine` | `nginx:1.31.5-alpine` | `amd64` (Alpine) | Reverse proxy & SSL gateway; verified `1.31.5` running |
| **duckdns** | `lscr.io/linuxserver/duckdns:latest` | `lscr.io/linuxserver/duckdns:version-73f1bc7d` | `amd64` (Alpine) | Dynamic DNS updater; verified running |
| *curl (setup script)* | `curlimages/curl:latest` | `curlimages/curl:8.22.0` | `amd64` | Service Account automation helper |

---

## 2. Deep Dive: Observable Breaking Changes & Storage Migration Analysis

### 2.1 Database & Persistence Backends

#### MySQL: `mysql:8.0.46` (vs MySQL 8.4 LTS / MySQL 9)
- **Rationale**: MySQL 8.0 remains supported through standard LTS channels. Upgrading to MySQL 8.4 LTS or 9.0 introduces major breaking changes:
  1. **Authentication Plugin**: MySQL 8.4 disables `mysql_native_password` by default. Connecting clients and Grafana database connections configured with legacy auth will fail unless explicitly updated to `caching_sha2_password` or started with `--mysql-native-password=ON`.
  2. **Removed Server Variables**: Several legacy replication and InnoDB tuning flags were removed in 8.4.
  3. **InnoDB Redo Log**: File format requirements prevent rolling back once an 8.4 instance touches an 8.0 datadir.
- **Migration Path**:
  - Keep `mysql:8.0.46` for zero-risk, zero-schema conversion stability.
  - When planning a future move to MySQL 8.4 LTS, first execute:
    ```sql
    ALTER USER 'grafana'@'%' IDENTIFIED WITH caching_sha2_password BY 'your_password';
    ```
  - Perform a complete dump using `mysqldump --single-transaction -u root -p grafana > grafana_backup.sql`.

#### PostgreSQL: `postgres:16.15-alpine` (vs PostgreSQL 17 / 18)
- **Rationale**: PostgreSQL major releases (e.g. 16 -> 17) are **not binary compatible** on disk. Changing the container image from `16-alpine` to `17-alpine` causes the container to immediately crash with:
  ```text
  FATAL: database files are incompatible with server
  DETAIL: The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 17.
  ```
- **Migration Path**:
  - Pinned to `postgres:16.15-alpine` guarantees security patches while preserving on-disk compatibility with the existing `postgres-data` Docker volume.
  - When upgrading to PostgreSQL 17+ in the future:
    1. Dump existing database: `docker exec -t postgres pg_dumpall -U litellm > litellm_backup.sql`
    2. Stop service and move old volume: `docker volume rm o11ystack_postgres-data`
    3. Update image to `postgres:17.x-alpine` and start service.
    4. Restore schema and data: `cat litellm_backup.sql | docker exec -i postgres psql -U litellm`

#### Redis: `redis:7.4.11-alpine` (vs Redis 8)
- **Rationale**: Redis 7.4.x is the final major version under the original open-source BSD-3 license before the transition to RSALv2/SSPLv1 dual licensing in Redis 8. Furthermore, Redis 8 alters command semantics and persistence serialization.
- **Migration Path**:
  - Pinned to `redis:7.4.11-alpine` maintains AOF (`appendonly yes`) compatibility on the `redis-data` volume without any risk of corruption or license impedance.

---

### 2.2 Observability Storage & Query Engines

#### VictoriaMetrics (`v1.152.0`), VictoriaLogs (`v1.52.0`), VictoriaTraces (`v0.11.0`)
- **Data Compatibility**:
  - VictoriaMetrics storage engine (`/var/lib/vmetrics`) is backward and forward compatible across 1.x releases.
  - VictoriaLogs storage format (`/var/lib/vlogs`) handles block partitions automatically with automatic partition upgrade.
  - VictoriaTraces (`/var/lib/vtraces`) supports OTLP trace structures and Jaeger/Tempo query API protocols.
- **Breaking Flag Changes**:
  - VictoriaMetrics has deprecated legacy `-promscrape.config` in favor of standard vmagent or direct OTel ingestion. In o11ystack, OTel Collector is used as the primary pipeline, rendering the deprecation harmless.
- **Upgrade Path**:
  - Upgrades within VictoriaMetrics v1.x and VictoriaLogs v1.x are drop-in: update the version tag, run `docker compose up -d <service>`, and the new binary will automatically verify and mount the data partition.

---

### 2.3 Application & Agent Services

#### Grafana (`13.2.1`)
- **Angular Plugins Removal**:
  - All legacy AngularJS plugins were deprecated in Grafana 10 and completely removed in Grafana 11+.
  - All provisioned datasources in `grafana/provisioning/datasources/datasources.yaml` (VictoriaMetrics, VictoriaLogs, VictoriaTraces) use modern React-compatible datasource types (`prometheus`, `victoriametrics-logs-datasource`, `tempo`).
- **Database Migrations**:
  - Grafana automatically runs relational database schema migrations against MySQL on startup.
  - The healthcheck in `docker-compose.yml` ensures downstream services wait until Grafana reports HTTP 200 on `/grafana/api/health`.

#### LiteLLM Proxy (`v1.100.1`)
- **Prisma Schema Migrations**:
  - LiteLLM uses Prisma ORM against PostgreSQL (`DATABASE_URL`).
  - On fresh startups or version upgrades, Prisma runs schema check migrations which can take 30–60 seconds.
  - **Applied Fix**: Adjusted `healthcheck` in `docker-compose.yml` to:
    ```yaml
    healthcheck:
      test: ["CMD-SHELL", "python3 -c \"import urllib.request; urllib.request.urlopen('http://localhost:4000/health/readiness')\" || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 8
      start_period: 60s
    ```
    This prevents Docker from falsely marking LiteLLM unhealthy during its initial database initialization.

#### Mezmo AURA (`0.2.17`)
- **Lookback Query Contract**:
  - Tested and verified with default 5-minute lookback telemetry window and explicit user overrides.
  - Fully compatible with VictoriaMetrics, VictoriaLogs, VictoriaTraces, and Grafana MCP servers.

---

## 3. Safe Migration & Future Upgrade Playbook

When updating any component in this stack in the future, follow this standard operational procedure:

### Step 1: Pre-Upgrade State Verification & Backup
Before changing any image tags:
```bash
# 1. Verify current stack health
docker compose ps

# 2. Backup Grafana MySQL database
docker exec mysql mysqldump -u grafana -p${MYSQL_PASSWORD} grafana > ./scratch/grafana_pre_upgrade.sql

# 3. Backup LiteLLM PostgreSQL database
docker exec postgres pg_dump -U litellm litellm > ./scratch/litellm_pre_upgrade.sql

# 4. Create snapshot of Victoria data directories (optional, recommended for major jumps)
tar -czf ./scratch/vmetrics_meta_$(date +%F).tar.gz /var/lib/vmetrics/metadata 2>/dev/null || true
```

### Step 2: Edit Target Version in `docker-compose.yml`
Locate the service in `docker-compose.yml` and replace the tag with the target version (e.g. `victoriametrics/victoria-metrics:v1.153.0`).

### Step 3: Pull and Inspect the New Image
Always pre-pull before restarting to verify image existence and architecture:
```bash
docker compose pull <service-name>
```

### Step 4: Graceful Single-Service Rolling Restart
Restart only the upgraded service to minimize downtime:
```bash
docker compose up -d --no-deps <service-name>
```

### Step 5: Verify Health & Logs
```bash
# Watch container startup logs
docker compose logs -f --tail=100 <service-name>

# Verify health status
docker compose ps <service-name>
```

---

## 4. Rollback Plan

If any container fails after an upgrade:
1. Edit `docker-compose.yml` and revert the image tag back to the verified version in the matrix above.
2. Re-create the container:
   ```bash
   docker compose up -d --no-deps <service-name>
   ```
3. If database corruption occurred during a failed migration, restore the database from the pre-upgrade dump:
   - For MySQL:
     ```bash
     cat ./scratch/grafana_pre_upgrade.sql | docker exec -i mysql mysql -u grafana -p${MYSQL_PASSWORD} grafana
     ```
   - For PostgreSQL:
     ```bash
     cat ./scratch/litellm_pre_upgrade.sql | docker exec -i postgres psql -U litellm litellm
     ```
