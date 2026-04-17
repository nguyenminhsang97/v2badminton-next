import type { Metadata } from "next";
import { CoachCardsGrid, getUsableCoaches } from "@/components/coaches/CoachCardsGrid";
import { canonicalUrl } from "@/lib/routes";
import { getCoaches } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

const pagePath = "/huan-luyen-vien/";

export const metadata: Metadata = {
  title: {
    absolute: "Đội ngũ huấn luyện viên | V2 Badminton",
  },
  description:
    "Xem đội ngũ huấn luyện viên tại V2 Badminton và nhóm học viên mỗi HLV đang đồng hành.",
  alternates: {
    canonical: canonicalUrl(pagePath),
  },
  openGraph: {
    title: "Đội ngũ huấn luyện viên | V2 Badminton",
    description:
      "Đội ngũ huấn luyện viên đồng hành cùng lớp thiếu nhi, người mới, người đi làm và lộ trình cá nhân hóa tại V2 Badminton.",
    url: canonicalUrl(pagePath),
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    type: "website",
    images: [canonicalUrl(siteConfig.defaultOgImagePath)],
  },
};

export default async function CoachesPage() {
  const coaches = getUsableCoaches(await getCoaches());

  return (
    <div className="coach-page">
      <section className="section coach-page__hero">
        <div className="section__header coach-page__header">
          <p className="section__eyebrow">Đội ngũ huấn luyện viên</p>
          <h1 className="section__title">Những người trực tiếp theo sát từng nhóm học viên</h1>
          <p className="section__desc">
            Danh sách đầy đủ các HLV đang đồng hành cùng lộ trình thiếu nhi, người mới,
            người đi làm và các buổi học cá nhân hóa tại V2 Badminton.
          </p>
        </div>

        {coaches.length > 0 ? (
          <CoachCardsGrid coaches={coaches} />
        ) : (
          <div className="coach-page__empty">
            <h2 className="coach-page__empty-title">Đội ngũ đang được cập nhật</h2>
            <p className="coach-page__empty-copy">
              Studio chưa có HLV nào sẵn sàng hiển thị. Khi coach data được thêm vào Sanity,
              trang này sẽ tự mở đầy đủ mà không cần sửa code.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
