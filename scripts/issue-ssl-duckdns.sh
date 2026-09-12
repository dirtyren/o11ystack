#!/usr/bin/env bash
# ==============================================================================
# DuckDNS Let's Encrypt SSL Certificate Issuance & Renewal Script
# Uses Certbot with DNS-01 challenge via DuckDNS API
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${ROOT_DIR}/.env"

if [ -f "$ENV_FILE" ]; then
    # shellcheck disable=SC1090
    source "$ENV_FILE"
fi

TOKEN="${DUCKDNS_TOKEN:-ff696fef-2c56-4864-94b0-e94edbc5b2e8}"
SUBDOMAIN="${DUCKDNS_SUBDOMAINS:-neoson-o11y}"
DOMAIN="${SUBDOMAIN}.duckdns.org"

echo "===> Requesting / Renewing Let's Encrypt SSL certificate for ${DOMAIN}..."

# Directory to hold Let's Encrypt state
mkdir -p "${ROOT_DIR}/letsencrypt"
mkdir -p "${ROOT_DIR}/nginx/certs"

docker run --rm \
  -e DUCKDNS_TOKEN="${TOKEN}" \
  -v "${ROOT_DIR}/scripts:/scripts:ro" \
  -v "${ROOT_DIR}/letsencrypt:/etc/letsencrypt" \
  certbot/certbot certonly \
  --manual \
  --manual-auth-hook /scripts/duckdns-auth.sh \
  --manual-cleanup-hook /scripts/duckdns-cleanup.sh \
  --preferred-challenges dns \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  --keep-until-expiring \
  -d "${DOMAIN}"

echo "===> Copying Let's Encrypt certificates to nginx/certs/..."
docker run --rm \
  -v "${ROOT_DIR}/letsencrypt:/etc/letsencrypt" \
  -v "${ROOT_DIR}/nginx/certs:/certs" \
  alpine sh -c "cp -L /etc/letsencrypt/live/${DOMAIN}/fullchain.pem /certs/cert.pem && cp -L /etc/letsencrypt/live/${DOMAIN}/privkey.pem /certs/key.pem && chmod 644 /certs/cert.pem /certs/key.pem"

echo "===> Reloading Nginx..."
docker compose -f "${ROOT_DIR}/docker-compose.yml" exec -T nginx nginx -s reload || true

echo "===> SSL certificate successfully installed and active for https://${DOMAIN}/ !"
