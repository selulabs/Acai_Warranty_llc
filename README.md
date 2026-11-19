# ACAI Warranty LLC Website

A multi-page marketing site for ACAI Warranty LLC built with React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide icons.

## Run locally

    npm install
    npm run dev

## Build

    npm run build
    npm run preview

## Deploy on Vercel

Import the repository into Vercel. Use Node 24, build command `npm run build`, and output directory `dist`. The build prerenders every page into its own HTML file. `vercel.json` enables clean URLs, redirects www to non-www, applies security headers, and lets unmatched URLs return a real 404 instead of serving the homepage.http://localhost:5173/

## Where things are configured

- Company information (name, email, placeholder phone, navigation, footer links): `src/data/site.ts`
- Photography: `src/data/images.ts`. Images are referenced from the Pexels CDN; replace with files in `public/` if you license your own.
- Protection plans and comparison table: `src/data/plans.ts`
- Page metadata and content-update dates: `src/data/pageMeta.ts`; shared build/browser head generation: `src/lib/seoMetadata.ts`
- Brand colors, fonts, and spacing: `tailwind.config.js` and `src/index.css`
- Structured data, favicon, fonts: `index.html`, `public/favicon.svg`
- Search engine files: `public/robots.txt`; sitemap generated into `dist/sitemap.xml` by `scripts/build.mjs`

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

## SEO, static generation, and analytics

- `npm run build` builds browser assets, renders all nine pages and `404.html` with React, inserts the same route metadata/structured data used for browser navigation, and generates the sitemap. The temporary server bundle is deleted and is not deployed.
- Update the relevant `PAGE_CONTENT_DATES` entry in `src/data/pageMeta.ts` only when that page's content, metadata, or structured data actually changes. These dates reflect the SEO content update on November 19, 2026; redeploying does not advance them. Add any new routes to both `src/App.tsx` and the metadata registry. Noindex pages are excluded from the sitemap.
- `public/sitemap.xml` was replaced by build-time generation. Inspect the sitemap in `dist/` or on the deployed site, rather than during Vite development.
- The existing logo is used for all favicon/app icons and `public/og-image.png` (1200×630). The optional `scripts/generate-brand-assets.mjs` utility regenerates them with local headless Chrome; normal deployments require no Chrome.
- Images keep the existing crops/layouts and use responsive Pexels variants. The mobile homepage keeps its separately selected photo. Below-the-fold images stay lazy; only the hero gets high priority. Supabase is loaded only when submitting, reducing initial JavaScript.
- The existing Google-hosted Manrope/Inter fonts, preconnects, and `display=swap` remain to preserve typography. GT America is not bundled or licensed here. Self-hosting matching licensed fonts can be evaluated separately.
- Structured data contains verified Organization/WebSite information, breadcrumbs, the auto/home services, and the same FAQs displayed on the pages. It intentionally omits the mailing address, LocalBusiness, ratings, reviews, licensing, and unconfirmed state availability. FAQ markup does not promise Google FAQ rich results.
- Vercel serves the generated `404.html` for unmatched routes. Vite's development/preview server is not a test of Vercel routing. HTTPS is enforced by Vercel; no redundant protocol redirect is added. `.vercel.app` hosts get an additional noindex response header. Canonicals point to the approved non-www production domain.
- Security headers permit the site's existing image/font providers, standard Supabase project domains, and consented Google Analytics. If using a custom Supabase domain or adding another integration, update CSP deliberately and test it. HTML revalidates; hashed `/assets/` files are immutable.

### Manual launch checklist

1. In Vercel, select Node 24, build command `npm run build`, output `dist`; connect both apex and www domains. Keep existing Supabase public environment values.
2. In GA4, create a Web data stream and copy the public measurement ID (`G-...`). Turn **Enhanced Measurement off**: this app sends its own SPA page views, lead and contact-click events, avoiding duplicate/automatic form or query-string collection. Leave Google Signals and advertising features disabled unless separately approved.
3. Set `VITE_GA4_MEASUREMENT_ID` in local `.env` and Vercel Production, then redeploy. Without a valid ID the tag, banner, and preference control are disabled. No GA API secret or account credentials belong in frontend variables. Review analytics/consent/privacy configuration for the audiences served.
4. Consent controls load no Google scripts or analytics requests until the visitor accepts. Reject and Accept have equal prominence. The footer preference control supports withdrawal; withdrawal disables collection, clears accessible GA cookies, and reloads the document when the preference is saved. Consent preference expires after 180 days. Quote contact consent is separate.
5. Mark `generate_lead` as a GA4 key event. `contact_click` includes only `contact_method=phone|email` and is an intent signal. Lead events include only service type and selected plan, never form contents or request IDs. Page paths/referrers are sanitized; full query strings are not sent by app events. Denied/blocked analytics will undercount leads; use saved database leads as the business record.
6. Add Domain property `acaiwarranty.com` in Google Search Console. Add its TXT verification record at the authoritative DNS provider, verify, retain the record, and submit `https://acaiwarranty.com/sitemap.xml`.
7. Use URL Inspection → Test live URL → Request indexing for the homepage and primary services/plans. Import the verified property in Bing Webmaster Tools. In GA4 Admin → Product links → Search Console links, link the property/web stream.
8. Verify production response codes: existing pages 200; an invented URL 404; www redirects permanently to non-www; HTTP redirects to HTTPS. Check View Source for content and per-route titles/canonicals, plus robots, sitemap, OG image/icons, and response headers.
9. Test accept/reject/withdraw in a fresh browser; inspect network requests and GA4 DebugView/Realtime. Submit a genuine test quote, check the saved lead and notification, then confirm one conversion. Recheck direct quote links such as `/contact?service=auto&plan=gold`.
10. Check PageSpeed Insights, mobile navigation/forms, Rich Results Test, Schema Markup Validator, and social previews. The Wyoming mailing address alone does not qualify for a Google Business Profile; only use a profile if the actual business model/location is eligible.

### Local checks

On Node 24: `npm run typecheck`, `npm run lint`, `npm run build`, `node tests/seo.test.mjs`, and `node tests/quote-submission.test.mjs`.

For optional browser checks, start headless Chrome with `--remote-debugging-port=9222`. Make a temporary test build using `VITE_GA4_MEASUREMENT_ID=G-TESTSEO123 VITE_SUPABASE_URL=https://seo-test.supabase.co VITE_SUPABASE_PUBLISHABLE_KEY=public-placeholder npm run build`, then run `node tests/seo-browser.mjs`. The test serves local generated files and intercepts Google/Supabase requests; it sends no real analytics, leads or emails. Rebuild with your normal environment afterward. The real Vercel redirect/status behavior and Google delivery must still be checked after deployment.

References: [Vite prerendering](https://vite.dev/guide/ssr#pre-rendering-ssg), [Vercel custom 404](https://vercel.com/kb/guide/custom-404-page), [Vercel clean URLs](https://vercel.com/docs/project-configuration/vercel-json), [Google basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode).
