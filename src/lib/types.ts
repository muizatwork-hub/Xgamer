export interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  xp: number;
  level: number;
  streak: number;
  claimStreak: number;
  lastClaimedAt?: string;
  isVerified: boolean;
  trustScore: number; // 0-100
  country?: string;
  isVpnDetected?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'Gaming' | 'Survey' | 'App' | 'Video' | 'Challenge';
  image: string;
  provider: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'Earning' | 'Withdrawal';
  status: 'Pending' | 'Completed' | 'Rejected';
  timestamp: string;
  description: string;
}

export interface LeaderboardEntry {
  username: string;
  earnings: number;
  xp: number;
  rank: number;
}
