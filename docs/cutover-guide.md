# Production Cutover Guide — `v2badminton.com`

> **Audience:** A junior dev (you) executing the cutover for the first time.
> **Goal:** Switch `https://v2badminton.com` (currently a stale Cloudflare-cached static page) to the new Next.js 16 production deployment at commit **`cb201f9`**.
> **Total time:** ~3.5 hours spread across 2 calendar days. Active "danger window" is **30 min**.
> **Rollback time if anything goes wrong:** **2–10 minutes**.

---

## How to use this guide

1. Read **§Before you start** completely before touching anything.
2. Complete phases **in order**. Each phase has a green checkpoint (✅) — do not move on until you can tick every box.
3. If anything in a "STOP IF" block triggers → stop and either fix it or escalate. Do not improvise.
4. Copy-paste commands exactly. Don't substitute "similar" commands.
5. When the guide says "dashboard," screenshots help. If stuck, take a screenshot and ask a senior before guessing.

---

## Before you start

### What you need on hand
- Access to **Vercel** for project `v2badminton-next` (Settings + Deployments permissions)
- Access to **Cloudflare** for zone `v2badminton.com` (DNS edit + Page Rules permissions)
- Access to **Sanity Studio** for this project (to verify lead writes)
- **A real phone you'll use to receive a test SMS/Zalo** (for end-to-end lead test)
- A test email address you control (Gmail is fine)
- This terminal: PowerShell on Windows, opened in the repo root `D:\V2\v2badminton-next`
- 3 hours of uninterrupted time, ideally split into two sessions:
  - Session A (30 min, anytime): Phase 0 + Phase 1 + Phase 2
  - Session B (1 hour, off-peak 2–4 AM ICT): Phase 3 + Phase 4 + Phase 5 first hour
  - Background watching (next 23 hours): Phase 5 monitoring

### Glossary
- **Apex domain**: `v2badminton.com` (no `www`).
- **Subdomain**: `www.v2badminton.com`.
- **DNS-only**: In Cloudflare, the gray cloud icon. Means Cloudflare just returns the DNS answer; it does NOT proxy traffic.
- **Proxied**: Orange cloud icon. Cloudflare sits in the request path, caches, applies firewall, etc.
- **SSL "Issued"**: Vercel has generated a Let's Encrypt cert for the domain. Required before users can load HTTPS.

### Cutover commit
The exact code state going live: **`cb201f9`** (already on `main`). Phase 0 makes this permanent.

---

## Phase 0 — Tag the cutover commit (5 min)

**Why:** Even after future commits land on main, you can always check out `cutover-2026-05-11` to see the exact code that went live. Essential for rollback diagnostics.

```bash
# In your repo root
git fetch origin
git checkout main
git pull --ff-only origin main
git tag -a cutover-2026-05-11 cb201f9 -m "Cutover to v2badminton.com production"
git push origin cutover-2026-05-11
```

**Verify:**
```bash
git tag -l cutover-2026-05-11
# Should output:
# cutover-2026-05-11
```

### ✅ Phase 0 checkpoint
- [ ] Tag `cutover-2026-05-11` exists locally
- [ ] Tag pushed to origin
- [ ] `git status` shows clean working tree
- [ ] You are on branch `main`

---

## Phase 1 — Vercel production environment audit (30 min)

**Why:** If even one env var is missing or wrong, the deployment will look fine but the lead form (the business-critical path) will silently fail. This phase catches it before users see it.

### 1.1 — Install / login to Vercel CLI

```bash
npx vercel@latest --version
# If first run, it will install. Confirm "y" when prompted.

npx vercel@latest login
# Choose "Continue with GitHub" (most likely)
# Browser opens, login, return to terminal.
```

### 1.2 — Confirm project link

```bash
npx vercel@latest link
```

When asked:
- **Set up "v2badminton-next"?** Yes
- **Which scope?** Select the team that owns `v2badminton-next`
- **Link to existing project?** Yes → select `v2badminton-next`

**Verify:**
```bash
cat .vercel/project.json
# Should output JSON with:
#   "projectId": "prj_EYbW9GXkyTcAVOs3oSG7eCDOH8pw"
#   "projectName": "v2badminton-next"
```

> **STOP IF** the projectId is different. That means you linked to the wrong project. Run `npx vercel@latest unlink` and try again.

### 1.3 — Pull current Production env to local file

```bash
npx vercel@latest env pull .env.production.local --environment=production
```

This downloads all Production-scope env vars to a local file `.env.production.local`. The file is gitignored — **do not commit it**.

**Verify the file exists:**
```bash
ls .env.production.local
# Should list the file (size > 0)
```

> **STOP IF** the command fails with "Project not linked" — go back to 1.2.
> **STOP IF** the file is empty (0 bytes) — your account may not have access. Escalate.

