# ACAI Warranty LLC Website

A multi-page marketing site for ACAI Warranty LLC built with React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide icons.

## Run locally

    npm install
    npm run dev

## Build

    npm run build
    npm run preview

## Deploy on Vercel

Import the repository into Vercel. The default Vite settings work: build command `npm run build`, output directory `dist`. `vercel.json` rewrites all routes to the app so direct links and page refreshes work.

## Where things are configured

- Company information (name, email, placeholder phone, navigation, footer links): `src/data/site.ts`
- Photography: `src/data/images.ts`. Images are referenced from the Pexels CDN; replace with files in `public/` if you license your own.
- Protection plans and comparison table: `src/data/plans.ts`
- Page titles, descriptions, and canonical URLs: `src/lib/seo.ts`
- Brand colors, fonts, and spacing: `tailwind.config.js` and `src/index.css`
- Structured data, favicon, fonts: `index.html`, `public/favicon.svg`
- Search engine files: `public/robots.txt`, `public/sitemap.xml`

## Replacing the placeholder phone number

Update `phoneDisplay` and `phoneHref` in `src/data/site.ts`. The number is currently labeled as a placeholder in the contact page and footer. Remove those labels once a verified number is in place.

## Supabase form integration

The Contact page submits to the `submit-quote` Edge Function. It validates the request, saves the lead in `public.quote_requests`, then attempts a Resend notification. The table has RLS enabled, no public policies, and no grants to `anon` or `authenticated`. Only the function's server-side service role can write leads. No scheduled retries are configured.

### Setup

1. Create a Supabase project; copy its Project URL and publishable key from the project settings.
2. In Supabase **SQL Editor**, paste and run `supabase/migrations/20261116000100_create_quote_requests.sql` once. If you previously created a quote table, reconcile its schema before running this migration.
3. In **Edge Functions → Secrets**, set these values directly (not in frontend files):

   | Name | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your Resend sending API key |
   | `QUOTE_FROM_EMAIL` | Your verified sender address, optionally with a display name |
   | `QUOTE_TO_EMAIL` | One recipient address, or comma-separated recipient addresses |
   | `ALLOWED_ORIGINS` | Comma-separated exact website origins including scheme and port if present; no paths, trailing slashes, or wildcard |

   Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` inside hosted functions. Never expose those privileged credentials to the browser. Add the exact local-development origin to `ALLOWED_ORIGINS` when testing locally.
4. Create a Resend account, add the sending domain/subdomain you own, and add its supplied SPF/return-path and DKIM DNS records. Review DMARC and preserve existing mailbox DNS records. Wait for verification. Resend does not create your receiving business mailbox.
5. With Node 24 and the Supabase CLI available, run:

   ```sh
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase functions deploy submit-quote
   ```

   The function uses `verify_jwt = false` because visitors are not signed in. It requires an allowlisted Origin, validates the body server-side, and checks a honeypot. The publishable key is public, and CORS is not authentication: determined bots can forge Origin and bypass a honeypot. Add a server-verified CAPTCHA or persistent rate limit if needed.
6. Copy `.env.example` to `.env`. Set only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Add the same public values in Vercel environment settings and redeploy. No Resend keys, service-role keys, database passwords, recipients, or sender configuration belong in frontend environment variables.
7. Submit both an auto and a home request. Confirm the database row, full email contents, and Reply-To. Check the Resend dashboard and spam folder if delivery is missing.

### Failure behavior and verification

- The form shows success only after the server confirms persistence. Email failures do not undo the lead or produce a customer-facing error.
- `email_status` starts as `pending`, becomes `sent` when Resend accepts the message, or `failed` if sending/configuration fails. `sent` does not guarantee inbox delivery. A crash or failed status update can leave `pending`; inspect function logs and reconcile manually. There are no automatic retries.
- Request UUIDs prevent duplicate inserts/emails for retries of the same unchanged form. Editing the form starts a new request. No personal information or provider errors are returned to the browser or logged by the handler.
- Server timestamps are authoritative. The honeypot is never saved or emailed. Notification content is plain text, and its recipient/sender cannot be supplied by the browser.
- Test invalid fields, consent, plan/service mismatches, honeypot, blocked origins, double submission, missing configuration, database failures, and email failures. Verify the public key cannot select, insert, update, or delete leads.
- On Node 24, run `node tests/quote-submission.test.mjs`, `npm run typecheck`, `npm run lint`, and `npm run build`. The handler tests mock database/email services; real delivery and deployed RLS require the setup above.

References: [Supabase guest function configuration](https://supabase.com/docs/guides/functions/auth), [function secrets](https://supabase.com/docs/guides/functions/secrets), [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction).

## Before launch: content and legal review

- Confirm all coverage categories, plan positioning, and comparison table entries against the actual service contracts.
- Complete the bracketed sections in the Privacy Policy and Terms & Conditions pages. Both are drafts that require business and legal review.
- Confirm response-time, activation, claims, and fee language before publishing.
- Replace the placeholder phone number and confirm the business email.
- Do not add testimonials, ratings, licenses, or statistics until they are verified.

## Fonts

The design specifies GT America for headings and body. Its license files are not included. Place the font files in `public/fonts/` and add `@font-face` rules to `src/index.css`. Until then, the site uses Manrope and Inter from Google Fonts.

## SEO limitation

This is a client-rendered single-page app. Route-specific titles, descriptions, and canonical URLs are set in the browser after load, while the homepage has default tags in `index.html`. For full crawler-visible prerendering of every route, add a prerendering step (for example, a static prerender script) as a follow-up.
