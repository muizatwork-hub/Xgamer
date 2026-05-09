import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, ShieldAlert, Globe, Activity, Ban, CheckCircle, 
  Search, Filter, ChevronRight, BarChart3, PieChart, Lock
} from 'lucide-react';

export default function AdminDashboard() {
  const [view, setView] = useState('Overview');

  const stats = [
    { label: 'Active Users', value: '12,402', delta: '+4.5%' },
    { label: 'Daily Revenue', value: '$8,240', delta: '+12.3%' },
    { label: 'Fraud Alerts', value: '14', delta: '-2', warning: true },
    { label: 'Pending Payouts', value: '$2,150', delta: '8 Requests' },
  ];

  const recentLogs = [
    { user: 'dark_knight', ip: '192.168.1.1', country: 'US', risk: 'Low', status: 'Trusted' },
    { user: 'proxy_user99', ip: '45.1.2.3', country: 'DE', risk: 'High', status: 'VPN Detected' },
    { user: 'earn_master', ip: '102.33.1.2', country: 'BR', risk: 'Med', status: 'Manual Review' },
    { user: 'bot_slayer', ip: '8.8.8.8', country: 'US', risk: 'Low', status: 'Trusted' },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-[#F5F5F5]">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[#1A1A1B] flex flex-col">
        <div className="p-8 border-b border-[#1A1A1B]">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-warning-red rounded flex items-center justify-center rotate-45">
              <Lock className="w-3 h-3 text-black -rotate-45" />
            </div>
            <span className="text-sm font-display font-black tracking-widest">X-ADMIN</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {['Overview', 'User Control', 'Fraud Logs', 'Analytics', 'System Config'].map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-display font-bold uppercase tracking-widest transition-all ${
                view === item ? 'bg-warning-red/10 text-warning-red' : 'text-white/20 hover:text-white'
              }`}
            >
              {item === 'Overview' && <Activity className="w-4 h-4" />}
              {item === 'User Control' && <Users className="w-4 h-4" />}
              {item === 'Fraud Logs' && <ShieldAlert className="w-4 h-4" />}
              {item === 'Analytics' && <PieChart className="w-4 h-4" />}
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 border-b border-[#1A1A1B] flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-white/40 text-xs font-display font-bold uppercase tracking-widest">
            <span>Root</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{view}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-display font-bold text-white/40">
            <span className="text-verified-green">System Live</span>
            <span className="text-white/10">|</span>
            <span>Admin: SuperUser</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#111112] border border-[#1A1A1B] p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
                  <span className={`text-[10px] font-bold ${stat.warning ? 'text-warning-red' : 'text-verified-green'}`}>{stat.delta}</span>
                </div>
                <h3 className="text-2xl font-display font-black">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Real-time VPN/Fraud Logs */}
            <div className="col-span-2 bg-[#111112] border border-[#1A1A1B] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#1A1A1B] flex items-center justify-between">
                <h4 className="font-display font-bold text-xs uppercase tracking-widest">Fraud Detection Logs</h4>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                    <input type="text" className="bg-black/40 border border-[#1A1A1B] rounded-md py-1.5 pl-8 pr-3 text-[10px] w-48" placeholder="Search logs..." />
                  </div>
                  <Filter className="w-4 h-4 text-white/20" />
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A1A1B] text-[10px] font-bold uppercase tracking-widest text-white/20">
                    <th className="p-6 text-left">User Identifier</th>
                    <th className="p-6 text-left">Origin / IP</th>
                    <th className="p-6 text-left">Risk Level</th>
                    <th className="p-6 text-left">Internal Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs transition-all">
                  {recentLogs.map((log, i) => (
                    <tr key={i} className="border-b border-[#1A1A1B] last:border-0 hover:bg-white/[0.02]">
                      <td className="p-6 font-bold">{log.user}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-white/20" />
                          <span className="text-white/40">{log.ip} ({log.country})</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.risk === 'High' ? 'bg-warning-red/10 text-warning-red' : 
                          log.risk === 'Med' ? 'bg-orange-glow/10 text-orange-glow' : 
                          'bg-verified-green/10 text-verified-green'
                        }`}>
                          {log.risk}
                        </span>
                      </td>
                      <td className="p-6 text-white/40">{log.status}</td>
                      <td className="p-6 text-right">
                        <button className="p-1.5 hover:bg-warning-red/20 rounded transition-all"><Ban className="w-4 h-4 text-warning-red" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* User Breakdown */}
            <div className="bg-[#111112] border border-[#1A1A1B] rounded-xl p-6">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-8">System Health</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-white/40">API Response</span>
                    <span className="text-verified-green">99.8%</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-verified-green w-[99.8%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-white/40">Database Load</span>
                    <span className="text-orange-glow">64%</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-orange-glow w-[64%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-white/40">Fraud Block Rate</span>
                    <span className="text-warning-red">12.5%</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-warning-red w-[12.5%]" />
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-[#1A1A1B]">
                <button className="w-full py-3 bg-white/5 border border-[#1A1A1B] rounded-lg text-[10px] font-display font-black tracking-widest uppercase hover:bg-white/10 transition-all">
                  Generate Revenue Report
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
