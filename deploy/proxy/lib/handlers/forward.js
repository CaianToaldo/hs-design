// deploy/proxy/lib/handlers/forward.js
import http from 'node:http';
import { bodyCarriesCredential, injectUserKey } from '../inject.js';

function isJson(req) {
  return /application\/json/i.test(req.headers['content-type'] || '');
}

async function readAll(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

function sendNoKey(res) {
  res.writeHead(428, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'NO_API_KEY', message: 'Configure sua chave em /conta' }));
}

export async function forwardToDaemon(req, res, { cfg, resolveUserKey = null }) {
  const headers = { ...req.headers };
  headers['authorization'] = `Bearer ${cfg.TOKEN}`;
  delete headers['connection'];

  // Only credential-carrying JSON request bodies are buffered/rewritten.
  // Everything else (incl. SSE responses and basic mode) is streamed untouched.
  let outBody = null;
  if (resolveUserKey && (req.method === 'POST' || req.method === 'PUT') && isJson(req)) {
    const raw = await readAll(req);
    let parsed = null;
    try { parsed = JSON.parse(raw.toString('utf8')); } catch { parsed = null; }
    if (parsed && bodyCarriesCredential(parsed)) {
      const userKey = await resolveUserKey();
      if (!userKey) { sendNoKey(res); return; }
      const injected = Buffer.from(JSON.stringify(injectUserKey(parsed, userKey)), 'utf8');
      outBody = injected;
    } else {
      outBody = raw; // body already consumed; forward as-is (no credential)
    }
  }

  // When we send a fixed-length buffered body, remove any chunked framing the
  // client may have advertised — having both content-length and transfer-encoding
  // is an HTTP framing ambiguity (RFC 7230 §3.3.3).
  if (outBody != null) {
    headers['content-length'] = String(outBody.length);
    delete headers['transfer-encoding'];
  }

  const upstream = http.request(
    { host: cfg.DAEMON.host, port: cfg.DAEMON.port, path: req.url, method: req.method, headers },
    (uRes) => { res.writeHead(uRes.statusCode || 502, uRes.headers); uRes.pipe(res); },
  );
  upstream.on('error', (err) => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`proxy upstream error: ${err.message}`);
  });

  if (outBody != null) { upstream.end(outBody); }
  else { req.pipe(upstream); } // streamed pass-through (basic mode / non-JSON / GET)
}
