import crypto from 'node:crypto';

function timingSafeEqual(a, b) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function isBasicAuthed(req, { user, pass }) {
  const m = /^Basic\s+(.+)$/i.exec(req.headers['authorization'] || '');
  if (!m) return false;
  let decoded;
  try { decoded = Buffer.from(m[1], 'base64').toString('utf8'); } catch { return false; }
  const idx = decoded.indexOf(':');
  if (idx < 0) return false;
  return timingSafeEqual(decoded.slice(0, idx), user)
    && timingSafeEqual(decoded.slice(idx + 1), pass);
}

export function requireBasic(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="HS Design", charset="UTF-8"',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end('Authentication required');
}
