# Human Futures Capital MVP blueprint

Human Futures Capital is an investment marketplace for backing people directly. The investee-controlled company, securities, contracts, and payment rails materialize the agreement; they are not the core thing being bought. The core thing is two sides choosing trust, aligned goals, accountability, and shared upside around a person's future work. The marketplace should feel closer to a creator platform than a brokerage terminal: browse people, understand their plans, invest when legally eligible, follow progress, receive updates, help them win, and track distributions.

This document turns the concept into an MVP that can ship on Vercel while keeping regulated activity on the correct rails. Counsel still has to bless the final contracts, offering flow, disclosures, tax flow, and payments setup before accepting investment money.

## 1. Hard calls

1. Do not process investment money through ordinary Stripe Checkout. Stripe marks crowdfunding, equity crowdfunding, investment/brokerage services, escrow, money transmission, and third-party settlement as restricted or limited-availability categories. Use Stripe for subscriptions, messaging products, booking calls, and paid services only after Stripe approval for the applicable platform model.
2. Do not operate as the securities intermediary in the MVP. Reg CF transactions must happen through an SEC-registered broker-dealer or funding portal. The HFC app can host profiles, diligence content, updates, portfolio views, and community tooling; investment order entry, escrow, securities issuance, and required investor limit checks belong to the registered partner.
3. Do not use S-corps for marketplace investees. S-corps cannot have partnerships/corporations/nonresident alien shareholders and are not designed for many investors or custom classes.
4. Use one Delaware C-corp per investee to represent the direct person-backed agreement in a form the legal, tax, accounting, and payment systems understand. The investee owns and operates that company. Investors buy non-voting securities issued by that company as the physical/legal representation of the trust agreement, not as control over the person's body, labor, or all future personal income.
5. No secondary market in MVP. Resales create securities exchange/ATS/broker-dealer issues. Start with locked holdings, issuer-approved transfers, and later integrate an ATS or broker-dealer partner.
6. No guaranteed buyback or cash-out promise. A reserve policy can exist inside the investee company, but the platform must not promise liquidity unless the legal and capital structure actually supports it.

## 2. Product thesis math for the pitch

These are pitch-model numbers, not legal offering claims.

### Education and teachers

- UNESCO reports 269 million higher-education students worldwide in 2024, equal to 43% of the typical higher-education age cohort.
- That implies a same-age cohort around 625.6 million people and about 356.6 million people not enrolled in higher education.
- US longitudinal data shows 8.3% of 2015-16 bachelor's earners became new classroom teachers within four years. Older data puts recent graduate entry into elementary/secondary teaching around 12%.
- Conservative model: if 8.3% of the 356.6 million non-enrolled cohort would have become teachers with access, that is about 29.6 million possible teachers.
- UNESCO projects a 44 million primary/secondary teacher deficit by 2030. The modeled lost-teacher pool would cover about 67% of that shortage.

### Doctors and health workers

- WHO projects an 11.1 million global health-worker shortfall by 2030.
- A Lancet/IHME workforce analysis estimated a 2019 shortage of 6.4 million physicians against universal health coverage targets.
- Scenario model: if just 1% of the non-enrolled higher-education-age cohort entered and completed physician training, that is 3.6 million additional doctors; at 2%, it is 7.1 million, enough to cover the estimated physician gap.
- A physician supply study found 10 additional primary-care physicians per 100,000 people was associated with fewer cardiovascular, cancer, and respiratory deaths. The honest claim is not "every doctor saves X lives"; the useful claim is "doctor density moves mortality."

### Cancer research tries

- IARC reported nearly 20 million new cancer cases and close to 10 million cancer deaths in 2022, with cases projected to reach 35 million by 2050.
- Clinical development success is low. Oncology drug phase-1-to-approval estimates commonly land around 7.9% to 14.3%, depending on cohort and methodology.
- Scenario model: 1,000 extra serious oncology clinical candidates could produce roughly 79 to 143 approvals or new indications if historical conversion rates held. Papers do not equal cures, but more capable researchers and funded attempts increase the surface area for breakthroughs.

