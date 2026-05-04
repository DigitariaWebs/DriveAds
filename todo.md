# Backend Todo

## Product Scope

- Mobile app primary audience: drivers (full feature set, read + write).
- Partners + advertisers on mobile: **read-only** companion (dashboard, stats, notifications, profile). All write/management work on web.
- Web dashboard: full admin + advertiser portal + partner portal (write access for partners + advertisers lives here).
- Enforce read-only mode for partner + advertiser roles on mobile API surface (block mutations server-side).
- Hide / disable mutation UI on mobile partner + advertiser screens (forms, create buttons, edit actions).

## Web Backend (serves Web + Mobile)

### Auth & Identity (Better Auth + MongoDB, dual-client: web cookies + mobile SecureStore via @better-auth/expo)
- [x] User accounts with roles: admin, advertiser, driver, partner, team_member
- [x] Driver self-registration (4-step: identity, vehicle, security, documents)
- [x] Company self-registration (creates Better Auth organization)
- [x] Partner registration
- [x] Login / logout
- [x] Token refresh (Better Auth session expiry + updateAge)
- [x] Password reset via email OTP (6-digit, 10min)
- [x] Change password
- [x] Current-user profile lookup (`/api/me` hydrates role + linked entity)
- [x] Pending state for newly-registered drivers/companies/partners (await admin validation)
- [x] Email verification via OTP on signup
- [x] Admin seed script
- [ ] Role-based access control middleware on protected routes (server-side guards per endpoint)
- [ ] Admin force-logout / ban / unban UI (admin plugin available, no UI yet)
- [ ] Team member invite acceptance UI (organization plugin wired, invite-accept screen pending)
- [ ] SMTP credentials in prod (currently dev console fallback)

### Drivers
- [ ] Driver profile (identity, contact, city)
- [ ] Vehicle management (one or multiple cars per driver: make, model, year, plate, type, inspection)
- [ ] Document upload + validation workflow (license, registration, insurance, photos)
- [ ] Driver status lifecycle (pending → validated/rejected)
- [ ] Driver KYC flow (ID verification, selfie liveness, address proof) — deferred
- [ ] KYC status field (unverified | pending | verified | rejected) — deferred
- [ ] Block driver withdrawals until KYC verified — deferred
- [ ] KYC re-verification triggers (expired ID, address change) — deferred
- [ ] Driver stats aggregates (monthly earnings, total earnings, campaigns done, rating, total km, growth)
- [ ] Driver campaign history
- [ ] Driver payment history + statement export
- [ ] Withdrawal requests (presets + custom amount)
- [ ] Notification preferences

### Companies / Advertisers
- [ ] Company profile (legal info, sector, contact, brand color, logo)
- [ ] Company status lifecycle (pending → validated/rejected)
- [ ] Company KYC (KBIS, beneficial owner, payment-method legal check) — deferred
- [ ] Company KYC status field — deferred
- [ ] Team management (invite by email, roles: admin/editor/viewer, last seen, pending invites)
- [ ] Asset library (visuals, videos, logos, briefs with usage tracking)
- [ ] Billing profile + payment methods (Stripe)
- [ ] Invoice history per company
- [ ] Account balance + MRR + total spend
- [ ] Company settings + preferences

### Campaigns
- [ ] Campaign lifecycle (draft → upcoming → active → completed)
- [ ] Two campaign types: Flocage (vehicle wraps) + Borne (kiosk ads)
- [ ] 3-step creation wizard data (brief, targeting, budget tier BOOST/GROWTH/LEADER)
- [ ] Targeting (cities, zones, dates, km target or borne count)
- [ ] Visual upload
- [ ] Driver assignment / unassignment
- [ ] Borne assignment for borne-type campaigns
- [ ] Driver acceptance flow + capacity check
- [ ] Tracking mode (GPS auto vs manual)
- [ ] Tracking events ingestion (GPS pings from mobile, manual check-ins)
- [ ] Progress calculation (km done vs target, drivers assigned vs needed)
- [ ] Campaign performance metrics (impressions, reach, km, hours)
- [ ] Impressions timeline
- [ ] Per-company campaign filtering for advertiser portal

### Partners
- [ ] Partner profile (business info, manager, address)
- [ ] Partner status lifecycle (pending → validated/rejected)
- [ ] Partner KYC (business registration, banking details for payouts) — deferred
- [ ] Partner KYC status field — deferred
- [ ] Block partner payouts until KYC verified — deferred

### Bornes / Terminals (Partner Hardware)
- [ ] Terminal registry with map coords + venue type (bar/hotel/nightclub/etc.)
- [ ] Terminal status (online/maintenance/offline) + uptime tracking
- [ ] Spray counter + daily usage
- [ ] Last sync + heartbeat
- [ ] Maintenance scheduling
- [ ] Stock inventory (5 scent types, level %, capacity, daily use, refill ETA)
- [ ] Stock alerts (Faible / Rupture)
- [ ] Stock orders from partner
- [ ] Refill logging
- [ ] Ad playback schedule per terminal (live, scheduled, frequency, time windows)
- [ ] Ad impression counter per terminal
- [ ] Partner ad-issue reports
- [ ] Terminal revenue split (sprays revenue + ads revenue share)
- [ ] Revenue history + payout schedule
- [ ] Monthly target tracking

