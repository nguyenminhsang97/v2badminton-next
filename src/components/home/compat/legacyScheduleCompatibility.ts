import type { CourtId } from "@/lib/locations";
import type { TimeSlotId } from "@/lib/schedule";
import type { HomepageLocation, HomepageScheduleBlock } from "@/domain/homepage";

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

export type LegacyScheduleCompatibilityIssue = {
  kind: "unmapped_location" | "invalid_time_slot";
  source: "location" | "schedule";
  id: string;
  label: string;
  value: string;
};

let lastReportedIssueKey: string | null = null;

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
    | Pick<HomepageLocation, "id" | "shortName" | "name">
    | Pick<HomepageScheduleBlock, "locationId" | "locationShortName" | "locationName">,
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

export function buildLegacyCourtOptions(locations: HomepageLocation[]) {
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

export function buildLegacyTimeSlotOptions(
  scheduleBlocks: HomepageScheduleBlock[],
) {
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

export function collectLegacyScheduleCompatibilityIssues(
  locations: HomepageLocation[],
  scheduleBlocks: HomepageScheduleBlock[],
): LegacyScheduleCompatibilityIssue[] {
  const issues: LegacyScheduleCompatibilityIssue[] = [];

  for (const location of locations) {
    if (resolveLegacyCourtId(location) !== null) {
      continue;
    }

    issues.push({
      kind: "unmapped_location",
      source: "location",
      id: location.id,
      label: location.name,
      value: location.shortName || location.name,
    });
  }

  for (const scheduleBlock of scheduleBlocks) {
    if (resolveLegacyCourtId(scheduleBlock) === null) {
      issues.push({
        kind: "unmapped_location",
        source: "schedule",
        id: scheduleBlock.id,
        label: scheduleBlock.locationName,
        value: scheduleBlock.locationShortName || scheduleBlock.locationName,
      });
    }

    if (!isLegacyTimeSlotId(scheduleBlock.timeSlotId)) {
      issues.push({
        kind: "invalid_time_slot",
        source: "schedule",
        id: scheduleBlock.id,
        label: scheduleBlock.locationName,
        value: scheduleBlock.timeSlotId,
      });
    }
  }

  return issues;
}

function formatCompatibilityIssue(
  issue: LegacyScheduleCompatibilityIssue,
): string {
  if (issue.kind === "invalid_time_slot") {
    return `- [schedule] ${issue.label} (${issue.id}) has unsupported timeSlotId "${issue.value}"`;
  }

  return `- [${issue.source}] ${issue.label} (${issue.id}) could not be mapped to a legacy CourtId from "${issue.value}"`;
}

export function assertLegacyScheduleCompatibility(
  locations: HomepageLocation[],
  scheduleBlocks: HomepageScheduleBlock[],
) {
  const issues = collectLegacyScheduleCompatibilityIssues(
    locations,
    scheduleBlocks,
  );

  if (issues.length === 0) {
    return;
  }

  const message = [
    "[legacy-schedule] Found unmapped schedule compatibility data.",
    "Migrate the affected locations/schedule blocks before removing the legacy bridge.",
    ...issues.map(formatCompatibilityIssue),
  ].join("\n");

  if (
    process.env.CI === "true" ||
    process.env.NEXT_STRICT_SCHEDULE_COMPAT === "true"
  ) {
    throw new Error(message);
  }

  const issueKey = issues
    .map((issue) => `${issue.kind}:${issue.source}:${issue.id}:${issue.value}`)
    .join("|");

  if (lastReportedIssueKey === issueKey) {
    return;
  }

  lastReportedIssueKey = issueKey;
  console.warn(message);
}
