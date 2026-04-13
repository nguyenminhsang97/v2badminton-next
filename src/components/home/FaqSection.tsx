import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { HomepageFaqSectionProps } from "./sectionProps";

function FaqAnswer({
  answer,
  answerPlainText,
}: Pick<HomepageFaqSectionProps["faqs"][number], "answer" | "answerPlainText">) {
  if (answer.length === 0) {
    return <p>{answerPlainText}</p>;
  }

  return <PortableText value={answer as PortableTextBlock[]} />;
}

export function FaqSection({ faqs }: HomepageFaqSectionProps) {
  return (
    <section className="section" id="hoi-dap">
      <div className="section__header">
        <h2 className="section__title">CÂU HỎI THƯỜNG GẶP</h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.id} className="faq-item">
            <summary className="faq-item__question">{faq.question}</summary>
            <div className="faq-item__answer">
              <FaqAnswer
                answer={faq.answer}
                answerPlainText={faq.answerPlainText}
              />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
