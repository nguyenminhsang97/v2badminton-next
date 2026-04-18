import { FaqList } from "@/components/blocks/FaqList";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageFaqSectionProps } from "./sectionProps";

export function FaqSection({ faqs }: HomepageFaqSectionProps) {
  return (
    <section className="section faq-section" id={HOME_SECTION_IDS.faq}>
      <div className="section__header">
        <p className="section__eyebrow">Gỡ vướng trước khi đăng ký</p>
        <h2 className="section__title">Câu hỏi thường gặp</h2>
        <p className="section__desc">
          Học phí, lịch học, chọn sân và cách xếp lớp cho người mới.
        </p>
      </div>
      <FaqList faqs={faqs} />
    </section>
  );
}
