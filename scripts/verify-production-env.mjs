const REQUIRED_PRODUCTION_ENV = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "NEXT_PUBLIC_ALLOW_INDEXING",
  "FORM_TOKEN_SECRET",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "NEXT_PUBLIC_SENTRY_DSN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
];

const SENSITIVE_PRODUCTION_ENV = ["SENTRY_AUTH_TOKEN"];

const missing = REQUIRED_PRODUCTION_ENV.filter((key) => {
  const value = normalizeEnvValue(process.env[key]);
  return !value || value.trim().length === 0;
});

const failures = [];
const warnings = [];

if (missing.length > 0) {
  failures.push(`Missing required production env: ${missing.join(", ")}`);
}

if (normalizeEnvValue(process.env.NEXT_PUBLIC_ALLOW_INDEXING) !== "true") {
  failures.push('NEXT_PUBLIC_ALLOW_INDEXING must be exactly "true" for cutover.');
}

if (normalizeEnvValue(process.env.NEXT_PUBLIC_SITE_URL) !== "https://v2badminton.com") {
  failures.push(
    'NEXT_PUBLIC_SITE_URL must be exactly "https://v2badminton.com" for cutover.',
  );
}

if (
  !normalizeEnvValue(process.env.POSTGRES_URL)?.trim() &&
  !normalizeEnvValue(process.env.POSTGRES_URL_NON_POOLING)?.trim()
) {
  failures.push(
    "POSTGRES_URL or POSTGRES_URL_NON_POOLING must be configured for cutover.",
  );
}

const missingSensitive = SENSITIVE_PRODUCTION_ENV.filter((key) => {
  const value = normalizeEnvValue(process.env[key]);
  return !value || value.trim().length === 0;
});

if (missingSensitive.length > 0) {
  warnings.push(
    `${missingSensitive.join(
      ", ",
    )} may be configured as a sensitive Vercel env and will not appear in \`vercel env pull\`. Verify via \`vercel env ls production\` and a successful production build log.`,
  );
}

if (failures.length > 0) {
  console.error("Production cutover env check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log("Production cutover env check passed.");

if (warnings.length > 0) {
  console.warn("Production cutover env check warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

function normalizeEnvValue(value) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}
