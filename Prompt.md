# Master Prompt: Recreating the Observability & AI Stack (`o11ystack`)

> **Instructions for the AI Assistant / Engineer:**
> You are tasked with designing, implementing, configuring, and verifying a complete, production-grade Observability and AI Orchestration Stack (**`o11ystack`**) running on Docker Compose on Linux.
> Follow all the instructions, architectural specifications, configuration details, and bug-avoidance guidelines below to recreate the exact repository and deployment.

---

## 1. High-Level Objective & Architecture

Build an all-in-one, self-hosted observability and autonomous AI SRE stack behind a hardened, SSL-enabled Nginx reverse proxy.

### Core Stack Requirements:
1. **Unified Observability Trio (VictoriaMetrics Suite)**:
   - **VictoriaMetrics** (TSDB for metrics, PromQL)
   - **VictoriaLogs** (Log database, LogSQL)
   - **VictoriaTraces** (Distributed trace engine, OTLP/Tempo/Jaeger compatible)
   - All three configured with **1-year retention** (`retentionPeriod=1y`) storing data in `/var/lib/vmetrics`, `/var/lib/vlogs`, and `/var/lib/vtraces`.
2. **Instrumentation & Telemetry Pipelines**:
   - **Prometheus Node Exporter** (Host hardware: CPU, memory, disk, network).
   - **Process Exporter** (Per-process CPU, memory, thread, and file descriptor metrics).
   - **Grafana Beyla** (Zero-code Linux eBPF auto-instrumentation for OS/kernel processes, HTTP/gRPC/SQL traces).
   - **OpenTelemetry Collector Contrib**:
     - *Metrics Pipeline*: Scrapes `node-exporter:9100`, `process-exporter:9256`, `victoriametrics:8428`, `victorialogs:9428`, and `victoriatraces:10428` -> exports via Prometheus Remote Write to VictoriaMetrics.
     - *Logs Pipeline*: Tails `/var/log/**/*.log` -> exports via OTLP HTTP to VictoriaLogs (`/insert/opentelemetry/v1/logs`).
     - *Traces Pipeline*: Receives spans from Beyla and AURA via OTLP gRPC/HTTP (`:4317` / `:4318`) -> exports to VictoriaTraces (`:4317`).
3. **Dedicated Relational Databases**:
   - **MySQL 8.0** for Grafana backend state, users, and dashboards.
   - **PostgreSQL 16** for LiteLLM key management, virtual keys, team quotas, and audit logs.
4. **Grafana Visualization & Dashboards**:
   - Grafana (Latest stable) pre-provisioned with MySQL backend.
   - Official **`victoriametrics-logs-datasource`** plugin installed.
   - Pre-provisioned datasources:
     - `victoriametrics` (Prometheus type, Default)
     - `victorialogs` (VictoriaLogs plugin type)
     - `victoriatraces` (Tempo type, with trace-to-logs correlation configured to `victorialogs`)
     - `victoriatraces-jaeger` (Jaeger type)
   - Pre-installed production dashboards in provisioning directory:
     - Dashboard `1860`: Node Exporter Full
     - Dashboard `13882`: Process Exporter with Treemap
     - Dashboard `10229`: VictoriaMetrics Single-Node
     - Dashboard `22084`: VictoriaLogs Single-Node
     - Dashboard `24136`: VictoriaTraces Single-Node
5. **Model Context Protocol (MCP) Tier**:
   - 4 standalone MCP servers: `mcp-victoriametrics`, `mcp-victorialogs`, `mcp-victoriatraces`, `mcp-grafana`.
   - Setup script that waits for Grafana migrations, automatically creates an Admin Service Account named `mcp-grafana`, generates a token, and passes it to `mcp-grafana`.
