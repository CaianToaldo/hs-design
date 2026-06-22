import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSessionValidator } from '../lib/session.js';

test('caches within TTL (one upstream call)', async () => {
  let calls = 0;
  let t = 1000;
  const validate = makeSessionValidator(
    async () => { calls++; return { id: 'u1', email: 'a@b.com' }; },
    { ttlMs: 100, now: () => t },
  );
  assert.deepEqual(await validate('tok'), { id: 'u1', email: 'a@b.com' });
  await validate('tok');
  assert.equal(calls, 1);
  t = 1200; // past TTL
  await validate('tok');
  assert.equal(calls, 2);
});

test('returns null for invalid token and does not cache null forever', async () => {
  const validate = makeSessionValidator(async () => null, { ttlMs: 100 });
  assert.equal(await validate('bad'), null);
});
