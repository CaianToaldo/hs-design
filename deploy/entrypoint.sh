#!/bin/sh
# hs/deploy: Persistent volumes (Railway/Fly/etc.) are mounted owned by root,
# but the daemon runs as the non-root `open-design` user. Run this entrypoint
# as root to make the data dir writable, then drop privileges before exec'ing
# the daemon. OD_DATA_DIR defaults to /app/.od (see daemon server.ts).
set -e
DATA_DIR="${OD_DATA_DIR:-/app/.od}"
mkdir -p "$DATA_DIR"
chown -R open-design:open-design "$DATA_DIR"
exec su-exec open-design:open-design "$@"