### 1.4 — Run the env verification script

This is the gate. The script checks every required var has the right value.

**Option A (recommended — uses dotenv-cli):**
```bash
npx dotenv-cli@latest -e .env.production.local -- node scripts/verify-production-env.mjs
```

**Option B (manual env loading in PowerShell):**
```powershell
Get-Content .env.production.local | ForEach-Object {
  if ($_ -match '^([^#=]+)=(.*)$') {
    Set-Item -Path "env:$($matches[1])" -Value $matches[2]
  }
}
node scripts/verify-production-env.mjs
```

**Expected output:**
```
Production cutover env check passed.
```

### 1.5 — Fix any failure

If the script fails, you'll see lines like:
```
Production cutover env check failed:
- Missing required production env: NEXT_PUBLIC_SITE_URL, ...
- NEXT_PUBLIC_ALLOW_INDEXING must be exactly "true" for cutover.
```

**For each missing/wrong var, fix in Vercel Dashboard:**

1. Open https://vercel.com/dashboard
2. Click project `v2badminton-next`
3. **Settings** → **Environment Variables**
4. Either add a new var or edit existing. **Environment** must be set to **Production** (uncheck Preview and Development unless intentional).
5. Click **Save**.

**Required production values (exact):**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://v2badminton.com` (exact, no trailing slash, no `www`) |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` (lowercase) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From your Sanity project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `FORM_TOKEN_SECRET` | A long random string (≥32 chars). Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. If already set, don't change. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | From Cloudflare → Turnstile → your widget |
| `TURNSTILE_SECRET_KEY` | From same Turnstile widget |
| `UPSTASH_REDIS_REST_URL` | From Upstash → your DB → Details |
| `UPSTASH_REDIS_REST_TOKEN` | Same |
| `NEXT_PUBLIC_SENTRY_DSN` | From Sentry project settings → Client Keys (DSN) |
| `SENTRY_DSN` | Same value as above |
| `SENTRY_ORG` | Sentry org slug |
| `SENTRY_PROJECT` | Sentry project slug |
| `SENTRY_AUTH_TOKEN` | Generate in Sentry → Settings → Auth Tokens (scope: `project:releases`). **Mark as Sensitive in Vercel.** |
| `POSTGRES_URL` | Auto-populated by Vercel Postgres integration. If unset, link the Vercel Postgres DB to this project. |

**Optional (lead notifications — don't block cutover but you'll lose alerts if missing):**

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | Email notifications |
| `NOTIFY_EMAIL_TO` | Where lead alerts go |
| `NOTIFY_EMAIL_FROM` | Verified Resend sender, e.g. `V2 Badminton <leads@v2badminton.com>` |
| `TELEGRAM_BOT_TOKEN` | Telegram lead alerts |
| `TELEGRAM_CHAT_ID` | Same |

**After making changes in the dashboard:**

```bash
# Repeat the pull + verify until the script passes.
rm .env.production.local
npx vercel@latest env pull .env.production.local --environment=production
npx dotenv-cli@latest -e .env.production.local -- node scripts/verify-production-env.mjs
```

### 1.6 — Clean up the local env file

```bash
rm .env.production.local
```

> **Why:** It contains production secrets. Even though it's gitignored, you don't want it sitting around on a laptop.

### ✅ Phase 1 checkpoint
- [ ] `npx vercel@latest env ls production` shows all required vars
- [ ] `verify-production-env.mjs` exited with `Production cutover env check passed.`
- [ ] `.env.production.local` deleted
- [ ] Vercel Postgres is linked to the project (Settings → Storage)

---

## Phase 2 — Production preview build & smoke test (15 min)

**Why:** Before flipping DNS, prove the production build at the right commit works end-to-end on the Vercel preview URL. This is the dress rehearsal.

### 2.1 — Trigger a fresh production deployment

```bash
# Make sure you are on the cutover commit
git checkout cb201f9

# Trigger a production deployment from your local code state
npx vercel@latest --prod
```

When asked:
- **Set up and deploy "v2badminton-next"?** Yes
- The first deploy uploads files. Takes ~3-5 min.

**Expected output ends with:**
```
[OK]  Production: https://v2badminton-next-xxxxxxxx.vercel.app [3m]
```

**Copy this URL — you'll smoke-test against it AND keep it as your post-cutover Vercel rollback target.**

Save it as a PowerShell env var in your current shell so later commands can reference it:

```powershell
$env:CUTOVER_DEPLOY_URL = "https://v2badminton-next-xxxxxxxx.vercel.app"   # paste your real URL
```

Also write it down in your notes — once the shell closes the variable is gone.

> Note: The domain `v2badminton.com` is NOT attached to this deployment yet. Smoke testing uses the Vercel-generated URL only.

