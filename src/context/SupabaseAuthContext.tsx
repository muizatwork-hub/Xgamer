import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User as AppUser } from '../lib/types';

interface AuthContextType {
  user: User | null;
  profile: AppUser | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdmin(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAdmin(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (uid: string) => {
    const { data } = await supabase.from('admins').select('user_id').eq('user_id', uid).single();
    setIsAdmin(!!data);
  };

  useEffect(() => {
    const handleUserSync = async () => {
      if (user) {
        await fetchProfile(user.id);
        
        // VPN / Trust Check
        try {
          const res = await fetch('/api/check-ip');
          const ipData = await res.json();
          
          // Update profile with VPN status
          await supabase
            .from('profiles')
            .update({
              is_vpn_detected: ipData.isVpn,
              country: ipData.country,
              trust_score: ipData.isVpn ? 30 : 98
            })
            .eq('id', user.id);

          // Log VPN event
          await supabase
            .from('vpn_logs')
            .insert({
              user_id: user.id,
              ip: ipData.ip,
              is_vpn: ipData.isVpn,
              country: ipData.country
            });
          
          // Refresh profile data
          fetchProfile(user.id);
        } catch (err) {
          console.error("Trust check failed", err);
        }
      }
    };
    handleUserSync();
  }, [user]);

  const fetchProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: uid, 
              username: user?.user_metadata?.full_name || 'XGamer',
              balance: 0.000,
              xp: 0,
              level: 1,
              streak: 0,
              claim_streak: 0,
              last_claimed_at: null,
              daily_withdrawn: 0,
              weekly_withdrawn: 0,
              monthly_withdrawn: 0,
              last_withdrawal_at: null,
              trust_score: 80,
              is_verified: false,
              referral_code: user?.user_metadata?.username ? `${user.user_metadata.username.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}` : `XG${Math.floor(100000 + Math.random() * 900000)}`,
              referred_by: user?.user_metadata?.referred_by || null
            }
          ])
          .select()
          .single();
        
        if (!createError) setProfile(mapProfile(newProfile));
      } else if (data) {
        setProfile(mapProfile(data));
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    }
  };

  const mapProfile = (dbProfile: any): AppUser => ({
    id: dbProfile.id,
    username: dbProfile.username,
    email: user?.email || '',
    balance: Number(dbProfile.balance || 0),
    xp: Number(dbProfile.xp || 0),
    level: Number(dbProfile.level || 1),
    streak: Number(dbProfile.streak || 0),
    claimStreak: Number(dbProfile.claim_streak || 0),
    lastClaimedAt: dbProfile.last_claimed_at,
    dailyWithdrawn: Number(dbProfile.daily_withdrawn || 0),
    weeklyWithdrawn: Number(dbProfile.weekly_withdrawn || 0),
    monthlyWithdrawn: Number(dbProfile.monthly_withdrawn || 0),
    lastWithdrawalAt: dbProfile.last_withdrawal_at,
    trustScore: Number(dbProfile.trust_score || 80),
    isVerified: dbProfile.is_verified,
    country: dbProfile.country,
    isVpnDetected: dbProfile.is_vpn_detected,
    referralCode: dbProfile.referral_code,
    referredBy: dbProfile.referred_by
  });

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!user || !profile) return;

    // Strictly map AppUser fields to Database column names
    const dbUpdates: any = {};
    
    // Only include fields that exist in the 'profiles' table
    if ('balance' in updates) dbUpdates.balance = Number(updates.balance);
    if ('username' in updates) dbUpdates.username = updates.username;
    if ('xp' in updates) dbUpdates.xp = updates.xp;
    if ('level' in updates) dbUpdates.level = updates.level;
    if ('streak' in updates) dbUpdates.streak = updates.streak;
    if ('claimStreak' in updates) dbUpdates.claim_streak = updates.claimStreak;
    if ('lastClaimedAt' in updates) dbUpdates.last_claimed_at = updates.lastClaimedAt;
    if ('dailyWithdrawn' in updates) dbUpdates.daily_withdrawn = updates.dailyWithdrawn;
    if ('weeklyWithdrawn' in updates) dbUpdates.weekly_withdrawn = updates.weeklyWithdrawn;
    if ('monthlyWithdrawn' in updates) dbUpdates.monthly_withdrawn = updates.monthlyWithdrawn;
    if ('lastWithdrawalAt' in updates) dbUpdates.last_withdrawal_at = updates.lastWithdrawalAt;
    if ('trustScore' in updates) dbUpdates.trust_score = updates.trustScore;
    if ('isVerified' in updates) dbUpdates.is_verified = updates.isVerified;
    if ('country' in updates) dbUpdates.country = updates.country;
    if ('isVpnDetected' in updates) dbUpdates.is_vpn_detected = updates.isVpnDetected;
    if ('referralCode' in updates) dbUpdates.referral_code = updates.referralCode;

    // Optimistic Update for UI responsiveness
    const optimisticProfile = { ...profile, ...updates };
    setProfile(optimisticProfile);

    try {
      const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase Database Error:", error.message, error.details);
        // Revert optimistic update on error by re-fetching actual DB state
        await fetchProfile(user.id);
        throw new Error(error.message);
      } else if (updatedData) {
        // Sync state with the data returned from database
        setProfile(mapProfile(updatedData));
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signInWithGoogle, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
