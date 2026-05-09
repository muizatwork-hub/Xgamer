import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

// Database Helper Utilities
export const db = {
  // Profiles
  async getProfile(uid: string) {
    return supabase.from('profiles').select('*').eq('id', uid).single();
  },

  // Game Sessions
  async startSession(userId: string, gameId: string) {
    return supabase.from('game_sessions').insert({
      user_id: userId,
      game_id: gameId,
      status: 'Active'
    }).select().single();
  },

  async endSession(sessionId: string, xp: number) {
    return supabase.from('game_sessions').update({
      end_time: new Date().toISOString(),
      xp_earned: xp,
      status: 'Completed'
    }).eq('id', sessionId);
  },

  // Transactions
  async getTransactions(userId: string) {
    return supabase.from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  // VPN Logs
  async logVpnEntry(userId: string, data: { ip: string, isVpn: boolean, country: string, fingerprint?: string }) {
    return supabase.from('vpn_logs').insert({
      user_id: userId,
      ip: data.ip,
      is_vpn: data.isVpn,
      country: data.country,
      device_fingerprint: data.fingerprint
    });
  }
};
