#!/usr/bin/env bash
# Create the `langfuse` database in the shared Postgres instance and the
# read-only ClickHouse user Grafana uses. Idempotent; safe to re-run.
#
# Normally both happen automatically on first boot (ClickHouse runs
# langfuse/clickhouse-init/*.sh, Postgres DB is created here once).
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== [1/2] Postgres: create database 'langfuse' (if missing) =="
# 'already exists' (42710) means a previous run created it - safe to ignore.
docker compose exec -T postgres psql -U litellm -d postgres -c "CREATE DATABASE langfuse" \
  || echo "database 'langfuse' already exists"

echo "== [2/2] ClickHouse: create read-only Grafana user (if missing) =="
docker compose exec -T langfuse-clickhouse /docker-entrypoint-initdb.d/01-grafana-user.sh

echo "OK"
