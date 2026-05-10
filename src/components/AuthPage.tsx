import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Github, Chrome, ArrowRight, Loader2, Gamepad2, ShieldCheck, Zap } from 'lucide-react';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import { supabase } from '../lib/supabase';
import Footer from './Footer';
import LegalModal from './LegalModal';

export default function AuthPage({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | 'cookie' | null>(null);
  
  const { signInWithGoogle } = useSupabaseAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: username,
            }
          }
        });
        if (signUpError) throw signUpError;
        setMessage("Verification email sent! Please check your inbox.");
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#reset-password`,
        });
        if (resetError) throw resetError;
        setMessage("Password reset link sent! Check your email.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError("Network error: Could not reach Supabase. Check your API URL in Secrets.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] flex flex-col items-center p-6 relative overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center w-full py-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-status-blue/10 rounded-full blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full relative z-10"
        >
          {/* ... existing form content ... */}
          <div className="text-center mb-10">
            <button 
              onClick={onBack}
              className="mb-8 text-white/40 hover:text-white transition-all text-xs font-display font-bold uppercase tracking-widest flex items-center gap-2 mx-auto"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
            </button>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-neon-blue rounded flex items-center justify-center rotate-45 border-2 border-blue-glow shadow-[0_0_15px_rgba(0,163,255,0.4)]">
                <span className="text-black font-display text-2xl -rotate-45 font-black">X</span>
              </div>
              <h1 className="text-3xl font-display font-black tracking-tight">XGAMER</h1>
            </div>
            <p className="text-white/40 text-sm font-medium">Elevate your gaming legacy.</p>
          </div>

          <div className="glass-card neon-border p-8 pb-10">
            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-8 overflow-hidden">
              <button
                onClick={() => { setMode('login'); setMessage(null); setError(null); }}
                className={`flex-1 py-3 text-xs font-display font-bold uppercase tracking-widest transition-all rounded-lg ${
                  mode === 'login' ? 'bg-neon-blue text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('signup'); setMessage(null); setError(null); }}
                className={`flex-1 py-3 text-xs font-display font-bold uppercase tracking-widest transition-all rounded-lg ${
                  mode === 'signup' ? 'bg-neon-blue text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-5">
              {mode === 'forgot' && (
                <div className="mb-6">
                  <h3 className="text-sm font-display font-bold uppercase tracking-widest mb-2">Reset Password</h3>
                  <p className="text-white/40 text-[10px] leading-relaxed">Enter your email and we'll send you a link to get back into your account.</p>
                </div>
              )}
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        required
                        placeholder="GamerTag"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Password</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => { setMode('forgot'); setError(null); setMessage(null); }}
                        className="text-[10px] font-bold uppercase tracking-widest text-neon-blue hover:text-blue-glow transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
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
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-warning-red text-[10px] font-bold uppercase text-center"
                >
                  {error}
                </motion.p>
              )}

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-verified-green text-[10px] font-bold uppercase text-center"
                >
                  {message}
                </motion.p>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full blue-button flex items-center justify-center gap-3 mt-4 h-14 disabled:opacity-50 disabled:grayscale transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="animate-pulse">Processing...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    Enter Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                ) : mode === 'signup' ? (
                  <>
                    Create Account <Zap className="w-4 h-4" />
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              {mode === 'forgot' && (
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors py-2"
                >
                  Back to Login
                </button>
              )}
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Social Access</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={signInWithGoogle}
                className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-4 hover:bg-white/10 transition-all text-xs font-display font-bold uppercase tracking-widest"
              >
                <Chrome className="w-4 h-4 text-neon-blue" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-4 hover:bg-white/10 transition-all text-xs font-display font-bold uppercase tracking-widest">
                <Gamepad2 className="w-4 h-4 text-status-blue" /> Discord
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Anti-Fraud Protection</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full mt-auto">
        <Footer onLegalClick={setLegalType} onNavigate={() => onBack()} />
      </div>

      <AnimatePresence>
        {legalType && (
          <LegalModal type={legalType} onClose={() => setLegalType(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
