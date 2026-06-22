import { serviceClient } from './supabase.js';
import { encryptSecret, decryptSecret, keyTail } from './crypto.js';

export async function getUserKey(cfg, userId, provider = 'anthropic') {
  const db = serviceClient(cfg);
  const { data, error } = await db
    .from('user_api_keys')
    .select('encrypted_key, key_tail')
    .eq('user_id', userId)
    .eq('provider', provider)
    .maybeSingle();
  if (error) throw new Error(`keystore read failed: ${error.message}`);
  if (!data) return null;
  return { plain: decryptSecret(data.encrypted_key, cfg.encryptionSecret), keyTail: data.key_tail };
}

export async function setUserKey(cfg, userId, plain, provider = 'anthropic') {
  const db = serviceClient(cfg);
  const tail = keyTail(plain);
  const { error } = await db.from('user_api_keys').upsert({
    user_id: userId,
    provider,
    encrypted_key: encryptSecret(plain, cfg.encryptionSecret),
    key_tail: tail,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`keystore write failed: ${error.message}`);
  return { keyTail: tail };
}
