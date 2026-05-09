import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, Wallet, Zap, Users, Trophy, Settings, LogOut, 
  Bell, ChevronUp, Clock, ShieldCheck, AlertTriangle, 
  CheckCircle2, TrendingUp, Filter, Search, Award
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Offers');
  const { profile, logout } = useSupabaseAuth();
  const trustScore = profile?.trustScore || 80;
  const isVpnDetected = profile?.isVpnDetected || false;

  const handleLogout = async () => {
    await logout();
    window.location.hash = '';
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

  return (
    <div className="flex h-screen bg-[#0F0F10] text-[#F5F5F5] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0F0F10] flex flex-col hidden md:flex">
        <div className="p-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-orange rounded flex items-center justify-center rotate-45 border border-orange-glow">
              <span className="text-black font-display text-xl -rotate-45 font-black">X</span>
            </div>
            <span className="text-xl font-display font-black tracking-tight tracking-widest">XGAMER</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 pt-4">
          {[
            { name: 'Offers', icon: Gamepad2 },
            { name: 'Wallet', icon: Wallet },
            { name: 'Referrals', icon: Users },
            { name: 'Leaderboard', icon: Trophy },
            { name: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.name 
                  ? 'bg-neon-orange text-black font-bold font-display uppercase tracking-widest text-xs' 
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

        <div className="p-4">
          <div className="glass-card p-4 neon-border bg-neon-orange/5">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F0F10]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-display font-black uppercase tracking-tight">{activeTab}</h2>
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search missions..."
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-orange/40 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 glass-card px-4 py-2 hover:border-white/20 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-neon-orange/20 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-neon-orange" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-white/30 leading-none mb-1">Balance</span>
                <span className="text-sm font-display font-bold leading-none">${profile?.balance.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/60">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-neon-orange rounded-full border-2 border-[#0F0F10]" />
              </button>
              <div className="w-10 h-10 rounded-full border-2 border-neon-orange bg-bg-secondary overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Gamer'}`} alt="Profile" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Top Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Balance', value: `$${profile?.balance.toFixed(2) || '0.00'}`, icon: Wallet, delta: '+0%', color: 'verified-green' },
                { label: 'XP Level', value: `Level ${profile?.level || 1}`, icon: Award, delta: `XP ${profile?.xp || 0}`, color: 'status-blue' },
                { label: 'Daily Streak', value: `${profile?.streak || 0} Days`, icon: Zap, delta: 'Keep going!', color: 'neon-orange' },
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
                    <span className={`text-[10px] font-bold uppercase ${stat.color.includes('/') ? 'text-white/40' : `text-${stat.color}`}`}>{stat.delta}</span>
                  </div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-display font-bold tracking-tight">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            {/* Main Grid: Offers & Charts */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Offers List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-black uppercase tracking-tight">Premium Missions</h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"><Filter className="w-4 h-4" /></button>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-neon-orange p-2">View All</button>
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
                        <span className="block text-neon-orange font-display font-bold text-lg leading-none mb-1">{offer.reward}</span>
                        <span className="text-[10px] font-bold uppercase text-white/20">Approx. 10m</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="space-y-8">
                
                {/* Earning Chart */}
                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-6">Activity Peak</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,122,0,0.05)' }} 
                          contentStyle={{ backgroundColor: '#1A1C1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          labelStyle={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '10px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 4 ? '#FF7A00' : 'rgba(255,255,255,0.1)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                    <span>Mon</span>
                    <span className="text-neon-orange">Today (Peak)</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Achievements */}
                <div className="glass-card p-6">
                  <h3 className="text-xs font-display font-bold uppercase tracking-widest mb-6">Achievements</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border border-dashed border-white/10 ${i <= 3 ? 'bg-neon-orange/10 border-neon-orange/30 text-neon-orange shadow-[0_0_10px_rgba(255,122,0,0.1)] transition-all transform hover:scale-110' : 'text-white/10 hover:border-white/20'}`}>
                        {i === 1 && <Zap className="w-5 h-5" />}
                        {i === 2 && <Trophy className="w-5 h-5" />}
                        {i === 3 && <Award className="w-5 h-5" />}
                        {i > 3 && <span className="text-[10px] font-bold">LOCKED</span>}
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-3 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">
                    View Achievement Hall
                  </button>
                </div>

                {/* Referral Promo */}
                <div className="glass-card p-6 bg-gradient-to-br from-neon-orange/20 to-transparent relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-orange/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                  <h3 className="font-display font-black text-xl mb-2 italic">EARN 15% EXTRA</h3>
                  <p className="text-white/50 text-xs mb-6 leading-relaxed">Invite your friends and earn a lifetime commission on every offer they complete.</p>
                  <button className="w-full h-12 bg-neon-orange text-black font-display font-black text-[10px] uppercase tracking-[0.2em] rounded-lg shadow-[0_0_15px_rgba(255,122,0,0.3)]">Get Link</button>
                </div>

              </div>
            </div>

            {/* Recent Activity Section */}
            <section className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-black uppercase tracking-tight">Withdrawal History</h3>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Last 30 Days</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      <th className="pb-4">Transaction ID</th>
                      <th className="pb-4">Method</th>
                      <th className="pb-4">Date</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium">
                    {[
                      { id: '#XG-9281', method: 'PayPal', date: 'May 08, 2026', amount: '$45.00', status: 'Completed', color: 'verified-green' },
                      { id: '#XG-8542', method: 'Bitcoin', date: 'May 04, 2026', amount: '$120.00', status: 'Processing', color: 'status-blue' },
                      { id: '#XG-7712', method: 'Visa Card', date: 'Apr 28, 2026', amount: '$25.00', status: 'Completed', color: 'verified-green' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                        <td className="py-5 font-mono text-xs">{row.id}</td>
                        <td className="py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-white/5" />
                            {row.method}
                          </div>
                        </td>
                        <td className="py-5 text-white/40">{row.date}</td>
                        <td className="py-5 font-display font-bold">{row.amount}</td>
                        <td className="py-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase bg-${row.color}/10 text-${row.color}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
