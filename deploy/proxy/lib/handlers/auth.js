// deploy/proxy/lib/handlers/auth.js
import { isEmailAllowed } from '../allowlist.js';
import { serializeCookie, clearCookie } from '../cookies.js';

const LOGIN_PAGE = (msg = '') => `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HS Design — Entrar</title>
<style>body{font-family:system-ui;background:#111;color:#eee;display:grid;place-items:center;height:100vh;margin:0}
form{background:#1c1c1c;padding:2rem;border-radius:12px;width:320px}
input,button{width:100%;padding:.7rem;margin-top:.6rem;border-radius:8px;border:1px solid #333;box-sizing:border-box}
button{background:#f26522;color:#fff;border:none;font-weight:600;cursor:pointer}
.msg{color:#9fe6a0;margin-top:.8rem;font-size:.9rem}</style></head>
<body><form method="POST" action="/login">
<h2>HS Design</h2><p>Receba um link de acesso por e-mail.</p>
<input name="email" type="email" placeholder="voce@hsmarketing.com" required autofocus>
<button type="submit">Enviar link</button>
${msg ? `<div class="msg">${msg}</div>` : ''}</form></body></html>`;

function send(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

export async function handleAuthRoutes(req, res, ctx) {
  const url = new URL(req.url, 'http://local');
  const { cfg, anon, readBody } = ctx;

  if (req.method === 'GET' && url.pathname === '/login') {
    send(res, 200, LOGIN_PAGE());
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const body = await readBody(req);
    const email = new URLSearchParams(body.toString('utf8')).get('email') || '';
    // Resposta genérica sempre (não revela se o e-mail existe/está liberado).
    const generic = 'Se este e-mail tiver acesso, enviamos um link. Confira sua caixa de entrada.';
    if (await isEmailAllowed(cfg, email)) {
      const emailRedirect = `${publicOrigin(req)}/auth/callback`;
      await anon.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { emailRedirectTo: emailRedirect } });
    }
    send(res, 200, LOGIN_PAGE(generic));
    return true;
  }

  if (req.method === 'GET' && url.pathname === '/auth/callback') {
    // Supabase manda tokens no fragment (#access_token=...). Servimos uma
    // página que reenvia os tokens via querystring para POST /auth/session.
    const tokenHash = url.searchParams.get('token_hash');
    const type = url.searchParams.get('type');
    if (tokenHash) {
      const { data, error } = await anon.auth.verifyOtp({ token_hash: tokenHash, type: type || 'email' });
      if (error || !data?.session) { send(res, 401, LOGIN_PAGE('Link inválido ou expirado.')); return true; }
      const user = data.session.user;
      if (!(await isEmailAllowed(cfg, user.email))) {
        send(res, 401, LOGIN_PAGE('Link inválido ou expirado.')); return true;
      }
      setSessionCookies(res, cfg, data.session);
      res.writeHead(302, { Location: '/' }); res.end(); return true;
    }
    // Fallback: tokens no fragment → bounce client-side para /auth/session.
    send(res, 200, CALLBACK_BOUNCE);
    return true;
  }

  if (req.method === 'POST' && url.pathname === '/auth/session') {
    const body = await readBody(req);
    const params = new URLSearchParams(body.toString('utf8'));
    const access = params.get('access_token'); const refresh = params.get('refresh_token');
    if (!access || !refresh) { send(res, 401, LOGIN_PAGE('Sessão inválida.')); return true; }
    const { data, error } = await anon.auth.getUser(access || '');
    if (error || !data?.user || !(await isEmailAllowed(cfg, data.user.email))) {
      send(res, 401, LOGIN_PAGE('Sessão inválida.')); return true;
    }
    setSessionCookies(res, cfg, { access_token: access, refresh_token: refresh });
    res.writeHead(302, { Location: '/' }); res.end(); return true;
  }

  if (req.method === 'POST' && url.pathname === '/logout') {
    res.setHeader('Set-Cookie', [clearCookie('hs_session'), clearCookie('hs_refresh')]);
    res.writeHead(302, { Location: '/login' }); res.end(); return true;
  }

  return false;
}

function publicOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'] || '';
  return `${proto}://${host}`;
}

function setSessionCookies(res, cfg, session) {
  res.setHeader('Set-Cookie', [
    serializeCookie('hs_session', session.access_token, { httpOnly: true, secure: cfg.cookieSecure, maxAge: 3600 }),
    serializeCookie('hs_refresh', session.refresh_token || '', { httpOnly: true, secure: cfg.cookieSecure, maxAge: 60 * 60 * 24 * 30 }),
  ]);
}

const CALLBACK_BOUNCE = `<!doctype html><meta charset="utf-8"><body>
<script>
(function(){var h=location.hash.slice(1);if(!h){location.href='/login';return;}
var f=document.createElement('form');f.method='POST';f.action='/auth/session';
new URLSearchParams(h).forEach(function(v,k){var i=document.createElement('input');i.type='hidden';i.name=k;i.value=v;f.appendChild(i);});
document.body.appendChild(f);f.submit();})();
</script></body>`;
