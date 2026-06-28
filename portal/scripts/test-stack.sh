#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
"$ROOT/scripts/build.sh" "$@"
docker compose up -d
for i in $(seq 1 60); do
  if curl -sf http://localhost:8080/api/health | grep -q '"UP"'; then
    echo "API is up"
    echo "Portal UI: http://localhost:8081"
    exit 0
  fi
  sleep 2
done
docker compose logs api
exit 1
