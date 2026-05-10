import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, TrendingUp, ShieldCheck, Users, Zap, Gift, ChevronRight, Star, ArrowRight, Wallet, X } from 'lucide-react';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import LegalModal from './LegalModal';
import Footer from './Footer';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  const { signInWithGoogle } = useSupabaseAuth();
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | 'cookie' | null>(null);

  const handleAuth = () => {
    onStart();
  };
  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#F5F5F5] selection:bg-neon-blue/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F0F10]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-blue rounded flex items-center justify-center rotate-45 border border-blue-glow shadow-[0_0_10px_rgba(0,163,255,0.3)]">
              <span className="text-black font-display text-xl -rotate-45 font-black">X</span>
            </div>
            <span className="text-xl font-display font-black tracking-tight">XGAMER</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white/60">
            <button onClick={() => document.getElementById('how-to-earn')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neon-blue transition-colors">How it Works</button>
            <button onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neon-blue transition-colors">Offers</button>
            <button onClick={() => document.getElementById('rewards')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neon-blue transition-colors">Rewards</button>
            <button onClick={() => document.getElementById('leaderboard')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neon-blue transition-colors">Masters</button>
            <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neon-blue transition-colors">FAQ</button>
            <button onClick={() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-neon-blue transition-colors">Support</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleAuth}
              className="text-sm font-display font-bold uppercase tracking-widest px-4 hover:text-neon-blue transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleAuth}
              className="bg-neon-blue text-black h-10 px-6 rounded font-display font-bold text-xs uppercase tracking-widest hover:bg-blue-glow transition-all shadow-[0_0_15px_rgba(0,163,255,0.2)]"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#00C2FF]/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-columns-[1.2fr_0.8fr] gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 mb-6">
              <Zap className="w-4 h-4 text-neon-blue" />
              <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-neon-blue">New Rewards Available</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter">
              PLAY. COMPLETE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-blue-glow to-neon-blue bg-[length:200%_auto] animate-gradient">EARN REAL</span> <br />
              REWARDS.
            </h1>
            
            <p className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed">
              The premium destination for gamers. Turn your passion into payouts. Completing high-value offers, challenges, and building your legacy has never been more rewarding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAuth}
                className="blue-button flex items-center justify-center gap-3"
              >
                Start Earning <ChevronRight className="w-5 h-5" />
              </button>
              <button className="h-14 px-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-display font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                Explore Offers
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F0F10] bg-bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-neon-blue text-neon-blue" />
                  ))}
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">
                  Trusted by <span className="text-white">100k+</span> Gamers Worldwide
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="aspect-[4/5] rounded-xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                  alt="Gaming"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-neon-blue/20 backdrop-blur-md rounded-lg border border-neon-blue/30">
                      <Gamepad2 className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold uppercase tracking-wider">Cyberpunk Challenge</h4>
                      <p className="text-[10px] text-white/60">Complete Act 1 to earn $50.00</p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-neon-blue shadow-[0_0_10px_#00A3FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Stat Widgets */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 glass-card neon-border min-w-[160px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-verified-green/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-verified-green" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase font-bold">Total Payouts</span>
                    <span className="text-lg font-display font-bold">$2.4M+</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -left-10 p-4 glass-card border-status-blue/30 shadow-[0_0_20px_rgba(0,194,255,0.1)]"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-status-blue" />
                  <span className="text-[10px] font-display font-bold uppercase tracking-widest">Anti-Fraud <br />Secure</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Ticker */}
      <div className="bg-bg-secondary border-y border-white/5 py-4 overflow-hidden mask-fade-edges relative z-10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-12">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-verified-green animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-white/40">USER_X7 COMPLETE OFFER <span className="text-neon-blue">+$12.50</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-verified-green animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-white/40">GAMER_PRO WITHDRAWAL <span className="text-verified-green">$45.00</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose XGamer Section */}
      <section id="rewards" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">The X-Gamer Edge</h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">Next-generation features built for the modern earner.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Instant Verification",
              desc: "Our AI-powered tracking verifies your completions in real-time. No more waiting days for your rewards.",
              color: "neon-blue"
            },
            {
              icon: ShieldCheck,
              title: "Trusted Security",
              desc: "Advanced anti-fraud systems protect your account and ensure advertiser-friendly compliance.",
              color: "status-blue"
            },
            {
              icon: Gift,
              title: "Premium Rewards",
              desc: "Withdraw via PayPal, Crypto, or high-value Gift Cards with industry-low minimums.",
              color: "verified-green"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="glass-card p-8 group overflow-hidden relative"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 bg-${feature.color}/10 border border-${feature.color}/20`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase font-display">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to Earn Section */}
      <section id="how-to-earn" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-neon-blue/5 blur-[120px] -z-10 rotate-12" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">The XGamer Cycle</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg">Your journey from player to pro-earner starts here.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 -z-10" />
            
            {[
              { step: "01", title: "Select Mission", desc: "Choose from hundreds of premium gaming and app offers tailored to your interest.", icon: Gamepad2 },
              { step: "02", title: "Complete Tasks", desc: "Follow the mission guidelines to complete levels, reach goals, or test new features.", icon: Zap },
              { step: "03", title: "Instant Payout", desc: "Once verified, rewards are instantly added to your X-Wallet for withdrawal.", icon: Wallet }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="w-20 h-20 bg-[#1A1C1F] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:border-neon-blue/50 transition-all duration-500 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-neon-blue text-black font-display font-black text-xs flex items-center justify-center rounded-lg rotate-12 group-hover:rotate-0 transition-transform">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 text-white/40 group-hover:text-neon-blue transition-colors" />
                </div>
                <h3 className="text-xl font-display font-black uppercase mb-4">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offers Preview */}
      <section id="offers" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Trending Missions</h2>
              <p className="text-white/40">Our algorithm selects the best value missions based on your region.</p>
            </div>
            <button className="group flex items-center gap-2 text-neon-blue font-display font-bold uppercase tracking-widest text-xs hover:text-blue-glow transition-colors">
              View All Offers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Raid Shadow Legends", reward: "$35.00", category: "Game", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400" },
              { title: "ExpressVPN Setup", reward: "$12.50", category: "App", img: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=400" },
              { title: "Genshin Impact Pro", reward: "$50.00", category: "Game", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400" },
              { title: "Premium Fintech App", reward: "$8.00", category: "Finance", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400" }
            ].map((offer, i) => (
              <div key={i} className="glass-card overflow-hidden group cursor-pointer hover:border-white/20 transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img src={offer.img} alt={offer.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {offer.category}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-display font-bold text-sm mb-4 line-clamp-1">{offer.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-neon-blue font-display font-bold text-lg">{offer.reward}</span>
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-neon-blue hover:text-black transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="leaderboard" className="py-20 bg-neon-blue">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
          <div>
            <span className="block text-black font-display font-black text-5xl mb-2">120K+</span>
            <span className="text-black/60 font-display font-bold uppercase tracking-widest text-xs">Active Gamers</span>
          </div>
          <div>
            <span className="block text-black font-display font-black text-5xl mb-2">$4.2M</span>
            <span className="text-black/60 font-display font-bold uppercase tracking-widest text-xs">Total Earned</span>
          </div>
          <div>
            <span className="block text-black font-display font-black text-5xl mb-2">850+</span>
            <span className="text-black/60 font-display font-bold uppercase tracking-widest text-xs">Active Offers</span>
          </div>
          <div>
            <span className="block text-black font-display font-black text-5xl mb-2">15</span>
            <span className="text-black/60 font-display font-bold uppercase tracking-widest text-xs">Payout Methods</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tight mb-16 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I earn money?", a: "Complete gaming challenges, app signups, and surveys from our curated list of high-paying offers." },
              { q: "What is the minimum withdrawal?", a: "You can withdraw as little as $1.00 via PayPal or Crypto once your funds are cleared." },
              { q: "How long does verification take?", a: "Most offers are verified instantly, but some high-value gaming missions may take up to 24 hours for manual review." },
              { q: "Is XGamer available worldwide?", a: "Yes, though the availability of specific offers depends on your region and country." }
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <h4 className="font-display font-bold uppercase tracking-wide mb-3 flex items-center justify-between">
                  {item.q}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
                </h4>
                <p className="text-sm text-white/40 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onLegalClick={setLegalType} onNavigate={onStart} />

      <AnimatePresence>
        {legalType && (
          <LegalModal type={legalType} onClose={() => setLegalType(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
