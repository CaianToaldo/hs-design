// deploy/proxy/proxy.js — HS Design authenticating proxy (basic | supabase)
import http from 'node:http';
import { loadConfig } from './lib/config.js';
import { isBasicAuthed, requireBasic } from './lib/basic-auth.js';
import { anonClient } from './lib/supabase.js';
import { parseCookies } from './lib/cookies.js';
import { makeSessionValidator } from './lib/session.js';
import { getUserKey } from './lib/keystore.js';
import { handleAuthRoutes } from './lib/handlers/auth.js';
import { handleAccountRoutes } from './lib/handlers/account.js';
import { forwardToDaemon } from './lib/handlers/forward.js';

const cfg = loadConfig();

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

function buildBasicServer() {
  return http.createServer((req, res) => {
    if (!isBasicAuthed(req, cfg.basic)) return requireBasic(res);
    // resolveUserKey omitted → pure pass-through pipe, identical to today.
    forwardToDaemon(req, res, { cfg });
  });
}

function buildSupabaseServer() {
  const anon = anonClient(cfg);
  const validateSession = makeSessionValidator(async (token) => {
    const { data, error } = await anon.auth.getUser(token);
    if (error || !data?.user) return null;
    return { id: data.user.id, email: data.user.email };
  });

  // Short-TTL cache of each user's decrypted key, so credential-carrying
  // requests don't hit Supabase every time. Invalidated when /conta saves.
  const keyCache = new Map(); // userId -> { key, exp }
  const KEY_TTL_MS = 60000;
  async function getCachedUserKey(userId) {
    const hit = keyCache.get(userId);
    if (hit && hit.exp > Date.now()) return hit.key;
    const rec = await getUserKey(cfg, userId).catch(() => null);
    const key = rec?.plain || null;
    keyCache.set(userId, { key, exp: Date.now() + KEY_TTL_MS });
    return key;
  }
  const invalidateKey = (userId) => keyCache.delete(userId);

  return http.createServer(async (req, res) => {
    try {
      // Public auth routes (no session required).
      if (await handleAuthRoutes(req, res, { cfg, anon, readBody })) return;

      // Session gate.
      const token = parseCookies(req.headers['cookie']).hs_session;
      const user = await validateSession(token);
      if (!user) {
        if (req.headers['accept']?.includes('text/html')) {
          res.writeHead(302, { Location: '/login' }); res.end(); return;
        }
        res.writeHead(401, { 'Content-Type': 'text/plain' }); res.end('Unauthorized'); return;
      }

      // Account page (manage own key).
      if (await handleAccountRoutes(req, res, { cfg, user, readBody, invalidateKey })) return;

      // Everything else → daemon. forwardToDaemon resolves the key lazily and
      // ONLY for credential-carrying bodies; non-provider requests pass through
      // without needing a key (so the app still loads before /conta is set).
      await forwardToDaemon(req, res, { cfg, resolveUserKey: () => getCachedUserKey(user.id) });
    } catch (err) {
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`proxy error: ${err.message}`);
    }
  });
}

const server = cfg.MODE === 'supabase' ? buildSupabaseServer() : buildBasicServer();
server.requestTimeout = 0;
server.headersTimeout = 0;
server.keepAliveTimeout = 0;
server.listen(cfg.PORT, '0.0.0.0', () => {
  console.log(`[proxy] mode=${cfg.MODE} listening on :${cfg.PORT} -> ${cfg.DAEMON.host}:${cfg.DAEMON.port}`);
});
