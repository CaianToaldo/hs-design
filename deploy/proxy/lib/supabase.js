import { createClient } from '@supabase/supabase-js';

export function serviceClient(cfg) {
  return createClient(cfg.supabase.url, cfg.supabase.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function anonClient(cfg) {
  return createClient(cfg.supabase.url, cfg.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
