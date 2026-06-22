export function bodyCarriesCredential(body) {
  if (!body || typeof body !== 'object') return false;
  if (typeof body.apiKey === 'string') return true;
  if (body.providers && typeof body.providers === 'object') {
    return Object.values(body.providers).some(
      (p) => p && typeof p === 'object' && 'apiKey' in p,
    );
  }
  return false;
}

export function injectUserKey(body, userKey) {
  if (!body || typeof body !== 'object') return body;
  const out = { ...body };
  if (typeof out.apiKey === 'string') out.apiKey = userKey;
  if (out.providers && typeof out.providers === 'object') {
    const providers = {};
    for (const [id, entry] of Object.entries(out.providers)) {
      providers[id] = entry && typeof entry === 'object' && 'apiKey' in entry
        ? { ...entry, apiKey: userKey }
        : entry;
    }
    out.providers = providers;
  }
  return out;
}
