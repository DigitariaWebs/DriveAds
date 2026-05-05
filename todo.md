# Backend Todo

## Product Scope

- Mobile app primary audience: drivers (full feature set, read + write).
- Partners + advertisers on mobile: **read-only** companion (dashboard, stats, notifications, profile). All write/management work on web.
- Web dashboard: full admin + advertiser portal + partner portal (write access for partners + advertisers lives here).
- Enforce read-only mode for partner + advertiser roles on mobile API surface (block mutations server-side).
- Hide / disable mutation UI on mobile partner + advertiser screens (forms, create buttons, edit actions).

---

## Cross-cutting (foundation)

### X1 — RBAC + route guards
- [ ] Server-side role guards per endpoint
- [ ] Mobile mutation block for advertiser + partner roles
- [ ] Helper for "current user must be driver/advertiser/partner/admin"
- [ ] Status check (validated only) on protected routes

### X2 — File upload infrastructure
- [x] Storage backend (Cloudinary signed direct uploads)
- [x] Signed-upload endpoint (`/api/uploads/sign`)
- [x] File metadata embedded per use-case (documents); generic `lib/cloudinary.ts` reusable
- [ ] Image resize + thumbnail (deferred — Cloudinary URL transforms cover most cases)
- [x] Mobile upload helper (expo-image-picker + expo-document-picker → signed Cloudinary)
- [ ] Web upload helper (dropzone + progress) — deferred until visuals/branding feature

### X3 — Notification engine
- [ ] In-app notification model (per user, type, read/archived)
- [ ] Unread count endpoint
- [ ] Mark read / read-all / archive / delete
- [ ] Email channel (nodemailer)
- [ ] Push channel (Expo push tokens, register/unregister)
- [ ] Realtime push to active sessions (SSE or polling)
- [ ] Domain event triggers (campaign match, doc validated, invoice paid, stock alert, ad reported, terminal offline, validation decision)

### X4 — Audit trail + GDPR
- [ ] Audit log collection (actor, action, target, before/after, timestamp)
- [ ] GDPR data export per user
- [ ] GDPR account deletion
- [ ] Document retention policy

### X5 — Mobile UX cross-cutting
- [ ] Loading skeletons on data screens
- [ ] Pull-to-refresh
- [ ] Error toasts on mutations
- [ ] Offline cache + retry
- [ ] Foreground push banner
- [ ] Drop `mocks/data.ts` + `mocks/partner.ts` from runtime
- [ ] Refactor `context/DataContext.tsx` to query hooks

---

## Auth & Identity (Better Auth + MongoDB)

- [x] User accounts with roles: admin, advertiser, driver, partner, team_member
- [x] Driver self-registration (4-step)
- [x] Company self-registration (creates Better Auth organization)
- [x] Partner registration
- [x] Login / logout
- [x] Token refresh
- [x] Password reset via email OTP
- [x] Change password
- [x] Current-user profile lookup (`/api/me`)
- [x] Pending state for newly-registered users
- [x] Email verification via OTP
- [x] Admin seed script
- [x] Real login + register flows on mobile
- [x] Pending screen polls user status (15s)
- [x] Forgot/reset/verify-email screens
- [x] Logout clears session
- [ ] Admin force-logout / ban / unban UI
- [ ] Team member invite acceptance UI
- [ ] SMTP credentials in prod
- [ ] KYC (driver + company + partner) — deferred

---

## Driver

### D1 — Campaigns (browse, accept, mine)
- Backend
  - [x] Campaign collection + lifecycle (draft → upcoming → active → completed)
  - [x] List available campaigns for driver (matching city + capacity)
  - [x] Campaign detail
  - [x] Accept action (capacity check, link driver to campaign)
  - [x] My campaigns (active + completed for current driver)
  - [x] Driver acceptance audit
- Mobile
  - [x] Home — active campaign card + opportunities horizontal list
  - [x] Browse campaigns screen with filters (city, type, reward range)
  - [x] Campaign detail screen + accept action
  - [x] My campaigns screen
- Web (admin view)
  - [x] Campaigns list filtered by driver

### D2 — Stats + earnings
- Backend
  - [x] Driver stats aggregate (monthly earnings, total earnings, campaigns done, rating, total km, growth %)
  - [x] Period selector aggregation (week / month / 3mo / year)
  - [ ] Advertiser-driven driver rating (rate driver post-campaign) — deferred
- Mobile
  - [x] Home stats (monthly earnings hero + mini stats)
  - [x] Stats screen with period selector
- Web (admin view)
  - [x] Driver detail stats panel

### D3 — Payments + withdrawals + statements
- Backend
  - [x] Payment history per driver
  - [x] Transaction detail
  - [x] Withdrawal request submission (presets + custom)
  - [x] Withdrawal processing (admin → payout)
  - [x] Statement generation (PDF, monthly)
