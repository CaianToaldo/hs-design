#!/bin/sh
# hs/deploy: Persistent volumes (Railway/Fly/etc.) are mounted owned by root,
# but the daemon runs as the non-root `open-design` user. Run this entrypoint
# as root to make the data dir writable, then drop privileges before exec'ing
# the daemon. OD_DATA_DIR defaults to /app/.od (see daemon server.ts).
set -e
DATA_DIR="${OD_DATA_DIR:-/app/.od}"
mkdir -p "$DATA_DIR"
chown -R open-design:open-design "$DATA_DIR"

# Start the loopback daemon (CMD) in the background. Bound to 127.0.0.1, so its
# auth gate bypasses loopback peers — the bundled proxy reaches it without a
# token. Then run the authenticating proxy in the foreground (PID receives
# tini's signals); if the proxy exits the container restarts.
su-exec open-design:open-design "$@" &
exec su-exec open-design:open-design node /usr/local/bin/proxy.js
