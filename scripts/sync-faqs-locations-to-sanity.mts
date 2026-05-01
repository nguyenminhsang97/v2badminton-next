/**
 * One-off migration: sync FAQ and Location fallback content to Sanity.
 *
 * Dry run:
 *   npx tsx scripts/sync-faqs-locations-to-sanity.mts
 *
 * Test one item:
 *   npx tsx scripts/sync-faqs-locations-to-sanity.mts --write --only-faq home-zero --only-location green
 *
 * Full write:
 *   npx tsx scripts/sync-faqs-locations-to-sanity.mts --write
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.
 * Reads can use SANITY_API_READ_TOKEN. Writes require SANITY_AUTH_TOKEN.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import { createClient } from "next-sanity";
import * as faqModule from "../src/lib/faqs";
import * as locationModule from "../src/lib/locations";
import type { FaqItem } from "../src/lib/faqs";
import type { CourtLocation } from "../src/lib/locations";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

type ModuleWithDefault<T extends object> = T | { default: T };

type Args = {
  createMissing: boolean;
  dryRun: boolean;
  onlyFaqs: Set<string>;
  onlyLocations: Set<string>;
  skipBackup: boolean;
};

type SanityFaqDocument = {
  _id: string;
  _type: "faq";
  question?: string;
  answer?: PortableTextBlock[];
  answerPlainText?: string;
  pages?: string[];
  includeInSchema?: boolean;
  featured?: boolean;
  homepageOrder?: number;
  order?: number;
};

type SanityLocationDocument = {
  _id: string;
  _type: "location";
  slug?: string;
  name?: string;
  shortName?: string;
  addressText?: string;
};

type PortableTextBlock = {
  _key: string;
  _type: "block";
  style: "normal";
  markDefs: [];
  children: Array<{
    _key: string;
    _type: "span";
    text: string;
    marks: [];
  }>;
};

type FaqPatch = {
  question: string;
  answer: PortableTextBlock[];
  pages: [FaqItem["page"]];
  includeInSchema: boolean;
  featured: boolean;
  homepageOrder: number;
  order: number;
};

type LocationPatch = {
  addressText: string;
};

const args = parseArgs(process.argv.slice(2));
const faqExports = unwrapModule(
  faqModule as unknown as ModuleWithDefault<typeof faqModule>,
);
const locationExports = unwrapModule(
  locationModule as unknown as ModuleWithDefault<typeof locationModule>,
);
const { faqs } = faqExports;
const { courtLocations } = locationExports;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const readToken = process.env.SANITY_API_READ_TOKEN?.trim();
const writeToken = process.env.SANITY_AUTH_TOKEN?.trim();
const readAccessToken = readToken || writeToken;

if (!projectId || !dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET.",
  );
}

if (!args.dryRun && !writeToken) {
  throw new Error("SANITY_AUTH_TOKEN is required when running with --write.");
}

const readClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-04-09",
  useCdn: false,
  perspective: "published",
  ...(readAccessToken ? { token: readAccessToken } : {}),
});

const writeClient = writeToken
  ? createClient({
      projectId,
      dataset,
      token: writeToken,
      apiVersion: "2026-04-09",
      useCdn: false,
      perspective: "published",
    })
  : null;

const selectedFaqs = faqs.filter(
  (faq) => args.onlyFaqs.size === 0 || args.onlyFaqs.has(faq.id),
);
const selectedLocations = courtLocations.filter(
  (location) =>
    args.onlyLocations.size === 0 || args.onlyLocations.has(location.id),
);

if (selectedFaqs.length === 0 && selectedLocations.length === 0) {
  throw new Error("No FAQ or location items selected.");
}

const [sanityFaqs, sanityLocations] = await Promise.all([
  fetchFaqs(),
  fetchLocations(),
]);

if (!args.dryRun && !args.skipBackup) {
  await writeBackup();
}

const faqResults = await syncFaqs(sanityFaqs);
const locationResults = await syncLocations(sanityLocations);

console.log("\nSummary");
console.log(`  Mode: ${args.dryRun ? "dry-run" : "write"}`);
console.log(`  FAQs changed: ${faqResults.changed}`);
console.log(`  FAQ documents missing: ${faqResults.missing}`);
console.log(`  Locations changed: ${locationResults.changed}`);
console.log(`  Location documents missing: ${locationResults.missing}`);

if (args.dryRun) {
  console.log("\nNo Sanity writes were made. Re-run with --write to patch documents.");
}

async function fetchFaqs() {
  return readClient.fetch<SanityFaqDocument[]>(
    `*[
      _type == "faq" &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      _type,
      question,
      "answer": coalesce(answer, []),
      "answerPlainText": pt::text(answer),
      "pages": coalesce(pages, []),
      includeInSchema,
      featured,
      homepageOrder,
      order
    }`,
  );
}

async function fetchLocations() {
  return readClient.fetch<SanityLocationDocument[]>(
    `*[
      _type == "location" &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      _type,
      "slug": slug.current,
      name,
      shortName,
      addressText
    }`,
  );
}

async function syncFaqs(existingFaqs: SanityFaqDocument[]) {
  console.log(`\nSyncing ${selectedFaqs.length} FAQs...`);

  let changed = 0;
  let missing = 0;

  for (const item of selectedFaqs) {
    const existing = findFaqDocument(existingFaqs, item);
    const patch = toFaqPatch(item);

    if (!existing) {
      missing += 1;
      await handleMissingFaq(item, patch);
      continue;
    }

    const diff = diffFields(existing, {
      ...patch,
      answerPlainText: item.answerText,
    });

    if (diff.length === 0) {
      console.log(`  = ${item.id} already matches ${existing._id}`);
      continue;
    }

    changed += 1;
    logPlan(item.id, existing._id, diff);

    if (!args.dryRun) {
      await getWriteClient().patch(existing._id).set(patch).commit();
    }
  }

  return { changed, missing };
}

async function syncLocations(existingLocations: SanityLocationDocument[]) {
  console.log(`\nSyncing ${selectedLocations.length} locations...`);

  let changed = 0;
  let missing = 0;

  for (const court of selectedLocations) {
    const existing = findLocationDocument(existingLocations, court);
    const patch = { addressText: court.addressText } satisfies LocationPatch;

    if (!existing) {
      missing += 1;
      console.warn(`  ! ${court.id} not found in Sanity; skipped`);
      continue;
    }

    const diff = diffFields(existing, patch);

    if (diff.length === 0) {
      console.log(`  = ${court.id} already matches ${existing._id}`);
      continue;
    }

    changed += 1;
    logPlan(court.id, existing._id, diff);

    if (!args.dryRun) {
      await getWriteClient().patch(existing._id).set(patch).commit();
    }
  }

  return { changed, missing };
}

async function handleMissingFaq(item: FaqItem, patch: FaqPatch) {
  if (!args.createMissing) {
    console.warn(`  ! ${item.id} not found in Sanity; skipped`);
    return;
  }

  const doc = {
    _id: `faq.${item.id}`,
    _type: "faq" as const,
    ...patch,
  };

  console.log(`  + ${item.id} will be created as ${doc._id}`);

  if (!args.dryRun) {
    await getWriteClient().create(doc);
  }
}

function findFaqDocument(existingFaqs: SanityFaqDocument[], item: FaqItem) {
  const candidateIds = new Set([item.id, `faq.${item.id}`]);

  return existingFaqs.find((doc) => candidateIds.has(doc._id));
}

function findLocationDocument(
  existingLocations: SanityLocationDocument[],
  court: CourtLocation,
) {
  const candidateIds = new Set([court.id, `location.${court.id}`]);
  const candidateSlugs = new Set<string>([court.id]);

  return existingLocations.find(
    (doc) =>
      candidateIds.has(doc._id) ||
      Boolean(doc.slug && candidateSlugs.has(doc.slug)),
  );
}

function toFaqPatch(item: FaqItem): FaqPatch {
  return {
    question: item.question,
    answer: toPortableText(item.answerText),
    pages: [item.page],
    includeInSchema: item.schemaEligible,
    featured: item.page === "homepage",
    homepageOrder: item.order,
    order: item.order,
  };
}

function toPortableText(plain: string): PortableTextBlock[] {
  const paragraphs = plain
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, index) => ({
    _key: `block-${index}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `span-${index}`,
        _type: "span",
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

function diffFields(
  current: Record<string, unknown>,
  next: Record<string, unknown>,
) {
  return Object.entries(next)
    .filter(([key, value]) => {
      if (key === "answer") {
        return false;
      }

      return JSON.stringify(current[key]) !== JSON.stringify(value);
    })
    .map(([key]) => (key === "answerPlainText" ? "answer" : key));
}

function logPlan(sourceId: string, sanityId: string, fields: string[]) {
  console.log(`  ~ ${sourceId} -> ${sanityId}: ${fields.join(", ")}`);
}

async function writeBackup() {
  const backupDir = path.join(process.cwd(), ".codex-artifacts", "sanity-backups");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `faq-location-${timestamp}.json`);
  const documents = await readClient.fetch<unknown[]>(
    `*[
      _type in ["faq", "location"] &&
      !(_id in path("drafts.**"))
    ]`,
  );

  await mkdir(backupDir, { recursive: true });
  await writeFile(backupPath, JSON.stringify({ documents }, null, 2), "utf8");
  console.log(`Backup written: ${backupPath}`);
}

function getWriteClient() {
  if (!writeClient) {
    throw new Error("SANITY_AUTH_TOKEN is required for Sanity writes.");
  }

  return writeClient;
}

function parseArgs(argv: string[]): Args {
  const parsed: Args = {
    createMissing: false,
    dryRun: true,
    onlyFaqs: new Set(),
    onlyLocations: new Set(),
    skipBackup: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case "--write":
        parsed.dryRun = false;
        break;
      case "--dry-run":
        parsed.dryRun = true;
        break;
      case "--create-missing":
        parsed.createMissing = true;
        break;
      case "--skip-backup":
        parsed.skipBackup = true;
        break;
      case "--only-faq":
        parsed.onlyFaqs.add(readValue(argv, ++index, arg));
        break;
      case "--only-location":
        parsed.onlyLocations.add(readValue(argv, ++index, arg));
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function readValue(argv: string[], index: number, flag: string) {
  const value = argv[index];

  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}.`);
  }

  return value;
}

function unwrapModule<T extends object>(moduleExports: ModuleWithDefault<T>): T {
  const maybeDefault = moduleExports as { default?: T };

  return maybeDefault.default ?? (moduleExports as T);
}