## 3. Legal product shape

### What is actually being invested in

The product language should say investors back the person directly. The legal structure should say the investment is represented by securities issued by the person's dedicated C-corp. That distinction matters:

- The emotional and product promise is human-first: trust, accountability, collaboration, and aligned goals.
- The legal instrument is company-first because US securities, tax, banking, and accounting systems need an issuer, books, cap table, and enforceable obligations.
- The C-corp materializes the agreement. It should not be described as the whole point of the investment.
- The investee still controls their life and work. Investors receive economic rights defined by the offering terms, not voting rights or personal control.

### MVP investment rail

Use a partner funding portal or broker-dealer for live investments.

1. HFC profile exists in HFC app.
2. Investee completes formation and diligence.
3. Counsel prepares offering docs for the investee's C-corp.
4. Registered partner hosts the official offering page or embedded order flow.
5. Investor clicks "Invest" in HFC.
6. HFC redirects or embeds partner flow.
7. Partner handles KYC, AML, accreditation/investment limits, order entry, escrow, closing, and securities records.
8. HFC stores read-only normalized investment records from partner webhooks/API.
9. HFC displays holdings, posts, revenue reports, distributions, and messages.

### Entity options

| Option | MVP decision | Why |
| --- | --- | --- |
| Investee Delaware C-corp | Use | Supports non-voting preferred/common, many investors, VC-compatible exclusions, cleaner cap tables. |
| One parent company with classes per person | Do not use for MVP | Cap table, tax, fiduciary, bankruptcy, and accounting risk compounds across every investee. |
| S-corp | Do not use | Shareholder and stock-class restrictions break marketplace mechanics. |
| Trust per investee | Not MVP | Can work for some structures, but adds trustee, tax, fiduciary, and state-law complexity. |
| Revenue-share note | Keep as counsel-approved instrument option | Easier investor story than common stock, but still likely a security. |

### Security instrument

Default MVP instrument: non-voting preferred stock or revenue-share note issued by each investee C-corp. Buying stock in a company has always been an agreement. A stock certificate is basically a signed agreement on paper: what was bought, what the holder expects, what the issuer owes, and what rules can be enforced. The real thing underneath is trust that the issuer will pursue the goals the investor backed. HFC applies that same agreement model to a person directly. Stock is just how the trust, expectations, rules, regulation, monitoring, and security get communicated in a form the world can enforce.

Stock is not the soul of the product; it is the most effective representation available because the legal system already understands private company ownership, cap tables, transfer restrictions, dividends, distributions, and taxable events. That paper-first model is old-school. Vintage. Useful, but not sacred. HFC should be the new-day version: direct human backing with better transparency, better accountability, and better alignment.

Required terms:

- No investor voting rights.
- Economic participation only in defined company revenue.
- Clear exclusions for outside startups, employer salary, grants, or third-party-funded ventures unless assigned into the investee C-corp.
- Distribution policy: monthly, quarterly, or annual only when board-approved and legally available.
- Reinvestment election: investor forgoes a cash distribution and receives additional securities only through the approved issuance process.
- Transfer restrictions: no public resale, no marketplace secondary sale until an ATS/broker-dealer integration exists.
- Anti-fraud reps: investee must report revenue truthfully and maintain books.

### Stock today, tokenized private stock later

Crypto could eventually represent the same agreement better than spreadsheet cap tables, but not as a launch assumption and not as open-market speculation.

The target model would be fixed-price, compliance-gated tokens representing private securities:

- Token price is preset by the offering or approved valuation event.
- Price changes the way private company valuation changes: new round, board/counsel-approved valuation update, conversion event, buyback/tender event, or other documented corporate action.
- Token transfers obey securities restrictions, investor eligibility, lockups, jurisdiction limits, and partner approval.
- The token is a blockchain implementation of private stock trading or VC-style ownership records, not a public market where hype sets the price.
- The user-facing product still says "back this person"; the token is just the ownership record.

