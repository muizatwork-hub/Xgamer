import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const messages = [
  "Loading Rewards...",
  "Checking Secure Connection...",
  "Preparing Offers...",
  "Syncing User Data...",
  "Initializing Anti-Fraud...",
  "Loading Dashboard..."
];

export default function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0F10] overflow-hidden"
    >
      {/* Background Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-neon-orange rounded-full blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-neon-orange rounded-lg flex items-center justify-center rotate-45 border-2 border-orange-glow shadow-[0_0_20px_rgba(255,122,0,0.5)]">
              <span className="text-black font-display text-4xl -rotate-45 font-black">X</span>
            </div>
            <h1 className="text-4xl font-display font-black tracking-tighter">
              GAMER
            </h1>
          </div>
        </motion.div>

        {/* Circular Loader */}
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="rgba(255,122,0,0.1)"
              strokeWidth="4"
              fill="transparent"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="60"
              stroke="#FF7A00"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * progress) / 100}
              className="drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-display font-bold text-neon-orange">{progress}%</span>
          </div>
        </div>

        {/* Status Message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-white/60 font-medium tracking-widest uppercase text-xs"
          >
            {messages[currentMessage]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Particles Decorative */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: ["0%", "100%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-neon-orange rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
