import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShieldCheck, Clock, Zap, Loader2, CheckCircle2 } from 'lucide-react';

interface OfferModalProps {
  offer: {
    title: string;
    reward: string;
    type: string;
    difficulty: string;
    img: string;
    description?: string;
    requirements?: string[];
  } | null;
  onClose: () => void;
}

export default function OfferModal({ offer, onClose }: OfferModalProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!offer) return null;

  const handleClaim = () => {
    setIsClaiming(true);
    // Simulate starting the process
    setTimeout(() => {
      setIsClaiming(false);
      setIsCompleted(true);
      // In a real app, this might open an external link
      // window.open('https://offerwall-provider.com/offer-id', '_blank');
    }, 2000);
  };

  const defaultDescription = "Engage with this premium offer to earn high-value rewards. Complete the listed requirements carefully to ensure successful tracking and payout.";
  const defaultRequirements = [
    "Install and open the application",
    "Reach the specified milestone (Level 10+)",
    "New users only",
    "Do not use VPN or Proxy during completion"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0F0F10]/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#1A1C1F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Sidebar */}
          <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden">
            <img src={offer.img} alt={offer.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#1A1C1F] via-transparent to-transparent md:via-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-neon-blue text-black font-display font-black text-[10px] uppercase tracking-widest rounded-full">
                {offer.reward}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{offer.type}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-status-blue">{offer.difficulty}</span>
              </div>
              <h2 className="text-2xl font-display font-black uppercase tracking-tight italic text-white mb-4">{offer.title}</h2>
              <p className="text-white/40 text-sm leading-relaxed">
                {offer.description || defaultDescription}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="text-[10px] font-display font-bold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3 text-neon-blue" />
                  Claiming Process
                </h3>
                <div className="space-y-3">
                  {(offer.requirements || defaultRequirements).map((req, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white/40">{i + 1}</span>
                      </div>
                      <p className="text-xs text-white/50 leading-snug">{req}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-neon-blue/5 border border-neon-blue/10 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neon-blue uppercase tracking-widest leading-none mb-1">Instant Payout</h4>
                  <p className="text-[10px] text-white/40 uppercase font-medium">Verified by X-Guardian System</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                disabled={isClaiming || isCompleted}
                onClick={handleClaim}
                className={`flex-1 h-14 rounded-xl font-display font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${
                  isCompleted 
                    ? 'bg-verified-green/20 text-verified-green border border-verified-green/20 cursor-default' 
                    : 'bg-neon-blue text-black hover:bg-blue-glow shadow-[0_0_20px_rgba(0,163,255,0.2)]'
                }`}
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Initializing...
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Offer Started
                  </>
                ) : (
                  <>
                    Start Mission <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              {!isCompleted && !isClaiming && (
                <button
                  onClick={onClose}
                  className="px-8 h-14 bg-white/5 border border-white/10 rounded-xl font-display font-bold uppercase tracking-widest text-[10px] text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {isCompleted && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[10px] uppercase font-bold text-white/20 mt-4 tracking-tighter"
              >
                Follow the instructions to receive ${offer.reward} in your wallet.
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-7-7 7 7-7 7"/>
    </svg>
  );
}
