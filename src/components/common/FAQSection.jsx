import { useState } from 'react';

/**
 * FAQSection — Accordion FAQ with schema markup support
 */
export default function FAQSection({ faqs }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section" aria-labelledby="faq-heading">
            <h2 id="faq-heading">Frequently Asked Questions</h2>
            <div>
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? 'open' : ''}`}
                    >
                        <button
                            className="faq-question"
                            onClick={() => toggle(index)}
                            aria-expanded={openIndex === index}
                        >
                            {faq.question}
                            <span className="faq-chevron">▾</span>
                        </button>
                        <div className="faq-answer">
                            <div className="faq-answer-inner">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
