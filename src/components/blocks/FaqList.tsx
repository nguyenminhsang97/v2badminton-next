import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { HomepageFaq } from "@/domain/homepage";

export type FaqListProps = {
  faqs: HomepageFaq[];
};

function FaqAnswer({
  answer,
  answerPlainText,
}: Pick<HomepageFaq, "answer" | "answerPlainText">) {
  if (answer.length === 0) {
    return <p>{answerPlainText}</p>;
  }

  return <PortableText value={answer as PortableTextBlock[]} />;
}

export function FaqList({ faqs }: FaqListProps) {
  return (
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
  );
}
