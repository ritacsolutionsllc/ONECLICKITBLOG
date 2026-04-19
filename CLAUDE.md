# OneClickIT.blog

## Project Overview
Tech blog built with Next.js 14 (App Router) + Sanity v3 CMS. Deployed on Vercel.

## Deployment & Environment
- Always verify required env vars (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `SANITY_REVALIDATE_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`) are set BEFORE running Vercel deploys
- Confirm correct Vercel project with `vercel project ls` before pushing env vars or deploying — past sessions have targeted the wrong project (e.g. `ocitsecurity` instead of `oneclickit.blog`)
- When deploying to Vercel, always run from the project root directory — verify with `pwd` first
- **Env var gotcha**: `echo "value" | vercel env add` adds a trailing newline that breaks HTTP headers (e.g. Sanity projectId validation). Use `printf 'value' | vercel env add` instead
- Vercel auto-deploys on push to `main`. Manual `vercel deploy --prod` only needed for hotfixes
- Custom domains aliased: `oneclickit.blog`, `oneclickit.today`, `www.oneclickit.today`, plus redirect to `oneclickittoday.com` via `next.config.mjs`

## Verification Before Action
- Verify eligibility/feasibility BEFORE scaffolding implementation (check API quotas, plan tiers, file access)
- For external APIs (Sanity, Anthropic, Stripe), confirm the API key tier/role has required permissions before writing code — Sanity "Access Manager" tokens cannot create documents; need "Developer" role
- When a tool returns 4xx/5xx, surface the specific error in the task description before retrying with a different approach
- Use `curl -I` to verify HTTP responses and meta tags when `WebFetch` results seem incomplete or truncated

## Dev Environment Notes
- On Windows, `echo` pipes append trailing newlines — prefer `printf` for env var values
- Turbopack dev server has file-watching/caching bugs on Windows — verify hydration-sensitive changes with a production build (`next build && next start`), not just dev mode
- If merge conflicts appear suspicious after a stash or rebase, restart the dev server to clear stale cache before investigating
- `next-sanity@9.x` requires `sanity@^3` and React 18 — do not bump to `next-sanity@12` without also upgrading to Next.js 16

## Tech Stack
- **Framework**: Next.js 14 with TypeScript, Tailwind CSS, App Router
- **CMS**: Sanity v3, embedded Studio at `/admin` via next-sanity
- **Content fetching**: GROQ via `sanityFetch()` with tag-based ISR revalidation
- **Image handling**: `@sanity/image-url` via `urlFor()` helper
- **Theme**: next-themes with dark mode support

## Key Conventions
- Server Components by default. Client components only for interactivity (`'use client'`)
- All Sanity queries in `src/sanity/lib/queries.ts` using `groq` tagged templates
- All TypeScript types in `src/types/sanity.ts`
- All Sanity schemas in `src/sanity/schemas/` (documents/ and objects/)
- Tag-based cache invalidation: every `sanityFetch()` declares tags, webhook maps `_type` to tags
- Affiliate links use `rel="nofollow sponsored"` automatically via PortableText `isAffiliate` annotation
- Feature flags (`enableAds`, `enableAffiliate`) controlled from Sanity siteSettings

## File Structure
```
src/
  app/              # Next.js App Router pages
    (blog)/         # Blog route group (post, digest, category)
    (legal)/        # Legal pages (about, privacy, terms, affiliate)
    admin/          # Sanity Studio embed
    api/            # Webhook + worker API stubs
  sanity/
    schemas/        # Sanity document and object schemas
    lib/queries.ts  # All GROQ queries
    fetch.ts        # sanityFetch() helper (server-only)
    client.ts       # Public Sanity client
    image.ts        # urlFor() image helper
  components/       # React components organized by domain
  lib/              # Utilities and constants
  types/            # TypeScript interfaces
```

## Commands
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npm run lint` — ESLint check

## Content Types
Documents: `original_post`, `buyer_guide`, `news_digest`, `trend_radar`, `source`, `category`, `author`, `siteSettings`
Objects: `seo`, `portableText`, `digestItem`, `product`, `trendItem`

## Revalidation
Sanity webhook POSTs to `/api/revalidate` with HMAC signature. Maps `_type` to cache tags for surgical invalidation.

## Worker APIs (stubs, ready for implementation)
- `POST /api/ingest` — RSS feed ingestion
- `POST /api/trends` — Trend discovery
- `POST /api/draft` — AI article drafting
All require `Authorization: Bearer {CRON_SECRET}` header.