6. **LiteLLM AI Gateway**:
   - Backed by PostgreSQL (`DATABASE_URL`).
   - Registers all 4 MCP servers and acts as an authenticated **MCP Gateway Hub** exposing streamable endpoints (`/{server}/mcp` and `/mcp`).
   - Pre-configured model list supporting:
     - Free Cloud Tier via OpenRouter (`aura-sre-model`, `openrouter-llama-3.3-70b-free`, `openrouter-deepseek-r1-free`, `openrouter-gemini-flash-free`, `openrouter-qwen-coder-free`).
     - Google Gemini Free Tier (`gemini-2.0-flash`).
     - GroqCloud Free Tier (`groq-llama-3.3-70b`).
     - Local Offline Ollama (`ollama-llama3` pointing to `OLLAMA_API_BASE`).
     - Commercial Providers (OpenAI `gpt-4o`, `gpt-4o-mini`, Anthropic `claude-3-5-sonnet`, Mistral, Bedrock, Azure).
     - Built-in Mock Model (`mock-model`) for zero-key testing.
   - Exposes Next.js Admin UI at `/litellm/ui/` authenticated via `admin` and `LITELLM_MASTER_KEY`.
7. **Autonomous Mezmo AURA SRE AI Agent (`mezmo/aura:latest`)**:
   - Runs `aura webserver --verbose` on port 8080.
   - Operates with an Orchestrator Coordinator and 4 specialized workers (`incident-responder`, `metrics-analyst`, `log-analyst`, `trace-analyst`).
   - Connects to LiteLLM for LLM completions using model `${AURA_MODEL:-aura-sre-model}`.
   - Connects to all MCP servers through LiteLLM's authenticated MCP gateway (`http_streamable` transport with Bearer token authentication).
   - Exports internal agent execution traces to OpenTelemetry Collector (`http://otel-collector:4317`) for inspection in VictoriaTraces / Grafana.
8. **Hardened Nginx Ingress & Reverse Proxy**:
   - HTTPS enabled by default with self-signed SSL certificates; port 80 redirects to 443.
   - HTTP Basic Auth on `/vmetrics/`, `/vlogs/`, and `/vtraces/` web interfaces.
   - Custom landing portal page at `/` with status links to all components.
   - Clean routing for LiteLLM Next.js UI preventing reload loops and enabling authentication.
9. **Interactive Automated Deployment (`deploy.sh`)**:
   - Interactively prompts for credentials on first run with auto-generated secure defaults.
   - Generates `.env` (`chmod 600`), SSL certificates, `.htpasswd`.
   - Creates host storage paths `/var/lib/v*`.
   - Bootstraps Grafana MCP Admin Service Account token.
   - Starts all 18 containers and displays a colored summary dashboard.

---

## 2. Directory Structure to Implement

Create the repository structure as follows:

```
.
├── docker-compose.yml                     # 18 services orchestrated with networks, healthchecks & volumes
├── deploy.sh                              # Complete interactive deployment and setup script
├── .env.example                           # Comprehensive environment template
├── .gitignore                             # Ignores .env, certs, .htpasswd, volumes
├── README.md                              # Complete architecture, .env.example reference & LLM access guide
├── Prompt.md                              # This prompt definition
├── aura/
│   └── config.toml                        # Mezmo AURA coordinator & worker definitions + LiteLLM MCP routes
├── grafana/
│   └── provisioning/
│       ├── dashboards/
│       │   ├── dashboards.yaml            # Dashboard provider definition pointing to /etc/grafana/dashboards
│       │   └── definitions/               # Downloaded dashboard JSONs (1860, 13882, 10229, 22084, 24136)
│       └── datasources/
│           └── datasources.yaml           # Datasources for VictoriaMetrics, VictoriaLogs, VictoriaTraces & Jaeger
├── litellm/
│   └── config.yaml                        # LiteLLM general settings, MCP servers, and model registry
├── nginx/
│   ├── nginx.conf                         # Main Nginx daemon configuration
│   ├── default.conf                       # SSL server block, prefix routes, Basic Auth, LiteLLM UI rules
│   └── certs/                             # SSL cert.pem and key.pem directory
├── otel-collector/
│   └── otel-collector-config.yaml         # OTel pipelines: metrics (scrape & remote write), logs, traces
├── process-exporter/
│   └── process-exporter.yml               # Process match rules for process-exporter
└── scripts/
    └── setup-grafana-mcp.sh               # Bootstrap script for Grafana MCP Admin Service Account
```

---

## 3. Step-by-Step Implementation Details

