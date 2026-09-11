#!/usr/bin/env bash
# ==============================================================================
# Observability & AI Stack Deployment Script
# VictoriaMetrics, VictoriaLogs, VictoriaTraces, Grafana, LiteLLM, MCP & Nginx
# ==============================================================================
set -euo pipefail

STACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${STACK_DIR}/.env"

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_banner() {
    echo -e "${CYAN}${BOLD}"
    cat << "EOF"
  ___  _ _       ____  _             _    
 / _ \/ / |_   _/ ___|| |_ __ _  ___| | __
| | | | | | | | \___ \| __/ _` |/ __| |/ /
| |_| | | | |_| |___) | || (_| | (__|   < 
 \___/|_|_|\__, |____/ \__\__,_|\___|_|\_\
           |___/                          
 VictoriaLogs | VictoriaMetrics | VictoriaTraces
 Grafana | LiteLLM | Mezmo AURA | Nginx Proxy
EOF
    echo -e "${NC}"
}

# Generate random secure string
gen_secret() {
    local length="${1:-32}"
    if command -v openssl >/dev/null 2>&1; then
        openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c "$length"
    else
        tr -dc 'a-zA-Z0-9' < /dev/urandom | head -c "$length"
    fi
}

prompt_secret() {
    local prompt_text="$1"
    local default_val="$2"
    local var_result=""

    if [ -t 0 ]; then
        if [ -n "$default_val" ]; then
            echo -ne "${BOLD}${prompt_text}${NC} [Press Enter to auto-generate]: "
            read -r -s input_val
            echo
            if [ -z "$input_val" ]; then
                var_result="$default_val"
            else
                var_result="$input_val"
            fi
        else
            while [ -z "$var_result" ]; do
                echo -ne "${BOLD}${prompt_text}${NC}: "
                read -r -s var_result
                echo
                if [ -z "$var_result" ]; then
                    log_warn "Password cannot be empty. Please enter a value."
                fi
            done
        fi
    else
        # Non-interactive mode fallback
        var_result="${default_val:-$(gen_secret 24)}"
    fi
    echo "$var_result"
}

prompt_text() {
    local prompt_text="$1"
    local default_val="$2"
    local var_result=""

    if [ -t 0 ]; then
        echo -ne "${BOLD}${prompt_text}${NC} [Default: ${default_val}]: "
        read -r input_val
        if [ -z "$input_val" ]; then
            var_result="$default_val"
        else
            var_result="$input_val"
        fi
    else
        var_result="$default_val"
    fi
    echo "$var_result"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    if ! command -v docker >/dev/null 2>&1; then
        log_error "Docker is not installed! Please install Docker before running this script."
        exit 1
    fi

    if ! docker compose version >/dev/null 2>&1; then
        log_error "Docker Compose v2 is not installed! Please install Docker Compose."
        exit 1
    fi

    if ! command -v openssl >/dev/null 2>&1; then
        log_warn "OpenSSL command not found. Some certificate/password utilities may fallback."
    fi

    log_success "Prerequisites check passed."
}

configure_environment() {
    if [ -f "$ENV_FILE" ] && [ "${1:-}" != "--force" ] && [ "${1:-}" != "--reconfigure" ]; then
        log_info "Existing configuration found at ${ENV_FILE}."
        log_info "To reconfigure passwords, run: ./deploy.sh --reconfigure"
        # shellcheck disable=SC1090
        source "$ENV_FILE"
        return
    fi

    echo -e "\n${BOLD}${CYAN}=== Initial Configuration Setup ===${NC}"
    echo -e "Please configure the initial passwords and parameters for the stack.\n"

    local s_host
    s_host=$(prompt_text "Enter domain or IP for the server" "localhost")

    echo -e "\n${YELLOW}--- Basic Authentication (VictoriaLogs, VictoriaMetrics, VictoriaTraces) ---${NC}"
    local b_user
    b_user=$(prompt_text "Enter Basic Auth Username" "admin")
    local b_pass
    b_pass=$(prompt_secret "Enter Basic Auth Password" "$(gen_secret 20)")

    echo -e "\n${YELLOW}--- Grafana Administration ---${NC}"
    local g_user
    g_user=$(prompt_text "Enter Grafana Admin Username" "admin")
    local g_pass
    g_pass=$(prompt_secret "Enter Grafana Admin Password" "$(gen_secret 20)")

    echo -e "\n${YELLOW}--- MySQL Backend (for Grafana) ---${NC}"
    local m_root_pass
    m_root_pass=$(prompt_secret "Enter MySQL Root Password" "$(gen_secret 24)")
    local g_db_pass
    g_db_pass=$(prompt_secret "Enter Grafana Database User Password" "$(gen_secret 24)")

    echo -e "\n${YELLOW}--- PostgreSQL Backend (for LiteLLM) ---${NC}"
    local p_user
    p_user=$(prompt_text "Enter PostgreSQL LiteLLM Username" "litellm")
    local p_pass
    p_pass=$(prompt_secret "Enter PostgreSQL LiteLLM Password" "$(gen_secret 24)")

    echo -e "\n${YELLOW}--- LiteLLM Proxy ---${NC}"
    local l_key
    l_key=$(prompt_secret "Enter LiteLLM Master Key" "sk-$(gen_secret 32)")

    echo -e "\n${YELLOW}--- Storage Paths (Retention 1 Year) ---${NC}"
    local vlogs_path
    vlogs_path=$(prompt_text "Enter host storage directory for VictoriaLogs" "/var/lib/vlogs")
    local vmetrics_path
    vmetrics_path=$(prompt_text "Enter host storage directory for VictoriaMetrics" "/var/lib/vmetrics")
    local vtraces_path
    vtraces_path=$(prompt_text "Enter host storage directory for VictoriaTraces" "/var/lib/vtraces")

    log_info "Writing configuration to ${ENV_FILE}..."

    cat > "$ENV_FILE" << EOF
# ==========================================
# Observability & AI Stack Configuration
# Generated on: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# ==========================================

SERVER_HOST=${s_host}
SERVER_PROTOCOL=https
HTTP_PORT=80
HTTPS_PORT=443

# Storage Paths for Victoria Services (Retention: 1y)
VLOGS_DATA_PATH=${vlogs_path}
VMETRICS_DATA_PATH=${vmetrics_path}
VTRACES_DATA_PATH=${vtraces_path}

# Basic Auth for /vlogs, /vmetrics, /vtraces
BASIC_AUTH_USER=${b_user}
BASIC_AUTH_PASSWORD=${b_pass}

# Grafana Administration
GRAFANA_ADMIN_USER=${g_user}
GRAFANA_ADMIN_PASSWORD=${g_pass}

# MySQL Database for Grafana
MYSQL_ROOT_PASSWORD=${m_root_pass}
GRAFANA_DB_PASSWORD=${g_db_pass}

# PostgreSQL Database for LiteLLM
POSTGRES_USER=${p_user}
POSTGRES_PASSWORD=${p_pass}

# LiteLLM Configuration
LITELLM_MASTER_KEY=${l_key}

# Mezmo AURA SRE AI Agent
AURA_MODEL=aura-sre-model

# LLM Providers (Optional - supply one or more for live LLM reasoning)
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
GEMINI_API_KEY=${GEMINI_API_KEY:-}
GROQ_API_KEY=${GROQ_API_KEY:-}
OLLAMA_API_BASE=${OLLAMA_API_BASE:-http://host.docker.internal:11434}

# Grafana Service Account Token (Generated automatically by deploy.sh)
GRAFANA_SERVICE_ACCOUNT_TOKEN=
EOF

    chmod 600 "$ENV_FILE"
    log_success "Environment saved securely to ${ENV_FILE}"

    # shellcheck disable=SC1090
    source "$ENV_FILE"
}

setup_storage_directories() {
    log_info "Ensuring host storage directories exist..."
    local paths=("${VLOGS_DATA_PATH:-/var/lib/vlogs}" "${VMETRICS_DATA_PATH:-/var/lib/vmetrics}" "${VTRACES_DATA_PATH:-/var/lib/vtraces}")

    for p in "${paths[@]}"; do
        if [ ! -d "$p" ]; then
            if mkdir -p "$p" 2>/dev/null; then
                log_success "Created storage directory: $p"
            else
                log_info "Creating $p via Docker..."
                local parent_dir
                parent_dir=$(dirname "$p")
                local base_name
                base_name=$(basename "$p")
                docker run --rm -v "${parent_dir}:/host_parent" alpine sh -c "mkdir -p /host_parent/${base_name} && chmod 777 /host_parent/${base_name}"
                log_success "Created storage directory: $p"
            fi
        else
            log_info "Storage directory already exists: $p"
        fi
    done
}

setup_credentials_and_certs() {
    log_info "Configuring Nginx Basic Authentication (.htpasswd)..."
    mkdir -p "${STACK_DIR}/nginx/certs"

    # Generate .htpasswd with openssl apr1 (MD5) or htpasswd
    local htpasswd_file="${STACK_DIR}/nginx/.htpasswd"
    local encrypted_pass
    if command -v openssl >/dev/null 2>&1; then
        encrypted_pass=$(openssl passwd -apr1 "${BASIC_AUTH_PASSWORD}")
    elif command -v htpasswd >/dev/null 2>&1; then
        encrypted_pass=$(htpasswd -nb "${BASIC_AUTH_USER}" "${BASIC_AUTH_PASSWORD}" | cut -d: -f2)
    else
        # Fallback to docker container
        encrypted_pass=$(docker run --rm httpd:alpine htpasswd -nb "${BASIC_AUTH_USER}" "${BASIC_AUTH_PASSWORD}" | cut -d: -f2)
    fi

    echo "${BASIC_AUTH_USER}:${encrypted_pass}" > "$htpasswd_file"
    chmod 644 "$htpasswd_file"
    log_success "Generated ${htpasswd_file}"

    # Generate Self-signed SSL certificate if missing
    local cert_file="${STACK_DIR}/nginx/certs/cert.pem"
    local key_file="${STACK_DIR}/nginx/certs/key.pem"

    if [ ! -f "$cert_file" ] || [ ! -f "$key_file" ]; then
        log_info "Generating self-signed SSL certificate for ${SERVER_HOST:-localhost}..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$key_file" \
            -out "$cert_file" \
            -subj "/CN=${SERVER_HOST:-localhost}/O=Observability Stack/OU=O11y" \
            >/dev/null 2>&1
        chmod 644 "$key_file" "$cert_file"
        log_success "Generated SSL certificates at nginx/certs/"
    else
        log_info "Existing SSL certificates found in nginx/certs/."
    fi
}

deploy_stack() {
    log_info "Starting Docker Compose services..."
    cd "${STACK_DIR}"

    # Start core databases and Victorias first
    docker compose up -d mysql postgres victoriametrics victorialogs victoriatraces node-exporter process-exporter otel-collector beyla

    log_info "Starting Grafana and waiting for database migrations..."
    docker compose up -d grafana

    # Run Grafana MCP server bootstrap script
    log_info "Bootstrapping Grafana Service Account and Token for MCP Server..."
    chmod +x "${STACK_DIR}/scripts/setup-grafana-mcp.sh"

    # Execute setup script using Docker network or localhost
    ENV_FILE="${ENV_FILE}" GRAFANA_INTERNAL_URL="http://localhost:3000" "${STACK_DIR}/scripts/setup-grafana-mcp.sh" || {
        log_warn "Initial attempt to reach Grafana via localhost failed, testing container network..."
        docker compose run --rm --entrypoint /bin/sh mcp-grafana -c \
            "apk add --no-cache curl >/dev/null 2>&1 || true" >/dev/null 2>&1 || true
    }

    # Re-source updated .env to get GRAFANA_SERVICE_ACCOUNT_TOKEN
    # shellcheck disable=SC1090
    source "$ENV_FILE"

    # Start remaining services: MCP servers, LiteLLM, Mezmo AURA, and Nginx
    log_info "Starting MCP servers, LiteLLM proxy, Mezmo AURA agent, and Nginx reverse proxy..."
    docker compose up -d mcp-victoriametrics mcp-victorialogs mcp-victoriatraces mcp-grafana litellm aura nginx

    log_success "All stack containers are up!"
}

show_summary() {
    local host="${SERVER_HOST:-localhost}"
    local proto="${SERVER_PROTOCOL:-https}"
    local port_str=""
    if [ "${HTTPS_PORT:-443}" != "443" ]; then
        port_str=":${HTTPS_PORT}"
    fi

    local base_url="${proto}://${host}${port_str}"

    echo -e "\n${GREEN}${BOLD}================================================================${NC}"
    echo -e "${GREEN}${BOLD}       OBSERVABILITY & AI STACK DEPLOYED SUCCESSFULLY!          ${NC}"
    echo -e "${GREEN}${BOLD}================================================================${NC}\n"

    echo -e "${BOLD}Access Endpoints via Nginx Reverse Proxy (SSL Enabled):${NC}"
    echo -e "  * Landing Portal:          ${CYAN}${base_url}/${NC}"
    echo -e "  * Grafana:                 ${CYAN}${base_url}/grafana/${NC}"
    echo -e "  * VictoriaMetrics UI:      ${CYAN}${base_url}/vmetrics/vmui/${NC}  ${YELLOW}(Basic Auth)${NC}"
    echo -e "  * VictoriaLogs UI:         ${CYAN}${base_url}/vlogs/select/vmui/${NC}   ${YELLOW}(Basic Auth)${NC}"
    echo -e "  * VictoriaTraces UI:       ${CYAN}${base_url}/vtraces/select/vmui/${NC} ${YELLOW}(Basic Auth)${NC}"
    echo -e "  * LiteLLM Proxy API / UI:  ${CYAN}${base_url}/litellm/${NC}"
    echo -e "  * Mezmo AURA SRE Agent:    ${CYAN}${base_url}/aura/${NC}   ${YELLOW}(Basic Auth)${NC}"

    echo -e "\n${BOLD}Model Context Protocol (MCP) Endpoints (configured in LiteLLM):${NC}"
    echo -e "  * VictoriaMetrics MCP:     ${CYAN}http://mcp-victoriametrics:8080/sse${NC}"
    echo -e "  * VictoriaLogs MCP:        ${CYAN}http://mcp-victorialogs:8081/sse${NC}"
    echo -e "  * VictoriaTraces MCP:      ${CYAN}http://mcp-victoriatraces:8082/sse${NC}"
    echo -e "  * Grafana MCP (Admin):     ${CYAN}http://mcp-grafana:8000/sse${NC}"

    echo -e "\n${BOLD}Credentials Summary:${NC}"
    echo -e "  * Basic Auth (V-Suite & AURA): User: ${GREEN}${BASIC_AUTH_USER}${NC} | Pass: ${GREEN}${BASIC_AUTH_PASSWORD}${NC}"
    echo -e "  * Grafana Admin:           User: ${GREEN}${GRAFANA_ADMIN_USER}${NC} | Pass: ${GREEN}${GRAFANA_ADMIN_PASSWORD}${NC}"
    echo -e "  * LiteLLM Master Key:      ${GREEN}${LITELLM_MASTER_KEY}${NC}"
    echo -e "  * Configuration File:      ${CYAN}${ENV_FILE}${NC}"

    echo -e "\n${BOLD}Data Storage Paths (1 Year Retention):${NC}"
    echo -e "  * VictoriaLogs:            ${VLOGS_DATA_PATH:-/var/lib/vlogs}"
    echo -e "  * VictoriaMetrics:         ${VMETRICS_DATA_PATH:-/var/lib/vmetrics}"
    echo -e "  * VictoriaTraces:          ${VTRACES_DATA_PATH:-/var/lib/vtraces}"

    echo -e "\n${YELLOW}Helpful Commands:${NC}"
    echo -e "  * Check service status:    ${BOLD}docker compose ps${NC}"
    echo -e "  * View service logs:       ${BOLD}docker compose logs -f [service]${NC}"
    echo -e "  * Stop stack:              ${BOLD}docker compose down${NC}"
    echo -e "  * Reconfigure passwords:   ${BOLD}./deploy.sh --reconfigure${NC}"
    echo -e "\n${GREEN}================================================================${NC}\n"
}

main() {
    print_banner
    check_prerequisites
    configure_environment "${1:-}"
    setup_storage_directories
    setup_credentials_and_certs
    deploy_stack
    show_summary
}

main "$@"
