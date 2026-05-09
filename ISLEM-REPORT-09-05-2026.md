# Development Report

**Date:** 09 May 2026
**Prepared by:** Islem

---

## Work Completed

All work today landed on the web repository. The mobile app received no
commits — every endpoint added today is consumed by the existing admin and
advertiser surfaces, which live on web.

---

### 1. Publeader — Validations workflow (AD1)

- Built the combined admin validation queue: drivers, companies, and partners
  share a single backend pipeline with per-kind detail, approve / reject /
  request-info actions, and outbound email notifications on every decision.
- Each entity carries a per-kind review trail (last action only — reviewer,
  timestamp, rejection reason, last info request) so the queue UI can render
  history without a separate audit table.
- Web validation queue page lists pending submissions and exposes the detail
  view with documents.

---

### 2. Publeader — Finance & Invoicing (AD2)

- Built the invoice subsystem on top of the new admin finance area: CRUD with
  status machine (`brouillon` → `envoyée` → `payée`, derived `en retard`
  computed on read), atomic per-year invoice reference counter, per-line
  totals, configurable VAT.
- Send-invoice route generates the PDF, emails the recipient via SMTP, and
  flips the invoice to `envoyée` in one transaction.
- Driver commissions, internal expenses ledger (4 categories), and finance
  KPIs (MRR, collections, pending, commissions due, overdue) wired into a
  single admin finance page.

---

### 3. Publeader — Stripe payments (AD3)

- Integrated Stripe Checkout (hosted) for invoice payment. Choices: hosted
  (PCI-light), email + advertiser web dashboard pay surface, refund/dispute
  reverts the invoice to `envoyée` with timestamp + reason flag.
- Persistent pay link strategy: each click on the email link mints a fresh
  Checkout Session via `/api/pay/[id]/redirect` so emails never expire even
  past Stripe's 24h Checkout TTL.
- Webhook handler with signature verification and idempotency (the Stripe
  event id is the primary key on a dedicated `stripe_events` collection;
  duplicate deliveries are ignored). Events handled: checkout completed,
  async payment succeeded, payment intent failed, charge refunded, dispute
  created/closed (won/warning_closed clears the flag, lost is treated as a
  refund).
- Advertiser web endpoints for listing own invoices and creating Checkout
  Sessions on demand. Send-invoice email body now embeds a Pay button when
  Stripe is configured.

---

### 4. Publeader — Reports (AD4)

- Six report builders, all generated inline (sync) and uploaded to Cloudinary
  as `raw` resources, with persisted history per request:
  - **Bilan mensuel** (PDF) — revenue, commissions, expenses, net margin,
    active campaigns, top advertisers.
  - **Export comptable** (ZIP of three CSVs) — invoices, commissions,
    expenses, RFC-4180 quoted, UTF-8 BOM for Excel.
  - **Performance Leader Borne** (PDF) — per-terminal sprays, impressions,
    refills, partner revenue using the same rates as the partner statements.
  - **Activité chauffeurs** (PDF) — top performers by commissions over the
    period, capped at 100.
  - **Rapport annonceurs** (PDF) — campaigns, budget, impressions, fill rate
    (flocage drivers + borne impressions), invoiced + collected.
  - **Audit RGPD** (PDF) — PII inventory by collection with retention policy
    and live row counts. Sourced from a single retention-policy const so
    legal review has one document to maintain.
- Period picker per request (start/end). Admin web page replaces the old
  static mocks: builder card with 6 radio cards + date range, history grid
  with download/delete per entry.

---

### 5. Publeader — Dashboards & KPIs (AD5)

- Single admin dashboard endpoint runs ~9 parallel Mongo queries: finance
  KPIs (reusing AD2's service), counts (drivers, companies, partners,
  campaigns), borne fleet health (online/offline/maintenance from heartbeat
  freshness, monthly revenue, top terminals), city distribution, validation
  queue summary, recent campaigns, and month-over-month deltas on every
  headline metric.
