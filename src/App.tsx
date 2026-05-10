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
import AuthPage from './components/AuthPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { SupabaseAuthProvider, useSupabaseAuth } from './context/SupabaseAuthContext';

function AppContent() {
  const [appState, setAppState] = useState<'loading' | 'landing' | 'dashboard' | 'admin' | 'auth' | 'reset-password'>('loading');
  const { user, profile, loading } = useSupabaseAuth();

  useEffect(() => {
    // Basic hash router
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') setAppState('admin');
      else if (hash === '#dashboard' && user) setAppState('dashboard');
      else if (hash === '#reset-password') setAppState('reset-password');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  useEffect(() => {
    if (!loading && !user && (appState === 'dashboard' || appState === 'admin')) {
      setAppState('landing');
      window.location.hash = '';
    }
  }, [user, loading, appState]);

  useEffect(() => {
    if (!loading && appState === 'loading') {
      // Simulate a bit of loading for the cool effect
      const timer = setTimeout(() => {
        const hash = window.location.hash;
        if (hash === '#admin') setAppState('admin');
        else if (hash === '#reset-password') setAppState('reset-password');
        else if (user) setAppState('dashboard');
        else setAppState('landing');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, appState]);

  const handleStartEarning = () => {
    setAppState('auth');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleResetComplete = () => {
    window.location.hash = 'dashboard';
    setAppState('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#F5F5F5] font-sans selection:bg-neon-blue/30 overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <LoadingScreen onFinish={() => {}} />
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

        {appState === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full h-full"
          >
            <AuthPage onBack={handleBackToLanding} />
          </motion.div>
        )}

        {(appState === 'dashboard' || (user && appState === 'landing' && !loading) || (user && appState === 'auth' && !loading)) && (
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

        {appState === 'reset-password' && (
          <motion.div
            key="reset-password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <ResetPasswordPage onComplete={handleResetComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SupabaseAuthProvider>
      <AppContent />
    </SupabaseAuthProvider>
  );
}



