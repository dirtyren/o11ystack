#!/bin/sh
# ClickHouse first-boot init (runs only when the data volume is empty):
# create the read-only user Grafana uses to query Langfuse data.
set -eu

CH_USER="${CLICKHOUSE_USER:-clickhouse}"
CH_PASS="${CLICKHOUSE_PASSWORD:?CLICKHOUSE_PASSWORD must be set}"
GF_USER="${GRAFANA_LANGFUSE_DB_USER:-grafana_langfuse}"
GF_PASS="${GRAFANA_LANGFUSE_DB_PASSWORD:?GRAFANA_LANGFUSE_DB_PASSWORD must be set}"

clickhouse-client --user "$CH_USER" --password "$CH_PASS" --multiquery --query "
CREATE USER IF NOT EXISTS ${GF_USER} IDENTIFIED WITH sha256_password BY '${GF_PASS}';
GRANT SELECT ON default.* TO ${GF_USER};
"
echo "langfuse-clickhouse init: ${GF_USER} ready (read-only on default.*)"
