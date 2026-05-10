import React from 'react';
import { motion } from 'motion/react';
import { Users, ShieldCheck, Zap } from 'lucide-react';

interface FooterProps {
  onLegalClick: (type: 'terms' | 'privacy' | 'cookie') => void;
  onNavigate?: (tab: string) => void;
}

export default function Footer({ onLegalClick, onNavigate }: FooterProps) {
  const handleNav = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-neon-blue rounded flex items-center justify-center rotate-45 border border-blue-glow">
                <span className="text-black font-display text-xl -rotate-45 font-black">X</span>
              </div>
              <span className="text-xl font-display font-black tracking-tight tracking-widest uppercase">XGAMER</span>
            </div>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
              The premier destination for elite gamers to monetize their skills and achievements through real-world rewards.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'Discord', icon: Users, color: 'hover:text-[#5865F2]' },
                { name: 'Twitter', icon: Zap, color: 'hover:text-white' },
                { name: 'Telegram', icon: Zap, color: 'hover:text-[#0088cc]' },
                { name: 'Facebook', icon: Users, color: 'hover:text-[#1877F2]' },
                { name: 'TikTok', icon: Zap, color: 'hover:text-[#FE2C55]' },
                { name: 'WhatsApp', icon: Zap, color: 'hover:text-[#25D366]' }
              ].map((social, i) => (
                <div key={i} className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center ${social.color} hover:bg-white/10 transition-all cursor-pointer group`} title={social.name}>
                  <social.icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-display font-bold uppercase tracking-wider text-xs mb-8 text-white/60">Platform</h5>
            <ul className="space-y-4 text-sm text-white/40">
              <li onClick={() => handleNav('Referrals')} className="hover:text-white cursor-pointer transition-colors">Affiliate Program</li>
              <li onClick={() => handleNav('Offers')} className="hover:text-white cursor-pointer transition-colors">Offer Walls</li>
              <li onClick={() => handleNav('Wallet')} className="hover:text-white cursor-pointer transition-colors">Withdrawal Shop</li>
              <li onClick={() => handleNav('Leaderboard')} className="hover:text-white cursor-pointer transition-colors">Leaderboards</li>
            </ul>
          </div>

          <div>
            <h5 className="font-display font-bold uppercase tracking-wider text-xs mb-8 text-white/60">Legal & Support</h5>
            <ul className="space-y-4 text-sm text-white/40">
              <li onClick={() => onLegalClick('terms')} className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li onClick={() => onLegalClick('privacy')} className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li onClick={() => onLegalClick('cookie')} className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
              <li onClick={() => handleNav('Support')} className="hover:text-white cursor-pointer transition-colors">Support Center</li>
            </ul>
          </div>
        </div>

        <div className="p-8 border border-white/5 bg-white/[0.01] rounded-2xl mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h6 className="text-sm font-black uppercase tracking-tight mb-2">Audit Verified Platform</h6>
              <p className="text-xs text-white/40">XGamer undergoes regular security audits to ensure fair payouts and anti-fraud compliance.</p>
            </div>
            <div className="flex items-center gap-4 text-nowrap">
              <button 
                onClick={() => handleNav('Support')}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center"
              >
                Email Support
              </button>
              <button className="px-6 py-3 bg-neon-blue text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-glow transition-all">Join Discord</button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em]">
            © 2026 XGAMER TECH LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] text-white/20 uppercase font-bold tracking-widest">
            <span>Server Time: {new Date().toLocaleTimeString()}</span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
