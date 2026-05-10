import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | 'cookie' | null;
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const content = {
    terms: {
      title: "Terms of Service",
      sections: [
        {
          h: "1. Acceptance of Terms",
          p: "By accessing XGamer, you agree to be bound by these Terms of Service. If you do not agree to all terms, do not use the service."
        },
        {
          h: "2. Eligibility",
          p: "You must be at least 13 years old to use this service. If you are under 18, you must have parental consent."
        },
        {
          h: "3. User Conduct",
          p: "The use of VPNs, Proxies, or any automated scripts is strictly prohibited. We reserve the right to ban any account found violating these rules without notice."
        },
        {
          h: "4. Earning & Withdrawals",
          p: "Points are earned by completing third-party offers. These points can be exchanged for rewards. We reserve the right to withhold rewards if fraud is suspected."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          h: "1. Data Collection",
          p: "We collect basic profile information (username, email) and transaction history related to offer completions."
        },
        {
          h: "2. Data Usage",
          p: "Your data is used to verify offer completions, prevent fraud, and process reward withdrawals."
        },
        {
          h: "3. Third-Party Sharing",
          p: "We share necessary data with offer wall providers to track completions. We do not sell your data to marketing agencies."
        },
        {
          h: "4. Security",
          p: "We use industry-standard encryption to protect your information and transaction history."
        }
      ]
    },
    cookie: {
      title: "Cookie Policy",
      sections: [
        {
          h: "1. Essential Cookies",
          p: "We use cookies to maintain your session and ensure the platform functions correctly."
        },
        {
          h: "2. Analytical Cookies",
          p: "We use basic analytics to understand how users interact with our site."
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F0F10]/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#1A1C1F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-display font-black uppercase tracking-tight">{activeContent.title}</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {activeContent.sections.map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-display font-bold uppercase tracking-widest text-neon-blue mb-3">{section.h}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{section.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Last Updated: May 2026</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