The MVP should keep the database ledger-ready:

- Append-only ownership events.
- Immutable valuation events.
- Explicit transfer restrictions.
- Source-linked issuance and cancellation records.
- Audit history for every distribution, reinvestment, transfer, and cap-table mutation.
- No business logic that depends on mutable balances without the underlying event trail.

That lets HFC migrate to tokenized private securities later if regulators, partners, and customers decide it is good, without rewriting the economic model.

### Revenue scope

All money is classified before it can affect investor economics.

| Revenue type | Included by default? | Treatment |
| --- | --- | --- |
| Products/services sold by investee C-corp | Yes | Shared under offering terms. |
| Creator income assigned to C-corp | Yes | Shared under offering terms. |
| A la carte coaching/calls sold through HFC | Yes if sold by C-corp | Stripe Connect seller payout, accounting sync. |
| Salary from employer | No | Personal income, excluded. |
| VC-backed startup owned by separate company | No | Excluded unless investee contributes shares/IP/revenue rights to HFC investee C-corp. |
| Grants/scholarships | Depends | Must be classified in offering docs. |
| Passive personal investments | No | Excluded. |

## 4. MVP scope

### Investor experience

- Browse investees by domain, location, transparency level, stage, target raise, revenue, recent posts, and goals.
- View profile: thesis, plan, valuation option selected, use of funds, financial dashboard, update history, risks, exclusions, and legal offering link.
- Invest through registered partner flow.
- Portfolio dashboard: holdings, total invested, current book value, distributions, reinvestment election, updates, requests for help, messages.
- Help board: investees can ask for intros, design review, accounting help, hiring, sales leads, or feedback.
- Messaging: free after investment; paid pre-investment messaging can be a premium feature if legal/Stripe review approves.

### Investee experience

- Onboard identity, bio, goals, background, links, bank, tax, risk disclosures.
- Formation checklist: C-corp, EIN, bank account, cap table, accounting connection, offering docs.
- Valuation wizard: choose one of the approved instruments and terms.
- Profile builder: public pitch, milestones, transparency setting, reporting cadence.
- Revenue tracker: connect accounting/bank/Stripe; classify transactions; publish revenue/spend snapshots.
- Investor updates: posts, videos, milestones, asks, polls.
- Payout admin: see calculated distributions, reserve policy, board approval state, and partner payment status.

### Marketplace/admin

- Manual approve every investee before public listing.
- Legal status gate: draft, diligence, ready for offering, live offering, closed, reporting.
- Review revenue classifications and suspicious deltas.
- Moderate content and messages.
- Admin-only partner reconciliation: offering IDs, investor IDs, cap table entries, distributions.

## 5. Stack for Vercel MVP

| Layer | Choice | Reason |
| --- | --- | --- |
| App | Next.js App Router, TypeScript | Fast Vercel deploy, full-stack routes, strong ecosystem. |
| UI | Tailwind + shadcn/ui | Fast marketplace/dashboard build. |
| Auth | Clerk or Auth.js | Use Clerk for speed; Auth.js if avoiding vendor lock-in matters more. |
| Database | Neon Postgres + Prisma | Vercel-friendly Postgres, relational cap-table/accounting data. |
| Files | Vercel Blob or S3/R2 | Investor updates, profile media, documents. |
| Background jobs | Inngest or Trigger.dev | Webhooks, monthly reporting, reconciliation jobs. |
| Realtime | Ably or Pusher | Messaging, live dashboard counters. |
| Payments | Stripe Connect | Non-investment subscriptions/services only, with restricted-business approval. |
| Investment rail | Registered funding portal/broker-dealer API | Required for securities transactions. |
| Accounting | Plaid + QuickBooks/Xero later | Bank/accounting sync, revenue verification. |
| Analytics | PostHog | Funnel, cohorts, marketplace conversion. |
| Email | Resend | Transactional email and investor update digests. |