### Step 1: Storage & Retention (`/var/lib/v*`)
- In `docker-compose.yml`, configure:
  - `victoriametrics`: Command `["-storageDataPath=/var/lib/vmetrics", "-retentionPeriod=1y", "-httpListenAddr=:8428"]`. Mount host path `${VMETRICS_DATA_PATH:-/var/lib/vmetrics}`.
  - `victorialogs`: Command `["-storageDataPath=/var/lib/vlogs", "-retentionPeriod=1y", "-httpListenAddr=:9428"]`. Mount host path `${VLOGS_DATA_PATH:-/var/lib/vlogs}`.
  - `victoriatraces`: Command `["-storageDataPath=/var/lib/vtraces", "-retentionPeriod=1y", "-httpListenAddr=:10428", "-otlpGRPCListenAddr=:4317"]`. Mount host path `${VTRACES_DATA_PATH:-/var/lib/vtraces}`.

### Step 2: OpenTelemetry Collector Pipelines & Victoria Self-Scraping
In `otel-collector/otel-collector-config.yaml`:
- **Receivers**:
  - `prometheus`: Scrapes `node-exporter:9100`, `process-exporter:9256`, `victoriametrics:8428`, `victorialogs:9428`, `victoriatraces:10428`.
  - `filelog`: Scrapes `/var/log/**/*.log` from the host.
  - `otlp`: Listens on `0.0.0.0:4317` (gRPC) and `0.0.0.0:4318` (HTTP).
- **Exporters**:
  - `prometheusremotewrite`: Endpoint `http://victoriametrics:8428/api/v1/write`.
  - `otlphttp/logs`: Endpoint `http://victorialogs:9428/insert/opentelemetry/v1/logs`.
  - `otlp/traces`: Endpoint `victoriatraces:4317` with `tls: { insecure: true }`.
- **Service Pipelines**:
  - `metrics`: receivers `[prometheus]`, exporters `[prometheusremotewrite]`.
  - `logs`: receivers `[filelog]`, exporters `[otlphttp/logs]`.
  - `traces`: receivers `[otlp]`, exporters `[otlp/traces]`.

### Step 3: Zero-Code eBPF Tracing with Grafana Beyla
- Service `beyla`: Image `grafana/beyla:latest`.
- Privileged: `true`, `pid: "host"`, `network_mode: "host"`.
- Environment:
  - `BEYLA_OPEN_PORT: "80,443,3000,4000,8080,8428,9428,10428"`
  - `OTEL_EXPORTER_OTLP_ENDPOINT: "http://127.0.0.1:4317"`
  - `BEYLA_SERVICE_NAME: "host-system-ebpf"`

### Step 4: Backend Databases (MySQL & PostgreSQL)
- `mysql`: Image `mysql:8.0`, database `grafana`, user `grafana`, password `${GRAFANA_DB_PASSWORD}`.
- `postgres`: Image `postgres:16-alpine`, database `litellm`, user `litellm`, password `${POSTGRES_PASSWORD}`.
- Health checks configured with `mysqladmin ping` and `pg_isready`.

### Step 5: Grafana Datasources & Pre-Installed Dashboards
- In `docker-compose.yml`, set Grafana plugins:
  `GF_INSTALL_PLUGINS: "victoriametrics-logs-datasource"`
- In `grafana/provisioning/datasources/datasources.yaml`:
  1. `victoriametrics`: type `prometheus`, url `http://victoriametrics:8428`, isDefault: `true`, httpMethod: `POST`.
  2. `victorialogs`: type `victoriametrics-logs-datasource`, url `http://victorialogs:9428`.
  3. `victoriatraces`: type `tempo`, url `http://victoriatraces:10428/select/tempo`, with `tracesToLogsV2` linking trace spans to VictoriaLogs by `traceID`.
  4. `victoriatraces-jaeger`: type `jaeger`, url `http://victoriatraces:10428/select/jaeger`.
