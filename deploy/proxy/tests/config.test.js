// deploy/proxy/tests/config.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../lib/config.js';

test('default MODE is basic', () => {
  const cfg = loadConfig({ PORT: '8080', DAEMON_INTERNAL: '127.0.0.1:7456' });
  assert.equal(cfg.MODE, 'basic');
  assert.equal(cfg.PORT, 8080);
  assert.deepEqual(cfg.DAEMON, { host: '127.0.0.1', port: 7456 });
});

test('MODE supabase requires supabase env', () => {
  assert.throws(() => loadConfig({ HS_AUTH_MODE: 'supabase' }), /SUPABASE_URL/);
});