NestJS can be added later for a separate compliance/accounting service, but the first deploy should stay as a Next.js monolith because Vercel free tier is the constraint.

## 6. Core domain model

```sql
create type user_role as enum ('investor', 'investee', 'admin');
create type profile_status as enum ('draft', 'review', 'listed', 'paused', 'rejected');
create type offering_status as enum ('draft', 'diligence', 'partner_live', 'closed', 'cancelled');
create type transaction_scope as enum ('included', 'excluded', 'needs_review');
create type distribution_cadence as enum ('monthly', 'quarterly', 'annual', 'reinvest');
create type ledger_event_type as enum ('issuance', 'transfer', 'cancellation', 'valuation', 'distribution', 'reinvestment');

create table users (
  id uuid primary key,
  email text unique not null,
  role user_role not null,
  created_at timestamptz not null default now()
);

create table investee_profiles (
  id uuid primary key,
  user_id uuid not null references users(id),
  display_name text not null,
  slug text unique not null,
  headline text not null,
  bio text not null,
  transparency_level int not null check (transparency_level between 1 and 5),
  status profile_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table investee_entities (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  legal_name text not null,
  jurisdiction text not null default 'DE',
  entity_type text not null default 'c_corp',
  ein_last4 text,
  formation_provider text,
  formed_at date,
  partner_cap_table_id text
);

create table offerings (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  partner_offering_id text unique,
  instrument_type text not null,
  target_raise_cents bigint not null,
  max_raise_cents bigint not null,
  valuation_cents bigint,
  revenue_share_bps int,
  distribution_cadence distribution_cadence not null,
  status offering_status not null default 'draft',
  legal_disclaimer text not null,
  created_at timestamptz not null default now()
);

create table investments (
  id uuid primary key,
  offering_id uuid not null references offerings(id),
  investor_id uuid not null references users(id),
  partner_investment_id text unique not null,
  amount_cents bigint not null,
  securities_count numeric(30, 12),
  reinvest_distributions boolean not null default false,
  closed_at timestamptz
);

create table ownership_ledger_events (
  id uuid primary key,
  offering_id uuid not null references offerings(id),
  investment_id uuid references investments(id),
  event_type ledger_event_type not null,
  actor_id uuid references users(id),
  from_user_id uuid references users(id),
  to_user_id uuid references users(id),
  securities_delta numeric(30, 12),
  valuation_cents bigint,
  amount_cents bigint,
  source text not null,
  source_event_id text,
  metadata_json jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table revenue_events (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  source text not null,
  external_id text,
  amount_cents bigint not null,
  occurred_at date not null,
  scope transaction_scope not null default 'needs_review',
  memo text,
  reviewed_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table expense_events (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  source text not null,
  amount_cents bigint not null,
  occurred_at date not null,
  category text not null,
  memo text,
  created_at timestamptz not null default now()
);

create table investor_updates (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  author_id uuid not null references users(id),
  title text not null,
  body_md text not null,
  visibility text not null check (visibility in ('public', 'investors', 'admins')),
  created_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  investor_id uuid not null references users(id),
  created_at timestamptz not null default now(),
  unique(profile_id, investor_id)
);

create table messages (
  id uuid primary key,
  conversation_id uuid not null references conversations(id),
  sender_id uuid not null references users(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table polls (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  question text not null,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table help_requests (
  id uuid primary key,
  profile_id uuid not null references investee_profiles(id),
  title text not null,
  body text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
```

## 7. API surface

### Public

- `GET /api/marketplace`: filtered investee cards.
- `GET /api/investees/:slug`: public profile, offering summary, revenue snapshots, posts.
- `GET /api/investees/:slug/updates`: public/investor-gated posts.

### Investor

