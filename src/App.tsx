/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [appState, setAppState] = useState<'loading' | 'landing' | 'dashboard' | 'admin'>('loading');

  useEffect(() => {
    // Basic hash router
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') setAppState('admin');
      else if (hash === '#dashboard') setAppState('dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStartEarning = () => {
    setAppState('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleLoadingFinish = () => {
    if (window.location.hash === '#admin') setAppState('admin');
    else if (window.location.hash === '#dashboard') setAppState('dashboard');
    else setAppState('landing');
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#F5F5F5] font-sans selection:bg-neon-orange/30 overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <LoadingScreen onFinish={handleLoadingFinish} />
          </motion.div>
        )}

        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <LandingPage onStart={handleStartEarning} />
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Dashboard />
          </motion.div>
        )}

        {appState === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <AdminDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



