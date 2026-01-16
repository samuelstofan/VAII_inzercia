import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const faqItems = [
  { questionKey: "faq.q1", answerKey: "faq.a1" },
  { questionKey: "faq.q2", answerKey: "faq.a2" },
  { questionKey: "faq.q3", answerKey: "faq.a3" },
  { questionKey: "faq.q4", answerKey: "faq.a4" },
];

export default function Faq() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{t("faq.title")}</h1>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <button
            key={item.questionKey}
            type="button"
            onClick={() => handleToggle(index)}
            className="w-full text-left bg-white rounded-lg shadow p-5"
            aria-expanded={openIndex === index}
          >
            <h2 className="text-lg font-semibold">{t(item.questionKey)}</h2>
            {openIndex === index && (
              <p className="text-gray-700 mt-2">{t(item.answerKey)}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
