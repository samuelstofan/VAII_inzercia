import { useLanguage } from "../context/LanguageContext";

export default function ReportListing() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{t("reportGuide.title")}</h1>
      <p className="text-gray-700 mb-6">{t("reportGuide.intro")}</p>

      <ol className="list-decimal pl-6 space-y-2 text-gray-700">
        <li>{t("reportGuide.step1")}</li>
        <li>{t("reportGuide.step2")}</li>
        <li>{t("reportGuide.step3")}</li>
        <li>{t("reportGuide.step4")}</li>
      </ol>

      <div className="bg-white rounded-lg shadow p-6 mt-6 space-y-2">
        <h2 className="text-lg font-semibold">{t("reportGuide.helpTitle")}</h2>
        <p className="text-gray-700">{t("reportGuide.helpText")}</p>
        <p className="text-gray-900">
          {t("contact.email")}: {t("contact.emailValue")}
        </p>
      </div>
    </div>
  );
}
