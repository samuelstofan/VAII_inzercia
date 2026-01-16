import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{t("about.title")}</h1>
      <p className="text-gray-700 mb-4">{t("about.p1")}</p>
      <p className="text-gray-700 mb-4">{t("about.p2")}</p>
      <p className="text-gray-700">{t("about.p3")}</p>
    </div>
  );
}
