#!/usr/bin/env bash
# ==============================================================================
# Observability & AI Stack Migration & Upgrade Script
# Performs safety pre-checks, database backups, rolling image pulls, and service restarts.
# ==============================================================================
set -euo pipefail

STACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$STACK_DIR"

ENV_FILE="${STACK_DIR}/.env"
BACKUP_DIR="${STACK_DIR}/backups/$(date +%Y%m%d_%H%M%S)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ ! -f "$ENV_FILE" ]; then
    log_error "Missing .env file in $STACK_DIR! Exiting."
    exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

mkdir -p "$BACKUP_DIR"
log_info "Starting o11ystack Migration & Upgrade Procedure"
log_info "Safety backups will be stored in: $BACKUP_DIR"

# ------------------------------------------------------------------------------
# 1. Pre-Upgrade Database Backups
# ------------------------------------------------------------------------------
log_info "Step 1: Running pre-upgrade database backups..."

# MySQL Backup (Grafana)
if docker ps --format '{{.Names}}' | grep -q "^mysql$"; then
    log_info "Backing up Grafana MySQL database..."
    docker exec mysql mysqldump -u grafana -p"${GRAFANA_DB_PASSWORD}" grafana > "${BACKUP_DIR}/grafana_mysql.sql" 2>/dev/null || {
        log_warn "MySQL backup via grafana user failed, attempting root user..."
        docker exec mysql mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" grafana > "${BACKUP_DIR}/grafana_mysql.sql"
    }
    log_success "MySQL backup saved to ${BACKUP_DIR}/grafana_mysql.sql"
fi

# PostgreSQL Backup (LiteLLM & Langfuse)
if docker ps --format '{{.Names}}' | grep -q "^postgres$"; then
    log_info "Backing up LiteLLM PostgreSQL database..."
    docker exec postgres pg_dump -U litellm litellm > "${BACKUP_DIR}/litellm_postgres.sql"
    log_success "PostgreSQL (litellm) backup saved to ${BACKUP_DIR}/litellm_postgres.sql"

    # Backup Langfuse DB if present
    if docker exec postgres psql -U litellm -lqt | cut -d \| -f 1 | grep -qw "langfuse"; then
        log_info "Backing up Langfuse PostgreSQL database..."
        docker exec postgres pg_dump -U litellm langfuse > "${BACKUP_DIR}/langfuse_postgres.sql"
        log_success "PostgreSQL (langfuse) backup saved to ${BACKUP_DIR}/langfuse_postgres.sql"
    fi
fi

# Redis Dump trigger
if docker ps --format '{{.Names}}' | grep -q "^redis$"; then
    log_info "Triggering Redis BGSAVE..."
    docker exec redis redis-cli -a "${REDIS_PASSWORD:-changeme_redis}" bgsave >/dev/null 2>&1 || true
fi

# ------------------------------------------------------------------------------
# 2. Pull All Updated Images
# ------------------------------------------------------------------------------
log_info "Step 2: Pulling updated container images..."
docker compose pull

# ------------------------------------------------------------------------------
# 3. Rolling Restart of Services in Dependency Order
# ------------------------------------------------------------------------------
log_info "Step 3: Performing ordered rolling restart..."

# Database Layer
log_info "Updating storage and database services..."
docker compose up -d --no-deps mysql postgres redis victoriametrics victorialogs victoriatraces langfuse-clickhouse langfuse-minio

# Wait for databases to report healthy
log_info "Waiting for database healthchecks..."
for db in mysql postgres redis; do
    if docker ps --format '{{.Names}}' | grep -q "^${db}$"; then
        until [ "$(docker inspect -f '{{.State.Health.Status}}' "$db" 2>/dev/null)" = "healthy" ]; do
            log_info "Waiting for $db to become healthy..."
            sleep 3
        done
        log_success "$db is healthy."
    fi
done

# Ingestion & Gateways
log_info "Updating telemetry collectors and gateways..."
docker compose up -d --no-deps otel-collector vector node-exporter process-exporter cadvisor beyla litellm headroom headroom-mcp headroom-exporter

# Wait for LiteLLM to be healthy
if docker ps --format '{{.Names}}' | grep -q "^litellm$"; then
    until [ "$(docker inspect -f '{{.State.Health.Status}}' "litellm" 2>/dev/null)" = "healthy" ]; do
        log_info "Waiting for LiteLLM (Prisma migrations) to complete..."
        sleep 5
    done
    log_success "LiteLLM is healthy."
fi

# Application & Agent Layer
log_info "Updating Grafana, MCP servers, Langfuse, and AI Agents..."
docker compose up -d --no-deps mcp-victoriametrics mcp-victorialogs mcp-victoriatraces mcp-grafana grafana aura opensre langfuse-web langfuse-worker

# Wait for Grafana healthcheck
if docker ps --format '{{.Names}}' | grep -q "^grafana$"; then
    until [ "$(docker inspect -f '{{.State.Health.Status}}' "grafana" 2>/dev/null)" = "healthy" ]; do
        log_info "Waiting for Grafana (schema migrations) to complete..."
        sleep 5
    done
    log_success "Grafana is healthy."
fi

# Refresh Grafana MCP Service Account token if needed
if [ -f "${STACK_DIR}/scripts/setup-grafana-mcp.sh" ]; then
    log_info "Refreshing Grafana MCP token configuration..."
    "${STACK_DIR}/scripts/setup-grafana-mcp.sh" || log_warn "Grafana MCP setup reported a non-fatal warning."
fi

# Proxy & DNS
log_info "Updating Nginx reverse proxy and DuckDNS..."
docker compose up -d --no-deps nginx duckdns

# ------------------------------------------------------------------------------
# 4. Final Verification
# ------------------------------------------------------------------------------
log_info "Step 4: Verifying final stack health status..."
docker compose ps

log_success "====================================================================="
log_success "o11ystack upgrade and migration completed successfully!"
log_success "Backups are safely stored in: $BACKUP_DIR"
log_success "====================================================================="
