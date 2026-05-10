import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPasswordPage({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: password
      });
      if (resetError) throw resetError;
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-neon-blue rounded flex items-center justify-center rotate-45 border-2 border-blue-glow shadow-[0_0_15px_rgba(0,163,255,0.4)]">
              <span className="text-black font-display text-2xl -rotate-45 font-black">X</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">XGAMER</h1>
          </div>
          <h2 className="text-xl font-display font-bold uppercase tracking-widest mt-2">New Password</h2>
          <p className="text-white/40 text-sm mt-2">Create a secure password for your account.</p>
        </div>

        <div className="glass-card neon-border p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-verified-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-verified-green" />
              </div>
              <h3 className="text-lg font-display font-bold uppercase tracking-widest mb-2">Password Updated</h3>
              <p className="text-white/40 text-xs">Redirecting you to dashboard...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-warning-red text-[10px] font-bold uppercase text-center">{error}</p>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full blue-button flex items-center justify-center gap-3 h-14"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
