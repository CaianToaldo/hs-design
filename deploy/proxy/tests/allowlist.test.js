import { test } from 'node:test';
import assert from 'node:assert/strict';
import { _isEmailAllowedWith } from '../lib/allowlist.js';

function fakeDb(rows) {
  return {
    from() { return this; },
    select() { return this; },
    eq(_col, val) { this._val = val; return this; },
    async maybeSingle() {
      return { data: rows.includes(this._val) ? { email: this._val } : null, error: null };
    },
  };
}

test('allows listed email (case-insensitive)', async () => {
  assert.equal(await _isEmailAllowedWith(fakeDb(['caian@hs.com']), 'CAIAN@HS.com'), true);
});
test('rejects unlisted email', async () => {
  assert.equal(await _isEmailAllowedWith(fakeDb(['caian@hs.com']), 'x@y.com'), false);
});
test('throws (fail-closed) on DB error', async () => {
  const errorDb = {
    from() { return this; },
    select() { return this; },
    eq() { return this; },
    async maybeSingle() {
      return { data: null, error: { message: 'connection refused' } };
    },
  };
  await assert.rejects(() => _isEmailAllowedWith(errorDb, 'x@y.com'), /connection refused/);
});
