import { test } from 'node:test';
import assert from 'node:assert/strict';
import { injectUserKey, bodyCarriesCredential } from '../lib/inject.js';

test('overrides top-level apiKey', () => {
  const out = injectUserKey({ apiKey: 'placeholder', model: 'x' }, 'REAL');
  assert.equal(out.apiKey, 'REAL');
  assert.equal(out.model, 'x');
});

test('overrides nested providers[*].apiKey', () => {
  const out = injectUserKey({ providers: { anthropic: { apiKey: 'p', baseUrl: 'b' } } }, 'REAL');
  assert.equal(out.providers.anthropic.apiKey, 'REAL');
  assert.equal(out.providers.anthropic.baseUrl, 'b');
});

test('leaves body without credential intact', () => {
  const body = { foo: 'bar' };
  assert.deepEqual(injectUserKey(body, 'REAL'), { foo: 'bar' });
  assert.equal(bodyCarriesCredential(body), false);
});

test('detects credential presence', () => {
  assert.equal(bodyCarriesCredential({ apiKey: 'x' }), true);
  assert.equal(bodyCarriesCredential({ providers: { a: { apiKey: 'x' } } }), true);
});
