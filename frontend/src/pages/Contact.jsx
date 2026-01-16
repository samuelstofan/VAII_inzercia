import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{t("contact.title")}</h1>
      <p className="text-gray-700 mb-4">{t("contact.p1")}</p>
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div>
          <p className="text-sm text-gray-500">{t("contact.email")}</p>
          <p className="text-gray-900">{t("contact.emailValue")}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("contact.phone")}</p>
          <p className="text-gray-900">{t("contact.phoneValue")}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("contact.address")}</p>
          <p className="text-gray-900">{t("contact.addressValue")}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("contact.hours")}</p>
          <p className="text-gray-900">{t("contact.hoursValue")}</p>
        </div>
      </div>
    </div>
  );
}
