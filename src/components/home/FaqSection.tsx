import { FaqList } from "@/components/blocks/FaqList";
import type { HomepageFaqSectionProps } from "./sectionProps";

export function FaqSection({ faqs }: HomepageFaqSectionProps) {
  return (
    <section className="section" id="hoi-dap">
      <div className="section__header">
        <h2 className="section__title">CÂU HỎI THƯỜNG GẶP</h2>
      </div>
      <FaqList faqs={faqs} />
    </section>
  );
}
