import { SignJWT, jwtVerify } from "jose";

const FORM_TOKEN_TTL = "10m";
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function getFormTokenSecret() {
  if (!process.env.FORM_TOKEN_SECRET) {
    return null;
  }

  return new TextEncoder().encode(process.env.FORM_TOKEN_SECRET);
}

export function checkHoneypot(formData: FormData) {
  const honeypotValue = formData.get("_gotcha");
  return typeof honeypotValue === "string" && honeypotValue.trim().length > 0;
}

export async function createFormToken() {
  const secret = getFormTokenSecret();
  if (!secret) {
    throw new Error("FORM_TOKEN_SECRET is not configured.");
  }

  return new SignJWT({ issuedAtMs: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(FORM_TOKEN_TTL)
    .sign(secret);
}

export async function verifyFormToken(token: string) {
  const secret = getFormTokenSecret();
  if (!secret) {
    return { ok: true, skipped: true as const };
  }

  if (!token.trim()) {
    return { ok: false, error: "missing_token" as const };
  }

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return { ok: true };
  } catch {
    return { ok: false, error: "invalid_or_expired" as const };
  }
}

export async function verifyTurnstile(token: string, ip: string) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return { ok: true, skipped: true as const };
  }

  if (!token.trim()) {
    return { ok: false, error: "missing_token" as const };
  }

  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    });

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      return { ok: false, error: `turnstile_http_${response.status}` };
    }

    const data = (await response.json()) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, error: "turnstile_failed" };
  } catch {
    return { ok: false, error: "turnstile_request_failed" as const };
  }
}
