# OneClickIT Newsroom Redesign — Plan

This document captures the scaffold for redesigning oneclickit.today as a
newsroom + corporate blog, modeled on the Vercel "Wisp Corporate Blog Starter"
IA and design language.

## Important: CMS decision needed

The live request was to scaffold on top of the **Wisp Corporate Blog Starter**.
This repository, however, is currently wired to **Sanity v3** (see
`sanity.config.ts`, `src/sanity/`, `next-sanity` dep). Two paths:

- **Path A — Migrate to Wisp.** Drop Sanity, add `@wisp-cms/client`, point
  fetchers at `wisp.posts.*`. Required env: `NEXT_PUBLIC_BLOG_ID`. Lower
  control, faster publishing UX.
- **Path B (recommended) — Keep Sanity, apply the redesign on top.** The CMS
  layer already has schemas, GROQ, ISR tag invalidation, embedded Studio at
  `/admin`, and worker stubs. The redesign is mostly a UI/IA layer.

The scaffolded files in this PR are CMS-agnostic. The pages and components
that would consume the CMS are documented in this file (and in the chat
response that produced this PR) but not committed yet, pending the CMS
decision.

## Route map

```
/                                     Editorial homepage (featured + latest + topics + spotlight + CTA)
/news                                 News archive (paginated, filterable)
/news/page/[page]                     Pagination
/news/[slug]                          Article page (TOC + related + end CTA)
/topics                               Index of all categories
/topics/[slug]                        Category landing
/topics/[slug]/page/[page]            Category pagination
/tag/[slug]                           Tag archive
/partners                             Partners & Active Projects (this PR)
/partners/[slug]                      Project detail
/about                                Company / mission
/contact                              Contact + lead form placeholder
/search?q=                            Search results
/api/newsletter                       Subscribe handler (placeholder)
/api/revalidate                       CMS webhook (already exists)
/sitemap.xml                          (already present)
/feed.xml                             RSS feed
```

Preserved from current repo: `/admin`, `/threat-map`, `/trend-radar`, `(legal)/*`.

## Folder structure (target)

```
src/
  app/
    (marketing)/      about, contact, partners
    (editorial)/      news, topics, tag, search
    api/              newsletter, revalidate (existing)
  components/
    layout/  home/  article/  news/  partners/  seo/  ui/
  config/    site.ts, categories.ts, nav.ts
  data/      partners.ts (this PR)
  lib/       wisp.ts (or sanity-content.ts), seo.ts, schema.ts, format.ts
  types/     content.ts, partners.ts (this PR)
```

## Content categories (canonical)

Company News, AI & Automation, Managed IT, Cybersecurity, Local Business Tech,
Product Updates, Partner Spotlights, Case Studies.

## SEO defaults

- `src/lib/seo.ts` — `buildMetadata()` with canonical, OG, Twitter (this PR).
- `src/lib/schema.ts` — Organization, Article, BreadcrumbList, FAQPage builders.
- Per-route `generateMetadata` for dynamic pages.
- One `<h1>` per page; section `<h2>`; downgrade CMS-emitted `h1`s in body.
- Keep `sitemap.ts` and `robots.ts`; add `feed.xml/route.ts`.
- Legacy redirects to add in `next.config.mjs`:
  - `/blog/:slug` → `/news/:slug` (permanent)
  - `/category/:slug` → `/topics/:slug` (permanent)
  - `/projects` → `/partners` (permanent)
  - `/projects/:slug` → `/partners/:slug` (permanent)

## Partners data model

Local typed config (`src/data/partners.ts`) keyed by slug. Promote to a CMS
collection only when non-engineers need to edit. See `src/types/partners.ts`.

## Next steps (after CMS decision)

1. Pick Path A or B.
2. Install shadcn primitives: `npx shadcn@latest add button card badge input separator skeleton`.
3. Add `src/components/layout/{SiteHeader,SiteFooter,Container}.tsx`.
4. Add home blocks: `FeaturedHero`, `LatestNewsGrid`, `TopicSection`, `PartnerSpotlight`, `NewsletterCTA`.
5. Add news + article pages (`(editorial)` route group) and the CMS adapter.
6. Add `opengraph-image.tsx` for `/news/[slug]` and `/partners/[slug]`.
7. Wire `/api/newsletter` to provider (Resend/ConvertKit/Buttondown).
8. QA Lighthouse on `/`, `/news`, an article, `/partners`. Target >=95 SEO/Best Practices.
