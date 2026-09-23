/**
 * Compare the hardcoded fallback lists with what Sanity actually publishes.
 *
 *   npx tsx scripts/check-fallback-drift.mts   # chạy từ apps/web
 *
 * Why this exists. When Sanity is unreachable, `getLocations` and
 * `getScheduleBlocks` serve `apps/web/src/lib/locations.ts` and
 * `apps/web/src/lib/schedule.ts` instead. The owner decided on 2026-09-23 that
 * this is the right trade — a visitor heading to a court needs the address, and
 * the timetable mirrors Sanity — and that only holds while the two agree. They
 * did not: the Khang Sport 11:30 slot stayed in this list after it was hidden in
 * Sanity, and two courts' coordinates were 3 km out for months.
 *
 * Exit codes: 0 no drift, 1 drift, 2 could not read Sanity.
 * GET only. Never prints the token.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as locationsModule from "../src/lib/locations";
import * as scheduleModule from "../src/lib/schedule";

// The web app's files are TypeScript without "type": "module", so tsx hands them
// back as CommonJS namespaces: the named exports sit under `default`.
type Unwrappable<T> = T | { default: T };
const unwrap = <T,>(module: Unwrappable<T>): T =>
  "default" in (module as { default?: T }) && (module as { default?: T }).default !== undefined
    ? ((module as { default: T }).default as T)
    : (module as T);

const { courtLocations } = unwrap<typeof import("../src/lib/locations")>(locationsModule);
const { scheduleItems } = unwrap<typeof import("../src/lib/schedule")>(scheduleModule);

const API_VERSION = "v2025-02-19";

function findEnvValue(name: string): string | null {
  if (process.env[name]) return process.env[name] as string;
  const starts = [process.cwd(), dirname(fileURLToPath(import.meta.url))];
  for (const start of starts) {
    let dir = resolve(start);
    for (let depth = 0; depth < 8; depth += 1) {
      const file = join(dir, ".env.local");
      if (existsSync(file)) {
        const line = readFileSync(file, "utf8")
          .split(/\r?\n/)
          .find((entry) => entry.startsWith(`${name}=`));
        const value = line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
        if (value) return value;
      }
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}

const token = findEnvValue("SANITY_API_READ_TOKEN");
if (!token) {
  console.error(
    "Không có SANITY_API_READ_TOKEN. Đọc ẩn danh chỉ trả về một phần dữ liệu, nên không chạy.\n" +
      "Đặt biến môi trường, hoặc thêm dòng đó vào .env.local ở gốc repo.",
  );
  process.exit(2);
}

const projectId = findEnvValue("NEXT_PUBLIC_SANITY_PROJECT_ID") ?? "w58s0f53";
const dataset = findEnvValue("NEXT_PUBLIC_SANITY_DATASET") ?? "production";

async function query<T>(groq: string): Promise<T> {
  const url = `https://${projectId}.api.sanity.io/${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(groq)}&perspective=published`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    console.error(`Sanity trả về HTTP ${response.status}. Kiểm tra token.`);
    process.exit(2);
  }
  return (await response.json()).result as T;
}

type SanityLocationRow = {
  id: string;
  name: string;
  addressText: string;
  mapsUrl: string;
  geoLat: number | null;
  geoLng: number | null;
};
type SanityScheduleRow = {
  id: string;
  courtId: string;
  dayGroup: string;
  timeLabel: string;
  levels: string[] | null;
};

const problems: string[] = [];
const compare = (label: string, field: string, live: unknown, fallback: unknown) => {
  if (JSON.stringify(live) !== JSON.stringify(fallback)) {
    problems.push(`${label} · ${field}\n      Sanity:    ${JSON.stringify(live)}\n      dự phòng:  ${JSON.stringify(fallback)}`);
  }
};

// ── Sân ────────────────────────────────────────────────────────────────────
const liveLocations = await query<SanityLocationRow[]>(
  `*[_type == "location" && isActive == true]{"id": _id, name, addressText, mapsUrl, geoLat, geoLng}`,
);
const liveById = new Map(liveLocations.map((row) => [row.id, row]));
for (const court of courtLocations) {
  const live = liveById.get(`location.${court.id}`);
  if (!live) {
    problems.push(`location.${court.id} có trong bản dự phòng nhưng Sanity không có (hoặc đã tắt)`);
    continue;
  }
  liveById.delete(`location.${court.id}`);
  compare(`location.${court.id}`, "name", live.name, court.name);
  compare(`location.${court.id}`, "addressText", live.addressText, court.addressText);
  compare(`location.${court.id}`, "mapsUrl", live.mapsUrl, court.mapsUrl);
  compare(`location.${court.id}`, "geoLat", live.geoLat, court.geo.lat);
  compare(`location.${court.id}`, "geoLng", live.geoLng, court.geo.lng);
}
for (const id of liveById.keys()) {
  problems.push(`${id} đang publish trên Sanity nhưng bản dự phòng không có`);
}

// ── Lịch học ───────────────────────────────────────────────────────────────
const liveSchedule = await query<SanityScheduleRow[]>(
  `*[_type == "schedule_block" && isActive == true]{"id": slug.current, "courtId": location->slug.current, dayGroup, timeLabel, levels}`,
);
const scheduleById = new Map(liveSchedule.map((row) => [row.id, row]));
for (const item of scheduleItems) {
  const live = scheduleById.get(item.id);
  if (!live) {
    problems.push(`schedule ${item.id} (${item.timeLabel}, ${item.dayGroup}) có trong bản dự phòng nhưng Sanity không có`);
    continue;
  }
  scheduleById.delete(item.id);
  compare(`schedule ${item.id}`, "dayGroup", live.dayGroup, item.dayGroup);
  compare(`schedule ${item.id}`, "timeLabel", live.timeLabel, item.timeLabel);
  compare(`schedule ${item.id}`, "levels", [...(live.levels ?? [])].sort(), [...item.levels].sort());
}
for (const [id, row] of scheduleById) {
  problems.push(`schedule ${id} (${row.timeLabel}, ${row.dayGroup}) đang publish trên Sanity nhưng bản dự phòng không có`);
}

// ── Kết quả ────────────────────────────────────────────────────────────────
console.log(
  `Đã so ${courtLocations.length} sân và ${scheduleItems.length} khung lịch với dataset ${dataset}.`,
);
if (problems.length === 0) {
  console.log("Bản dự phòng khớp Sanity.");
  process.exit(0);
}
console.log(`\nLỆCH — ${problems.length} chỗ:`);
for (const problem of problems) console.log(`  ${problem}`);
console.log(
  "\nBản dự phòng chỉ phục vụ khi Sanity không đọc được, nên lệch nghĩa là lúc đó khách sẽ thấy dữ liệu sai.\n" +
    "Sửa apps/web/src/lib/locations.ts hoặc apps/web/src/lib/schedule.ts cho khớp, trừ khi có ghi chú nói rõ vì sao cố ý khác.",
);
process.exit(1);
