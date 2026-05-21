# Human Futures Capital

Invest in people.

Human Futures Capital is a planned marketplace for investing directly in people. The company, stock, contracts, and payment rails are the legal machinery that materializes the agreement; the actual product is two humans choosing trust, alignment, accountability, and shared upside. People list themselves, explain what they want to become, pick approved valuation/security terms, form a dedicated C-corp to represent the agreement, and accept investment through a compliant funding-portal or broker-dealer rail. Investors browse humans like a creator marketplace, review goals, risks, revenue scope, transparency level, updates, spend, and traction, then invest, track holdings, receive distributions, choose approved reinvestment options, message investees, answer help requests, and follow progress from a portfolio dashboard.

The core bet: money kills dreams, belief compounds motivation, and direct investment into capable humans can unlock teachers, doctors, researchers, founders, creators, operators, and other high-agency people before traditional capital notices them. The product has to include accountability from day one: revenue and spend tracking, accounting/bank integrations, investee updates, investor-visible milestones, revenue classification, audit logs, payout calculations, reserve policies, and clear rules for what counts as company revenue versus excluded personal salary, VC-funded startup revenue, grants, or unrelated activity.

Investors do not receive voting rights. Investees can still publish non-binding polls, ask backers for help, sell approved a la carte services, and build a community that wants them to win because upside is aligned.

The fastest legal MVP is not ordinary Stripe-powered equity crowdfunding. Stripe can support subscriptions, paid messaging, bookings, and a la carte investee services after approval, but live investment money, escrow, securities issuance, investor checks, closings, and cap-table records should run through a registered partner. The first Vercel build should be a Next.js marketplace with profiles, dashboards, messaging, updates, admin review, mock investment handoff, revenue reporting, and partner-ready integration boundaries.

## Representation model

Buying stock in a company has always been an agreement. A stock certificate is basically a signed agreement on paper: here is what you bought, what you expect, what the company owes, and what rules everyone can enforce. The real thing underneath is trust that the company will pursue the goals you backed. HFC applies that same idea to a person directly. The stock is just how the trust, expectations, rules, regulation, monitoring, and security get communicated in a form the world can enforce.

Stock is not the soul of the product; it is the best available physical/legal representation of the trust agreement. The C-corp exists so the agreement has books, taxes, ownership records, distributions, and enforceable obligations. That paper-first model is old-school. Vintage. Useful, but not sacred. HFC is the new-day version: direct human backing with better transparency, better accountability, and better alignment. A crypto version could eventually represent the same thing as fixed-price, preset, compliance-gated tokens: not open-market meme coins, not price discovery by speculation, but blockchain-native private stock whose price changes through approved valuation events the way private company equity or VC rounds do. The MVP should model ownership, transfers, valuation events, restrictions, and audit history as an append-only ledger internally so the system can migrate to tokenized private securities if regulators, partners, and users decide that is the better rail.

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
- Ledger: append-only ownership, valuation, distribution, transfer, and reinvestment events.
- Jobs: Inngest or Trigger.dev for webhooks, reporting, and reconciliation.
- Realtime: Ably or Pusher for messaging and live dashboard counters.

Full implementation details live in [`docs/hfc-mvp-blueprint.md`](docs/hfc-mvp-blueprint.md).
