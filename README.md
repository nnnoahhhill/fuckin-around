# Human Futures Capital

Invest in people.

Human Futures Capital is a planned marketplace for crowdfunding investment into individuals through investee-controlled companies. People list themselves, choose from approved valuation/security options, form a dedicated C-corp, issue non-voting economic securities, and accept investment through a compliant funding-portal or broker-dealer rail. Investors browse humans like a creator marketplace, review goals, risks, revenue scope, transparency level, updates, spend, and traction, then invest, track holdings, receive distributions, choose approved reinvestment options, message investees, answer help requests, and follow progress from a portfolio dashboard.

The core bet: money kills dreams, belief compounds motivation, and direct investment into capable humans can unlock teachers, doctors, researchers, founders, creators, operators, and other high-agency people before traditional capital notices them. The product has to include accountability from day one: revenue and spend tracking, accounting/bank integrations, investee updates, investor-visible milestones, revenue classification, audit logs, payout calculations, reserve policies, and clear rules for what counts as company revenue versus excluded personal salary, VC-funded startup revenue, grants, or unrelated activity.

Investors do not receive voting rights. Investees can still publish non-binding polls, ask backers for help, sell approved a la carte services, and build a community that wants them to win because upside is aligned.

The fastest legal MVP is not ordinary Stripe-powered equity crowdfunding. Stripe can support subscriptions, paid messaging, bookings, and a la carte investee services after approval, but live investment money, escrow, securities issuance, investor checks, closings, and cap-table records should run through a registered partner. The first Vercel build should be a Next.js marketplace with profiles, dashboards, messaging, updates, admin review, mock investment handoff, revenue reporting, and partner-ready integration boundaries.

## MVP surfaces

- Marketplace: browse investees by domain, ambition, transparency, stage, raise, revenue, and update cadence.
- Investee profile: thesis, story, use of funds, valuation option, revenue scope, risk disclosures, updates, help requests, and legal offering link.
- Investor dashboard: holdings, invested amount, distributions, reinvestment election, messages, updates, and portfolio activity.
- Investee dashboard: formation checklist, profile builder, revenue classifier, spend tracker, update composer, polls, and payout status.
- Admin console: approve profiles, review revenue classifications, reconcile partner investment events, moderate content, and calculate distributions.

## Build direction

- App: Next.js App Router on Vercel.
- Database: Neon Postgres with Prisma.
- Auth: Clerk or Auth.js.
- UI: Tailwind and shadcn/ui.
- Payments: Stripe Connect only for non-investment services after approval.
- Investment rail: registered funding portal or broker-dealer API.
- Accounting: manual CSV first, then Plaid, QuickBooks, or Xero.
- Jobs: Inngest or Trigger.dev for webhooks, reporting, and reconciliation.
- Realtime: Ably or Pusher for messaging and live dashboard counters.

Full implementation details live in [`docs/hfc-mvp-blueprint.md`](docs/hfc-mvp-blueprint.md).
