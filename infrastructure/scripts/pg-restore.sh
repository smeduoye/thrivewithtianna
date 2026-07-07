#!/usr/bin/env bash
# Restore a pg_dump backup into the running Postgres container.
# Usage: pg-restore.sh /path/to/thrive-YYYY-MM-DD.sql.gz
#
# WARNING: This replaces all data in the target database. Stop the API first
# if you need a clean restore: docker compose -f docker-compose.prod.yml stop api

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /path/to/thrive-YYYY-MM-DD.sql.gz" >&2
  exit 1
fi

BACKUP_FILE="$1"
if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${DEPLOY_DIR}/.env"
CONTAINER="${POSTGRES_CONTAINER:-thrivewithtianna-postgres}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

POSTGRES_DB="${POSTGRES_DB:-thrive}"
POSTGRES_USER="${POSTGRES_USER:-thrive}"

docker_cmd() {
  if docker info >/dev/null 2>&1; then
    docker "$@"
  else
    sudo docker "$@"
  fi
}

if ! docker_cmd ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "Container ${CONTAINER} is not running." >&2
  exit 1
fi

echo "Restoring ${BACKUP_FILE} into ${POSTGRES_DB} on ${CONTAINER}..."
gunzip -c "$BACKUP_FILE" | docker_cmd exec -i "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1
echo "Restore complete."