- Mobile
  - [x] Payments history screen
  - [x] Transaction detail screen
  - [x] Withdraw screen (presets + custom amount)
  - [x] Statement download
- Web (admin)
  - [x] Withdrawal queue + process action

### D4 — Documents upload + validation
- Backend
  - [x] Document model (license, registration, insurance, RIB, vehicle photos)
  - [x] Upload endpoint — Cloudinary signed direct upload + `/api/me/documents` POST
  - [x] Validation workflow (admin approve/reject per doc type)
  - [x] `documentsApproved` flag on driver (renamed from `documentsUploaded`)
- Mobile
  - [x] Documents screen — list per type with status, reject reasons, re-upload
  - [x] Upload via camera/gallery (expo-image-picker) + file picker (expo-document-picker)
- Web (admin)
  - [x] Document review queue + approve/reject (file preview + reason input)

### D5 — Vehicles CRUD
- Backend
  - [x] Vehicle collection (driverId, make, model, year, plate, type, inspection, photos, isActive)
  - [x] CRUD endpoints (list, create, update, delete) + activate + photos add/delete
  - [x] Migration from inline DriverDoc fields → vehicles collection
- Mobile
  - [x] My cars screen (list + add/edit/delete + activate + photo upload via Cloudinary)
- Web (admin)
  - [x] Driver detail vehicles list (photo previews + inspection status)

### D6 — Profile edit
- Backend
  - [ ] Update driver profile endpoint (identity, contact, city)
- Mobile
  - [ ] Edit profile screen
- Web (admin)
  - [ ] Driver detail edit

### D7 — Notifications + preferences
- Backend (uses X3)
  - [ ] Notification list filtered to driver
  - [ ] Notification prefs (email toggle, push toggle, per-type)
- Mobile
  - [ ] Notifications list with read/archive/delete
  - [ ] Notification email preferences screen
- Web
  - [ ] Notification center for admin

### D8 — Settings + support
- Backend
  - [ ] Support contact form submission (creates ticket)
- Mobile
  - [ ] Settings screen
  - [ ] Support contact form
- Web (admin)
  - [ ] Support ticket queue

### D9 — GPS tracking + manual check-in
- Backend
  - [ ] Tracking events ingestion (GPS pings + manual check-ins)
  - [ ] Progress calculation (km done vs target)
- Mobile
  - [ ] Background location task (start/stop on campaign accept/complete)
  - [ ] Manual check-in mode for non-GPS campaigns
- Web (admin)
  - [ ] Tracking events viewer per campaign

---

## Advertiser

### A1 — Company profile + brand
- Backend
  - [ ] Update company profile (legal info, sector, contact, brand color, logo)
- Mobile (read-only)
  - [ ] Profile view
- Web
  - [ ] Edit profile + brand

### A2 — Team management
- Backend
  - [ ] Invite by email (Better Auth organization plugin)
  - [ ] Roles: admin / editor / viewer
  - [ ] Last-seen tracking
  - [ ] Pending invites list
  - [ ] Invite acceptance screen
- Web
  - [ ] Team page (list, invite, remove, role change)

### A3 — Asset library
- Backend (uses X2)
  - [ ] Asset model (visuals, videos, logos, briefs)
  - [ ] Usage tracking per asset
- Web
  - [ ] Asset library page (upload, list, delete, usage)

### A4 — Campaign creation wizard
- Backend
  - [ ] 3-step wizard data model (brief, targeting, budget tier BOOST/GROWTH/LEADER)
  - [ ] Two campaign types: Flocage (vehicle wraps) + Borne (kiosk ads)
  - [ ] Targeting (cities, zones, dates, km target / borne count)
  - [ ] Visual upload — depends on X2
  - [ ] Draft + publish flow
- Web
  - [ ] 3-step creation wizard
  - [ ] Draft list + edit

### A5 — Campaign list + detail (own only)
- Backend
  - [ ] List filtered by companyId
  - [ ] Detail with metrics + assigned drivers
  - [ ] Driver assignment / unassignment (Flocage)
  - [ ] Borne assignment (Borne type)
- Mobile (read-only)
  - [ ] Campaigns list — own only
  - [ ] Campaign detail view
- Web
  - [ ] Campaigns list + detail + assign action

### A6 — Performance + impressions
- Backend
  - [ ] Campaign performance metrics (impressions, reach, km, hours)
  - [ ] Impressions timeline
  - [ ] Sparkline data
- Mobile (read-only)
  - [ ] Stats screen
- Web
  - [ ] Performance dashboard per campaign

