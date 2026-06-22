import { serviceClient } from './supabase.js';

export async function _isEmailAllowedWith(db, email) {
  const norm = String(email || '').trim().toLowerCase();
  if (!norm) return false;
  const { data, error } = await db
    .from('allowlist').select('email').eq('email', norm).maybeSingle();
  if (error) throw new Error(`allowlist read failed: ${error.message}`);
  return Boolean(data);
}

export function isEmailAllowed(cfg, email) {
  return _isEmailAllowedWith(serviceClient(cfg), email);
}
