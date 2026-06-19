"use client";

import type { ImageLoaderProps } from "next/image";

const SANITY_CDN_HOST = "cdn.sanity.io";
const MAX_WIDTH = 1920;
const DEFAULT_QUALITY = 75;

export function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.includes(SANITY_CDN_HOST)) {
    return src;
  }

  const base = src.split("?")[0];
  const cappedWidth = Math.min(Math.max(1, Math.round(width)), MAX_WIDTH);
  const q = quality ?? DEFAULT_QUALITY;

  return `${base}?w=${cappedWidth}&auto=format&q=${q}&fit=max`;
}
