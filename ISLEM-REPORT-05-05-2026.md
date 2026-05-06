# Development Report

**Date:** 05 May 2026
**Prepared by:** Islem

---

## Work Completed

### 1. Publeader — Mobile / Backend Stabilization

- Fixed a session-persistence bug that was logging users out of the mobile app on every reload — drivers now stay signed in.
- Resolved a networking issue that prevented real Android devices from reaching the backend.
- Cleaned up sensitive configuration files from version control.
- Restricted the mobile app to drivers only — advertisers and partners now use the web dashboard for sign-up; the mobile app gives them read-only access.
- Hardened the demo-data seeding so the team can reset to a clean known state instantly.

---

### 2. Publeader — Campaigns Module (Driver browse, accept, mine)

- Designed and built the campaign system end-to-end: campaigns now have a real lifecycle (draft → upcoming → active → completed) that progresses automatically over time.
- Drivers can now browse campaigns matching their city, see full details, accept missions (with safeguards against double-acceptance), and view their active / upcoming / completed campaigns in a dedicated screen.
- Populated the platform with 9 demo brands (Nike, Adidas, Coca-Cola, Renault, OpenAI, FedEx, LEGO, Louis Vuitton, Spotify) and 10 demo campaigns to make the app feel real during demos.
- Mobile screens fully wired with live data, with rich filtering (status, tracking type, reward range), pull-to-refresh, and automatic refresh when returning to a screen.
- Admins can now filter the campaigns list by driver on the web dashboard.

---

### 3. Publeader — Statistics & Earnings

- Built the driver statistics system with a period selector (7 days / 30 days / 3 months / 1 year) and growth comparison vs. the prior period.
- Driver home screen now shows real monthly earnings with an automatic up/down trend indicator.
- Statistics screen displays a revenue card, four key metrics (campaigns done, kilometres, average per campaign, active missions), and a monthly-breakdown chart.
- On the admin side, every driver now has a dedicated detail page with their lifetime stats, period selector, and link to filter their campaigns.

---

### 4. Publeader — Payments, Withdrawals & Statements

- Designed and built a full payments system: drivers earn real money when campaigns complete, see a pending balance during a 7-day hold, then funds become available for withdrawal.
- Built the withdrawal flow on mobile: drivers add their IBAN once in their profile, then request withdrawals with preset amounts or custom values, with server-side minimum enforcement and clear error messages.
- Built the matching admin queue on the web: pending / paid / rejected tabs, with actions to mark a withdrawal as paid (with optional bank reference) or reject it (rejection automatically refunds the driver's balance).
- Implemented monthly account statement generation as PDF — drivers can download their statement for any of the past 12 months directly from the mobile app.
- All payment screens (history, transaction detail, withdraw, statement) are now wired to live data with proper loading and error states.

---

### 5. Publeader — Documents Upload & Validation (KYC)

- Set up Cloudinary as the file-storage backend with secure signed direct uploads — files go straight from the user's device to Cloudinary, never through our server, which is secure and scalable.
- Designed the KYC document workflow: drivers upload required documents (driving license, vehicle registration, insurance, RIB, vehicle photos) with the right number of files per type; admin reviews each type and approves or rejects with a reason.
- Mobile documents screen rebuilt: drivers see status badges per document type, descriptions of what's required, rejection reasons when applicable, and can re-upload to replace previously rejected documents.
- Built the admin review queue on the web: pending / approved / rejected tabs, with a review modal showing image previews and approve/reject actions with a required rejection reason.
- A driver only becomes "documents-approved" when every required document type has been admin-approved — this gates the validation flow cleanly.

---

### 6. Publeader — Vehicles Management

- Drivers can now manage up to three vehicles directly from the app: add, edit, delete, switch which one is "active" (used for campaigns), and upload showcase photos.
- Each vehicle has a technical-inspection date with automatic status (valid / expiring soon / expired / missing) shown directly in the UI.
- Built a vehicles section on the admin driver-detail page with photo previews and inspection status at a glance.

---

### 7. Publeader — Profile Edit

- Drivers can now edit their phone number and city directly from the app; name and email remain locked for security/KYC reasons.
- Added a 48-hour cooldown on city changes to prevent abuse, with a clear French error message when the limit is hit.
- Admins can edit any driver's profile (including name and validation status) from the web dashboard, bypassing the cooldown for support cases.

---

### 8. Daily Operations

- On-site at the office collaborating with the team on scope, architecture decisions, and review of the daily progress.

---

## Summary

Today the platform moved from "auth done" to "core driver experience fully functional end-to-end" — a driver can register, get validated, browse and accept campaigns, see real earnings and statistics, upload KYC documents, manage their vehicles, edit their profile, request withdrawals, and download monthly statements. Admins have matching review tools on the web for documents, withdrawals, campaigns filtering, and driver profile edits. Seven major sections of the roadmap (D1 to D6 plus the file-storage infrastructure) shipped today.