### 2.2 — Smoke test the Vercel URL

Open in browser (use your test Vercel URL from 2.1):

| URL path | Pass criteria |
|---|---|
| `/` | Homepage loads. Hero shows "Hành trình chinh phục cầu lông". Pricing section visible. No console errors (F12 → Console tab). |
| `/blog/` | Blog list page loads. Shows posts or empty-state card. |
| `/chinh-sach-bao-mat/` | Legal page loads, narrow column (~920px wide). |
| `/hoc-cau-long-cho-nguoi-moi/` | Money page loads, hero image present but no duplicate-h1 alt text in DevTools. |
| `/sitemap.xml` | Returns XML starting with `<?xml`. View source. Should list main routes. |
| `/robots.txt` | Returns text starting with `User-agent: *`. Should contain `Allow: /` (NOT `Disallow: /`). |
| `/studio` | Sanity Studio loads (you may need to log in). |
| `/api/health` | Returns JSON (likely `{"status":"ok"}` or similar). |

> **STOP IF** `/robots.txt` says `Disallow: /` — that means `NEXT_PUBLIC_ALLOW_INDEXING` is not `true` in Vercel. Search engines will skip the site. Go back to 1.5.

### 2.3 — Submit a real test lead

This is the most important step in Phase 2. The lead form path is the business-critical conversion.

**On the Vercel URL:**

1. Scroll to contact section (`#lien-he` in URL).
2. Fill the form with **your own** real data:
   - Name: "Test Junior Dev"
   - Phone: a real phone you have
   - Email: a real inbox you have
   - Level: any
   - Court: any (if visible)
   - Time slot: any
3. Complete the Turnstile captcha if shown.
4. Click submit.

**Pass criteria — split into MUST-PASS (launch blockers) and SHOULD-PASS (ops notifications):**

**MUST-PASS (launch blockers — if any fail, do NOT proceed to cutover):**
- [ ] Form shows green success state ("Cam on..." or similar)
- [ ] Open Vercel Dashboard -> Storage -> Postgres -> Data -> `leads` (or similar) table -> row exists for this submission (~10 seconds)
- [ ] Open Sanity Studio (`/studio`) -> lead document appears under the appropriate type (~30 seconds)

**SHOULD-PASS (ops alerts — failures are warnings, not blockers):**
- [ ] Within 30 seconds: email arrives at `NOTIFY_EMAIL_TO` (check spam folder)
- [ ] Within 30 seconds: Telegram notification arrives (if `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` configured)

