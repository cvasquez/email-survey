# Email Survey Tool

A lightweight survey tool designed for email campaigns. Embed survey responses directly in your emails using parameterized links for maximum engagement.

## Features

- **Frictionless Response Collection**: Recipients click a link with their answer pre-selected (`?answer=satisfied`), then provide optional context
- **AWeber Integration**: Track responses back to specific subscribers using the `hash_md5` personalization variable
- **Simple Dashboard**: Create surveys, view responses in a clean table, export to CSV
- **Minimal Configuration**: Only toggle whether to require respondent names
- **Secure**: Row-level security with Supabase ensures data isolation between users

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account (optional, for deployment)

### 2. Setup Supabase

Follow the detailed instructions in [SETUP.md](SETUP.md):

1. Create a new Supabase project
2. Run the database schema from [supabase-schema.sql](supabase-schema.sql)
3. Get your project credentials (URL, anon key, service role key)

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Survey Creation

1. Sign up / log in
2. Create a survey with a title
3. Toggle "Require name" if you want to collect respondent names
4. Copy your survey link

### Email Integration

Your survey link format:
```
https://yourdomain.com/s/[survey-id]?hash_md5={{subscriber.email | hash_md5}}&answer=YOUR-ANSWER-VALUE
```

**Example email:**

"How satisfied are you with our product?"

- [Very Satisfied](https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=very-satisfied)
- [Satisfied](https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=satisfied)
- [Neutral](https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=neutral)
- [Dissatisfied](https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=dissatisfied)

### AWeber Integration

Add the `hash_md5` personalization variable to track which subscriber gave which response:

```
https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=satisfied
```

AWeber uses the template syntax `{{subscriber.email | hash_md5}}` which generates an MD5 hash of the subscriber's email address. This gets replaced with the actual hash value when the email is sent, allowing you to tie responses back to specific subscribers.

### Response Flow

1. Recipient clicks a link in your email
2. They see: "Tell me about your answer: [answer value]"
3. They type their response (and name if required)
4. Response is saved with the answer value and AWeber hash_md5
5. You view all responses in the dashboard

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── surveys/          # Survey CRUD endpoints
│   │   └── responses/        # Response submission endpoint
│   ├── dashboard/            # Protected: survey list
│   ├── surveys/
│   │   ├── new/             # Protected: create survey
│   │   └── [id]/responses/  # Protected: view responses
│   ├── s/[surveyId]/        # PUBLIC: response form
│   ├── login/               # Authentication
│   └── signup/              # Registration
├── lib/
│   ├── supabase/            # Supabase clients
│   └── utils.ts             # Utility functions
├── types/
│   └── database.ts          # TypeScript types
└── middleware.ts            # Route protection
```

## Key Files

- [middleware.ts](middleware.ts) - Protects dashboard and redirects auth'd users
- [app/s/[surveyId]/page.tsx](app/s/[surveyId]/page.tsx) - Public response form with URL param parsing
- [app/api/responses/route.ts](app/api/responses/route.ts) - Response submission endpoint (includes AWeber hash_md5)
- [app/surveys/[id]/responses/page.tsx](app/surveys/[id]/responses/page.tsx) - Response visualization table
- [supabase-schema.sql](supabase-schema.sql) - Database schema with RLS policies

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
4. Deploy

### Configure Supabase for Production

1. In Supabase dashboard, go to Authentication → URL Configuration
2. Add your Vercel domain to "Site URL" and "Redirect URLs"

## Testing Checklist

- [ ] Sign up and create an account
- [ ] Create a survey with "Require name" disabled
- [ ] Copy the survey link
- [ ] Test the link with `?answer=test-answer` in browser
- [ ] Submit a response
- [ ] View responses in dashboard
- [ ] Create another survey with "Require name" enabled
- [ ] Test that name field appears and is required
- [ ] Test AWeber integration with `?hash_md5=test123&answer=satisfied`
- [ ] Verify hash_md5 appears in responses table
- [ ] Test CSV export functionality
- [ ] Test response filtering

## AWeber Setup Example

In your AWeber message editor, create links like this:

```html
<a href="https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=very-satisfied">
  Very Satisfied
</a>
<a href="https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=satisfied">
  Satisfied
</a>
<a href="https://yourdomain.com/s/abc123?hash_md5={{subscriber.email | hash_md5}}&answer=dissatisfied">
  Dissatisfied
</a>
```

The `{{subscriber.email | hash_md5}}` template variable is replaced by AWeber with an MD5 hash of each subscriber's email address when the email is sent. This lets you tie responses back to specific subscribers for follow-up campaigns.

## Database Schema

### `surveys` table
- Stores survey metadata (title, require_name, unique_link_id)
- RLS: Users can only access their own surveys

### `responses` table
- Stores survey responses with answer_value, free_response, hash_md5
- RLS: Anyone can INSERT (public submission), only survey owners can SELECT

See [supabase-schema.sql](supabase-schema.sql) for full schema.

## Troubleshooting

### "Survey not found" error
- Verify your Supabase credentials in `.env.local`
- Check that the database schema was applied correctly
- Ensure the survey exists and is active

### Can't log in
- Verify Supabase Auth is enabled in your project settings
- Check that email confirmation is disabled (or configure SMTP)

### Responses not appearing
- Check browser console for errors
- Verify RLS policies are set up correctly
- Ensure you're logged in as the survey creator

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
