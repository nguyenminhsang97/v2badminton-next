// Phase 1 content-platform catch-all route.
//
// The locked spec calls for an optional catch-all (`[[...slug]]`), but Next.js
// 16 rejects that because `(site)/page.tsx` and `(site)/[[...slug]]/page.tsx`
// resolve to the same `/` with equal specificity. We use a required catch-all
// (`[...slug]`) instead — content paths always have ≥1 segment, so this
// matches every routable content URL without colliding with the home route.
// All other behavior (resolver, redirects, noindex defaults) matches §5 of
// `.claude/CMS/v2badminton-cms-phase-1-locked-spec.md`.
import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { ArticleView } from "@/components/content/ArticleView";
import { CourtView } from "@/components/content/CourtView";
import { HubPortal } from "@/components/content/HubPortal";
import { NodePortal } from "@/components/content/NodePortal";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { normalizeContentPath } from "@/lib/content/path";
import { canonicalUrl, reservedRoutePrefixes } from "@/lib/routes";
import {
  getContentArticle,
  getContentHub,
  getContentNode,
  getContentRedirect,
  getCourt,
  resolveContentRoute,
} from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export const dynamicParams = true;

type CatchAllPageProps = {
  params: Promise<{ slug: string[] }>;
};

// Strip a trailing brand suffix authored in the CMS seoTitle field (e.g.
// "…— V2 Badminton") before returning the title to Next.js. The global
// layout template (`"%s | V2 Badminton"`) appends one brand suffix; without
// this helper CMS docs that already include the suffix produce a double:
// "… — V2 Badminton | V2 Badminton".
function stripBrandSuffix(title: string | undefined): string | undefined {
  if (!title) return title;
  return title.replace(/\s*[—|]\s*V2 Badminton\s*$/u, "").trim() || undefined;
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = normalizeContentPath(slug);

  const [route, chromeSettings] = await Promise.all([
    resolveContentRoute(path),
    loadSiteChromeSettings(),
  ]);

  if (route == null) {
    return { robots: { index: false, follow: true } };
  }

  // Prefer CMS-managed site-wide default OG image; fall back to the static file.
  const siteDefaultOgImage =
    chromeSettings.defaultOgImageUrl ?? canonicalUrl(siteConfig.defaultOgImagePath);

  let seoTitle: string | undefined;
  let seoDescription: string | undefined;
  let ogImage: string;
  let ogType: "article" | "website";

  if (route._type === "content_hub") {
    const hub = await getContentHub(route._id);
    seoTitle = stripBrandSuffix(hub?.seoTitle);
    seoDescription = hub?.seoDescription;
    ogImage = siteDefaultOgImage;
    ogType = "website";
  } else if (route._type === "content_node") {
    const node = await getContentNode(route._id);
    seoTitle = stripBrandSuffix(node?.seoTitle);
    seoDescription = node?.seoDescription;
    ogImage = siteDefaultOgImage;
    ogType = "website";
  } else if (route._type === "court") {
    const court = await getCourt(route._id);
    seoTitle = stripBrandSuffix(court?.seoTitle);
    seoDescription = court?.seoDescription;
    ogImage = court?.coverImageUrl ?? siteDefaultOgImage;
    ogType = "website";
  } else {
    const article = await getContentArticle(route._id);
    seoTitle = stripBrandSuffix(article?.seoTitle);
    seoDescription = article?.seoDescription;
    ogImage = article?.coverImageUrl ?? siteDefaultOgImage;
    ogType = "article";
  }

  const ogTitle = seoTitle ? `${seoTitle} | ${siteConfig.name}` : undefined;
  const url = canonicalUrl(path);

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: url },
    robots: { index: route.isIndexed, follow: true },
    openGraph: {
      title: ogTitle,
      description: seoDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: ogType,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const path = normalizeContentPath(slug);

  if (reservedRoutePrefixes.some((p) => path.startsWith(p))) {
    notFound();
  }

  const route = await resolveContentRoute(path);

  if (route) {
    if (route._type === "content_hub") {
      return <HubPortal id={route._id} path={path} />;
    }
    if (route._type === "content_node") {
      return <NodePortal id={route._id} path={path} />;
    }
    if (route._type === "court") {
      return <CourtView id={route._id} path={path} />;
    }
    return <ArticleView id={route._id} path={path} />;
  }

  const contentRedirect = await getContentRedirect(path);
  if (contentRedirect) {
    if (contentRedirect.permanent) {
      permanentRedirect(contentRedirect.toPath);
    }
    redirect(contentRedirect.toPath);
  }

  notFound();
}
