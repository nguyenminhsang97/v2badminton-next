import "server-only";
import { createClient } from "@sanity/client";
import { draftMode } from "next/headers";

type SanityQueryParams = Record<string, unknown>;

export const SANITY_API_VERSION = "2026-04-09";

/**
 * Revalidation choice:
 * - use time-based ISR via `next.revalidate` only as a long safety net
 * - default to 86400 seconds (24h); on-demand webhook revalidation
 *   (`revalidateTag` in /api/revalidate/sanity) is the real freshness path
 * - a short window (e.g. 300s) multiplied across every Sanity-backed route
 *   and crawler traffic causes large numbers of ISR Writes for no benefit,
 *   since the webhook already pushes published edits live within seconds
 *
 * Operator expectation:
 * - in production, published Sanity edits appear within seconds via the webhook;
 *   the 24h timer only matters if the webhook is ever missed
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

/**
 * Draft-mode client. Separate from the read client on purpose.
 *
 * It uses its own token (SANITY_API_VIEWER_TOKEN) so the published path can
 * never read an unpublished document even by mistake: the read client's token
 * and perspective are untouched, and this one is only ever reached behind
 * `draftMode().isEnabled`, which requires the __prerender_bypass cookie.
 *
 * Not configured means no preview — never a silent fall back to published data
 * dressed up as a draft.
 */
const viewerToken = process.env.SANITY_API_VIEWER_TOKEN?.trim();

const sanityDraftClient =
  projectId && dataset && viewerToken
    ? createClient({
        projectId,
        dataset,
        apiVersion: SANITY_API_VERSION,
        useCdn: false,
        perspective: "drafts",
        token: viewerToken,
      })
    : null;

export function getSanityReadClient() {
  return sanityReadClient;
}

export function isSanityDraftConfigured() {
  return Boolean(sanityDraftClient);
}

export function getSanityDraftClient() {
  return sanityDraftClient;
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

  // Draft mode is per-request: only a browser carrying the __prerender_bypass
  // cookie gets here, so pages stay statically rendered for everyone else.
  const isDraft = await isDraftRequest();

  if (isDraft && sanityDraftClient) {
    try {
      const result = await sanityDraftClient.fetch<TResult | null>(
        query,
        params ?? {},
        {
          // Never cache a draft. It is unpublished content and must not be
          // reachable through a cache entry after the session ends.
          cache: "no-store",
          perspective: "drafts",
          useCdn: false,
        },
      );

      return { data: result ?? fallback ?? null, state: "success" };
    } catch (error) {
      console.error("[sanity] Draft query failed.", { error });
      return { data: fallback ?? null, state: "query_error" };
    }
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

/**
 * `draftMode()` throws outside a request scope — during `generateStaticParams`,
 * in scripts, in tests. Treat any of those as "not a draft" rather than letting
 * it break the published path, which is by far the more important one.
 */
async function isDraftRequest(): Promise<boolean> {
  try {
    const { isEnabled } = await draftMode();
    return isEnabled;
  } catch {
    return false;
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
    return 86400;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  if (!hasWarnedInvalidRevalidate) {
    hasWarnedInvalidRevalidate = true;
    console.warn(
      `[sanity] Invalid SANITY_REVALIDATE_SECONDS="${rawValue}". Falling back to 86400 seconds.`,
    );
  }

  return 86400;
}
