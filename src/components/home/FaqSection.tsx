import { FaqList } from "@/components/blocks/FaqList";
import type { HomepageFaqSectionProps } from "./sectionProps";

export function FaqSection({ faqs }: HomepageFaqSectionProps) {
  return (
    <section className="section faq-section" id="hoi-dap">
      <div className="section__header">
        <p className="section__eyebrow">Hỏi trước khi đăng ký</p>
        <h2 className="section__title">CÂU HỎI THƯỜNG GẶP</h2>
        <p className="section__desc">
          Những câu hỏi gặp nhiều nhất về lịch học, học phí, sân tập và cách V2
          xếp lớp cho người mới hoặc doanh nghiệp.
        </p>
      </div>
      <FaqList faqs={faqs} />
    </section>
  );
}
