import { captureException } from "@/lib/monitoring";

const DEFAULT_ALERT_COOLDOWN_MS = 15 * 60 * 1000;

declare global {
  var __v2OpsAlertCooldowns: Map<string, number> | undefined;
}

function getCooldownStore() {
  globalThis.__v2OpsAlertCooldowns ??= new Map<string, number>();
  return globalThis.__v2OpsAlertCooldowns;
}

function shouldSendAlert(key: string, cooldownMs: number) {
  const cooldowns = getCooldownStore();
  const now = Date.now();
  const lastSentAt = cooldowns.get(key) ?? 0;

  if (now - lastSentAt < cooldownMs) {
    return false;
  }

  cooldowns.set(key, now);
  return true;
}

function buildOpsMessage(title: string, details: string) {
  const environment =
    process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";

  return [
    `V2 Badminton ops alert: ${title}`,
    `Environment: ${environment}`,
    details,
  ].join("\n");
}

export async function notifyOpsTelegram(
  alertKey: string,
  title: string,
  details: string,
  cooldownMs = DEFAULT_ALERT_COOLDOWN_MS,
) {
  if (
    !process.env.TELEGRAM_BOT_TOKEN ||
    !process.env.TELEGRAM_OPS_CHAT_ID ||
    !shouldSendAlert(alertKey, cooldownMs)
  ) {
    return { sent: false, skipped: true as const };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_OPS_CHAT_ID,
          text: buildOpsMessage(title, details),
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Ops Telegram returned ${response.status}: ${(await response.text()).slice(0, 500)}`,
      );
    }

    return { sent: true as const };
  } catch (error) {
    console.error("Ops Telegram notify failed", error);
    captureException(error, {
      tags: {
        area: "notify_ops_telegram",
      },
      extras: {
        alert_key: alertKey,
      },
    });
    return { sent: false, skipped: false as const };
  } finally {
    clearTimeout(timeout);
  }
}
