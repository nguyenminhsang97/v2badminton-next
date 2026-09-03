import "server-only";

import { cache } from "react";
import { sanityFetchOrFallback } from "../client";
import type { SanityPost, SanityPostListItem } from "../types";
import { POST_BY_SLUG_QUERY, PUBLISHED_POSTS_QUERY } from "./shared";

export const getPublishedPosts = cache(async (): Promise<SanityPostListItem[]> => {
  const posts = await sanityFetchOrFallback<SanityPostListItem[]>({
    query: PUBLISHED_POSTS_QUERY,
    fallback: [],
    tags: ["sanity:posts"],
  });

  return posts ?? [];
});

export const getPostBySlug = cache(
  async (slug: string): Promise<SanityPost | null> => {
    return sanityFetchOrFallback<SanityPost>({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
      fallback: null,
      tags: ["sanity:posts", `sanity:post:${slug}`],
    });
  },
);
