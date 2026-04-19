---
name: deploy-vercel
description: Safely deploy the current project to Vercel with pre-flight checks. Use when the user says "deploy", "ship to prod", "push to vercel", or similar. Prevents recurring issues: wrong project targeting, missing env vars, CWD drift, trailing-newline env vars, and post-deploy blind spots.
---

# Deploy to Vercel (safe)

Runs a strict pre-flight checklist before any Vercel deployment. Stops if any step fails — the user has been bitten by wrong-project targeting and empty env vars multiple times.

## Preflight Checklist

1. **Confirm working directory**
   - Run `pwd` and verify it matches the project root the user intends to deploy
   - Verify `.vercel/project.json` exists; read it to get `projectId` and `orgId`

2. **Confirm correct Vercel project**
   - Run `vercel project ls --scope <team-slug>` and confirm the linked project is correct
   - If no project is linked, STOP and ask the user which Vercel project to target

3. **Verify env vars locally**
   - Read `.env.example` to get the full list of required variables
   - Read `.env.local` (without echoing secrets) and confirm every `.env.example` key is present and non-empty
   - Flag any placeholders (empty, `"your_key_here"`, etc.)

4. **Verify env vars on Vercel**
   - Run `vercel env ls production --scope <team-slug>`
   - Compare output against `.env.example` — flag any missing or empty keys
   - **CRITICAL**: If any env var needs to be added or fixed, use `printf 'value' | vercel env add KEY production` — never `echo`, which appends a trailing newline that breaks HTTP header values (this has caused prior Sanity projectId failures)

5. **Run local build**
   - Run `npm run build` (or `next build`) and confirm it exits 0
   - If build fails, STOP — do not deploy a broken build

6. **Deploy**
   - Run `vercel deploy --prod --scope <team-slug>`
   - Capture the deployment ID and inspect URL

7. **Post-deploy verification**
   - Poll the deployment state via Vercel MCP (`mcp__…__get_deployment`) or `vercel inspect <url>` until `READY`
   - Fetch the production URL (`oneclickit.blog`, `oneclickit.today`, or whatever is aliased) and verify:
     - HTTP 200
     - Correct `<title>` and meta description
     - No obvious React error placeholder
     - `<link rel="canonical">` present and correct

8. **Report**
   - Summarize: deployment ID, build time, URL, aliased domains, anything notable in logs
   - If anything failed, surface the specific error and stop — do not auto-retry

## Abort conditions
- `.vercel/project.json` missing or pointing to the wrong project
- Any required env var missing or empty locally or remotely
- `npm run build` non-zero exit
- Destination production URL returns non-200 or renders an error page

Never run `vercel env rm` or `vercel remove` without explicit user approval.
