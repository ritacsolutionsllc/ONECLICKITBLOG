---
name: batch-pr-audit
description: Audit open PRs across one or more repos in parallel, merge the safe ones, flag the rest. Use when the user says "merge the dependabot PRs", "sweep my PRs", "check all repos", or needs to manage PRs across multiple projects.
---

# Batch PR Audit & Merge

Uses parallel Task agents to process multiple repos concurrently instead of sequentially. Returns a consolidated report.

## Workflow

1. **Discover repos**
   - If the user names repos, use that list
   - Otherwise, run `gh repo list <org-or-user> --limit 50` and confirm scope with the user

2. **Spawn one agent per repo** (in a single message with multiple Agent tool calls for true parallelism)
   - Each agent runs `gh pr list --repo <repo> --state open --json number,title,author,mergeStateStatus,statusCheckRollup,isDraft`
   - Each agent attempts `gh pr merge <num> --auto --squash` on PRs that are:
     - Not draft
     - All checks passing
     - From `dependabot[bot]` OR explicitly whitelisted authors
     - Not modifying workflow files, `package.json` major versions, or security-critical paths
   - Each agent reports back: `{ repo, merged: [...], flagged: [...], errors: [...] }`

3. **Consolidate**
   - Produce a single markdown table: `repo | PR# | author | action | note`
   - Group by status: ✅ merged, ⚠️ flagged for review, ❌ errored

4. **Flag, don't merge, when:**
   - Merge conflicts
   - Failing CI
   - Author not in whitelist
   - PR title contains `BREAKING`, `major`, or `!:` (conventional breaking change)
   - Touches `.github/workflows/*`, `infrastructure/`, `prisma/migrations/`

## Output format

```
## PR Audit — 2026-04-13

| Repo | PR | Author | Action | Note |
|------|----|--------|--------|------|
| oneclickit.blog | #6 | dependabot | ✅ merged | next patch 14.2.36 |
| ocitsecurity | #42 | user | ⚠️ flagged | CI failing |
| imperium | #9 | dependabot | ✅ merged | types patch |

Merged: 2 · Flagged: 1 · Errored: 0
```

Never force-merge. Never `--admin` override. Never skip CI.
