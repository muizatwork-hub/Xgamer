-- Supabase SQL Schema for XGamer

-- 1. Profiles Table (Core User Data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  balance NUMERIC DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 80,
  is_verified BOOLEAN DEFAULT FALSE,
  country TEXT,
  is_vpn_detected BOOLEAN DEFAULT FALSE,
  referrer_id UUID REFERENCES auth.users(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Offers Table
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reward NUMERIC NOT NULL,
  category TEXT,
  difficulty TEXT,
  image_url TEXT,
  provider TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Game Sessions (Gameplay Tracking)
CREATE TABLE game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  xp_earned INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('Active', 'Completed', 'Aborted')) DEFAULT 'Active'
);

-- 4. Transactions Table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('Earning', 'Withdrawal', 'Referral')),
  status TEXT CHECK (status IN ('Pending', 'Completed', 'Rejected')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VPN Logs (Security)
CREATE TABLE vpn_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  ip TEXT,
  is_vpn BOOLEAN,
  country TEXT,
  device_fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notifications
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Leaderboards (Realtime Reads)
CREATE VIEW leaderboards AS
SELECT id, username, xp, level, avatar_url
FROM profiles
ORDER BY xp DESC
LIMIT 100;

-- 8. Admin List
CREATE TABLE admins (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role TEXT DEFAULT 'moderator',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vpn_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Offers
CREATE POLICY "Offers are viewable by everyone" ON offers FOR SELECT USING (true);

-- Game Sessions
CREATE POLICY "Users can view own sessions" ON game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- VPN Logs (Strict)
CREATE POLICY "Admins can view all logs" ON vpn_logs FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "Users can log their own trust check" ON vpn_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admins (Only admins can see admin list)
CREATE POLICY "Admins can view admin list" ON admins FOR SELECT USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- REFRESH TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