**Why this split:** Email and Telegram are configured as **optional** in `src/lib/env.ts`. The lead is still captured to Postgres + Sanity even when notifications are skipped. A missing email or Telegram alert is an operational gap (you won't get pinged about leads in real time), not a data-loss bug.

> **STOP IF** any MUST-PASS check fails. The form-submission red-error case is almost always a missing/wrong env (most often `TURNSTILE_SECRET_KEY`, `FORM_TOKEN_SECRET`, or `POSTGRES_URL`). Check Vercel Function logs: Dashboard -> Functions -> Logs.
>
> **WARN IF** only SHOULD-PASS checks fail. Log a known-issue ticket and proceed, but plan to fix the notification config within 24 hours so you don't miss real customer leads.

### 2.4 — Run Lighthouse baseline

This captures your "before cutover" performance so you can compare after.

In Chrome on the Vercel URL:
1. F12 → **Lighthouse** tab
2. Mode: Navigation, Device: Mobile, Categories: Performance + Accessibility + Best Practices + SEO
3. Click **Analyze page load**
4. **Save the report**: ⋮ menu → **Save as HTML** → save as `lighthouse-pre-cutover-mobile.html` somewhere safe.
5. Repeat with Device: Desktop → save as `lighthouse-pre-cutover-desktop.html`.

### ✅ Phase 2 checkpoint

**MUST-PASS (block cutover if any fail):**
- [ ] Production deployment succeeded; URL recorded as `$env:CUTOVER_DEPLOY_URL`
- [ ] All 8 smoke-test URLs loaded cleanly
- [ ] Test lead form submission succeeded (green state)
- [ ] Test lead persisted to Postgres `leads` table
- [ ] Test lead appeared in Sanity Studio

**SHOULD-PASS (proceed but flag as known-issue):**
- [ ] Email notification received
- [ ] Telegram notification received (if configured)
- [ ] Lighthouse mobile + desktop reports saved (for post-cutover comparison)

**Record for rollback:**
- [ ] `$env:CUTOVER_DEPLOY_URL = "https://v2badminton-next-XXXX.vercel.app"` (from Phase 2.1) — save in your notes. This is your last-known-good Vercel deployment.

---

## Phase 3 — Cloudflare DNS prep (15 min, BEFORE the cutover window)

**Why:** You're going to edit DNS at 2 AM. Prep the exact changes during the day so the cutover is a 5-minute mechanical task, not 30 minutes of investigation.

### 3.1 — Backup current Cloudflare DNS

1. Login to https://dash.cloudflare.com → select zone `v2badminton.com`
2. **DNS** → **Records** in the left sidebar
3. Top-right ⋮ menu → **Export**
4. Save as `cloudflare-dns-backup-2026-05-11.txt`. Store in a personal Drive folder — **NOT in this repo**.
5. **Also take a screenshot** of the records table for visual reference.

> **STOP IF** you don't see the Export option — your account lacks DNS edit permissions. Get them before continuing.

### 3.2 — Add the domain to Vercel project (if not already)

```bash
# This tells Vercel "I want to serve v2badminton.com from this project"
# It does NOT change DNS — that's the next step.
npx vercel@latest domains add v2badminton.com v2badminton-next
npx vercel@latest domains add www.v2badminton.com v2badminton-next
```

If you see "Domain already exists" — that's fine, skip ahead.

### 3.3 — Get Vercel's required DNS targets

```bash
npx vercel@latest domains inspect v2badminton.com
npx vercel@latest domains inspect www.v2badminton.com
```

**Look for the "Recommended" or "Required" DNS records section.** Vercel will tell you exactly what to set. Typically:

- For apex `v2badminton.com`:
  - **Type:** `A`
  - **Name:** `@` (or blank)
  - **Value:** `76.76.21.21` (verify in inspect output — Vercel sometimes updates this)
- For `www.v2badminton.com`:
  - **Type:** `CNAME`
  - **Name:** `www`
  - **Value:** `cname.vercel-dns.com.` (note the trailing dot; some UIs add it automatically)

**Write these values down. You'll type them into Cloudflare during Phase 4.**

### 3.4 — Plan the exact Cloudflare edits

Open the Cloudflare DNS records page in a separate browser tab. **Identify** (do not edit yet) the following:

| Currently exists? | Type | Name | Value | Plan |
|---|---|---|---|---|
| ? | A | `v2badminton.com` (`@`) | ? | **REPLACE** with Vercel value |
| ? | AAAA | `v2badminton.com` (`@`) | `100::` | **DELETE** (null IPv6) |
| ? | A or CNAME | `www` | ? | **REPLACE** with Vercel CNAME |
| ? | AAAA | `www` | `100::` | **DELETE** |
| ✅ | MX | any | (Google/Zoho/etc) | **PRESERVE** — email |
| ✅ | TXT | `v2badminton.com` | (SPF, DKIM, DMARC, verification codes) | **PRESERVE** |
| ✅ | CNAME | e.g. `mail`, `autodiscover` | (email providers) | **PRESERVE** |

**Write a checklist on paper or notes app:**
```
DELETE: AAAA @ → 100::
DELETE: AAAA www → 100::
DELETE: A @ → <whatever it is>
DELETE: CNAME www → <whatever it is>
ADD: A @ → 76.76.21.21 (DNS only, gray cloud)
ADD: CNAME www → cname.vercel-dns.com (DNS only, gray cloud)
PRESERVE: MX, TXT, CNAME for email
```

### 3.5 — Fix the existing broken `www → /s` redirect

The current `www.v2badminton.com` redirects to `https://v2badminton.com/s` (404). Find the rule and disable it.

Look in Cloudflare for:
- **Rules → Page Rules** → look for any rule matching `www.v2badminton.com/*`
- **Rules → Bulk Redirects** → same
- **Rules → Redirect Rules** → same

If found: **toggle OFF** (don't delete yet — easier to restore if Vercel www redirect doesn't kick in).

> **You'll let Vercel handle the www → apex redirect.** When you add both domains to the Vercel project, Vercel automatically issues a 308 redirect from www to apex (or whichever is canonical). No Cloudflare rule needed.

### ✅ Phase 3 checkpoint
- [ ] Cloudflare DNS exported to a local backup file
- [ ] `npx vercel@latest domains inspect` showed valid DNS targets
- [ ] You have a written checklist of exact records to DELETE/REPLACE/PRESERVE
- [ ] Broken `www → /s` Cloudflare rule identified (will disable during cutover)

---

## Phase 4 — Cutover window (30 min, off-peak time)

**Run this between 2:00 AM and 4:00 AM Vietnam time.** Vietnamese traffic is lowest then; if anything breaks you have hours to fix before morning users arrive.

**Have ready in tabs:**
- Cloudflare DNS page
- Vercel project deployments page
- Vercel project domains page
- Sanity Studio (logged in)
- Your test phone with a working network
- This guide

### 4.1 — Final pre-DNS check (2 min)

```powershell
# Confirm you're still on the cutover commit
git log -1 --oneline
# Should show: cb201f9 fix(ui): sprint 3 - polish and a11y conventions (#36)

# Confirm the production deployment from Phase 2 is still the active production deployment
npx vercel@latest list v2badminton-next --environment production --status READY | Select-Object -First 10
# The top row should be the deployment URL from Phase 2.1 (which you saved as $env:CUTOVER_DEPLOY_URL).
```

> **STOP IF** the top production deployment is not the one you smoke-tested in Phase 2.1. Re-run `npx vercel@latest --prod` from the `cb201f9` checkout before proceeding.

### 4.2 — Cloudflare DNS edits (5 min)

Working from your Phase 3.4 checklist, in Cloudflare DNS:

1. **DELETE** the AAAA `@` → `100::` record (click the row → Delete).
2. **DELETE** the AAAA `www` → `100::` record.
3. **DELETE** any existing A `@` record.
4. **DELETE** any existing CNAME or A `www` record.
5. **ADD** new A record:
   - Type: `A`
   - Name: `@`
   - IPv4 address: `76.76.21.21` (or whatever Vercel inspect said)
   - **Proxy status: DNS only (gray cloud)** ← critical
   - TTL: Auto
   - Click Save
6. **ADD** new CNAME record:
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com.` (or whatever Vercel inspect said)
   - **Proxy status: DNS only (gray cloud)**
   - TTL: Auto
   - Click Save
7. **Disable** the broken `www → /s` redirect rule (Rules → Page Rules / Redirect Rules → toggle off).

**Visually check:** The DNS records page should now show:
- A `@` → `76.76.21.21` (gray cloud)
- CNAME `www` → `cname.vercel-dns.com` (gray cloud)
- All email records (MX, TXT, etc.) untouched

### 4.3 — Wait for DNS propagation (2–10 min)

```bash
# Use Cloudflare's own resolver to verify (skips your ISP cache)
nslookup v2badminton.com 1.1.1.1
nslookup www.v2badminton.com 1.1.1.1
```

**Wait for:**
- Apex resolves to `76.76.21.21` (or Vercel's IP)
- `www` resolves via CNAME to a Vercel host

Re-run every 60s until correct. Should be < 5 min for Cloudflare.

> **Alternative:** Online DNS check — https://dnschecker.org/#A/v2badminton.com — should show green across global resolvers within 5–10 min.

### 4.4 — Vercel domain verification + SSL (1–5 min)

```bash
npx vercel@latest domains inspect v2badminton.com
npx vercel@latest domains inspect www.v2badminton.com
```

**Look for both:**
- `Configuration: Valid` ✅
- `Nameservers: Correct` or `SSL: Issued` ✅

If SSL not issued yet, wait 2 min and re-run. Vercel auto-issues Let's Encrypt within minutes of DNS being correct.

> **STOP IF** after 10 min Vercel still says `SSL: Pending` and DNS resolves correctly — open Vercel dashboard → Domains → click the domain → look for the specific error. Common cause: a stuck CAA record blocking Let's Encrypt. Check Cloudflare DNS for any CAA records; if present, must allow `letsencrypt.org`.

### 4.5 — Smoke test on real domain (10 min)

In PowerShell, use `curl.exe` (the real curl binary, NOT the PowerShell `curl` alias which maps to `Invoke-WebRequest` and ignores `-I`/`-sL`):

```powershell
# Should all return 200 (or 301/308 for www)
curl.exe -I https://v2badminton.com/
curl.exe -I https://www.v2badminton.com/
curl.exe -s https://v2badminton.com/robots.txt | Select-Object -First 10
curl.exe -s https://v2badminton.com/sitemap.xml | Select-Object -First 3
```

PowerShell-native alternative if `curl.exe` is unavailable:

```powershell
(Invoke-WebRequest -Method Head -Uri https://v2badminton.com/ -MaximumRedirection 0 -SkipHttpErrorCheck).StatusCode
(Invoke-WebRequest -Method Head -Uri https://www.v2badminton.com/ -MaximumRedirection 0 -SkipHttpErrorCheck).Headers.Location
(Invoke-WebRequest -Uri https://v2badminton.com/robots.txt -UseBasicParsing).Content.Split("`n") | Select-Object -First 10
(Invoke-WebRequest -Uri https://v2badminton.com/sitemap.xml -UseBasicParsing).Content.Substring(0, 200)
```

Expected:
- `https://v2badminton.com/` -> `HTTP/2 200`
- `https://www.v2badminton.com/` -> `HTTP/2 308` or `301` with `Location: https://v2badminton.com/`
- `/robots.txt` -> starts with `User-agent: *`, contains `Allow: /`
- `/sitemap.xml` -> starts with `<?xml`

**In a browser** (open Incognito/Private to bypass cache):

Repeat the entire Phase 2.2 smoke test, but using **`https://v2badminton.com`** as the base instead of the Vercel preview URL.

| Check | Pass criteria | Severity |
|---|---|---|
| `https://v2badminton.com/` | Homepage loads, no console errors | MUST-PASS |
| `https://v2badminton.com/blog/` | Blog list loads | MUST-PASS |
| `https://v2badminton.com/chinh-sach-bao-mat/` | Legal page loads | MUST-PASS |
| `https://v2badminton.com/hoc-cau-long-cho-nguoi-moi/` | Money page loads | MUST-PASS |
| `https://v2badminton.com/studio` | Sanity Studio loads (login may be needed) | MUST-PASS |
| `https://www.v2badminton.com/` | Redirects 308 to `https://v2badminton.com/` (NOT `/s`) | MUST-PASS |
| Lead form submit: green success + row in Postgres + doc in Sanity | Lead is persisted | **MUST-PASS** |
| Lead form submit: email arrived | Notification works | SHOULD-PASS |
| Lead form submit: Telegram arrived | Notification works | SHOULD-PASS |

> **STOP IF any MUST-PASS check fails** -> jump to **Phase 6 - Rollback Scenario C** (DNS restore). Don't try to fix on live.
>
> **WARN IF only SHOULD-PASS checks fail** -> log a known-issue ticket. Proceed with monitoring but plan to fix notifications within 24h.

### 4.6 — (Optional, recommended SKIP for now) Enable Cloudflare proxy

You can come back to this 48h after cutover. For now leave DNS-only (gray cloud) — Vercel's CDN is solid.

### ✅ Phase 4 checkpoint

**MUST-PASS (rollback if any fail):**
- [ ] DNS edits applied in Cloudflare
- [ ] `nslookup` confirms Vercel IPs / CNAME
- [ ] `vercel domains inspect` shows Valid + Issued for both apex + www
- [ ] All MUST-PASS smoke tests passed on real domain
- [ ] Real test lead persisted to Postgres + Sanity

**SHOULD-PASS (warning, not blocker):**
- [ ] Email notification received
- [ ] Telegram notification received (if configured)

---

## Phase 5 — Post-cutover monitoring (24 hours)

### 5.1 — First hour (active)

**T+0 to T+30 min — stay at the keyboard:**

- Keep Vercel dashboard → **Logs** tab open. Watch for any 5xx errors.
- Keep Sentry → **Issues** open. Watch for new error events.
- Refresh `https://v2badminton.com/` every 5 min from different devices/networks (laptop wifi, phone 4G).

**T+30 min — submit 2 more test leads:**
- One from a mobile device on 4G
- One from desktop
- Both should arrive in the lead pipeline
- This catches issues that didn't show up at 2 AM

### 5.2 — First 6 hours (passive)

- Check Sentry every hour or two
- Check Vercel logs for any 5xx
- Check Postgres → leads table is growing if you have organic traffic

### 5.3 — At T+1 hour — run Lighthouse on real domain

Same procedure as Phase 2.4, but on `https://v2badminton.com/`. Save reports `lighthouse-post-cutover-mobile.html` and `lighthouse-post-cutover-desktop.html`. Compare scores against pre-cutover baseline.

Performance scores should be similar or better. SEO score should be ≥ 95.

### 5.4 — At T+24 hours

- Open Google Search Console for `v2badminton.com`
- **URL Inspection** → enter `https://v2badminton.com/` → **Request Indexing**
- Repeat for top-priority pages: `/`, `/blog/`, `/hoc-cau-long-cho-nguoi-moi/`, etc.
- Re-submit sitemap: **Sitemaps** → `https://v2badminton.com/sitemap.xml` → Submit

### ✅ Phase 5 checkpoint (at T+24h)
- [ ] No critical Sentry issues opened in last 24h
- [ ] No spike in 5xx in Vercel logs
- [ ] At least 1 real (non-test) lead recorded in Postgres
- [ ] Lighthouse SEO score ≥ 95 on homepage
- [ ] Google Search Console sitemap re-submitted

---

## Phase 6 — Rollback procedures

> **Important context before choosing a scenario:**
>
> The **pre-cutover live site** at `v2badminton.com` was a static page served from Cloudflare cache, NOT from a Vercel deployment. That means:
>
> - **"Restore the previous public state"** = restore Cloudflare DNS to its pre-cutover records (Scenario C below). Promoting an older Vercel deployment will NOT bring back the old static page, because there is no older Vercel deployment that matches that state.
> - **"Promote a previous Vercel deployment"** is only useful AFTER cutover when a NEW bad deploy goes out and you want to fall back to the last-known-good Vercel deploy. Record `$env:CUTOVER_DEPLOY_URL` from Phase 2.1 — that is your last-known-good Vercel deploy.

### Scenario A: A new bad deploy happens AFTER cutover and you need to fall back to the cutover deploy

**Use case:** You are days post-cutover. Someone merges code. A new production deployment goes out. Something breaks. You want to rollback to the cutover deploy (`cb201f9`).

**Action: Promote the cutover deployment URL.** No DNS change. ~30 seconds.

```powershell
# Find the cutover deployment from Phase 2.1
npx vercel@latest list v2badminton-next --environment production --status READY | Select-Object -First 20

# Promote it (use the URL you recorded in Phase 2.1, or a known-good one from the list)
npx vercel@latest promote https://v2badminton-next-<CUTOVER-HASH>.vercel.app
```

Or via Vercel Dashboard:
1. Deployments tab
2. Find the cutover commit `cb201f9` deployment (or a later known-good)
3. ... menu on that row -> **Promote to Production**

The domain immediately serves the chosen deployment. DNS unchanged.

> **Does not apply to first-day cutover failures.** On the day of cutover, the cutover deploy IS the only Vercel production deploy. If it is broken, you cannot promote an older Vercel deploy that does not exist — use Scenario C.

### Scenario B: Lead form is broken specifically (rest of site fine)

**Don't rollback DNS.** Site is otherwise working — only the lead pipeline is broken.

1. Quick patch: add a banner in the contact section ("Form dang bao tri - vui long goi 0907 911 886 hoac Zalo") via a hotfix PR, or temporarily hide the form section.
2. Investigate via Vercel Function logs + Sentry (likely env var, Turnstile config, Postgres connection).
3. Fix -> deploy -> re-test the form end-to-end with a real submission.

### Scenario C: Cutover itself failed — restore pre-cutover public state (DNS rollback)

**Use case:** SSL never issues, the entire site is unreachable, the cutover deploy is unusable, or you decide to abort the cutover and try again another night.

**Action: Restore Cloudflare DNS from Phase 3.1 backup. ~5-10 minutes.**

1. Cloudflare dashboard -> DNS -> Records.
2. **Delete** the Vercel A and CNAME records you added in Phase 4.2.
3. **Re-add** the original records from your Phase 3.1 backup. Either:
   - Use Cloudflare's Import feature (DNS -> Records -> ... menu -> **Import**) with the exported zone file.
   - Or manually recreate each record from the screenshot/backup text.
4. Wait 2-10 min for DNS to propagate back.
5. Verify with PowerShell:

   ```powershell
   nslookup v2badminton.com 1.1.1.1
   curl.exe -I https://v2badminton.com/
   ```

   You should see the old Cloudflare-cached response (200 with `CF-Cache-Status: HIT`) again. **This is the pre-cutover state.**

6. Optional: in Vercel, you may also want to unlink the domain so it does not keep trying to issue SSL:

   ```powershell
   npx vercel@latest domains rm v2badminton.com
   npx vercel@latest domains rm www.v2badminton.com
   ```

   (You can re-add them when you retry the cutover.)

The site is back to the pre-cutover stale-but-static state. Diagnose what failed offline before retrying.

### Scenario D: Email DNS records accidentally deleted (critical)

**Email outage. Restore immediately.**

MX, SPF (TXT), DKIM (TXT or CNAME), and DMARC (TXT) records control how mail is delivered. Deleting one of them can break inbound email within minutes and outbound email within hours. From the Phase 3.1 backup file, re-add each missing record **exactly** (values must match byte-for-byte). Verify with:

```powershell
nslookup -type=MX v2badminton.com 1.1.1.1
nslookup -type=TXT v2badminton.com 1.1.1.1
```

---

## Post-cutover checklist (within 1 week)

- [ ] Re-enable Cloudflare proxy (orange cloud) after 48h stable on DNS-only
- [ ] Set Cloudflare SSL/TLS encryption mode to **Full (strict)** before enabling proxy
- [ ] Update Google Analytics property to use `v2badminton.com` as the default URL
- [ ] Update Sentry project settings → Allowed Domains → ensure `v2badminton.com` listed
- [ ] Update Turnstile widget settings → Domains → ensure `v2badminton.com` listed
- [ ] Update Resend → Verified Sender Domain → ensure SPF/DKIM still valid
- [ ] Push the `cutover-2026-05-11` tag note to internal team chat for reference
- [ ] Schedule a Lighthouse run weekly via GitHub Actions (optional but nice)

---

## Troubleshooting reference

| Symptom | Likely cause | Fix |
|---|---|---|
| Vercel SSL stuck `Pending` after 15 min | CAA record blocks Let's Encrypt | Cloudflare DNS → delete CAA record, or add CAA for `letsencrypt.org` |
| `curl` shows old Cloudflare response after DNS update | DNS not propagated yet, or cached | Wait 5 more min, query with `nslookup v2badminton.com 1.1.1.1` (Cloudflare resolver, fresh) |
| Site loads but shows `noindex` in HTML | `NEXT_PUBLIC_ALLOW_INDEXING` ≠ `"true"` | Vercel env → fix → redeploy |
| Lead form submits but lead not in Postgres | `POSTGRES_URL` env missing or wrong | Vercel → Storage → re-link Postgres database to project |
| Lead form succeeds but no email | `RESEND_API_KEY` missing OR `NOTIFY_EMAIL_FROM` not verified in Resend | Verify the from-domain in Resend dashboard, re-add key |
| `www.v2badminton.com` redirects to `/s` (the old bug) | Cloudflare redirect rule still active | Cloudflare → Rules → disable/delete the rule |
| Sentry shows no events | Wrong DSN or `SENTRY_AUTH_TOKEN` invalid | Verify DSN matches Sentry project; regenerate token if needed |
| Sanity Studio shows "Project not found" | Wrong `NEXT_PUBLIC_SANITY_PROJECT_ID` | Copy ID from Sanity dashboard → fix in Vercel |
| `verify-production-env.mjs` says `NEXT_PUBLIC_SITE_URL must be exactly "https://v2badminton.com"` | Has trailing slash, has `www`, or uses `http://` | Fix in Vercel: exact string `https://v2badminton.com` |

---

## When to ask for help (don't guess)

Stop and escalate to a senior dev / project owner if:

- Any production credential needs to be **regenerated** (FORM_TOKEN_SECRET, Resend key, Sentry token). Coordinate before invalidating.
- Any **email** DNS record looks unfamiliar — never delete an MX/TXT/CNAME you don't fully recognize.
- Vercel SSL stays `Pending` after **30 min** with correct DNS.
- After Phase 4.5, **any smoke test fails** that didn't fail in Phase 2.2 — that's a delta between Vercel preview and prod, which means a config difference somewhere.
- You see a **Cloudflare Workers route** intercepting `v2badminton.com/*` — don't delete it without understanding what it does first.

---

## Appendix A — Quick command reference (PowerShell-safe)

```powershell
# Recheck production env
npx dotenv-cli -e .env.production.local -- node scripts/verify-production-env.mjs

# List recent ready production deployments
npx vercel@latest list v2badminton-next --environment production --status READY | Select-Object -First 10

# Promote a known-good deployment to production (rollback)
npx vercel@latest promote https://v2badminton-next-<HASH>.vercel.app

# Inspect a domain config (DNS + SSL state)
npx vercel@latest domains inspect v2badminton.com

# Trigger a fresh production deploy from current local code
npx vercel@latest --prod

# DNS check from Cloudflare resolver (skips ISP cache)
nslookup v2badminton.com 1.1.1.1

# HTTP health check on live domain (always use curl.exe, not the PowerShell alias)
curl.exe -I https://v2badminton.com/

# Tail real-time Function logs
npx vercel@latest logs --follow

# View current production env names (values hidden)
npx vercel@latest env ls production
```

---

## Appendix B — Visual decision flowchart (ASCII)

```
+----------------------------------+
| Phase 0: Tag commit              |
| [check] Tag pushed?              |
+---------------+------------------+
                | yes
                v
+----------------------------------+
| Phase 1: Env audit               |
| [check] verify-production-env    |
|         passes?                  |
+---------------+------------------+
                | yes (must, do not skip)
                v
+----------------------------------+
| Phase 2: Vercel preview deploy   |
| [check] Lead persists to DB +    |
|         Sanity (MUST-PASS)?      |
| [check] Notifications work       |
|         (SHOULD-PASS)?           |
+---------------+------------------+
                | MUST-PASS yes
                v
+----------------------------------+
| Phase 3: Cloudflare prep         |
| [check] DNS backup saved?        |
| [check] Vercel inspect values    |
|         noted?                   |
+---------------+------------------+
                | yes
                | (wait until 2-4 AM ICT)
                v
+----------------------------------+
| Phase 4: Cutover (LIVE!)         |
| Apply DNS edits -> wait -> smoke |
+---------------+------------------+
                |
        +-------+-------+
        |               |
    all MUST       any MUST
    pass?          fails?
        |               |
        v               v
+-----------------+  +--------------------------+
| Phase 5:        |  | Phase 6 - Scenario C:    |
| Monitor 24h     |  | DNS rollback to pre-cut  |
+-----------------+  +--------------------------+
```

---

## Done. The site is now live on `v2badminton.com`

Update internal Slack/Telegram: "Cutover complete at <timestamp>. Tag: `cutover-2026-05-11`. Commit: `cb201f9`. Last-known-good Vercel deploy: `$CUTOVER_DEPLOY_URL`. Rollback procedure documented in `docs/cutover-guide.md`. First 24h monitoring active."
