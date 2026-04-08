# Block D Env Checklist

## Required Env Vars

### Core save-first pipeline

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `FORM_TOKEN_SECRET`

### Telegram notify

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### Email notify

- `RESEND_API_KEY`
- `NOTIFY_EMAIL_TO`
- `NOTIFY_EMAIL_FROM` (required in production; preview can fall back to Resend sandbox)

### Turnstile

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

### Rate limit

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Nice-To-Have For Block E

- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `TELEGRAM_OPS_CHAT_ID`

## Quick Release Readiness

- `POSTGRES_URL` + `FORM_TOKEN_SECRET` missing:
  - Block D is not testable end-to-end
- `TURNSTILE` vars missing:
  - JS path still works, but captcha verification is skipped
- `UPSTASH` vars missing:
  - submit still works, but rate limit is skipped
- `TELEGRAM` / `RESEND` vars missing:
  - lead save still works, notify audit fields should become `skipped`
- `TELEGRAM_OPS_CHAT_ID` missing:
  - Sentry still captures degraded integrations, but Telegram ops alerts are skipped

## One-Shot QA Flow

1. Run the app with env vars loaded.
2. Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\self-qa-block-d.ps1 -BaseUrl http://localhost:3000
```

3. Follow the ordered browser + DB checks in `BLOCK_D_QA_RUNBOOK.md`.

## Expected Fast Signals

- `/api/health` returns `200`
- `/api/form-token` returns a fresh token with `Cache-Control: no-store`
- homepage HTML does not include a signed form token
- DB query can show recent `leads` rows once manual submits start
