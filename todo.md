# Backend Todo

## Web Backend (serves Web + Mobile)

### Auth & Identity (dual-client: web cookies + mobile Bearer tokens)
- [ ] User accounts with roles: admin, advertiser, driver, partner, team_member
- [ ] Driver self-registration (4-step: identity, vehicle, security, documents)
- [ ] Company self-registration
- [ ] Partner registration
- [ ] Login / logout
- [ ] Token refresh
- [ ] Password reset via email
- [ ] Change password
- [ ] Current-user profile lookup (hydrate role + linked entity on app launch)
- [ ] Pending state for newly-registered drivers/companies (await admin validation)
- [ ] Role-based access control across all features
- [ ] Session revocation

### Drivers
- [ ] Driver profile (identity, contact, city)
- [ ] Vehicle management (one or multiple cars per driver: make, model, year, plate, type, inspection)
- [ ] Document upload + validation workflow (license, registration, insurance, photos)
- [ ] Driver status lifecycle (pending → validated/rejected)
- [ ] Driver stats aggregates (monthly earnings, total earnings, campaigns done, rating, total km, growth)
- [ ] Driver campaign history
- [ ] Driver payment history + statement export
- [ ] Withdrawal requests (presets + custom amount)
- [ ] Notification preferences

### Companies / Advertisers
- [ ] Company profile (legal info, sector, contact, brand color, logo)
- [ ] Company status lifecycle (pending → validated/rejected)
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
- [ ] Real login (email + password)
- [ ] Real register-driver 4-step submission
- [ ] Real register-advertiser flow
- [ ] Real register-partner flow
- [ ] Pending screen polls user status until validated
- [ ] Forgot/reset password screens
- [ ] Change password wired
- [ ] Logout clears tokens

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

### Advertiser
- [ ] Home dashboard (own KPIs)
- [ ] Campaigns list (own only) with filter
- [ ] Create campaign (mobile 3-step wizard)
- [ ] Driver assignment modal
- [ ] Stats / performance
- [ ] Profile + company edit
- [ ] Notifications

### Partner
- [ ] Home (terminal status, stock summary, live ads, notifs)
- [ ] Stock screen (alerts, order action)
- [ ] Ads screen (live, scheduled, report issue)
- [ ] Revenue screen (history, transactions, statement export)
- [ ] Notifications with filters (all/unread/stock/ops)
- [ ] Profile + terminal preferences (notification toggles, maintenance allowed)

### Cross-cutting mobile UX
- [ ] Loading skeletons on data screens
- [ ] Pull-to-refresh
- [ ] Error toasts on mutations
- [ ] Offline cache + retry
- [ ] Image/file upload helpers
- [ ] Foreground push banner
- [ ] Remove role quick-access buttons in login (dev-only)
