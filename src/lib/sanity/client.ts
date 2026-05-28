import "server-only";
import { createClient } from "next-sanity";

type SanityQueryParams = Record<string, unknown>;

export const SANITY_API_VERSION = "2026-04-09";

/**
 * Sprint 2 revalidation choice:
 * - use time-based ISR via `next.revalidate`
 * - default to 300 seconds
 * - avoid webhook/on-demand setup on the critical path for the first frontend wiring pass
 *
 * Operator expectation:
 * - in production, published Sanity edits may take up to this window to show on the site
 * - in `next dev`, Next renders on-demand so content appears fresh immediately
 */
export const SANITY_REVALIDATE_SECONDS = resolveSanityRevalidateSeconds();

const SANITY_CACHE_TAGS = ["sanity"] as const;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const token = process.env.SANITY_API_READ_TOKEN?.trim();

let hasWarnedMissingConfig = false;
let hasWarnedInvalidRevalidate = false;

const sanityReadClient =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion: SANITY_API_VERSION,
        // Disable Sanity CDN: Next.js ISR (next.revalidate) already provides
        // the caching layer. Using the CDN risks serving stale null results for
        // parameterized GROQ queries that can poison the ISR Data Cache on
        // build/revalidation — a class of bug observed in W4 preview (2026-05-25).
        useCdn: false,
        perspective: "published",
        ...(token ? { token } : {}),
      })
    : null;

export function getSanityReadClient() {
  return sanityReadClient;
}

export function isSanityReadConfigured() {
  return Boolean(sanityReadClient);
}

export type SanityFetchOptions<TResult> = {
  query: string;
  params?: SanityQueryParams;
  fallback?: TResult | null;
  tags?: readonly string[];
};

export type SanityFetchState = "success" | "missing_config" | "query_error";

export type SanityFetchResult<TResult> = {
  data: TResult | null;
  state: SanityFetchState;
};

export async function sanityFetchWithStatus<TResult>({
  query,
  params,
  fallback,
  tags = [],
}: SanityFetchOptions<TResult>): Promise<SanityFetchResult<TResult>> {
  if (!sanityReadClient) {
    warnMissingSanityConfig();
    return {
      data: fallback ?? null,
      state: "missing_config",
    };
  }

  try {
    const result = await sanityReadClient.fetch<TResult | null>(query, params ?? {}, {
      next: {
        revalidate: SANITY_REVALIDATE_SECONDS,
        tags: Array.from(new Set([...SANITY_CACHE_TAGS, ...tags])),
      },
      perspective: "published",
      useCdn: false,
    });

    return {
      data: result ?? fallback ?? null,
      state: "success",
    };
  } catch (error) {
    console.error("[sanity] Read query failed. Falling back to safe value.", {
      tags: Array.from(new Set([...SANITY_CACHE_TAGS, ...tags])),
      error,
    });

    return {
      data: fallback ?? null,
      state: "query_error",
    };
  }
}

export async function sanityFetchOrFallback<TResult>(
  options: SanityFetchOptions<TResult>,
): Promise<TResult | null> {
  const result = await sanityFetchWithStatus(options);
  return result.data;
}

function warnMissingSanityConfig() {
  if (hasWarnedMissingConfig) {
    return;
  }

  hasWarnedMissingConfig = true;

  console.warn(
    "[sanity] Read client is disabled because NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing. Falling back to static data.",
  );
}

function resolveSanityRevalidateSeconds() {
  const rawValue = process.env.SANITY_REVALIDATE_SECONDS?.trim();

  if (!rawValue) {
    return 300;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  if (!hasWarnedInvalidRevalidate) {
    hasWarnedInvalidRevalidate = true;
    console.warn(
      `[sanity] Invalid SANITY_REVALIDATE_SECONDS="${rawValue}". Falling back to 300 seconds.`,
    );
  }

  return 300;
}
