#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${ENV_FILE:-/home/hermes/o11ystack/.env}"
if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    set -a
    source "$ENV_FILE"
    set +a
fi

GRAFANA_ADMIN_USER="${GRAFANA_ADMIN_USER:-admin}"
GRAFANA_ADMIN_PASSWORD="${GRAFANA_ADMIN_PASSWORD:-}"
HTTPS_PORT="${HTTPS_PORT:-443}"

if [ -z "$GRAFANA_ADMIN_PASSWORD" ]; then
    echo "[ERROR] GRAFANA_ADMIN_PASSWORD is not set!"
    exit 1
fi

echo "==> Detecting Grafana connectivity..."
MAX_RETRIES=30
RETRY_COUNT=0
API_BASE=""

# Function to run curl either directly or via docker network
execute_api() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"

    local cmd=(curl -s -k -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}")
    if [ "$method" = "POST" ]; then
        cmd+=(-X POST -H "Content-Type: application/json" -d "$data")
    elif [ "$method" = "PATCH" ]; then
        cmd+=(-X PATCH -H "Content-Type: application/json" -d "$data")
    fi

    "${cmd[@]}" "${API_BASE}${endpoint}"
}

# Find accessible endpoint
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Option A: via host Nginx SSL proxy
    if curl -s -k -f -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" "https://localhost:${HTTPS_PORT}/grafana/api/health" >/dev/null 2>&1; then
        API_BASE="https://localhost:${HTTPS_PORT}/grafana"
        echo "==> Grafana is reachable via Nginx at ${API_BASE}!"
        break
    fi

    # Option B: via direct host port 3000 (if mapped)
    if curl -s -f -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" "http://localhost:3000/grafana/api/health" >/dev/null 2>&1; then
        API_BASE="http://localhost:3000/grafana"
        echo "==> Grafana is reachable locally at ${API_BASE}!"
        break
    fi

    # Option C: via Docker internal network
    if docker run --rm --network o11ystack_o11y-net curlimages/curl:latest -s -f -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" "http://grafana:3000/grafana/api/health" >/dev/null 2>&1; then
        API_BASE="docker_net"
        echo "==> Grafana is reachable inside Docker network!"
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "    Waiting for Grafana to be healthy... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
done

if [ -z "$API_BASE" ]; then
    echo "[ERROR] Timed out waiting for Grafana to become available."
    exit 1
fi

echo "==> Checking if Service Account 'mcp-grafana' exists..."
if [ "$API_BASE" = "docker_net" ]; then
    SA_SEARCH=$(docker run --rm --network o11ystack_o11y-net curlimages/curl:latest -s \
        -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" \
        "http://grafana:3000/grafana/api/serviceaccounts/search?query=mcp-grafana" || echo '{"serviceAccounts":[]}')
else
    SA_SEARCH=$(execute_api "GET" "/api/serviceaccounts/search?query=mcp-grafana")
fi

SA_ID=$(python3 -c "
import sys, json
try:
    data = json.loads('''$SA_SEARCH''')
    sas = data.get('serviceAccounts', [])
    match = [s['id'] for s in sas if s.get('name') == 'mcp-grafana']
    if match:
        print(match[0])
except Exception:
    pass
" 2>/dev/null || true)

if [ -z "$SA_ID" ]; then
    echo "==> Creating Service Account 'mcp-grafana' with role Admin (all permissions)..."
    if [ "$API_BASE" = "docker_net" ]; then
        CREATE_RESP=$(docker run --rm --network o11ystack_o11y-net curlimages/curl:latest -s -X POST \
            -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" \
            -H "Content-Type: application/json" \
            -d '{"name":"mcp-grafana","role":"Admin"}' \
            "http://grafana:3000/grafana/api/serviceaccounts")
    else
        CREATE_RESP=$(execute_api "POST" "/api/serviceaccounts" '{"name":"mcp-grafana","role":"Admin"}')
    fi
    SA_ID=$(python3 -c "import sys, json; print(json.loads('''$CREATE_RESP''').get('id', ''))" 2>/dev/null || true)
    echo "    Created Service Account ID: $SA_ID"
else
    echo "    Service Account 'mcp-grafana' already exists with ID: $SA_ID"
    # Ensure Admin role
    if [ "$API_BASE" = "docker_net" ]; then
        docker run --rm --network o11ystack_o11y-net curlimages/curl:latest -s -X PATCH \
            -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" \
            -H "Content-Type: application/json" \
            -d '{"role":"Admin"}' \
            "http://grafana:3000/grafana/api/serviceaccounts/${SA_ID}" >/dev/null 2>&1 || true
    else
        execute_api "PATCH" "/api/serviceaccounts/${SA_ID}" '{"role":"Admin"}' >/dev/null 2>&1 || true
    fi
fi

if [ -z "$SA_ID" ]; then
    echo "[ERROR] Failed to determine Service Account ID for 'mcp-grafana'!"
    exit 1
fi

echo "==> Generating Service Account Token with full Admin permissions for Grafana MCP Server..."
TOKEN_NAME="mcp-token-$(date +%s)"
if [ "$API_BASE" = "docker_net" ]; then
    TOKEN_RESP=$(docker run --rm --network o11ystack_o11y-net curlimages/curl:latest -s -X POST \
        -u "${GRAFANA_ADMIN_USER}:${GRAFANA_ADMIN_PASSWORD}" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"${TOKEN_NAME}\"}" \
        "http://grafana:3000/grafana/api/serviceaccounts/${SA_ID}/tokens")
else
    TOKEN_RESP=$(execute_api "POST" "/api/serviceaccounts/${SA_ID}/tokens" "{\"name\":\"${TOKEN_NAME}\"}")
fi

SA_TOKEN=$(python3 -c "import sys, json; print(json.loads('''$TOKEN_RESP''').get('key', ''))" 2>/dev/null || true)

if [ -n "$SA_TOKEN" ]; then
    echo "==> Successfully obtained Grafana Admin Service Account Token!"
    if grep -q "^GRAFANA_SERVICE_ACCOUNT_TOKEN=" "$ENV_FILE"; then
        sed -i "s|^GRAFANA_SERVICE_ACCOUNT_TOKEN=.*|GRAFANA_SERVICE_ACCOUNT_TOKEN=${SA_TOKEN}|" "$ENV_FILE"
    else
        echo "GRAFANA_SERVICE_ACCOUNT_TOKEN=${SA_TOKEN}" >> "$ENV_FILE"
    fi
    echo "    Updated GRAFANA_SERVICE_ACCOUNT_TOKEN in $ENV_FILE"
else
    echo "[ERROR] Could not extract token from response: $TOKEN_RESP"
    exit 1
fi
