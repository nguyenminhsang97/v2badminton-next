# Block E Monitoring Runbook

## Goal

Verify error visibility and alert plumbing before wider QA or release.

## Required Env For Baseline

- `NEXT_PUBLIC_SENTRY_DSN` for client-side capture
- `SENTRY_DSN` for server-side capture
- `ENABLE_MONITORING_TEST_ROUTES=true` for preview-only verification routes

## Optional Env For Better Diagnostics

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `TELEGRAM_OPS_CHAT_ID`

## What Is Already Wired In Repo

- Next.js Sentry baseline via `withSentryConfig`
- `instrumentation-client.ts`
- `instrumentation.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `app/global-error.tsx`
- server-side capture in:
  - `submitLead`
  - `/api/health`
  - `notifyTelegram`
  - `notifyEmail`
- preview-only verification routes:
  - `/monitoring-test`
  - `/api/monitoring-test`

## Step 1 - Build Verification

Run:

```powershell
npm.cmd run build
```

Pass condition:

- build succeeds
- no monitoring config crash when Sentry env is absent

## Step 2 - Client Error Capture

Use a preview deployment with `NEXT_PUBLIC_SENTRY_DSN` and `ENABLE_MONITORING_TEST_ROUTES=true`.

Recommended check:

1. Open `/monitoring-test`
2. Click `Trigger client capture`
3. Confirm issue appears in Sentry

Pass condition:

- one real client-side issue appears in Sentry with the correct release/environment

## Step 3 - Server Error Capture

Trigger a controlled backend failure in preview.

Recommended options:

- click `Trigger server capture` on `/monitoring-test`
- temporarily break `TELEGRAM_BOT_TOKEN`
- temporarily break `RESEND_API_KEY`
- temporarily point Postgres env to an invalid target for a short test

Pass condition:

- Sentry receives a server-side error for the failing path
- lead-save success/failure matches the intended graceful-degradation behavior

## Step 4 - Health Check Monitoring

Configure an external uptime monitor against:

```text
https://{preview-or-prod-url}/api/health
```

Recommended defaults:

- interval: 1 minute
- alert after: 2 consecutive failures
- channel: Telegram ops chat or email

Pass condition:

- `/api/health` returns `200` when DB is healthy
- monitor flips to failed on `503`
- alert is actually delivered

## Step 5 - Notify Failure Verification

Break one notify channel at a time and submit a lead.

Pass condition:

- lead is still saved
- DB audit field becomes `failed`
- Sentry captures the notify failure

## Release Gate

Block E is ready when:

- one client error is visible in Sentry
- one server error is visible in Sentry
- `/api/health` is externally monitored
- one real alert has been observed end-to-end
