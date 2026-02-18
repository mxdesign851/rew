#!/usr/bin/env sh
set -eu

PORT_VALUE="${PORT:-3000}"
MAX_ATTEMPTS="${MIGRATION_RETRY_COUNT:-12}"
SLEEP_SECONDS="${MIGRATION_RETRY_DELAY_SECONDS:-3}"

echo "[boot] ReviewPilot startup initiated"
echo "[boot] Node version: $(node -v)"
echo "[boot] Target port: ${PORT_VALUE}"

run_migrations() {
  attempt=1
  while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
    if npx prisma migrate deploy; then
      echo "[boot] Prisma migration deploy completed."
      return 0
    fi

    if [ "$attempt" -eq "$MAX_ATTEMPTS" ]; then
      echo "[boot] Prisma migrate deploy failed after ${MAX_ATTEMPTS} attempts."
      return 1
    fi

    echo "[boot] Migration attempt ${attempt}/${MAX_ATTEMPTS} failed; retrying in ${SLEEP_SECONDS}s..."
    attempt=$((attempt + 1))
    sleep "$SLEEP_SECONDS"
  done
}

if [ -n "${DATABASE_URL:-}" ]; then
  echo "[boot] DATABASE_URL detected. Running migrations with retry."
  run_migrations
else
  echo "[boot] DATABASE_URL is missing; cannot run migrations."
  exit 1
fi

echo "[boot] Starting Next.js server on 0.0.0.0:${PORT_VALUE}"
exec npx next start -H 0.0.0.0 -p "$PORT_VALUE"
