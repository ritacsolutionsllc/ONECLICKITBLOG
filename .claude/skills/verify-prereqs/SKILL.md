---
name: verify-prereqs
description: Validate prerequisites (env vars, API quotas, API key permissions, file paths, eligibility criteria) BEFORE scaffolding implementation. Use at the start of any new task that involves external APIs, deployment, or content generation. Prevents wasted work from hitting quota/permission/eligibility blockers mid-build.
---

# Verify Prerequisites

Front-loads verification so we don't scaffold work that will die at runtime. Do this BEFORE writing implementation code.

## Generic checklist

For any task that touches:

### External APIs (Anthropic, OpenAI, Gemini, Stripe, Sanity, Sendgrid, etc.)
- Confirm the API key exists in the expected env var
- Confirm the key's tier/plan has the required capability (e.g. Gemini free tier has **zero image quota**; Sanity "Access Manager" role **cannot create documents** — need "Developer" role)
- Make a minimal test call (e.g. list models, get balance, fetch one record) and surface the status code
- If the key is invalid or underprivileged, STOP and ask the user to provide a correct one BEFORE continuing

### Deployment targets
- Confirm correct Vercel project via `vercel project ls` and `.vercel/project.json`
- Confirm CWD with `pwd`
- Read `.env.example`, confirm all keys exist in `.env.local` and on Vercel (use `vercel env ls`)

### Files / data the user referenced
- If the user references a file path, run `ls` or a read to confirm it exists before planning around it
- If the user references a URL, fetch it once and confirm it returns 200 with expected content

### Eligibility / feasibility (grants, features, integrations)
- If the task is "apply for X" or "integrate Y", verify the eligibility criteria or integration requirements FIRST
- Scaffolding an application for a grant the user doesn't qualify for wastes an hour

## Output format

After running checks, produce a compact checklist like:

```
Prerequisite verification:
✅ CWD: /path/to/project (correct)
✅ Vercel project: oneclickit.blog (linked)
✅ .env.local: 6/6 required keys present
❌ SANITY_API_WRITE_TOKEN: role is "Viewer" — need "Developer" for createOrReplace mutations
⚠️  Gemini API key: tier = free, image model quota = 0/month

Blocked. Ask user for:
1. A Sanity token with Developer role
2. A decision: skip image generation, or upgrade Gemini plan?
```

Then STOP and wait for the user to resolve blockers. Do NOT proceed with implementation while there are ❌ items.
