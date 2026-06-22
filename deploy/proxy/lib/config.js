// deploy/proxy/lib/config.js
function parseDaemon(daemon) {
  const sep = daemon.lastIndexOf(':');
  return sep > 0
    ? { host: daemon.slice(0, sep), port: Number(daemon.slice(sep + 1)) }
    : { host: daemon, port: 7456 };
}

export function loadConfig(env = process.env) {
  const MODE = env.HS_AUTH_MODE === 'supabase' ? 'supabase' : 'basic';
  const cfg = {
    MODE,
    PORT: Number(env.PORT) || 8080,
    DAEMON: parseDaemon(env.DAEMON_INTERNAL || '127.0.0.1:7456'),
    TOKEN: env.OD_API_TOKEN || '',
    cookieSecure: env.HS_COOKIE_INSECURE !== '1',
    basic: { user: env.PROXY_USER || '', pass: env.PROXY_PASS || '' },
    supabase: {
      url: env.SUPABASE_URL || '',
      anonKey: env.SUPABASE_ANON_KEY || '',
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || '',
    },
    encryptionSecret: env.KEY_ENCRYPTION_SECRET || '',
  };
  if (MODE === 'supabase') {
    const supabaseEnvNames = { url: 'SUPABASE_URL', anonKey: 'SUPABASE_ANON_KEY', serviceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY' };
    for (const k of Object.keys(supabaseEnvNames)) {
      if (!cfg.supabase[k]) throw new Error(`${supabaseEnvNames[k]} missing`);
    }
    if (!cfg.encryptionSecret) throw new Error('KEY_ENCRYPTION_SECRET missing');
  }
  return cfg;
}