- In `grafana/provisioning/dashboards/`:
  - Provide `dashboards.yaml` provider.
  - Download official dashboard JSONs into `definitions/`:
    - `1860_node_exporter_full.json`
    - `13882_process_exporter.json`
    - `10229_victoriametrics.json`
    - `22084_victorialogs.json`
    - `24136_victoriatraces.json`
  - In each JSON definition, ensure `__inputs` array is removed and datasource instances point to standard names (`victoriametrics`, `victorialogs`, `victoriatraces`).

### Step 6: Model Context Protocol (MCP) Tier & Grafana Service Account
- Services:
  - `mcp-victoriametrics`: image `ghcr.io/victoriametrics/mcp-victoriametrics:latest`, entrypoint `http://victoriametrics:8428`.
  - `mcp-victorialogs`: image `ghcr.io/victoriametrics/mcp-victorialogs:latest`, entrypoint `http://victorialogs:9428`.
  - `mcp-victoriatraces`: image `ghcr.io/victoriametrics-community/mcp-victoriatraces:latest`, entrypoint `http://victoriatraces:10428`.
  - `mcp-grafana`: image `grafana/mcp-grafana:latest`, environment `GRAFANA_URL=http://grafana:3000/grafana`, `GRAFANA_SERVICE_ACCOUNT_TOKEN=${GRAFANA_SERVICE_ACCOUNT_TOKEN}`.
- Script `scripts/setup-grafana-mcp.sh`:
  - Polls Grafana `/api/health` until migrations finish.
  - Calls `POST /api/serviceaccounts` with Admin role.
  - Calls `POST /api/serviceaccounts/<id>/tokens` to get an unexpiring token.
  - Writes token into `.env` as `GRAFANA_SERVICE_ACCOUNT_TOKEN`.

### Step 7: LiteLLM AI Gateway, MCP Hub & Redis Cache
- In `litellm/config.yaml`:
  - `master_key: os.environ/LITELLM_MASTER_KEY`
  - `database_url: os.environ/DATABASE_URL`
  - `store_model_in_db: true`
  - `store_prompts_in_spend_logs: true`
  - `maximum_spend_logs_retention_period: "7d"`
  - `maximum_spend_logs_retention_interval: "1d"`
  - `maximum_spend_logs_cleanup_cron: "0 4 * * *"`
  - `maximum_spend_logs_cleanup_batch_size: 1000`
  - `maximum_spend_logs_cleanup_max_batches: 500`
  - `maximum_spend_logs_cleanup_run_budget: "5m"`
  - `maximum_spend_logs_cleanup_batch_timeout: "30s"`
  - `litellm_settings`:
    - `cache: true`
    - `cache_params`: `{ type: redis, host: os.environ/REDIS_HOST, port: 6379, password: os.environ/REDIS_PASSWORD }`
  - Register MCP servers: `victoriametrics`, `victorialogs`, `victoriatraces`, `grafana` (all using transport `sse`).
  - Pre-configure model list:
    - Free models via OpenRouter (`aura-sre-model`, `openrouter-llama-3.3-70b-free`, `openrouter-deepseek-r1-free`, `openrouter-gemini-flash-free`, `openrouter-qwen-coder-free`).
    - `gemini-2.0-flash` (Google AI).
    - `groq-llama-3.3-70b` (GroqCloud).
    - `ollama-llama3` (`ollama/llama3.2` pointing to `os.environ/OLLAMA_API_BASE`).
    - Commercial options: `gpt-4o`, `gpt-4o-mini`, `claude-3-5-sonnet`.
    - `mock-model` with `mock_response` string for zero-key testing.
