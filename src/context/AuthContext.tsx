import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { User as AppUser } from '../lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync or Create Profile
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const newProfile: AppUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            username: firebaseUser.displayName || 'XGamer',
            balance: 0,
            xp: 0,
            level: 1,
            streak: 0,
            claimStreak: 0,
            isVerified: false,
            trustScore: 80,
          };
          await setDoc(userDocRef, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(userDoc.data() as AppUser);
        }

        // Mock VPN/Trust Check Log
        try {
          const ipRes = await fetch('/api/check-ip');
          const ipData = await ipRes.json();
          // Log to Firestore vpn_logs
          // Note: In a real app we'd also update the profile with this data
          const logRef = doc(db, 'vpn_logs', `${firebaseUser.uid}_${Date.now()}`);
          await setDoc(logRef, {
            userId: firebaseUser.uid,
            ip: ipData.ip,
            isVpn: ipData.isVpn,
            country: ipData.country,
            timestamp: new Date().toISOString()
          });
        } catch (e) {
          console.error("Failed to log trust data", e);
        }

        // Real-time listener for profile changes
        const profileUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as AppUser);
          }
        });

        return () => profileUnsubscribe();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
