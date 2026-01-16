import { useState } from "react";

const faqItems = [
  {
    question: "Ako pridám inzerát?",
    answer:
      "Po prihlásení kliknite na tlačidlo Pridať inzerát a vyplňte všetky povinné polia.",
  },
  {
    question: "Ako upravím alebo vymažem inzerát?",
    answer:
      "Po otvorení Vášho inzerátu sa dole zobrazí možnosť pre úpravu alebo odstránenie. Pri konkrétnom inzeráte zvoľte upraviť alebo odstrániť.",
  },
  {
    question: "Ako kontaktujem predajcu?",
    answer:
      "Na detaile inzerátu kliknite na odoslanie správy. Konverzácie nájdete v sekcii Správy.",
  },
  {
    question: "Čo znamená režim predajcu?",
    answer:
      "Po aktivovaní režimu predajcu budete viditeľní v zozname predajcov.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">FAQ</h1>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <button
            key={item.question}
            type="button"
            onClick={() => handleToggle(index)}
            className="w-full text-left bg-white rounded-lg shadow p-5"
            aria-expanded={openIndex === index}
          >
            <h2 className="text-lg font-semibold">{item.question}</h2>
            {openIndex === index && (
              <p className="text-gray-700 mt-2">{item.answer}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