- `GET /api/portfolio`: holdings, ledger-derived balances, distributions, updates, messages.
- `POST /api/offerings/:id/invest-intent`: creates partner handoff URL.
- `PATCH /api/investments/:id/reinvestment`: toggles reinvest election through partner-approved process.
- `POST /api/conversations`: starts message if user is eligible.
- `POST /api/messages`: sends message.
- `POST /api/help-requests/:id/offers`: offers help.

### Investee

- `POST /api/investee/profile`: create/update profile.
- `POST /api/investee/entity-checklist`: update formation state.
- `POST /api/investee/offerings`: draft terms for admin/counsel review.
- `POST /api/investee/revenue-events/classify`: classify synced revenue.
- `POST /api/investee/updates`: publish investor update.
- `POST /api/investee/polls`: create non-binding poll.
- `POST /api/investee/help-requests`: ask investors for help.

### Admin

- `PATCH /api/admin/profiles/:id/status`: approve/pause/reject.
- `PATCH /api/admin/revenue-events/:id`: review revenue classification.
- `POST /api/admin/offerings/:id/submit-to-partner`: create partner offering.
- `POST /api/admin/distributions/:profileId/calculate`: produce distribution draft.
- `POST /api/webhooks/partner`: receive investment/closing/cap-table events and append ownership ledger events.
- `POST /api/webhooks/stripe`: receive non-investment payment events.
- `POST /api/webhooks/accounting`: receive bank/accounting updates.

## 8. Key workflows

### Investee onboarding

1. User signs up as investee.
2. App collects identity, public story, goals, jurisdiction, risk profile, and expected revenue sources.
3. Admin approves profile for internal diligence.
4. Formation provider creates Delaware C-corp and EIN.
5. Investee opens bank account and accounting ledger.
6. Counsel attaches offering docs and approved economic instrument.
7. Registered partner creates official offering.
8. HFC flips profile to `listed` and offering to `partner_live`.

### Investor purchase

1. Investor browses and opens profile.
2. Investor sees risk, exclusions, offering terms, reporting cadence, and partner disclosure.
3. Investor clicks Invest.
4. HFC creates `invest-intent` and sends user to registered partner.
5. Partner runs legal checks, collects funds, and closes investment.
6. Partner webhook creates `investment` and the related `ownership_ledger_events`.
7. Portfolio dashboard derives holdings from the ledger and shows the update feed.

### Revenue reporting

1. Revenue source syncs from Stripe/accounting/bank.
2. Each event lands as `needs_review`.
3. Investee classifies as included/excluded with memo.
4. Admin or rules engine flags suspicious patterns: repeated exclusions, revenue drop after raise, manual deletes, missing reports.
5. Monthly snapshot publishes revenue, spend, runway, reserve, milestones, and investor-visible notes.

### Distribution

1. Cadence job calculates distributable amount from included revenue minus approved expenses/reserve.
2. Admin reviews calculation.
3. Board approval is recorded for the investee entity.
4. Payment processor or partner disburses to investors.
5. Investors with reinvest election receive new securities only through approved issuance mechanics.

## 9. UI map

### Marketplace

- Hero: "Invest at the source."
- Filters: category, stage, transparency, location, raise size, revenue, update cadence.
- Cards: person, mission, current raise, traction, transparency score, latest update, included revenue scope.

### Investee profile

- Pitch video/photo.
- Current ambition and use of funds.
- Offering terms box with legal partner link.
- Revenue/spend/live activity counters.
- What counts as company revenue and what does not.
- Updates feed.
- Help requests.
- Non-binding polls.
- Risk disclosures.

### Investor dashboard

- Portfolio value, invested amount, distributions, reinvest status.
- Feed of investee updates sorted by urgency.
- Revenue/spend trend per investee.
- Upcoming distribution dates.
- Help requests from portfolio.
- Messages.

### Investee dashboard

