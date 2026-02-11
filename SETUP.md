# Setup Instructions

## 1. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Name: "email-survey" (or your preferred name)
   - Database Password: (choose a strong password)
   - Region: (select closest to you)
4. Click "Create new project" and wait for it to initialize

## 2. Run Database Schema

1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Copy the contents of [supabase-schema.sql](supabase-schema.sql) and paste into the query editor
4. Click "Run" to execute the schema
5. Verify tables were created:
   - Go to "Table Editor" in left sidebar
   - You should see `surveys` and `responses` tables

## 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon in left sidebar)
2. Click "API" under Project Settings
3. You'll need these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

## 4. Configure Environment Variables

1. Copy [.env.example](.env.example) to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Test the Setup

1. Click "Sign Up" and create an account
2. Log in with your credentials
3. You should be redirected to the dashboard
4. Try creating a survey

## Next Steps

- Configure your domain in Vercel when ready to deploy
- Update `NEXT_PUBLIC_APP_URL` to your production URL
- Set up AWeber integration by using the hash_md5 personalization variable in your email links
