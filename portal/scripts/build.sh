#!/usr/bin/env bash
# Build host artifacts and package runtime container images.
# Skips unchanged steps; runs backend and frontend in parallel when both need work.
# Usage:
#   ./scripts/build.sh              # artifacts + docker compose build
#   ./scripts/build.sh --artifacts-only
#   ./scripts/build.sh --force
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACTS_ONLY=false
FORCE=false
BACKEND_REBUILT=false
FRONTEND_REBUILT=false

for arg in "$@"; do
  case "$arg" in
    --artifacts-only) ARTIFACTS_ONLY=true ;;
    --force) FORCE=true ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

newest_input() {
  local newest=""
  local path file
  for path in "$@"; do
    if [[ -d "$path" ]]; then
      while IFS= read -r file; do
        if [[ -z "$newest" || "$file" -nt "$newest" ]]; then
          newest="$file"
        fi
      done < <(find "$path" -type f 2>/dev/null || true)
    elif [[ -f "$path" ]]; then
      if [[ -z "$newest" || "$path" -nt "$newest" ]]; then
        newest="$path"
      fi
    fi
  done
  if [[ -n "$newest" ]]; then
    printf '%s\n' "$newest"
  fi
}

backend_stale() {
  local jar=( "$ROOT"/backend/target/backend-*.jar )
  if [[ ! -f ${jar[0]} ]]; then
    return 0
  fi
  local newest
  newest="$(newest_input \
    "$ROOT/backend/src" \
    "$ROOT/backend/pom.xml" \
    "$ROOT/backend/.mvn/maven.config")"
  if [[ -z "$newest" ]]; then
    return 1
  fi
  [[ "$newest" -nt ${jar[0]} ]]
}

frontend_deps_stale() {
  if [[ ! -d "$ROOT/frontend/node_modules" ]]; then
    return 0
  fi
  [[ "$ROOT/frontend/package.json" -nt "$ROOT/frontend/node_modules" ]] && return 0
  [[ "$ROOT/frontend/package-lock.json" -nt "$ROOT/frontend/node_modules" ]] && return 0
  return 1
}

frontend_dist_stale() {
  if [[ ! -f "$ROOT/frontend/dist/index.html" ]]; then
    return 0
  fi
  local newest
  newest="$(newest_input \
    "$ROOT/frontend/src" \
    "$ROOT/frontend/package.json" \
    "$ROOT/frontend/package-lock.json" \
    "$ROOT/frontend/vite.config.ts" \
    "$ROOT/frontend/tsconfig.json" \
    "$ROOT/frontend/index.html")"
  if [[ -z "$newest" ]]; then
    return 1
  fi
  [[ "$newest" -nt "$ROOT/frontend/dist/index.html" ]]
}

build_backend() {
  echo "==> [backend] Building JAR (local Maven)"
  cd "$ROOT/backend"
  mvn -B package -DskipTests
  local jar=(target/backend-*.jar)
  if [[ ! -f ${jar[0]} ]]; then
    echo "ERROR: backend JAR not found under backend/target/" >&2
    exit 1
  fi
}

build_frontend() {
  local install_deps=$1
  local build_dist=$2
  cd "$ROOT/frontend"
  if [[ "$install_deps" == true ]]; then
    echo "==> [frontend] Installing dependencies"
    npm ci
  elif [[ "$build_dist" == true ]]; then
    echo "==> [frontend] Dependencies are up to date (skipped npm ci)"
  fi
  if [[ "$build_dist" == true ]]; then
    echo "==> [frontend] Building dist"
    npm run build
  fi
  if [[ ! -f "$ROOT/frontend/dist/index.html" ]]; then
    echo "ERROR: frontend dist/ not found - run npm run build" >&2
    exit 1
  fi
}

RUN_BACKEND=false
RUN_FRONTEND_DEPS=false
RUN_FRONTEND_BUILD=false

if [[ "$FORCE" == true ]] || backend_stale; then
  RUN_BACKEND=true
fi
if [[ "$FORCE" == true ]] || frontend_deps_stale; then
  RUN_FRONTEND_DEPS=true
fi
if [[ "$FORCE" == true ]] || frontend_dist_stale; then
  RUN_FRONTEND_BUILD=true
fi
RUN_FRONTEND=false
if [[ "$RUN_FRONTEND_DEPS" == true || "$RUN_FRONTEND_BUILD" == true ]]; then
  RUN_FRONTEND=true
fi

if [[ "$RUN_BACKEND" == true && "$RUN_FRONTEND" == true ]]; then
  echo "==> Building backend and frontend in parallel"
  build_backend &
  BACKEND_PID=$!
  build_frontend "$RUN_FRONTEND_DEPS" "$RUN_FRONTEND_BUILD" &
  FRONTEND_PID=$!
  wait "$BACKEND_PID"
  wait "$FRONTEND_PID"
  BACKEND_REBUILT=true
  if [[ "$RUN_FRONTEND_BUILD" == true ]]; then
    FRONTEND_REBUILT=true
  fi
else
  if [[ "$RUN_BACKEND" == true ]]; then
    build_backend
    BACKEND_REBUILT=true
  else
    echo "==> Backend JAR is up to date (skipped Maven)"
  fi

  if [[ "$RUN_FRONTEND" == true ]]; then
    build_frontend "$RUN_FRONTEND_DEPS" "$RUN_FRONTEND_BUILD"
    if [[ "$RUN_FRONTEND_BUILD" == true ]]; then
      FRONTEND_REBUILT=true
    fi
  else
    echo "==> Frontend dependencies are up to date (skipped npm ci)"
    echo "==> Frontend dist is up to date (skipped npm run build)"
  fi
fi

if [[ "$ARTIFACTS_ONLY" == true ]]; then
  echo "==> Artifacts ready (skipped docker compose build)"
  exit 0
fi

if [[ "$FORCE" == true || "$BACKEND_REBUILT" == true || "$FRONTEND_REBUILT" == true ]]; then
  echo "==> Building runtime container images (parallel)"
  cd "$ROOT"
  docker compose build --parallel
else
  echo "==> Container images are up to date (skipped docker compose build)"
fi

echo "==> Done. Start the stack with: docker compose up -d"
