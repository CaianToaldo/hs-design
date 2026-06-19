// hs/deploy: Authenticating reverse proxy for the HS Design daemon.
//
// The daemon (bound to 0.0.0.0 with OD_API_TOKEN) requires
// `Authorization: Bearer <OD_API_TOKEN>` on every /api request, and the web UI
// — built for loopback — never sends it. This zero-dependency proxy sits in
// front of the (now private) daemon: it gates access with HTTP Basic auth and
// injects the bearer token before forwarding, so the browser UI works over a
// public domain. This is the "proxy injetor" from the BUILD-LOOP spike (Fase 3).
//
// Env:
//   PORT             listen port (Railway target port)            default 8080
//   DAEMON_INTERNAL  daemon host:port on the private network      e.g. hs-design-copy.railway.internal:7456
//   OD_API_TOKEN     the daemon bearer token (Railway reference)
//   PROXY_USER       Basic-auth username
//   PROXY_PASS       Basic-auth password (set as a Railway secret)
'use strict';
const http = require('node:http');

const PORT = Number(process.env.PORT) || 8080;
const DAEMON = process.env.DAEMON_INTERNAL || '';
const TOKEN = process.env.OD_API_TOKEN || '';
const USER = process.env.PROXY_USER || '';
const PASS = process.env.PROXY_PASS || '';

const sep = DAEMON.lastIndexOf(':');
const DHOST = sep > 0 ? DAEMON.slice(0, sep) : DAEMON;
const DPORT = sep > 0 ? Number(DAEMON.slice(sep + 1)) : 7456;

if (!DAEMON || !TOKEN || !USER || !PASS) {
  console.error('[proxy] missing required env (DAEMON_INTERNAL, OD_API_TOKEN, PROXY_USER, PROXY_PASS)');
}

function timingSafeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return require('node:crypto').timingSafeEqual(ba, bb);
}

function authed(req) {
  const header = req.headers['authorization'] || '';
  const m = /^Basic\s+(.+)$/i.exec(header);
  if (!m) return false;
  let decoded;
  try {
    decoded = Buffer.from(m[1], 'base64').toString('utf8');
  } catch {
    return false;
  }
  const idx = decoded.indexOf(':');
  if (idx < 0) return false;
  const u = decoded.slice(0, idx);
  const p = decoded.slice(idx + 1);
  return timingSafeEqual(u, USER) && timingSafeEqual(p, PASS);
}

function requireAuth(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="HS Design", charset="UTF-8"',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end('Authentication required');
}

const server = http.createServer((req, res) => {
  if (!authed(req)) return requireAuth(res);

  // Forward the original headers (keep Host/Origin so the daemon's
  // allowed-origin check sees the public proxy domain), but replace the
  // client's Basic credential with the daemon bearer token.
  const headers = { ...req.headers };
  headers['authorization'] = `Bearer ${TOKEN}`;
  delete headers['connection'];

  const upstream = http.request(
    { host: DHOST, port: DPORT, path: req.url, method: req.method, headers },
    (uRes) => {
      res.writeHead(uRes.statusCode || 502, uRes.headers);
      uRes.pipe(res);
    },
  );
  upstream.on('error', (err) => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`proxy upstream error: ${err.message}`);
  });
  req.pipe(upstream);
});

// Keep SSE / long-poll streams alive (the chat stream can run for minutes).
server.requestTimeout = 0;
server.headersTimeout = 0;
server.keepAliveTimeout = 0;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[proxy] listening on :${PORT} -> ${DHOST}:${DPORT} (basic-auth gated, bearer injected)`);
});
