import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCookies, serializeCookie, clearCookie } from '../lib/cookies.js';

test('parses cookie header', () => {
  assert.deepEqual(parseCookies('a=1; hs_session=xyz'), { a: '1', hs_session: 'xyz' });
});
test('parses empty/missing header', () => {
  assert.deepEqual(parseCookies(undefined), {});
});
test('serializes with flags', () => {
  const c = serializeCookie('hs_session', 'xyz', { httpOnly: true, secure: true, maxAge: 3600 });
  assert.match(c, /^hs_session=xyz/);
  assert.match(c, /HttpOnly/);
  assert.match(c, /Secure/);
  assert.match(c, /SameSite=Lax/);
});
test('clearCookie expires', () => {
  assert.match(clearCookie('hs_session'), /Max-Age=0/);
});
