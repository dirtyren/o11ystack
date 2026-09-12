#!/usr/bin/env sh
set -e
DOMAIN=$(echo "$CERTBOT_DOMAIN" | sed 's/\.duckdns\.org$//')
TOKEN="${DUCKDNS_TOKEN}"
if [ -z "$TOKEN" ]; then
    echo "DUCKDNS_TOKEN is required" >&2
    exit 1
fi
echo "[certbot-hook] Setting DuckDNS TXT record for ${DOMAIN}..."
wget -qO- "https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&txt=${CERTBOT_VALIDATION}"
echo
echo "[certbot-hook] Waiting 30s for DNS propagation..."
sleep 30
