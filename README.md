# SchoolApp 360 — Launching Soon

A minimal "launching soon" landing page for SchoolApp 360, a School ERP
platform (Admin Web Dashboard, Teacher app, Parent app on one backend). The
page collects early-access requests from a limited number of schools ahead
of general launch. Built with Next.js App Router, plain JavaScript, and
Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your MongoDB URI + Resend API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build locally
npm run lint    # ESLint
```

## Environment variables

See `.env.example`.

- `MONGODB_URI` — **required**. Without it, submissions fail with a `500`
  (storage is the source of truth now, so this isn't a soft-fail).
- `RESEND_API_KEY` — optional. Without it, submissions still succeed and are
  stored, but no notification email goes out.

## Project structure

```
app/
  page.js                     The entire landing page (hero + early-access form)
  layout.js                   Root layout: fonts, metadata, JSON-LD
  api/early-access/route.js   POST endpoint: validates, rate-limits, stores, emails
  sitemap.js, robots.js       Metadata route conventions
  opengraph-image.js          OG image (generated with next/og)
components/
  EarlyAccessForm.js          Name / email / school / phone lead-capture form
  Toast.js                    Bottom slide-up toast for success/error feedback
  JsonLd.js                   Structured-data helper
lib/
  site-config.js              Site name, tagline, description, URL, contact email
  structured-data.js          Organization JSON-LD
  rate-limit.js                In-memory sliding-window rate limiter
  mongodb.js                   Cached MongoDB Atlas client
  email.js                     Sends the early-access notification via Resend
  og.js                        Shared template for the generated OG image
```

## How the early-access form works

`EarlyAccessForm` posts to `POST /api/early-access`, which, in order:

1. **Rate-limits by IP** — 5 requests per minute (`lib/rate-limit.js`). Over
   the limit gets a `429` with a `Retry-After` header. This limiter is
   process-local; if it needs to hold up across multiple server instances,
   swap the in-memory `Map` for a shared store (Vercel KV / Upstash Redis).
2. **Rejects non-JSON requests** (`415`) and oversized bodies (`413`).
3. **Honeypot check** — a hidden `company` field real users never fill in.
   Bots that autofill every field trip it; the request is silently dropped
   with a fake success response.
4. **Validates** `name`, `email`, `schoolName`, `phone` — all required, each
   capped at 200 characters (phone at 30).
5. **Stores the submission** in MongoDB Atlas, collection
   `early_access_requests` (`lib/mongodb.js`), along with IP and user agent.
   A storage failure returns a real `500` — this is the data of record.
6. **Emails a notification** to `siteConfig.email` via Resend
   (`lib/email.js`). A missing key or failed send doesn't fail the request —
   the submission is already stored.

The form itself shows field-level errors inline and a bottom toast for the
overall result (`components/Toast.js`), and resets on success.

## Before going live

- **MongoDB Atlas**: create a cluster, a database user, and a connection
  string; set `MONGODB_URI`. Restrict network access to Vercel's IPs or use
  Atlas's "allow from anywhere" only as a temporary measure.
- **Resend**: set `RESEND_API_KEY`, and verify a sending domain with Resend
  so `EARLY_ACCESS_FROM_EMAIL` can use your own domain instead of the shared
  `onboarding@resend.dev` test sender.
- **Site URL** (`lib/site-config.js`: `siteConfig.url`): update once you know
  the production domain — it feeds metadata, sitemap, and JSON-LD.

## Deploying

Ready to deploy on [Vercel](https://vercel.com/new) — connect the repo, add
`MONGODB_URI` and `RESEND_API_KEY` as environment variables, and deploy.