### A7 — Billing + invoices + payment methods
- Backend
  - [ ] Billing profile per company
  - [ ] Stripe payment methods
  - [ ] Invoice history
  - [ ] Account balance + MRR + total spend
  - [ ] Stripe webhooks
- Web
  - [ ] Billing page (methods, invoices, balance)

### A8 — Notifications (advertiser)
- Backend (uses X3)
  - [ ] Filter to companyId notifications
- Mobile (read-only)
  - [ ] Notifications view
- Web
  - [ ] Notifications center

---

## Partner

### P1 — Partner profile
- Backend
  - [ ] Update partner profile (business, manager, address, hours)
- Mobile (read-only)
  - [ ] Profile view
- Web
  - [ ] Edit profile

### P2 — Terminals (bornes)
- Backend
  - [ ] Terminal registry (coords, venue type, partner)
  - [ ] Status (online/maintenance/offline) + uptime
  - [ ] Heartbeat ingestion + last sync
  - [ ] Maintenance scheduling
- Mobile (read-only)
  - [ ] Home — terminal status summary
- Web
  - [ ] Terminal list + map + status detail

### P3 — Stock
- Backend
  - [ ] Stock inventory (5 scent types: level %, capacity, daily use, refill ETA)
  - [ ] Spray counter + daily usage
  - [ ] Stock alerts (Faible / Rupture)
  - [ ] Stock orders from partner
  - [ ] Refill logging
- Mobile (read-only)
  - [ ] Stock screen view
- Web
  - [ ] Stock screen + order action + refill log

### P4 — Ads
- Backend
  - [ ] Ad playback schedule per terminal (live, scheduled, frequency, time windows)
  - [ ] Ad impression counter per terminal
  - [ ] Partner ad-issue reports
- Mobile (read-only)
  - [ ] Ads screen view
- Web
  - [ ] Ads schedule + report action + impressions

### P5 — Revenue
- Backend
  - [ ] Terminal revenue split (sprays + ads share)
  - [ ] Revenue history + payout schedule
  - [ ] Monthly target tracking
  - [ ] Statement export
- Mobile (read-only)
  - [ ] Revenue screen (history, transactions)
- Web
  - [ ] Revenue page + payout schedule + statement export

### P6 — Notifications (partner)
- Backend (uses X3)
  - [ ] Filter to partnerId notifications
- Mobile (read-only)
  - [ ] Notifications with filters (all/unread/stock/ops)
- Web
  - [ ] Notifications center

---

## Admin (web only)

### AD1 — Validations queue
- Backend
  - [ ] Combined queue (pending drivers + companies + partners)
  - [ ] Per-submission detail with documents
  - [ ] Approve / reject / request more info
  - [ ] Notify submitter on decision
- Web
  - [ ] Validation queue page + per-item detail

### AD2 — Finances
- Backend
  - [ ] Invoices CRUD (statuses: payée / envoyée / en retard / brouillon)
  - [ ] Driver commissions (per campaign, per km, batch payout)
  - [ ] Internal expenses ledger (categories: fourniture / sous-traitance / infrastructure / logistique)
  - [ ] Finance KPIs (MRR, collections, pending, commissions due)
- Web
  - [ ] Finances page (invoices, commissions, expenses, KPIs)

### AD3 — Stripe + payment processing
- Backend
  - [ ] Stripe webhook handler (payment confirmation, dispute, refund)
  - [ ] Payment status sync to invoices

### AD4 — Reports
- Backend
  - [ ] Async generation (PDF/CSV)
  - [ ] Monthly summary
  - [ ] Accounting export (invoices, commissions, expenses)
  - [ ] Borne performance report
  - [ ] Driver activity report
  - [ ] Advertiser engagement report
  - [ ] GDPR audit report
- Web
  - [ ] Reports page + download

### AD5 — Dashboard / KPIs
- Backend
  - [ ] Admin aggregates (MRR + trend, active campaigns, validated drivers, pending counts, borne fleet health, validation queue, city distribution)
  - [ ] Revenue chart data (Flocage vs Borne stacked, 30/90/365 day)
  - [ ] Advertiser dashboard data (own impressions, % vs goal, sparkline, active campaigns, team activity, billing summary)
- Web
  - [ ] Admin dashboard
  - [ ] Advertiser dashboard

### AD6 — Search palette
- Backend
  - [ ] Global search (campaigns, drivers, companies, bornes)
- Web
  - [ ] cmd+K palette

### AD7 — Users management
- Backend
  - [ ] Admin force-logout (Better Auth admin plugin)
  - [ ] Ban / unban
- Web
  - [ ] Users page with actions

### AD8 — Global settings
- Backend
  - [ ] Platform settings collection
- Web
  - [ ] Settings page (admin)
