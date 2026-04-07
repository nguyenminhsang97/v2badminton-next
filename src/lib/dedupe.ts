import { createHash } from "node:crypto";
import { query } from "@/lib/db";

type DedupePayload = {
  name: string;
  phone: string;
  court: string;
  time_slot: string;
  message: string;
  landing_page: string;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function normalizePhone(value: string) {
  const compact = value.replace(/[\s-]+/g, "");

  if (compact.startsWith("+84")) {
    return `0${compact.slice(3)}`;
  }

  if (compact.startsWith("84")) {
    return `0${compact.slice(2)}`;
  }

  return compact;
}

export function buildDedupeKey(payload: DedupePayload) {
  const normalizedPayload = JSON.stringify({
    phone: normalizePhone(payload.phone),
    name: normalizeText(payload.name),
    court: normalizeText(payload.court),
    time_slot: normalizeText(payload.time_slot),
    message: normalizeText(payload.message),
    landing_page: normalizeText(payload.landing_page),
  });

  return createHash("sha256").update(normalizedPayload).digest("hex");
}

export async function findRecentDuplicate(dedupeKey: string) {
  const result = await query<{ id: string }>`
    SELECT id
    FROM leads
    WHERE dedupe_key = ${dedupeKey}
      AND created_at > now() - interval '15 minutes'
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return result.rows[0] ?? null;
}