- Profile completion.
- Offering status.
- Cash received, cash spent, included revenue, reserve.
- Upcoming reporting tasks.
- Investor questions.
- Update composer.
- Revenue classifier.

## 10. Monetization

MVP revenue streams that do not require HFC to custody investment money:

1. Investee SaaS fee for formation/admin/reporting after free beta.
2. Platform subscription for investors: deeper analytics, pre-investment messages, saved searches, alerts.
3. A la carte services sold by investees: coaching calls, office hours, templates, paid posts.
4. Success/platform fee only if counsel and registered partner approve the exact compensation structure.
5. Later: issuer services, accounting package, cap-table/admin package, ATS partner referral.

## 11. Compliance and trust features

- Prominent investment risk disclosure on every offering surface.
- Offering content immutable after partner launch except approved amendments.
- Audit log for profile edits, revenue classification, distribution calculations, and admin actions.
- Investor eligibility gates delegated to partner.
- KYC/AML delegated to partner for investments; Stripe/KYC for service payouts.
- No performance promises in copy.
- No "guaranteed liquidity" language.
- Marketplace rankings must not look like investment advice unless counsel approves.
- Every revenue event has source, external ID, classification, reviewer, timestamp, and memo.

## 12. Build phases

### Phase 0: legal/product validation

- Pick name, jurisdiction, counsel, registered partner candidates, Stripe approval path.
- Draft templates: investee service agreement, profile terms, risk disclosures, privacy, messaging policy.
- Decide instrument: non-voting preferred stock vs revenue-share note.

### Phase 1: non-investment marketplace

- Next.js app on Vercel.
- Auth, public profiles, marketplace browsing, updates, messaging waitlist.
- Stripe for paid services/subscriptions only after approval.
- Admin review console.

### Phase 2: partner-powered first investments

- Formation checklist.
- Partner offering handoff.
- Partner webhooks into append-only portfolio ledger records.
- Investor dashboard.
- Reporting snapshots.

### Phase 3: accounting and distributions

- Bank/accounting sync.
- Revenue classification.
- Distribution calculator.
- Board approval records.
- Partner/payment disbursement integration.

### Phase 4: community and liquidity

- Help marketplace.
- Polls.
- Reputation.
- ATS/broker-dealer secondary integration.
- Reserve policy tooling without liquidity promises.

## 13. First repo implementation tasks

1. Replace static site with `apps/web` Next.js app.
2. Add `packages/db` Prisma schema based on this document.
3. Add `packages/domain` with typed state machines for profile/offering/investment statuses and ledger event validation.
4. Add marketplace/profile/dashboard screens using seeded data.
5. Add Clerk/Auth.js auth.
6. Add Neon Postgres.
7. Add admin approval screens.
8. Add Stripe service-payment sandbox for subscriptions and a la carte products.
9. Add partner investment adapter interface with a mock provider until the real partner contract is signed.
10. Add accounting adapter interface with manual CSV import first, then Plaid/QuickBooks.

## 14. External references

- SEC Regulation Crowdfunding overview: https://www.sec.gov/resources-small-businesses/exempt-offerings/regulation-crowdfunding
- SEC Rule 506(c) overview: https://www.sec.gov/resources-small-businesses/exempt-offerings/general-solicitation-rule-506c
- Stripe restricted businesses: https://stripe.com/en-th/legal/restricted-businesses
- IRS S-corp requirements: https://www.irs.gov/businesses/small-businesses-self-employed/s-corporations
- UNESCO higher education enrollment: https://www.unesco.org/en/articles/number-students-higher-education-more-doubled-20-years-inequalities-remain
- UNESCO teacher shortage: https://www.unesco.org/en/articles/global-report-teachers-addressing-teacher-shortages-and-transforming-profession
- WHO health workforce shortage: https://www.who.int/teams/health-workforce/about
- IARC global cancer burden: https://www.iarc.who.int/news-events/new-report-on-global-cancer-burden-in-2022-by-world-region-and-human-development-level