- In `docker-compose.yml`:
  - Dedicated `redis:7-alpine` container with healthcheck and persistent `redis-data` volume.
  - Wire `REDIS_HOST: redis`, `REDIS_PORT: "6379"`, and `REDIS_PASSWORD: ${REDIS_PASSWORD:-changeme_redis}` into `litellm`.
  - Pass all API keys through environment: `OPENROUTER_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `OLLAMA_API_BASE`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `MISTRAL_API_KEY`, `AWS_*`, `AZURE_*`.
  - Set `PROXY_BASE_URL: "${PROXY_BASE_URL:-${SERVER_PROTOCOL:-https}://${SERVER_HOST:-localhost}/litellm}"`.

### Step 8: Mezmo AURA Autonomous SRE Agent
- In `docker-compose.yml`:
  - Image: `mezmo/aura:latest`.
  - Command: `["./aura", "webserver", "--verbose"]`.
  - Environment:
    - `CONFIG_PATH: "/app/config/config.toml"`
    - `AURA_MODEL: "${AURA_MODEL:-aura-sre-model}"`
    - `AURA_LLM_BASE_URL: "http://litellm:4000/v1"`
    - `LITELLM_MASTER_KEY: "${LITELLM_MASTER_KEY}"`
    - `OTEL_EXPORTER_OTLP_ENDPOINT: "http://otel-collector:4317"`
- In `aura/config.toml`:
  - Wire LLM client:
    ```toml
    [llm]
    model = "{{ env.AURA_MODEL }}"
    base_url = "{{ env.AURA_LLM_BASE_URL }}"
    api_key = "{{ env.LITELLM_MASTER_KEY }}"
    ```
  - Wire all MCP servers via LiteLLM's authenticated MCP gateway:
    - `[mcp.servers.victoriametrics]`: url `http://litellm:4000/victoriametrics/mcp`, transport `http_streamable`, headers `{ Authorization = "Bearer {{ env.LITELLM_MASTER_KEY }}" }`.
    - `[mcp.servers.victorialogs]`: url `http://litellm:4000/victorialogs/mcp`, transport `http_streamable`, headers `{ Authorization = "Bearer {{ env.LITELLM_MASTER_KEY }}" }`.
    - `[mcp.servers.victoriatraces]`: url `http://litellm:4000/victoriatraces/mcp`, transport `http_streamable`, headers `{ Authorization = "Bearer {{ env.LITELLM_MASTER_KEY }}" }`.
    - `[mcp.servers.grafana]`: url `http://litellm:4000/grafana/mcp`, transport `http_streamable`, headers `{ Authorization = "Bearer {{ env.LITELLM_MASTER_KEY }}" }`.
    - `[mcp.servers.litellm-hub]`: url `http://litellm:4000/mcp`, transport `http_streamable`.
  - Configure Coordinator and 4 specialist workers (`incident-responder`, `metrics-analyst`, `log-analyst`, `trace-analyst`) with appropriate `mcp_filter` tags.

### Step 9: Hardened Nginx Configuration & Critical Bug Avoidance
Ensure `nginx/default.conf` avoids the common pitfalls:

1. **LiteLLM Next.js UI Infinite Reload Loop Prevention**:
   - LiteLLM's Next.js web application unauthenticated checks redirect to `/litellm/ui/login/?redirect_to=...`.
   - **Do NOT** put `location /litellm/ui/ { return 301 /ui/; }` (this causes an infinite loop between `/ui/` and `/litellm/ui/login/`).
   - Instead, map:
     ```nginx
     location = /litellm/ui {
         return 301 /litellm/ui/$is_args$args;
     }

     location /litellm/ui/ {
         proxy_pass http://litellm:4000/ui/;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
         proxy_cookie_path / /;
         proxy_redirect http://litellm:4000/ui/ /litellm/ui/;
     }

     # Redirect legacy root /ui to /litellm/ui/
     location = /ui {
         return 301 /litellm/ui/$is_args$args;
     }
     location /ui/ {
         rewrite ^/ui/(.*)$ /litellm/ui/$1 permanent;
     }
     ```
2. **Direct Authentication Endpoints**:
   - LiteLLM's UI posts to `/litellm/v2/login` or directly to `/v2/login` / `/login`.
   - Configure fallback routing:
     ```nginx
     location ~ ^/(v[1-3]/login|login|sso/) {
         proxy_pass http://litellm:4000;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
     }
     ```
3. **Favicon & Swagger OpenAPI Routes**:
   - Map `location = /favicon.ico { proxy_pass http://litellm:4000/ui/favicon.ico; }`.
   - Map Swagger UI assets: `/litellm/openapi.json`, `/litellm/oauth2-redirect.html`, `/litellm/swagger/`.
4. **Basic Auth for Victoria UIs & Mezmo AURA**:
   - Guard `/vmetrics/`, `/vlogs/`, `/vtraces/`, and `/aura/` with `auth_basic "Restricted Access"; auth_basic_user_file /etc/nginx/.htpasswd;`.
