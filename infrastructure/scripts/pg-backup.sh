#!/usr/bin/env bash
# Daily logical backup of the Thrive Postgres database (Docker).
# Installed via deploy workflow; see infrastructure/aws-ec2-runbook.md.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${DEPLOY_DIR}/.env"
BACKUP_DIR="${BACKUP_DIR:-${DEPLOY_DIR}/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
CONTAINER="${POSTGRES_CONTAINER:-thrivewithtianna-postgres}"
LOG="${BACKUP_DIR}/backup.log"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

POSTGRES_DB="${POSTGRES_DB:-thrive}"
POSTGRES_USER="${POSTGRES_USER:-thrive}"

mkdir -p "$BACKUP_DIR"

docker_cmd() {
  if docker info >/dev/null 2>&1; then
    docker "$@"
  else
    sudo docker "$@"
  fi
}

log() {
  echo "$(date -u +%FT%TZ) $*" >> "$LOG"
}

if ! docker_cmd ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  log "ERROR: container ${CONTAINER} is not running"
  exit 1
fi

STAMP="$(date -u +%F)"
OUT="${BACKUP_DIR}/thrive-${STAMP}.sql.gz"

docker_cmd exec "$CONTAINER" pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$OUT"
chmod 600 "$OUT"

find "$BACKUP_DIR" -name 'thrive-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete

SIZE="$(du -h "$OUT" | cut -f1)"
log "OK: ${OUT} (${SIZE})"
