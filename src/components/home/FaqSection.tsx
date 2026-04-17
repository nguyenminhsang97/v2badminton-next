import { FaqList } from "@/components/blocks/FaqList";
import type { HomepageFaqSectionProps } from "./sectionProps";

export function FaqSection({ faqs }: HomepageFaqSectionProps) {
  return (
    <section className="section faq-section" id="hoi-dap">
      <div className="section__header">
        <p className="section__eyebrow">Gỡ vướng trước khi để lại số</p>
        <h2 className="section__title">CÂU HỎI THƯỜNG GẶP</h2>
        <p className="section__desc">
          Những câu hỏi thường làm người học chần chừ nhất: học phí, lịch học, chọn sân và cách
          xếp lớp cho người mới.
        </p>
      </div>
      <FaqList faqs={faqs} />
    </section>
  );
}
