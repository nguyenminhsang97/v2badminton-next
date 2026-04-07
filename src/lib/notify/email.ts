import { Resend } from "resend";
import { updateEmailAudit } from "@/lib/db";
import type { LeadNotificationPayload } from "@/lib/leadPipeline";
import { captureException } from "@/lib/monitoring";

async function writeEmailAudit(
  leadId: string,
  status: "pending" | "sent" | "failed" | "skipped",
  errorMessage: string | null = null,
) {
  try {
    await updateEmailAudit(leadId, status, errorMessage);
  } catch (error) {
    console.error("Email audit update failed", error);
    captureException(error, {
      tags: {
        area: "notify_email_audit",
      },
      extras: {
        lead_id: leadId,
        status,
      },
    });
  }
}

function buildEmailBody(payload: LeadNotificationPayload) {
  return [
    "Dang ky moi tu V2 Badminton",
    `Ho ten: ${payload.name}`,
    `So dien thoai: ${payload.phone}`,
    `Trinh do: ${payload.level ?? "Chua chon"}`,
    `San tap: ${payload.court ?? "Chua chon"}`,
    `Khung gio: ${payload.time_slot ?? "Chua chon"}`,
    `Loi nhan: ${payload.message ?? "Khong co"}`,
    `Landing page: ${payload.landing_page}`,
    `Submission method: ${payload.submission_method}`,
  ].join("\n");
}

export async function notifyEmail(
  leadId: string,
  payload: LeadNotificationPayload,
) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL_TO) {
    await writeEmailAudit(
      leadId,
      "skipped",
      "RESEND_API_KEY or NOTIFY_EMAIL_TO is missing.",
    );
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM ?? "V2 Badminton <onboarding@resend.dev>",
      to: [process.env.NOTIFY_EMAIL_TO],
      subject: `[V2 Badminton] Dang ky moi - ${payload.name} - ${payload.phone}`,
      text: buildEmailBody(payload),
    });

    await writeEmailAudit(leadId, "sent");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error.";
    console.error("Email notify failed", error);
    captureException(error, {
      tags: {
        area: "notify_email",
      },
      extras: {
        lead_id: leadId,
      },
    });
    await writeEmailAudit(leadId, "failed", message);
  }
}
