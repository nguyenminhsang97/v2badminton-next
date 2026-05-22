import { FaqList } from "@/components/blocks/FaqList";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { HomepageFaqSectionProps } from "./sectionProps";

export function FaqSection({ faqs, content }: HomepageFaqSectionProps) {
  const eyebrow = content?.eyebrow ?? "Gỡ vướng trước khi đăng ký";
  const title = content?.title ?? "Câu hỏi thường gặp";

  return (
    <section className="section faq-section" id={HOME_SECTION_IDS.faq}>
      <div className="section__header">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
      </div>
      <FaqList faqs={faqs} />
    </section>
  );
}
