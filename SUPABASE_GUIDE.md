# XGamer Supabase Integration Guide

Welcome to the **XGamer** Master Integration Suite. As your Senior Supabase Architect, I have designed a secure, real-time backend architecture tailored for high-performance gaming rewards.

This guide walk you through the manual setup required in the Supabase Dashboard to sync with the frontend code I've already implemented.

---

## STEP 1: Creating your Supabase Project
**What it does:** Provisions your dedicated PostgreSQL database, Auth service, and Realtime engine.
**Navigation:** [Supabase Dashboard](https://supabase.com/dashboard)
**Action:**
1. Click **"New Project"**.
2. Select your Organization.
3. **Name:** `XGamer-Production`.
4. **Database Password:** Generate a strong one and **STORE IT SECURELY**.
5. **Region:** Choose the region closest to your users (e.g., `West Europe` or `East US`).
6. **Plan:** Free tier is fine for starting, but move to "Pro" when you hit 50k+ users for better IOPS.

---

## STEP 2 & 3: API Keys & Environment Variables
**Why it matters:** These allow your frontend to communicate securely with your backend.
**Navigation:** Project Settings -> API
**Action:**
1. Copy the **Project URL**.
2. Copy the **anon / public** key.
3. **DO THIS MANUALLY IN AI STUDIO:** Go to the **Secrets** panel (Settings) and add:
   - `VITE_SUPABASE_URL`: (Your URL)
   - `VITE_SUPABASE_ANON_KEY`: (Your Key)

---

## STEP 4: Authentication Setup
**What it does:** Enables users to sign up via Email or Social.
**Navigation:** Authentication -> Providers
**Action:**
1. **Email:** Ensure "Enable Signup" is ON. Disable "Confirm Email" only for testing, keep it ON for production to prevent bot accounts.
2. **Google:** 
   - Enable Google Provider.
   - You need a Client ID and Secret from the [Google Cloud Console](https://console.cloud.google.com/).
   - Add the Supabase Redirect URI (found in Google Auth settings) to your Google Cloud authorized redirect URIs.
3. **Discord:** 
   - Enable Discord Provider.
   - Get your ID/Secret from the [Discord Developer Portal](https://discord.com/developers/applications).

---

## STEP 5, 6, 7 & 8: Database Architecture & Security (RLS)
**Why it matters:** RLS (Row Level Security) ensures User A cannot see User B's wallet or withdrawal requests.
**Navigation:** SQL Editor
**Action:**
Copy and run the contents of the `supabase-schema.sql` file I generated. It includes:
- **Tables:** `profiles`, `offers`, `transactions`, `vpn_logs`.
- **Relationships:** Foreign keys linking transactions to profiles.
- **Security:** RLS is enabled on all tables by default.

### Critical Security Policies (Explained):
- **Profiles:** `auth.uid() = id` ensures only the logged-in user can touch their data.
- **Offers:** `true` for SELECT (everyone sees offers), but only admins (using service_role) can WRITE.
- **Transactions:** `auth.uid() = user_id` prevents balance manipulation between users.

---

## STEP 9: Realtime Subscriptions
**What it does:** Allows the dashboard to update the "Wallet Balance" instantly when a mission is completed.
**Navigation:** Database -> Replication
**Action:**
1. Under "Supabase Realtime", click on **"Source"** or the **"Tables"** link.
2. Toggle **ON** the following tables:
   - `profiles` (for live balance/XP)
   - `transactions` (for live history)
   - `notifications` (once created)
   - `leaderboards` (for live rank changes)

---

## STEP 10: Storage Buckets
**Why it matters:** Stores avatars and KYC documents securely.
**Navigation:** Storage
**Action:**
1. Create a bucket named `avatars`. Set it to **Public**.
2. (Advanced) Create a bucket named `kyc_documents`. Set it to **Private**.
3. **Security Policy:** 
   - For `avatars`: Allow `SELECT` for everyone. Allow `INSERT/UPDATE` only if `auth.uid() = owner_id`.
   - For `kyc_documents`: Only owners and `admins` can `SELECT`.

---

## STEP 11, 12 & 13: Specialized Gaming Systems

### VPN & Trust Architecture (VPN Detection)
**The Logic:**
- When a user logs in, the `SupabaseAuthContext` calls `/api/check-ip`.
- If a VPN is detected, the `trust_score` is dropped automatically to `30`.
- **Manual Step:** In the Supabase Dashboard, you can see `vpn_logs` table to identify clusters of accounts using the same IP (Multi-accounting detection).

### Gameplay Tracking
**The Logic:**
- Frontend sends `game_sessions` updates via Supabase DB.
- **Security Guard:** Never trust the "Points" sent by the client. Always verify on the server side (Edge Functions) that the points earned match the mission constraints.

---

## STEP 14: Admin Dashboard Backend
**Why it matters:** You need to approve withdrawals and ban cheaters.
**Action:**
1. Create a table named `admins`.
2. Add your own `user_id` to this table.
3. The `AdminDashboard.tsx` uses this to verify your permissions before showing sensitive logs.

---

## STEP 15, 16 & 17: Notifications, Withdrawals & Referrals

### Withdrawal System:
- User submits a `Withdrawal` request (Status: `Pending`).
- Admin sees this in the Admin Panel.
- Upon approval, a DB update triggers a Realtime notification to the user.

### Referral System:
- Use a `referrals` table matching `referrer_id` to `referee_id`.
- When a user completes an offer, use a Database Trigger to award 15% to the `referrer_id`.

---

## STEP 18: Deployment Preparation
1. **Enable App Check:** Under Settings -> App Check. This prevents non-official apps (like bots or curl scripts) from hitting your API.
2. **Review Rate Limits:** Supabase has built-in protection, but you should monitor for spikes in the `vpn_logs`.
3. **Final Test:** Run a "Shadow Update" test—try to update your own balance via the browser console. If RLS is set correctly, Supabase will return `403 Forbidden`.

---
**Senior Architect Note:** Always prioritize RLS. A database without RLS is a vault with an open door.
