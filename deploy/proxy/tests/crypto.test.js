import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encryptSecret, decryptSecret, keyTail } from '../lib/crypto.js';

const SECRET = 'unit-test-master-key';

test('round-trips a secret', () => {
  const plain = 'sk-ant-api03-abcd1234';
  const blob = encryptSecret(plain, SECRET);
  assert.notEqual(blob, plain);
  assert.equal(decryptSecret(blob, SECRET), plain);
});
test('different IV each call', () => {
  assert.notEqual(encryptSecret('x', SECRET), encryptSecret('x', SECRET));
});
test('wrong secret fails to decrypt', () => {
  const blob = encryptSecret('x', SECRET);
  assert.throws(() => decryptSecret(blob, 'other-key'));
});
test('keyTail returns last 4', () => {
  assert.equal(keyTail('sk-ant-api03-abcd1234'), '1234');
});
