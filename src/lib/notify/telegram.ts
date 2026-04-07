import { updateTelegramAudit } from "@/lib/db";
import type { LeadNotificationPayload } from "@/lib/leadPipeline";
import { captureException } from "@/lib/monitoring";

async function writeTelegramAudit(
  leadId: string,
  status: "pending" | "sent" | "failed" | "skipped",
  errorMessage: string | null = null,
) {
  try {
    await updateTelegramAudit(leadId, status, errorMessage);
  } catch (error) {
    console.error("Telegram audit update failed", error);
    captureException(error, {
      tags: {
        area: "notify_telegram_audit",
      },
      extras: {
        lead_id: leadId,
        status,
      },
    });
  }
}

function formatLevel(value: LeadNotificationPayload["level"]) {
  switch (value) {
    case "co_ban":
      return "Co ban";
    case "nang_cao":
      return "Nang cao";
    case "doanh_nghiep":
      return "Doanh nghiep";
    default:
      return "Chua chon";
  }
}

function formatTelegramMessage(payload: LeadNotificationPayload) {
  return [
    "Dang ky moi tu V2 Badminton",
    `Ho ten: ${payload.name}`,
    `So dien thoai: ${payload.phone}`,
    `Trinh do: ${formatLevel(payload.level)}`,
    `San tap: ${payload.court ?? "Chua chon"}`,
    `Khung gio: ${payload.time_slot ?? "Chua chon"}`,
    `Loi nhan: ${payload.message ?? "Khong co"}`,
    `Landing page: ${payload.landing_page}`,
    `Submission method: ${payload.submission_method}`,
  ].join("\n");
}

export async function notifyTelegram(
  leadId: string,
  payload: LeadNotificationPayload,
) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    await writeTelegramAudit(
      leadId,
      "skipped",
      "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.",
    );
    return;
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
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: formatTelegramMessage(payload),
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Telegram returned ${response.status}: ${(await response.text()).slice(0, 500)}`,
      );
    }

    await writeTelegramAudit(leadId, "sent");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Telegram error.";
    console.error("Telegram notify failed", error);
    captureException(error, {
      tags: {
        area: "notify_telegram",
      },
      extras: {
        lead_id: leadId,
      },
    });
    await writeTelegramAudit(leadId, "failed", message);
  } finally {
    clearTimeout(timeout);
  }
}