### Validations Queue (Admin)
- [ ] Combined queue (pending drivers + pending companies)
- [ ] Per-submission detail with documents
- [ ] Approve / reject / request more info actions
- [ ] Notify submitter on decision
- [ ] KYC review queue (driver + company + partner) — deferred

### Finances (Admin)
- [ ] Invoices (create, edit, send, mark paid, PDF, statuses: payée/envoyée/en retard/brouillon)
- [ ] Driver commissions (per campaign, per km, batch payout)
- [ ] Internal expenses ledger (categories: fourniture / sous-traitance / infrastructure / logistique)
- [ ] Finance KPIs (MRR, collections, pending, commissions due)
- [ ] Stripe webhooks for payment confirmation
- [ ] Withdrawal processing (driver requests → payout)

### Notifications
- [ ] In-app notifications per user (types: campaign, payment, validation, system, borne)
- [ ] Unread count
- [ ] Mark read / read-all / archive / delete
- [ ] Email channel
- [ ] Push channel (Expo tokens for mobile)
- [ ] Realtime push to active sessions
- [ ] Triggered by domain events (new campaign match for driver, document validated, invoice paid, stock alert, ad reported, terminal offline, validation decision)

### Reports (Admin)
- [ ] Monthly summary report
- [ ] Accounting export (invoices, commissions, expenses)
- [ ] Borne performance report
- [ ] Driver activity report
- [ ] Advertiser engagement report
- [ ] GDPR audit report
- [ ] Async generation + download (PDF/CSV)

### Dashboard / KPIs
- [ ] Admin dashboard aggregates (MRR + trend, active campaigns, validated drivers, pending counts, borne fleet health, validation queue, city distribution)
- [ ] Revenue chart (Flocage vs Borne stacked, 30/90/365 day)
- [ ] Advertiser dashboard (own impressions, % vs goal, sparkline, active campaigns, team activity, billing summary)

### Search
- [ ] Global search across campaigns, drivers, companies, bornes (cmd+K palette)

### Settings
- [ ] User-level settings (notification toggles, email prefs)
- [ ] Company-level settings (advertiser portal)
- [ ] Global platform settings (admin)

### Compliance
- [ ] GDPR data export per user
- [ ] GDPR account deletion
- [ ] Audit trail of state changes (approvals, rejections, payments, campaign edits)
- [ ] Document retention policy

---

## Mobile App Integration (consumes Web Backend)

### Replace mock data with real fetches
- [ ] Drop `mocks/data.ts` + `mocks/partner.ts` from runtime
- [ ] Refactor `context/DataContext.tsx` to query hooks
- [ ] Refactor `context/AuthContext.tsx` to real auth + hydrate from `/me`

### Auth flows
- [x] Real login (email + password)
- [x] Real register-driver 4-step submission
- [x] Real register-advertiser flow
- [x] Real register-partner flow
- [x] Pending screen polls user status until validated (15s interval)
- [x] Forgot/reset password screens (OTP)
- [x] Email verification screen (OTP)
- [x] Change password wired
- [x] Logout clears session

### Driver
- [ ] Home (driver, stats, active + available campaigns, unread count)
- [ ] Browse campaigns with filters
- [ ] Campaign detail + accept action
- [ ] My campaigns
- [ ] Stats with period selector
- [ ] Payments history + transaction detail
- [ ] Withdraw amount submission
- [ ] Statement download
- [ ] Documents upload (camera / file picker → multipart)
- [ ] Cars CRUD
- [ ] Edit profile
- [ ] Notification preferences + email toggle
- [ ] Notifications list with read/archive/delete
- [ ] Settings + support contact form
- [ ] GPS background tracking task (location pings → tracking events)
- [ ] Manual check-in mode for non-GPS campaigns

### Advertiser (mobile = read-only companion)
- [ ] Home dashboard (own KPIs) — read-only
- [ ] Campaigns list (own only) with filter — read-only
- [ ] Stats / performance — read-only
- [ ] Profile view (edit on web only)
- [ ] Notifications
- [ ] Hide/remove create-campaign + assign-driver UI on mobile (web-only)

### Partner (mobile = read-only companion)
- [ ] Home (terminal status, stock summary, live ads, notifs) — read-only
- [ ] Stock screen view (no order action — web only)
- [ ] Ads screen view (no report action — web only)
- [ ] Revenue screen (history, transactions) — read-only, no statement export
- [ ] Notifications with filters (all/unread/stock/ops)
- [ ] Profile view (edit on web only)
- [ ] Hide/remove all mutation buttons on partner mobile screens

### Cross-cutting mobile UX
- [ ] Loading skeletons on data screens
- [ ] Pull-to-refresh
- [ ] Error toasts on mutations
- [ ] Offline cache + retry
- [ ] Image/file upload helpers
- [ ] Foreground push banner
- [ ] Remove role quick-access buttons in login (dev-only)