5. **Docker Mount Inode Pitfall**:
   - Note that updating `nginx/default.conf` on the host changes file inodes. Always run `docker compose restart nginx` whenever Nginx configs change.

### Step 10: Interactive Deployment Automation (`deploy.sh`)
Implement `deploy.sh` to execute the full setup:
1. Validate dependencies (`docker`, `docker compose`, `openssl`).
2. Generate secure random passwords (or prompt interactively if running in a TTY).
3. Create host storage directories (`/var/lib/vmetrics`, `/var/lib/vlogs`, `/var/lib/vtraces`).
4. Generate self-signed SSL certs (`cert.pem`, `key.pem`) and encrypted `.htpasswd`.
5. Start databases (`mysql`, `postgres`) and Victoria backends.
6. Start Grafana, run `scripts/setup-grafana-mcp.sh`, update `.env` with `GRAFANA_SERVICE_ACCOUNT_TOKEN`.
7. Start remaining containers: MCP servers, LiteLLM, AURA, and Nginx.
8. Output formatted summary of all access URLs and credentials.

### Step 11: Comprehensive Documentation & `.env.example`
- Provide a clean `.env.example` detailing all variables.
- Provide a comprehensive `README.md` containing:
  - Architecture diagram (Mermaid format).
  - Component table.
  - Dedicated **Configuration Reference (`.env.example`)** table.
  - Dedicated **Giving LiteLLM Access to Models** guide (Free cloud, Ollama, Commercial, Mock, CLI verification, and LiteLLM Web UI).
  - Grafana datasources and pre-installed dashboards table.
  - MCP integration details and AURA architecture.
  - End-to-end verification commands.

---

## 4. End-to-End Verification Checklist

Run these commands to confirm complete functionality:

```bash
source .env

# 1. Check all 18 containers are healthy
docker compose ps

# 2. Verify Nginx landing page
curl -k -s -o /dev/null -w "%{http_code}\n" https://localhost/

# 3. Check VictoriaMetrics, VictoriaLogs, VictoriaTraces Basic Auth
curl -k -s -u "${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}" "https://localhost/vmetrics/api/v1/label/__name__/values" | grep "node_"
curl -k -s -u "${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}" "https://localhost/vlogs/select/logsql/hits?query=*&step=1d"
curl -k -s -u "${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}" "https://localhost/vtraces/select/jaeger/api/services"

# 4. Check Grafana provisioned datasources & pre-installed dashboards
curl -k -s -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" "https://localhost/grafana/api/datasources" | jq -r '.[].name'
curl -k -s -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" "https://localhost/grafana/api/search" | jq -r '.[].title'

# 5. Check LiteLLM UI & Login Form
curl -k -I https://localhost/litellm/ui/
curl -k -I https://localhost/litellm/ui/login/

# 6. Check LiteLLM Model Registry
curl -k -s -H "Authorization: Bearer ${LITELLM_MASTER_KEY}" https://localhost/litellm/models | jq '.data[].id'

# 7. Test LiteLLM Chat Completion (mock-model)
curl -k -s -X POST https://localhost/litellm/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${LITELLM_MASTER_KEY}" \
  -d '{"model":"mock-model","messages":[{"role":"user","content":"Health check"}]}' | jq .

# 8. Check Mezmo AURA SRE Agent Health (Basic Auth)
curl -k -s -u "${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}" "https://localhost/aura/health" | jq .

# 9. Test Mezmo AURA Autonomous Investigation (Basic Auth)
curl -k -s -u "${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}" \
  -X POST https://localhost/aura/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Perform an observability health inspection."}]}' | jq .
```

---

## 5. Development & Git Workflow Instructions

Whenever you implement features or fixes:
1. Always create a feature branch (`git checkout -b <branch-name>`).
2. Commit with descriptive messages.
3. Push to remote and open a GitHub Pull Request (`gh pr create`).
4. Merge the Pull Request via GitHub CLI (`gh pr merge <id> --merge`).
5. Checkout `main`, pull origin, and delete the feature branch.
