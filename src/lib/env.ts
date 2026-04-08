const REQUIRED_PRODUCTION_VARS = [
  "FORM_TOKEN_SECRET",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
  "NOTIFY_EMAIL_FROM",
] as const;

const OPTIONAL_WARNING_GROUPS = [
  {
    vars: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"] as const,
    message: "Telegram lead notifications will be skipped.",
  },
  {
    vars: ["RESEND_API_KEY", "NOTIFY_EMAIL_TO"] as const,
    message: "Email lead notifications will be skipped.",
  },
  {
    vars: ["TURNSTILE_SECRET_KEY", "NEXT_PUBLIC_TURNSTILE_SITE_KEY"] as const,
    message: "Turnstile verification will be skipped on the JS path.",
  },
] as const;

let hasValidatedRuntimeEnv = false;

function hasValue(value: string | undefined) {
  return Boolean(value && value.trim().length > 0);
}

function hasAllValues(keys: readonly string[]) {
  return keys.every((key) => hasValue(process.env[key]));
}

export function isProductionDeployment() {
  return process.env.VERCEL_ENV === "production";
}

export function isMonitoringTestRoutesEnabled() {
  return (
    process.env.ENABLE_MONITORING_TEST_ROUTES === "true" &&
    !isProductionDeployment()
  );
}

export function getNotifyEmailFromAddress() {
  if (hasValue(process.env.NOTIFY_EMAIL_FROM)) {
    return process.env.NOTIFY_EMAIL_FROM!.trim();
  }

  if (isProductionDeployment()) {
    return null;
  }

  return "V2 Badminton <onboarding@resend.dev>";
}

export function validateRuntimeEnv() {
  if (hasValidatedRuntimeEnv) {
    return;
  }

  hasValidatedRuntimeEnv = true;

  const missingProductionVars = REQUIRED_PRODUCTION_VARS.filter(
    (key) => !hasValue(process.env[key]),
  );

  const warnings = OPTIONAL_WARNING_GROUPS.filter(
    ({ vars }) => !hasAllValues(vars),
  ).map(({ vars, message }) => `${vars.join(" + ")} missing. ${message}`);

  if (warnings.length > 0) {
    console.warn(
      `[env] Optional runtime integrations are not fully configured:\n- ${warnings.join("\n- ")}`,
    );
  }

  if (isProductionDeployment() && missingProductionVars.length > 0) {
    throw new Error(
      `[env] Missing required production environment variables: ${missingProductionVars.join(", ")}`,
    );
  }
}
