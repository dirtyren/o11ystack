#!/usr/bin/env sh
set -e
DOMAIN=$(echo "$CERTBOT_DOMAIN" | sed 's/\.duckdns\.org$//')
TOKEN="${DUCKDNS_TOKEN}"
if [ -z "$TOKEN" ]; then
    exit 0
fi
echo "[certbot-hook] Clearing DuckDNS TXT record for ${DOMAIN}..."
wget -qO- "https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&txt=true&clear=true" >/dev/null 2>&1 || true
