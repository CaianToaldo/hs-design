export function makeSessionValidator(getUserFn, { ttlMs = 60000, now = Date.now } = {}) {
  const cache = new Map(); // token -> { user, exp }
  return async function validate(token) {
    if (!token) return null;
    const hit = cache.get(token);
    if (hit && hit.exp > now()) return hit.user;
    const user = await getUserFn(token);
    if (user) cache.set(token, { user, exp: now() + ttlMs });
    else cache.delete(token);
    return user;
  };
}