- Revenue chart endpoint with hybrid data source: paid invoices for past
  days (attributed to flocage/borne via the linked campaign), accrued
  campaign budgets distributed linearly across active windows for today.
  Range selector supports 30 / 90 / 365 days.
- Advertiser dashboard endpoint: own impressions over the past 30 days
  with sparkline + delta vs prior 30, % toward `borne.targetImpressions`
  goal, active campaigns, billing summary (paid this month + open + overdue),
  recent campaign events as activity feed.
- Wired all three screens (`DashboardGlass`, `DashboardPro`,
  `EnterpriseDashboard`) to live data, replaced the hard-coded mock arrays
  and the synthetic stacked-area generator.

---

### 6. Publeader — Global search palette (AD6)

- Admin-only `/api/admin/search` with case-insensitive regex (escaped) over
  campaigns (brand/title/domain/city), drivers (name/phone/city), companies
  (name/contact/SIRET/VAT/city), and terminals (code/name/address/city).
  Per-type cap of 5, total 20 max.
- ⌘K palette wired to live search with 250 ms debounce and an
  `AbortController` cancelling in-flight requests on every keystroke.
  Mock entities removed; `Résultats` group only renders for queries ≥ 2
  characters.

---

### 7. Publeader — User management & platform settings (AD7 + AD8)

- Admin user management page (`/utilisateurs`) backed by Better-auth's
  admin plugin. Filters by role / banned / search; per-row actions for
  ban (with optional reason + expiration in days), unban, force-logout
  (revoke all sessions). Self-ban is blocked at the route layer.
- Platform settings page (`/parametres-plateforme`) edits the two existing
  `app_config` keys (wallet config and partner revenue rates) via a single
  `/api/admin/settings` endpoint. After save, the in-memory caches in
  `wallet.ts` and `partner-revenue-service.ts` are invalidated so live
  services pick up new values immediately.
- Three Auth-section open items (admin force-logout / ban / unban UI, team
  member invite acceptance UI, SMTP credentials in prod) are now satisfied
  by this work plus the existing `/invite/[id]` route and Gmail App Password
  setup. Note: production should migrate to a dedicated transactional mail
  provider before public launch.

---

### 8. Publeader — Audit trail & GDPR (X4)

- Audit log collection + service. Twelve admin mutations now record audit
  entries (actor, action, target, before/after snapshots, IP): user
  ban/unban/revoke-sessions, invoice send/mark-paid/delete, validation
  approve/reject/request-info, withdrawal process/reject, partner payout
  mark-paid, settings update (with full before/after diff), reports
  generate/delete, and Stripe webhook processing as a system event.
- Admin `/audit` page: filter by action, actor, date range; expandable row
  shows the JSON payload (before / after / meta / IP).
- GDPR data export: `/api/me/gdpr/export` builds a ZIP of role-scoped JSON
  files (user, driver+transactions+withdrawals+vehicles+documents for
  drivers; company+invoices+campaigns+assets for advertisers; partner+
  terminals+payouts for partners; plus a manifest).
- GDPR account deletion (anonymization, not hard delete): `/api/me/gdpr/delete`
  zeroes PII on the user row + role-specific row, randomises the password
  hash and wipes sessions to block future logins, destroys uploaded
  documents and vehicle photos from Cloudinary, and writes a compliance
  record into a new `gdpr_deletions` collection. Financial records
  (transactions, withdrawals, invoices) are retained per the FR Code de
  commerce 10-year obligation, but no longer attributable to the user.
- New `/mes-donnees` page available to all logged-in roles: download ZIP
  button + delete-account modal that requires typing `SUPPRIMER`.
- Document retention policy moved to a single source of truth
  (`lib/retention-policy.ts`) consumed by both the GDPR audit report and
  this report. No automated purge — admins enforce manually.


