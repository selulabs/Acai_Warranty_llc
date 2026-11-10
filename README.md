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

The quote form is frontend-only and does not send or store anything. To connect it, replace the body of `submitQuoteRequest` in `src/lib/quoteSubmission.ts` with an insert into your quote requests table. The payload type is `QuoteRequestPayload` in `src/types/quote.ts`. The form component does not need to change.

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
