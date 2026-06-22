export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of String(header).split(';')) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

export function serializeCookie(name, value, opts = {}) {
  let c = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Lax`;
  if (opts.httpOnly) c += '; HttpOnly';
  if (opts.secure) c += '; Secure';
  if (opts.maxAge != null) c += `; Max-Age=${opts.maxAge}`;
  return c;
}

export function clearCookie(name) {
  return `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}
