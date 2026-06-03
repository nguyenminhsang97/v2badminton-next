import type { Metadata } from "next";
import { CoachCardsGrid, getUsableCoaches } from "@/components/coaches/CoachCardsGrid";
import { loadSiteChromeSettings } from "@/components/layout/siteSettings";
import { JsonLd } from "@/components/ui/JsonLd";
import { canonicalUrl } from "@/lib/routes";
import { getCoaches } from "@/lib/sanity";
import { buildPersonSchema, hasRealCoachName } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const pagePath = "/huan-luyen-vien/";

const COACH_PAGE_TITLE = "Đội ngũ huấn luyện viên | V2 Badminton";
const COACH_PAGE_DESCRIPTION =
  "Xem đội ngũ huấn luyện viên tại V2 Badminton và nhóm học viên mỗi HLV đang đồng hành.";
const COACH_PAGE_OG_DESCRIPTION =
  "Đội ngũ huấn luyện viên đồng hành cùng lớp thiếu nhi, người mới, người đi làm và lộ trình cá nhân hóa tại V2 Badminton.";

export async function generateMetadata(): Promise<Metadata> {
  const [coaches, chromeSettings] = await Promise.all([
    getCoaches(),
    loadSiteChromeSettings(),
  ]);
  const usableCoaches = getUsableCoaches(coaches);

  // Prefer CMS-managed site-wide default OG image; fall back to the static file.
  const ogImage =
    chromeSettings.defaultOgImageUrl ?? canonicalUrl(siteConfig.defaultOgImagePath);

  const metadata: Metadata = {
    title: { absolute: COACH_PAGE_TITLE },
    description: COACH_PAGE_DESCRIPTION,
    alternates: { canonical: canonicalUrl(pagePath) },
    openGraph: {
      title: COACH_PAGE_TITLE,
      description: COACH_PAGE_OG_DESCRIPTION,
      url: canonicalUrl(pagePath),
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: COACH_PAGE_TITLE,
      description: COACH_PAGE_OG_DESCRIPTION,
      images: [ogImage],
    },
  };

  if (usableCoaches.length === 0) {
    return { ...metadata, robots: { index: false, follow: true } };
  }

  return metadata;
}

export default async function CoachesPage() {
  const coaches = getUsableCoaches(await getCoaches());
  const personSchemas = coaches
    .filter(hasRealCoachName)
    .map(buildPersonSchema);

  return (
    <div className="coach-page">
      {personSchemas.length > 0 ? (
        <JsonLd id="coach-person" data={personSchemas} />
      ) : null}
      <section className="section coach-page__hero">
        <div className="section__header coach-page__header">
          <p className="section__eyebrow">Đội ngũ huấn luyện viên</p>
          <h1 className="section__title">
            Những người trực tiếp theo sát từng nhóm học viên
          </h1>
          <p className="section__desc">
            Danh sách đầy đủ các HLV đang đồng hành cùng lộ trình thiếu nhi,
            người mới, người đi làm và các buổi học cá nhân hóa tại V2 Badminton.
          </p>
        </div>

        {coaches.length > 0 ? (
          <CoachCardsGrid coaches={coaches} />
        ) : (
          <div className="coach-page__empty">
            <h2 className="coach-page__empty-title">Đội ngũ đang được cập nhật</h2>
            <p className="coach-page__empty-copy">
              Đội ngũ HLV đang được cập nhật. Vui lòng liên hệ Zalo 0907 911 886
              để được tư vấn trực tiếp về lớp phù hợp.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
