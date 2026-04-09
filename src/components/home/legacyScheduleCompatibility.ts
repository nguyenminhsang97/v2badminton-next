import type { CourtId } from "@/lib/locations";
import type { TimeSlotId } from "@/lib/schedule";
import type { SanityLocation, SanityScheduleBlock } from "@/lib/sanity";

export const LEGACY_COURT_TAB_ORDER: Record<CourtId, number> = {
  hue_thien: 1,
  green: 2,
  phuc_loc: 3,
  khang_sport: 4,
};

const LEGACY_COURT_ALIAS_MAP: Record<string, CourtId> = {
  green: "green",
  "san green": "green",
  hue_thien: "hue_thien",
  "hue thien": "hue_thien",
  "san hue thien": "hue_thien",
  khang_sport: "khang_sport",
  "khang sport": "khang_sport",
  "khang sport binh trieu": "khang_sport",
  "san khang sport binh trieu": "khang_sport",
  phuc_loc: "phuc_loc",
  "phuc loc": "phuc_loc",
  "san phuc loc": "phuc_loc",
};

const VALID_TIME_SLOT_IDS = new Set<TimeSlotId>([
  "sang-07-09",
  "sang-08-10",
  "sang-09-11",
  "trua-1130-13",
  "trua-12-14",
  "chieu-14-1530",
  "chieu-17-18",
  "toi-18-20",
  "toi-20-22",
]);

function normalizeLocationKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function resolveLegacyCourtId(
  input:
    | Pick<SanityLocation, "id" | "shortName" | "name">
    | Pick<SanityScheduleBlock, "locationId" | "locationShortName" | "locationName">,
): CourtId | null {
  const candidates =
    "locationId" in input
      ? [input.locationId, input.locationShortName, input.locationName]
      : [input.id, input.shortName, input.name];

  for (const candidate of candidates) {
    const legacyCourtId = LEGACY_COURT_ALIAS_MAP[normalizeLocationKey(candidate)];
    if (legacyCourtId) {
      return legacyCourtId;
    }
  }

  return null;
}

export function isLegacyTimeSlotId(value: string): value is TimeSlotId {
  return VALID_TIME_SLOT_IDS.has(value as TimeSlotId);
}

export function buildLegacyCourtOptions(locations: SanityLocation[]) {
  const seen = new Set<CourtId>();

  return locations.flatMap((location) => {
    const legacyCourtId = resolveLegacyCourtId(location);

    if (legacyCourtId === null || seen.has(legacyCourtId)) {
      return [];
    }

    seen.add(legacyCourtId);

    return [
      {
        value: legacyCourtId,
        label: location.name,
      },
    ];
  });
}

export function buildLegacyTimeSlotOptions(scheduleBlocks: SanityScheduleBlock[]) {
  const options = new Map<TimeSlotId, string>();

  for (const block of scheduleBlocks) {
    if (!isLegacyTimeSlotId(block.timeSlotId) || options.has(block.timeSlotId)) {
      continue;
    }

    options.set(block.timeSlotId, block.timeLabel);
  }

  return Array.from(options, ([value, label]) => ({
    value,
    label,
  }));
}
