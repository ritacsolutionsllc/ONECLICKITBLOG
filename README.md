# OneClickNews

> Editorial content hub and product showcase for RITAC Solutions

**Live URL:** https://oneclickitnews.base44.app  
**Pricing:** Free — content site (newsletter + sponsorship monetization)  
**Enforcement Gates:** 0/3 passing  
**Current Status:** 🔴 7 /admin/* routes publicly exposed. No editorial login. FTC disclosure missing.

---

## Implementation Priority: #10 / 13

## Enforcement Gate Checklist

| Gate | Status |
|------|--------|
| Routing (Public/Protected/Admin classification) | ❌ |
| Auth (Login + Signup pages) | ❌ |
| Pricing (/pricing page with Stripe CTAs) | ❌ |
| Entitlements (PlanGate on premium features) | ❌ |
| Stripe Webhook | ✅ Registered May 29 2026 |
| Admin Safety (AuthGuard adminOnly) | ❌ |

---

## Protected Routes

- `/admin/AdminDashboard`
- `/admin/AdminPosts`
- `/admin/AdminMedia`
- `/admin/AdminProducts`
- `/admin/AdminTopics`
- `/admin/AdminAnalytics`

## Plan Gates

- `N/A — content site, no paid tiers`

---

## Backend Functions (all live)

| Function | Endpoint |
|----------|----------|
| Stripe Checkout | `POST https://superagent-b2d614b7.base44.app/functions/createStripeCheckout` |
| Billing Portal | `POST https://superagent-b2d614b7.base44.app/functions/createBillingPortal` |
| Usage Gate | `POST https://superagent-b2d614b7.base44.app/functions/checkUsageGate` |
| Export Gate | `POST https://superagent-b2d614b7.base44.app/functions/exportGate` |
| Audit Logger | `POST https://superagent-b2d614b7.base44.app/functions/auditLogger` |

---

## Universal Components Required

- `AuthGuard.jsx` — wraps all protected routes
- `PlanGate.jsx` — wraps premium features with upgrade prompt
- `BillingPortalButton.jsx` — opens Stripe customer self-serve portal

---

## QA Checklist

- [ ] Logged-out users cannot access protected routes (test in incognito)
- [ ] /login and /signup are separate with correct redirect behavior
- [ ] Public homepage shows marketing content — not dashboard UI
- [ ] /pricing page exists and is publicly accessible
- [ ] Pricing CTAs trigger createStripeCheckout correctly
- [ ] Premium features show upgrade prompt to free users
- [ ] Premium features blocked at logic layer (not just UI)
- [ ] Admin routes return 403 for non-admin authenticated users
- [ ] BillingPortalButton opens Stripe customer portal
- [ ] No demo/test data visible to real users
- [ ] Mobile layout (375px) — no overflow or broken elements

---

## Related Apps (Cross-sell)

All 13 apps: https://oneclickitonboarding.base44.app  
Book a demo: https://calendly.com/oneclickitllc

---

*Managed by RITAC Solutions · RITAC Command AI Agent · May 2026*
