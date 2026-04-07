# Block D QA Runbook

## Goal

Run the full save-first lead pipeline in one clean pass once env vars are available, without mixing implementation and debugging.

## Before You Start

- App is running locally or on preview
- Env vars are loaded
- `schema.sql` has already been applied to Postgres
- Open one SQL client tab for fast DB checks

## Step 0 - Preflight

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\self-qa-block-d.ps1 -BaseUrl http://localhost:3000
```

Expected:

- `/api/health` returns `200`
- `/api/form-token` returns `200`
- `Cache-Control` contains `no-store`
- homepage HTML does not leak the signed token

Stop here if any of the above is red.

## Step 1 - JS Happy Path

In a normal browser session:

1. Open homepage
2. Fill valid name + phone
3. Optionally select court / time / message
4. Complete captcha
5. Submit once

Expected UI:

- success state appears
- no generic error banner

Expected DB:

```sql
SELECT id, name, phone, submission_method, telegram_status, email_status, created_at
FROM leads
ORDER BY created_at DESC
LIMIT 3;
```

Pass condition:

- one fresh row exists
- `submission_method = 'js'`
- `telegram_status` and `email_status` leave `pending` shortly after insert

## Step 2 - Dedupe

Submit the exact same payload again within 15 minutes.

Expected:

- client still shows success-style outcome
- no second DB row is inserted
- no duplicate conversion should be tracked

DB check:

```sql
SELECT COUNT(*)::int AS count
FROM leads
WHERE phone = 'PHONE_YOU_USED'
  AND created_at > NOW() - INTERVAL '15 minutes';
```

Pass condition:

- count stays at `1`

## Step 3 - Honeypot

In DevTools, set hidden `_gotcha` to a non-empty value and submit.

Expected:

- response looks like success to the browser
- no new DB row

Pass condition:

- latest row count does not change

## Step 4 - No-JS Path

Disable JavaScript and submit again with a fresh phone number.

Expected:

- lead still saves successfully
- captcha is skipped

Pass condition:

- a new row exists with `submission_method = 'no_js'`

## Step 5 - Notify Failure Tolerance

Temporarily break one notify channel at a time:

- invalid `TELEGRAM_BOT_TOKEN`
- invalid `RESEND_API_KEY`

Submit once per broken channel.

Pass condition:

- lead is still inserted
- broken channel becomes `failed`
- healthy channel still reaches `sent` or `skipped`

DB check:

```sql
SELECT id, telegram_status, telegram_error, email_status, email_error, created_at
FROM leads
ORDER BY created_at DESC
LIMIT 5;
```

## Step 6 - Rate Limit

Use the same IP and submit repeatedly.

Expected:

- JS path blocks on 6th request within the window
- no-JS path blocks on 3rd request within the window

Pass condition:

- blocked requests do not create new DB rows
- user-facing error is rate-limit specific, not generic failure

## Fast Failure Map

- `/api/health = 503`: Postgres env or DB reachability issue
- `/api/form-token = 503`: missing `FORM_TOKEN_SECRET`
- token appears in HTML source: token rendering leak, stop release
- JS path fails before submit: Turnstile or token bootstrap issue
- row inserted but notify stays `pending`: `after()` callback or notify module bug
- duplicate creates a new row: dedupe normalization/query issue
- no-JS submit fails but JS works: native form path regression

## Release Gate

Block D is ready only when all six steps above pass in sequence.
