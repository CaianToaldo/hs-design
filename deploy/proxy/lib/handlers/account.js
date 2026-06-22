// deploy/proxy/lib/handlers/account.js
import { getUserKey, setUserKey } from '../keystore.js';

const PAGE = (tail, saved) => `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HS Design — Minha chave</title>
<style>body{font-family:system-ui;background:#111;color:#eee;display:grid;place-items:center;height:100vh;margin:0}
form{background:#1c1c1c;padding:2rem;border-radius:12px;width:360px}
input,button{width:100%;padding:.7rem;margin-top:.6rem;border-radius:8px;border:1px solid #333;box-sizing:border-box}
button{background:#f26522;color:#fff;border:none;font-weight:600;cursor:pointer}
.tail{color:#9aa;font-size:.9rem;margin-top:.5rem}a{color:#f26522}</style></head>
<body><form method="POST" action="/conta">
<h2>Minha chave Anthropic</h2>
${tail ? `<div class="tail">Configurada: •••${tail}</div>` : '<div class="tail">Nenhuma chave configurada ainda.</div>'}
<input name="apiKey" type="password" placeholder="sk-ant-..." autocomplete="off" required>
<button type="submit">Salvar</button>
${saved ? '<div class="tail">Salva com sucesso. <a href="/">Ir para o app</a></div>' : ''}
<div class="tail"><a href="/">Voltar ao app</a> · <form method="POST" action="/logout" style="display:inline"><button style="background:none;color:#f26522;width:auto;padding:0;margin-top:.6rem" type="submit">Sair</button></form></div>
</form></body></html>`;

function send(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

export async function handleAccountRoutes(req, res, ctx) {
  const { cfg, user, readBody, invalidateKey } = ctx;
  const url = new URL(req.url, 'http://local');
  if (url.pathname !== '/conta') return false;

  if (req.method === 'GET') {
    const existing = await getUserKey(cfg, user.id).catch(() => null);
    send(res, 200, PAGE(existing?.keyTail || '', false));
    return true;
  }
  if (req.method === 'POST') {
    const body = await readBody(req);
    const apiKey = new URLSearchParams(body.toString('utf8')).get('apiKey') || '';
    if (!apiKey.trim()) { send(res, 400, PAGE('', false)); return true; }
    const { keyTail } = await setUserKey(cfg, user.id, apiKey.trim());
    invalidateKey?.(user.id); // drop the in-memory cache so the new key applies now
    send(res, 200, PAGE(keyTail, true));
    return true;
  }
  return false;
}
