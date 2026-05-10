import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, Wallet, Zap, Users, Trophy, Settings, LogOut, 
  Bell, ChevronUp, Clock, ShieldCheck, AlertTriangle, 
  CheckCircle2, TrendingUp, Filter, Search, Award, Menu, X,
  MessageSquare, Send, MessageCircle, Music, Facebook, Twitter, User, Mail
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';
import Footer from './Footer';
import LegalModal from './LegalModal';
import OfferModal from './OfferModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Offers');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | 'cookie' | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const { profile, logout, isAdmin, updateProfile } = useSupabaseAuth();
  const trustScore = profile?.trustScore || 80;
  const isVpnDetected = profile?.isVpnDetected || false;

  const getWithdrawalLimits = (score: number) => {
    if (score < 50) return { daily: 5, weekly: 20, monthly: 50 };
    if (score < 80) return { daily: 25, weekly: 100, monthly: 300 };
    return { daily: 100, weekly: 500, monthly: 2000 };
  };

  const limits = getWithdrawalLimits(trustScore);

  const resetLimitsIfExpired = async () => {
    if (!profile || !profile.lastWithdrawalAt) return;
    
    const last = new Date(profile.lastWithdrawalAt);
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    
    const updates: any = {};
    
    // Check daily (24h)
    if (diffMs > 86400000) {
      updates.dailyWithdrawn = 0;
    }
    
    // Check weekly (7d)
    if (diffMs > 604800000) {
      updates.weeklyWithdrawn = 0;
    }
    
    // Check monthly (30d)
    if (diffMs > 2592000000) {
      updates.monthlyWithdrawn = 0;
    }
    
    if (Object.keys(updates).length > 0) {
      await updateProfile(updates);
    }
  };

  useEffect(() => {
    if (activeTab === 'Wallet') {
      resetLimitsIfExpired();
    }
  }, [activeTab]);

  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => setIsTabLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.hash = '';
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleAdminPanel = () => {
    window.location.hash = 'admin';
  };

  const chartData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 85 },
    { name: 'Thu', value: 65 },
    { name: 'Fri', value: 120 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 150 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Offers': {
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Balance', value: `$${profile?.balance.toFixed(2) || '0.00'}`, icon: Wallet, delta: '+0%', color: 'verified-green' },
                { label: 'XP Level', value: `Level ${profile?.level || 1}`, icon: Award, delta: `XP ${profile?.xp || 0}`, color: 'status-blue' },
                { label: 'Daily Streak', value: `${profile?.streak || 0} Days`, icon: Zap, delta: 'Keep going!', color: 'neon-blue' },
                { label: 'Trust Status', value: profile?.isVerified ? 'Verified' : 'Unverified', icon: ShieldCheck, delta: `${profile?.trustScore || 80}%`, color: profile?.isVerified ? 'verified-green' : 'white/40' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 bg-white/5 rounded-lg`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color.includes('/') ? 'white/60' : stat.color}`} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${stat.color.includes('/') ? 'text-white/40' : (stat.color.startsWith('verified') ? 'text-verified-green' : (stat.color.startsWith('status') ? 'text-status-blue' : (stat.color.startsWith('neon') ? 'text-neon-blue' : 'text-white/40')))}`}>{stat.delta}</span>
                  </div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-display font-bold tracking-tight">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-black uppercase tracking-tight">Premium Missions</h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"><Filter className="w-4 h-4" /></button>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-neon-blue p-2">View All</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Cyberpunk 2077 Challenge', reward: '$50.00', type: 'Gaming', difficulty: 'Hard', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200' },
                    { title: 'Premium Fintech Signup', reward: '$12.50', type: 'Finance', difficulty: 'Easy', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=200' },
                    { title: 'Market Sentiment Survey', reward: '$0.85', type: 'Survey', difficulty: 'Instant', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200' },
                    { title: 'Watch Reward Ad', reward: '$0.05', type: 'Video', difficulty: 'Auto', img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=200' }
                  ].map((offer, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      onClick={() => setSelectedOffer(offer)}
                      className="glass-card p-4 flex items-center gap-6 group cursor-pointer hover:bg-white/[0.02]"
                    >
                      <img src={offer.img} alt="" className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{offer.type}</span>
                          <span className="text-white/10 text-[xs]">•</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-status-blue">{offer.difficulty}</span>
                        </div>
                        <h4 className="font-display font-bold text-sm tracking-tight">{offer.title}</h4>
                      </div>
                      <div className="text-right">
                        <span className="block text-neon-blue font-display font-bold text-lg leading-none mb-1">{offer.reward}</span>
                        <span className="text-[10px] font-bold uppercase text-white/20">Approx. 10m</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-6">Activity Peak</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Tooltip 
                          cursor={{ fill: 'rgba(0,163,255,0.05)' }} 
                          contentStyle={{ backgroundColor: '#1A1C1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          labelStyle={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '10px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 4 ? '#00A3FF' : 'rgba(255,255,255,0.1)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-6">Achievements</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border border-dashed border-white/10 ${i <= 3 ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue shadow-[0_0_10px_rgba(0,163,255,0.1)] transition-all transform hover:scale-110' : 'text-white/10 hover:border-white/20'}`}>
                        {i === 1 && <Zap className="w-5 h-5" />}
                        {i === 2 && <Trophy className="w-5 h-5" />}
                        {i === 3 && <Award className="w-5 h-5" />}
                        {i > 3 && <span className="text-[10px] font-bold">LOCKED</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'Daily Bonus': {
        const rewards = [0.10, 0.15, 0.20, 0.30, 0.40, 0.60, 1.00];
        const currentStreak = profile?.claimStreak || 0;
        const lastClaimed = profile?.lastClaimedAt;
        const now = new Date();
        const canClaim = !lastClaimed || now.toDateString() !== new Date(lastClaimed).toDateString();
        const needsTaskToReset = currentStreak >= 7;

        const handleClaimBonus = async () => {
          if (!canClaim || !profile) return;

          // Check for broken streak (missed more than 48h)
          const isStreakBroken = lastClaimed && (now.getTime() - new Date(lastClaimed).getTime()) > 172800000;
          
          if (isStreakBroken) {
            try {
              await updateProfile({
                claimStreak: 0
              });
              setWithdrawError("Streak Broken: You missed a day. Process reset to Day 1.");
            } catch (err) {
              setWithdrawError("Failed to reset streak.");
            }
            setTimeout(() => setWithdrawError(null), 5000);
            return;
          }

          if (needsTaskToReset) {
             if ((profile.balance || 0) < 2) {
                setWithdrawError("Requirement: Complete a $2.00 mission to unlock next 7-day cycle.");
                setTimeout(() => setWithdrawError(null), 5000);
                return;
             }
             
             try {
               await updateProfile({
                 claimStreak: 0
               });
               setWithdrawSuccess("Next cycle unlocked! Claim your Day 1 reward now.");
               setTimeout(() => setWithdrawSuccess(null), 5000);
             } catch (err) {
               setWithdrawError("Unlock failed. Try again.");
             }
             return;
          }

          const reward = rewards[currentStreak] || 0;
          const currentBalance = Number(profile.balance || 0);
          const newBalance = Number((currentBalance + reward).toFixed(2));

          try {
            await updateProfile({
              balance: newBalance,
              claimStreak: currentStreak + 1,
              lastClaimedAt: now.toISOString()
            });
            setWithdrawSuccess(`Success! $${reward.toFixed(2)} added to your dashboard balance.`);
            setTimeout(() => setWithdrawSuccess(null), 5000);
          } catch (err) {
            setWithdrawError("Connection error. Claim failed.");
            setTimeout(() => setWithdrawError(null), 5000);
          }
        };
        
        return (
          <div className="space-y-8">
            <div className="glass-card p-10 bg-gradient-to-br from-neon-blue/10 via-transparent to-transparent">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div>
                  <h3 className="text-3xl font-display font-black italic uppercase tracking-tight mb-2">Daily Reward Drop</h3>
                  <p className="text-white/40 text-sm max-w-lg">Claim your daily legacy bonus. Maintain your streak to maximize earnings. Every 7 days, a high-value task ($2.00+) is required to verify your activity.</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Current Streak</div>
                  <div className="text-4xl font-display font-black text-neon-blue italic">{currentStreak} Days</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
                {rewards.map((reward, i) => {
                  const isClaimed = i < currentStreak;
                  const isCurrent = i === currentStreak;
                  const isLocked = i > currentStreak;
                  
                  return (
                    <motion.div
                      key={i}
                      whileHover={isCurrent ? { scale: 1.05, y: -5 } : {}}
                      className={`relative p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-3 ${
                        isClaimed 
                          ? 'bg-verified-green/5 border-verified-green/20' 
                          : isCurrent 
                            ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_20px_rgba(0,163,255,0.2)]' 
                            : 'bg-white/5 border-white/5 opacity-40'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Day {i + 1}</span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isClaimed ? 'bg-verified-green text-black' : isCurrent ? 'bg-neon-blue text-black' : 'bg-white/10 text-white/20'}`}>
                        {isClaimed ? <CheckCircle2 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <span className={`text-sm font-display font-black ${isClaimed ? 'text-verified-green' : isCurrent ? 'text-white' : 'text-white/20'}`}>${reward.toFixed(2)}</span>
                      
                      {isClaimed && (
                        <div className="absolute top-2 right-2">
                           <div className="w-4 h-4 bg-verified-green rounded-full flex items-center justify-center">
                             <CheckCircle2 className="w-3 h-3 text-black" />
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5">
                {canClaim ? (
                  <button 
                    onClick={handleClaimBonus}
                    className="px-12 py-5 bg-neon-blue text-black rounded-xl font-display font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-glow shadow-[0_0_30px_rgba(0,163,255,0.3)] transition-all transform hover:scale-105 active:scale-95"
                  >
                    {needsTaskToReset ? "Complete $2 Task to Reset" : `Claim Day ${currentStreak + 1} Reward`}
                  </button>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 text-white/20">
                      <Clock className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">Next Claim Available in 14:22:05</span>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-white/10 italic">Rewards reset at 00:00 UTC</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-8 border-l-4 border-l-neon-blue">
                <div className="flex items-center gap-4 mb-6 text-neon-blue">
                  <ShieldCheck className="w-6 h-6" />
                  <h4 className="text-lg font-display font-bold uppercase tracking-tight">Requirement Logic</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-white/40 font-bold text-xs">1</div>
                    <p className="text-xs text-white/50 leading-relaxed">Claims must be made consecutively. Missing a day resets your streak to Day 1.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-white/40 font-bold text-xs">2</div>
                    <p className="text-xs text-neon-blue font-bold leading-relaxed">After completing a 7-day cycle, you MUST complete at least one mission worth $2.00 or more to unlock the next 7-day reward sequence.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center shrink-0 text-white/40 font-bold text-xs">3</div>
                    <p className="text-xs text-white/50 leading-relaxed">VPN and Proxy usage during claims will result in instant streak termination and manual review.</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h4 className="text-xs font-display font-bold uppercase tracking-widest text-white/40 mb-6">Upcoming High-Value Missions</h4>
                <div className="space-y-4">
                  {[
                    { title: 'Premium Crypto Exchange KYC', reward: '$5.50', time: '15 Min' },
                    { title: 'Mobile Strategy Level 25', reward: '$18.00', time: '5 Days' }
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <h5 className="text-sm font-bold tracking-tight mb-1">{task.title}</h5>
                        <div className="flex items-center gap-2">
                           <Clock className="w-3 h-3 text-white/20" />
                           <span className="text-[10px] font-bold text-white/20 uppercase">{task.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-verified-green font-display font-bold text-lg">{task.reward}</span>
                        <span className="text-[10px] font-black uppercase text-white/20">Unlocked</span>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveTab('Offers')}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-dashed border-white/10 rounded-xl mt-2"
                  >
                    View All Requirements
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'Active Missions': {
        return (
          <div className="space-y-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-display font-black uppercase tracking-tight">Active Missions</h3>
                <span className="px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-[10px] font-black uppercase">3 Missions Running</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Cyberpunk 2077 Challenge', reward: '$50.00', progress: 65, time: '2d 4h left', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200' },
                  { title: 'Premium Fintech Signup', reward: '$12.50', progress: 20, time: '6d 12h left', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=200' },
                  { title: 'Candy Crush Mission', reward: '$1.50', progress: 90, time: '14h left', img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=200' }
                ].map((mission, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                        <img src={mission.img} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-display font-bold tracking-tight mb-1">{mission.title}</h4>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-white/30" />
                                <span className="text-[10px] font-bold uppercase text-white/30">{mission.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3 h-3 text-verified-green" />
                                <span className="text-[10px] font-bold uppercase text-verified-green">Tracking Verified</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left md:text-right">
                             <span className="block text-2xl font-display font-black italic text-neon-blue">${mission.reward}</span>
                             <span className="text-[10px] uppercase font-bold text-white/20">Pending Reward</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Global Progress</span>
                             <span className="text-[10px] uppercase font-bold text-neon-blue">{mission.progress}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${mission.progress}%` }}
                              className="h-full bg-neon-blue shadow-[0_0_10px_#00A3FF]"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                           <button className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-colors">Abort Mission</button>
                           <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10">Resume Progress</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border border-white/5 bg-neon-blue/[0.02] rounded-2xl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-neon-blue" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight mb-1">Tracking Policy</h4>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Missions are tracked using device unique identifiers. Clearing browser cache or using "Incognito" mode may break tracking and prevent payouts. 
                    If a mission isn't updating, please wait up to 24 hours or contact support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'Wallet': {
        const now = new Date();
        const lastWithdrawal = profile?.lastWithdrawalAt ? new Date(profile.lastWithdrawalAt) : null;
        const diffMs = lastWithdrawal ? now.getTime() - lastWithdrawal.getTime() : Infinity;

        const effectiveDaily = diffMs > 86400000 ? 0 : (profile?.dailyWithdrawn || 0);
        const effectiveWeekly = diffMs > 604800000 ? 0 : (profile?.weeklyWithdrawn || 0);
        const effectiveMonthly = diffMs > 2592000000 ? 0 : (profile?.monthlyWithdrawn || 0);

        const handleWithdraw = async () => {
          setWithdrawError(null);
          setWithdrawSuccess(null);
          
          const amount = parseFloat(withdrawAmount);
          if (isNaN(amount) || amount <= 0) {
             setWithdrawError("Please enter a valid amount to withdraw.");
             return;
          }

          if (amount < 5) {
            setWithdrawError("Minimum withdrawal amount is $5.00. Earn more to cash out.");
            return;
          }

          if (amount > (profile?.balance || 0)) {
            setWithdrawError("Insufficient balance for this withdrawal.");
            return;
          }

          if (!withdrawalAddress) {
            setWithdrawError("Please enter a valid withdrawal address.");
            return;
          }

          const currentDaily = effectiveDaily;
          const currentWeekly = effectiveWeekly;
          const currentMonthly = effectiveMonthly;

          const dailyRemaining = limits.daily - currentDaily;
          const weeklyRemaining = limits.weekly - currentWeekly;
          const monthlyRemaining = limits.monthly - currentMonthly;

          if (amount > dailyRemaining) {
            setWithdrawError(`Daily limit exceeded. You can withdraw $${dailyRemaining.toFixed(2)} more today. Your daily limit is $${limits.daily.toFixed(0)} based on your ${trustScore}% Trust Score.`);
            return;
          }
          if (amount > weeklyRemaining) {
            setWithdrawError(`Weekly limit exceeded. You can withdraw $${weeklyRemaining.toFixed(2)} more this week. Your weekly limit is $${limits.weekly.toFixed(0)} based on your ${trustScore}% Trust Score.`);
            return;
          }
          if (amount > monthlyRemaining) {
            setWithdrawError(`Monthly limit exceeded. You can withdraw $${monthlyRemaining.toFixed(2)} more this month. Your monthly limit is $${limits.monthly.toFixed(0)} based on your ${trustScore}% Trust Score.`);
            return;
          }

          try {
            await updateProfile({
              balance: (profile?.balance || 0) - amount,
              dailyWithdrawn: currentDaily + amount,
              weeklyWithdrawn: currentWeekly + amount,
              monthlyWithdrawn: currentMonthly + amount,
              lastWithdrawalAt: now.toISOString()
            });
            setWithdrawSuccess(`Success! Withdrawal request for $${amount.toFixed(2)} has been submitted. Payout typicall takes 24-48 hours.`);
            setWithdrawAmount('');
          } catch (err) {
            setWithdrawError("Withdrawal failed due to a system error. Please try again later.");
          }
        };

        return (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-8 bg-gradient-to-br from-neon-blue/10 via-transparent to-transparent">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">Withdrawable Balance</span>
                      <motion.h4 
                        key={profile?.balance}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-display font-black italic"
                      >
                        ${profile?.balance.toFixed(2) || '0.00'}
                      </motion.h4>
                    </div>
                    <div className="bg-neon-blue text-black p-3 rounded-xl hover:rotate-12 transition-transform cursor-pointer">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Withdrawal Amount ($)</label>
                        <input 
                          type="number" 
                          placeholder="Min: $5.00" 
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full h-14 bg-[#0F0F10] border border-white/10 rounded-xl px-6 text-sm focus:outline-none focus:border-neon-blue transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Payment Destination</label>
                        <input 
                          type="text" 
                          placeholder="Email or Wallet Address" 
                          value={withdrawalAddress}
                          onChange={(e) => setWithdrawalAddress(e.target.value)}
                          className="w-full h-14 bg-[#0F0F10] border border-white/10 rounded-xl px-6 text-sm focus:outline-none focus:border-neon-blue transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-white/20 uppercase font-bold italic ml-1">Ensure your details are correct. All transactions are screened for security.</p>

                    <div className="space-y-4">
                      <button 
                        onClick={handleWithdraw}
                        className="w-full h-14 bg-neon-blue text-black rounded-xl font-display font-bold uppercase tracking-widest text-xs hover:bg-blue-glow transition-all"
                      >
                        Initiate Withdrawal
                      </button>

                      <AnimatePresence>
                        {withdrawError && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-warning-red/10 border border-warning-red/20 rounded-xl flex items-center gap-3"
                          >
                            <AlertTriangle className="w-4 h-4 text-warning-red shrink-0" />
                            <span className="text-[10px] font-bold uppercase text-warning-red">{withdrawError}</span>
                          </motion.div>
                        )}
                        {withdrawSuccess && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-verified-green/10 border border-verified-green/20 rounded-xl flex items-center gap-3"
                          >
                            <CheckCircle2 className="w-4 h-4 text-verified-green shrink-0" />
                            <span className="text-[10px] font-bold uppercase text-verified-green">{withdrawSuccess}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-6">Withdrawal Limits</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-white/40">Daily Limit</span>
                        <span className="text-neon-blue">${Number(effectiveDaily).toFixed(2)} / ${limits.daily.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (effectiveDaily / limits.daily) * 100)}%` }}
                          className="h-full bg-neon-blue"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-white/40">Weekly Limit</span>
                        <span className="text-status-blue">${Number(effectiveWeekly).toFixed(2)} / ${limits.weekly.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (effectiveWeekly / limits.weekly) * 100)}%` }}
                          className="h-full bg-status-blue"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-white/40">Monthly Limit</span>
                        <span className="text-white/60">${Number(effectiveMonthly).toFixed(2)} / ${limits.monthly.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (effectiveMonthly / limits.monthly) * 100)}%` }}
                          className="h-full bg-white/20"
                        />
                      </div>
                    </div>
                    
                    <p className="text-[8px] text-white/20 uppercase font-bold text-center italic">Limits are based on your Trust Score ({trustScore}%)</p>
                  </div>
                </div>

                <div className="glass-card p-8">
                  <h3 className="font-display font-black uppercase tracking-tight mb-8">Withdrawal Methods</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'PayPal', fee: '2%', time: 'Instant' },
                      { name: 'Bitcoin', fee: '0%', time: '24 Hours' },
                      { name: 'Ethereum', fee: '0.5%', time: '1 Hour' },
                      { name: 'Gift Card', fee: '0%', time: 'Instant' }
                    ].map((method, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all cursor-pointer group text-center">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                          <Wallet className="w-5 h-5 text-neon-blue" />
                        </div>
                        <h4 className="text-sm font-bold mb-1">{method.name}</h4>
                        <span className="text-[8px] uppercase font-bold text-white/30 block mb-1">Fee: {method.fee}</span>
                        <span className="text-[8px] uppercase font-bold text-verified-green">{method.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-4">Cashout Progress</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] uppercase font-bold text-white/30">Next Goal: $5.00</span>
                      <span className="text-[10px] uppercase font-bold text-neon-blue">{Math.min(100, ((profile?.balance || 0) / 5) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((profile?.balance || 0) / 5) * 100)}%` }}
                        className="h-full bg-neon-blue shadow-[0_0_10px_#00A3FF]"
                      />
                    </div>
                    <p className="text-[8px] text-white/20 uppercase font-bold text-center italic">Earn ${(5 - (profile?.balance || 0) > 0 ? 5 - (profile?.balance || 0) : 0).toFixed(2)} more for your next reward</p>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-4">Account Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Total Earned</span>
                      <span className="text-sm font-display font-bold text-verified-green">${profile?.balance.toFixed(3) || '0.000'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Total Withdrawn</span>
                      <span className="text-sm font-display font-bold text-dark-blue">$0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'Referrals': {
        const referralCode = profile?.referralCode || profile?.username?.toUpperCase() || 'XG-REFER';
        
        const copyToClipboard = (text: string) => {
          navigator.clipboard.writeText(text);
          setWithdrawSuccess("Copied to clipboard!");
          setTimeout(() => setWithdrawSuccess(null), 3000);
        };

        return (
          <div className="space-y-8">
            <div className="glass-card p-10 bg-gradient-to-br from-neon-blue/20 to-transparent relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-4xl font-display font-black italic mb-4 uppercase leading-none">Multiply Your Legacy</h3>
                <p className="text-white/50 text-lg max-w-md mb-8">Earn a <span className="text-neon-blue font-bold">15% lifetime commission</span> from every offer your referrals complete.</p>
                
                <div className="grid md:grid-cols-2 gap-8 items-end">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Your Referral Code</label>
                    <div className="flex gap-2">
                      <div className="flex-1 h-14 bg-black/40 border border-white/10 rounded-xl flex items-center px-6 text-xl font-display font-bold text-neon-blue tracking-widest uppercase">
                        {referralCode}
                      </div>
                      <button 
                        onClick={() => copyToClipboard(referralCode)}
                        className="h-14 px-8 bg-neon-blue text-black rounded-xl font-display font-black uppercase tracking-widest text-[10px] hover:bg-blue-glow transition-all active:scale-95"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Referral Link</label>
                    <div className="flex gap-2">
                       <div className="flex-1 h-14 bg-black/40 border border-white/10 rounded-xl flex items-center px-6 text-[10px] font-mono text-white/40 truncate">
                         xgamer.com/join?ref={referralCode}
                       </div>
                       <button 
                        onClick={() => copyToClipboard(`https://xgamer.com/join?ref=${referralCode}`)}
                        className="h-14 w-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                       >
                         <Send className="w-4 h-4 text-white/60" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 blur-[80px] -z-0" />
              <div className="absolute -bottom-20 -right-20 w-80 h-80 border-8 border-white/[0.02] rounded-full -z-0" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Total Referrals', value: '12', icon: Users, color: 'neon-blue' },
                { label: 'Network XP', value: '45,200', icon: Award, color: 'status-blue' },
                { label: 'Total Commission', value: '$128.50', icon: Wallet, color: 'verified-green' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                  <h4 className="text-2xl font-display font-bold tracking-tight">{stat.value}</h4>
                </div>
              ))}
            </div>

            <div className="glass-card p-8">
               <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-8">Active Referral Network</h3>
               <div className="space-y-4">
                 {[
                   { name: 'PlayerOne', earned: '$45.20', commission: '$6.78', status: 'Active' },
                   { name: 'X_Ghost', earned: '$12.00', commission: '$1.80', status: 'Idle' },
                   { name: 'GamerGirl99', earned: '$89.50', commission: '$13.43', status: 'Active' }
                 ].map((ref, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                         <User className="w-4 h-4 text-white/40" />
                       </div>
                       <div>
                         <h5 className="text-sm font-bold">{ref.name}</h5>
                         <span className={`text-[8px] font-black uppercase ${ref.status === 'Active' ? 'text-verified-green' : 'text-white/20'}`}>{ref.status}</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="block text-xs font-bold text-white/40">Total Earned: {ref.earned}</span>
                       <span className="text-[10px] font-black italic text-neon-blue">Your Cut: {ref.commission}</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );
      }
      case 'Leaderboard': {
        return (
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-display font-black uppercase tracking-tight italic mb-8">GLOBAL MASTERS</h3>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'CyberDemon', xp: '1.2M', level: 85 },
                  { rank: 2, name: 'NeonKnight', xp: '980K', level: 78 },
                  { rank: 3, name: 'VibeCheck', xp: '850K', level: 72 },
                  { rank: 4, name: 'ShadowEdge', xp: '720K', level: 65 },
                  { rank: 5, name: 'PixelPaladin', xp: '680K', level: 62 },
                  { rank: 6, name: 'GlitchHacker', xp: '540K', level: 58 },
                  { rank: 7, name: 'ApexTitan', xp: '490K', level: 52 },
                  { rank: 8, name: 'RogueZero', xp: '420K', level: 48 },
                  { rank: 9, name: 'Ghost_Shell', xp: '380K', level: 45 },
                  { rank: 10, name: 'SynthLord', xp: '310K', level: 42 }
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-xl border bg-white/[0.02] border-white/5">
                    <div className="w-8 font-display font-black text-xl italic text-white/20">#{user.rank}</div>
                    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt=""/></div>
                    <div className="flex-1">
                      <h4 className="font-display font-bold tracking-tight">{user.name}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Level {user.level}</span>
                    </div>
                    <div className="text-right"><span className="block font-display font-black text-lg text-white/80">{user.xp} XP</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'Transactions': {
        const transactions = [
          { id: 'XG-9281', title: 'Cyberpunk Challenge', amount: '$50.00', status: 'Completed', date: 'Oct 24, 2023', type: 'Earning' },
          { id: 'XG-9280', title: 'Daily Streak Bonus', amount: '$1.00', status: 'Completed', date: 'Oct 24, 2023', type: 'Bonus' },
          { id: 'XG-9279', title: 'PayPal Withdrawal', amount: '-$15.00', status: 'Pending', date: 'Oct 23, 2023', type: 'Withdrawal' },
          { id: 'XG-9278', title: 'Achievement: Level 5', amount: '$5.00', status: 'Completed', date: 'Oct 22, 2023', type: 'Bonus' },
        ];

        return (
          <div className="space-y-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-display font-black uppercase tracking-tight">Financial Records</h3>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">Export CSV</button>
                   <button className="px-4 py-2 bg-neon-blue rounded-lg text-[10px] font-bold uppercase tracking-widest text-black">Filter by Type</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4">Transaction ID</th>
                      <th className="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4">Description</th>
                      <th className="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4">Amount</th>
                      <th className="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4">Status</th>
                      <th className="pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-5 px-4 text-xs font-mono text-white/40 group-hover:text-white transition-colors">{tx.id}</td>
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5`}>
                               {tx.type === 'Withdrawal' ? <Wallet className="w-4 h-4 text-warning-red" /> : <Zap className="w-4 h-4 text-neon-blue" />}
                             </div>
                             <span className="text-sm font-bold tracking-tight">{tx.title}</span>
                          </div>
                        </td>
                        <td className={`py-5 px-4 text-sm font-display font-bold ${tx.amount.startsWith('-') ? 'text-warning-red' : 'text-verified-green'}`}>
                          {tx.amount}
                        </td>
                        <td className="py-5 px-4">
                          <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${tx.status === 'Completed' ? 'bg-verified-green/10 text-verified-green' : 'bg-status-blue/10 text-status-blue animate-pulse'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-[10px] font-bold text-white/20 uppercase">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex justify-center">
                 <button className="text-[10px] font-black uppercase text-white/20 hover:text-white transition-colors py-4">Load Older Records</button>
              </div>
            </div>
          </div>
        );
      }
      case 'Notifications': {
        return (
          <div className="space-y-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-display font-bold uppercase tracking-widest text-white/40">Alerts & Messaging</h3>
                <button className="text-[10px] font-black uppercase text-neon-blue hover:text-blue-glow transition-colors">Mark all read</button>
              </div>
              <div className="space-y-4">
                {[
                  { title: "System Verified", body: "Your Trust Score has increased by 15% after your recent mission completion.", type: "system", time: "10m ago" },
                  { title: "Withdrawal Successful", body: "Your withdrawal request #XG-8291 has been processed via PayPal.", type: "wallet", time: "2h ago" },
                  { title: "New Milestone", body: "You have reached Level 10! Check your achievements to claim your bonus XP.", type: "achievement", time: "5h ago" }
                ].map((note, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                       <h4 className="text-sm font-bold uppercase tracking-tight group-hover:text-neon-blue transition-colors">{note.title}</h4>
                       <span className="text-[10px] font-bold text-white/20 uppercase">{note.time}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{note.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'Settings': {
        return (
          <div className="space-y-8 max-w-4xl pb-20">
            <div className="glass-card p-8">
              <h3 className="text-xs font-display font-bold uppercase tracking-widest text-white/40 mb-8 border-b border-white/5 pb-4">Personal Configuration</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Display Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" 
                        defaultValue={profile?.username} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all font-bold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 ml-1">Email Connection</label>
                    <div className="relative opacity-60">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="email" 
                        readOnly
                        defaultValue={profile?.email} 
                        className="w-full bg-black/20 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none cursor-not-allowed" 
                      />
                    </div>
                    <p className="text-[8px] text-white/20 uppercase font-black italic ml-1">Connected via Supabase Auth</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden mb-4 border-2 border-neon-blue/20 p-1">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button className="text-[10px] font-black uppercase text-neon-blue hover:text-white transition-colors">Rotate Avatar Seed</button>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-10 border-t border-white/5 flex gap-4">
                <button className="h-14 px-10 bg-neon-blue text-black font-display font-black uppercase tracking-widest text-xs rounded-xl hover:bg-blue-glow transition-all">Save Changes</button>
                <button className="h-14 px-10 bg-white/5 text-white/40 font-display font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all">Cancel</button>
              </div>
            </div>

            <div className="glass-card p-8 border-l-4 border-l-warning-red">
               <h3 className="text-xs font-display font-bold uppercase tracking-widest text-warning-red mb-6">Danger District</h3>
               <p className="text-xs text-white/40 mb-6 leading-relaxed">Once you delete your account, there is no going back. All earned legacy points (XP), balance, and streak progress will be permanently erased from the network.</p>
               <button className="h-14 px-10 bg-warning-red/10 border border-warning-red/20 text-warning-red font-display font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-warning-red hover:text-white transition-all">Initiate Account Termination</button>
            </div>
          </div>
        );
      }
      case 'Support': {
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h3 className="text-lg font-display font-black uppercase tracking-tight mb-6">Contact Us</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-tight">Email Support</h4>
                      <p className="text-[10px] text-white/40">Response within 24 hours</p>
                      <a href="mailto:support@xgamer.com" className="text-xs text-neon-blue hover:underline">support@xgamer.com</a>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <h4 className="text-sm font-bold uppercase tracking-tight mb-4">Live Social Connect</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Discord', icon: MessageSquare, color: 'text-[#5865F2]' },
                        { name: 'Telegram', icon: Send, color: 'text-[#0088cc]' },
                        { name: 'X (Twitter)', icon: Twitter, color: 'text-white' },
                        { name: 'WhatsApp', icon: MessageCircle, color: 'text-[#25D366]' },
                        { name: 'TikTok', icon: Music, color: 'text-[#FE2C55]' },
                        { name: 'Facebook', icon: Facebook, color: 'text-[#1877F2]' }
                      ].map((social) => (
                        <button key={social.name} className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all gap-2 border border-white/5">
                          <social.icon className={`w-5 h-5 ${social.color}`} />
                          <span className="text-[8px] font-bold uppercase tracking-tighter text-white/40">{social.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-lg font-display font-black uppercase tracking-tight mb-6">Common Issues</h3>
                <div className="space-y-4">
                  {[
                    "Why is my offer still pending?",
                    "Minimum withdrawal requirements",
                    "Trust scores and verification",
                    "Referral commissions tracking",
                    "VPN & Proxy policy details"
                  ].map((faq, i) => (
                    <button key={i} className="w-full p-4 text-left bg-white/5 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/[0.08] transition-all flex items-center justify-between group">
                      <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{faq}</span>
                      <ChevronUp className="w-4 h-4 rotate-90 text-white/20" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0F0F10] text-[#F5F5F5] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[#0F0F10] border-r border-white/5 z-50 flex flex-col md:hidden"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-neon-blue rounded flex items-center justify-center rotate-45 border border-blue-glow">
                    <span className="text-black font-display text-xl -rotate-45 font-black">X</span>
                  </div>
                  <span className="text-xl font-display font-black tracking-widest">XGAMER</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/40 hover:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2 pt-4">
                {[
                  { name: 'Offers', icon: Gamepad2 },
                  { name: 'Daily Bonus', icon: Zap },
                  { name: 'Active Missions', icon: Zap },
                  { name: 'Wallet', icon: Wallet },
                  { name: 'Referrals', icon: Users },
                  { name: 'Leaderboard', icon: Trophy },
                  { name: 'Transactions', icon: TrendingUp },
                  { name: 'Notifications', icon: Bell },
                  { name: 'Support', icon: Users },
                  { name: 'Settings', icon: Settings }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveTab(item.name);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      activeTab === item.name 
                        ? 'bg-neon-blue text-black font-bold font-display uppercase tracking-widest text-xs' 
                        : 'text-white/40 hover:bg-white/5 hover:text-white font-display uppercase tracking-widest text-xs'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="p-4 space-y-4">
                {isAdmin && (
                  <button 
                    onClick={handleAdminPanel}
                    className="w-full flex items-center gap-4 px-4 py-3 bg-status-blue/10 text-status-blue border border-status-blue/20 rounded-xl hover:bg-status-blue/20 transition-all font-display uppercase tracking-widest text-[10px] font-black"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 text-white/40 hover:text-warning-red transition-all font-display uppercase tracking-widest text-xs"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0F0F10] flex flex-col hidden md:flex shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-blue rounded flex items-center justify-center rotate-45 border border-blue-glow">
              <span className="text-black font-display text-xl -rotate-45 font-black">X</span>
            </div>
            <span className="text-xl font-display font-black tracking-tight tracking-widest">XGAMER</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 pt-4">
          {[
            { name: 'Offers', icon: Gamepad2 },
            { name: 'Daily Bonus', icon: Zap },
            { name: 'Active Missions', icon: Zap },
            { name: 'Wallet', icon: Wallet },
            { name: 'Referrals', icon: Users },
            { name: 'Leaderboard', icon: Trophy },
            { name: 'Transactions', icon: TrendingUp },
            { name: 'Notifications', icon: Bell },
            { name: 'Support', icon: Users },
            { name: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.name 
                  ? 'bg-neon-blue text-black font-bold font-display uppercase tracking-widest text-xs' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white font-display uppercase tracking-widest text-xs'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {activeTab === item.name && (
                <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          {isAdmin && (
            <button 
              onClick={handleAdminPanel}
              className="w-full flex items-center gap-4 px-4 py-3 bg-status-blue/10 text-status-blue border border-status-blue/20 rounded-xl hover:bg-status-blue/20 transition-all font-display uppercase tracking-widest text-[10px] font-black"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          )}

          <div className="glass-card p-4 neon-border bg-neon-blue/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Trust Verification</span>
              {isVpnDetected ? (
                <AlertTriangle className="w-4 h-4 text-warning-red" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-verified-green" />
              )}
            </div>
            
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${trustScore}%` }}
                className={`h-full ${isVpnDetected ? 'bg-warning-red shadow-[0_0_8px_#FF3B3B]' : 'bg-verified-green shadow-[0_0_8px_#00D26A]'}`}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold font-display ${isVpnDetected ? 'text-warning-red' : 'text-verified-green'}`}>
                {isVpnDetected ? 'Suspicious' : 'Trusted User'}
              </span>
              <span className="text-xs font-display font-medium text-white/40">{trustScore}%</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-6 flex items-center gap-4 px-4 py-3 text-white/40 hover:text-warning-red transition-all font-display uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#0F0F10]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-all md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-display font-black uppercase tracking-tight">{activeTab}</h2>
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search missions..."
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-blue/40 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 glass-card px-4 py-2 hover:border-white/20 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-neon-blue" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-white/30 leading-none mb-1">Balance</span>
                <span className="text-sm font-display font-bold leading-none">${profile?.balance.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/60">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-neon-blue rounded-full border-2 border-[#0F0F10]" />
              </button>
              <div className="w-10 h-10 rounded-full border-2 border-neon-blue bg-bg-secondary overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Gamer'}`} alt="Profile" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 bg-white/5 rounded-lg hover:bg-warning-red/20 text-white/40 hover:text-warning-red transition-all ml-2"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <AnimatePresence>
            {isTabLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#0F0F10]/50 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-blue animate-pulse">Syncing Data...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-7xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>

            <div className="pt-20">
              <Footer onLegalClick={setLegalType} onNavigate={setActiveTab} />
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedOffer && (
          <OfferModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {legalType && (
          <LegalModal type={legalType} onClose={() => setLegalType(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
