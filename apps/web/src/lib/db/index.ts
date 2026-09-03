import { sql as vercelSql, type QueryResultRow } from "@vercel/postgres";
import type { LeadInsertPayload } from "@/lib/leadPipeline";
import type { LeadDeliveryStatus, LeadRow } from "@/lib/db/types";

type QueryPrimitive = string | number | boolean | null | undefined;

function truncateErrorMessage(errorMessage: string | null) {
  if (!errorMessage) {
    return null;
  }

  return errorMessage.slice(0, 500);
}

export function isDatabaseConfigured() {
  return Boolean(
    process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING,
  );
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: QueryPrimitive[]
) {
  if (!isDatabaseConfigured()) {
    throw new Error("Postgres environment variables are not configured.");
  }

  return vercelSql<T>(strings, ...values);
}

export async function checkDatabaseConnection() {
  return query`SELECT 1`;
}

export async function insertLead(payload: LeadInsertPayload) {
  const result = await query<Pick<LeadRow, "id">>`
    INSERT INTO leads (
      name,
      phone,
      level,
      court,
      time_slot,
      message,
      submission_method,
      landing_page,
      dedupe_key
    ) VALUES (
      ${payload.name},
      ${payload.phone},
      ${payload.level},
      ${payload.court},
      ${payload.time_slot},
      ${payload.message},
      ${payload.submission_method},
      ${payload.landing_page},
      ${payload.dedupe_key}
    )
    RETURNING id
  `;

  return result.rows[0]?.id ?? null;
}

export async function updateTelegramAudit(
  leadId: string,
  status: LeadDeliveryStatus,
  errorMessage: string | null = null,
) {
  await query`
    UPDATE leads
    SET
      telegram_status = ${status},
      telegram_attempted_at = now(),
      telegram_error = ${truncateErrorMessage(errorMessage)}
    WHERE id = ${leadId}
  `;
}

export async function updateEmailAudit(
  leadId: string,
  status: LeadDeliveryStatus,
  errorMessage: string | null = null,
) {
  await query`
    UPDATE leads
    SET
      email_status = ${status},
      email_attempted_at = now(),
      email_error = ${truncateErrorMessage(errorMessage)}
    WHERE id = ${leadId}
  `;
}
