import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBasicAuthed } from '../lib/basic-auth.js';

const creds = { user: 'hs', pass: 'secret' };
const reqWith = (h) => ({ headers: { authorization: h } });

test('accepts valid Basic header', () => {
  const token = Buffer.from('hs:secret').toString('base64');
  assert.equal(isBasicAuthed(reqWith(`Basic ${token}`), creds), true);
});
test('rejects wrong password', () => {
  const token = Buffer.from('hs:nope').toString('base64');
  assert.equal(isBasicAuthed(reqWith(`Basic ${token}`), creds), false);
});
test('rejects missing header', () => {
  assert.equal(isBasicAuthed({ headers: {} }, creds), false);
});
