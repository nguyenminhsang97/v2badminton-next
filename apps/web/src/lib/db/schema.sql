CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  level TEXT,
  court TEXT,
  time_slot TEXT,
  message TEXT,
  submission_method TEXT NOT NULL,
  landing_page TEXT,
  dedupe_key TEXT,
  telegram_status TEXT NOT NULL DEFAULT 'pending',
  telegram_attempted_at TIMESTAMPTZ,
  telegram_error TEXT,
  email_status TEXT NOT NULL DEFAULT 'pending',
  email_attempted_at TIMESTAMPTZ,
  email_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS leads_dedupe_key_idx
  ON leads (dedupe_key, created_at);

CREATE INDEX IF NOT EXISTS leads_phone_idx
  ON leads (phone);
