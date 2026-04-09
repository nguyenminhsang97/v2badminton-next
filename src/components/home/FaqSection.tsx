import { getFaqsForPage } from "@/lib/faqs";

export function FaqSection() {
  const faqs = getFaqsForPage("homepage");

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
              {faq.answerHtml ? (
                <div dangerouslySetInnerHTML={{ __html: faq.answerHtml }} />
              ) : (
                <p>{faq.answerText}</p>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
