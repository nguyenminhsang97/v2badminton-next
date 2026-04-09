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
        useCdn: true,
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

export async function sanityFetchOrFallback<TResult>({
  query,
  params,
  fallback,
  tags = [],
}: SanityFetchOptions<TResult>): Promise<TResult | null> {
  if (!sanityReadClient) {
    warnMissingSanityConfig();
    return fallback ?? null;
  }

  try {
    const result = await sanityReadClient.fetch<TResult | null>(query, params ?? {}, {
      next: {
        revalidate: SANITY_REVALIDATE_SECONDS,
        tags: Array.from(new Set([...SANITY_CACHE_TAGS, ...tags])),
      },
      perspective: "published",
      useCdn: true,
    });

    return result ?? fallback ?? null;
  } catch (error) {
    console.error("[sanity] Read query failed. Falling back to safe value.", {
      tags: Array.from(new Set([...SANITY_CACHE_TAGS, ...tags])),
      error,
    });

    return fallback ?? null;
  }
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
