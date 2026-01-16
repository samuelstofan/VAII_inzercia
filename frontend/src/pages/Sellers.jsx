import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

export default function Sellers() {
  const { t } = useLanguage();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await api.get("/api/sellers");
        setSellers(res.data);
      } catch (err) {
        console.error(err);
        setError(t("sellers.errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [t]);

  if (loading) return <div className="p-6">{t("sellers.loading")}</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{t("sellers.title")}</h1>
        <Link to="/" className="text-blue-600">
          {t("common.backHome")}
        </Link>
      </div>

      {sellers.length === 0 ? (
        <p className="text-gray-600">{t("sellers.empty")}</p>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="p-4 bg-white shadow rounded border border-gray-200"
            >
              <h2 className="text-xl font-semibold">{seller.name}</h2>
              <p className="text-gray-700">{seller.email}</p>
              <Link
                to={`/predajcovia/${seller.id}`}
                className="inline-block mt-3 text-blue-600"
              >
                {t("sellers.listingsLink")}
              </Link>
              <p className="text-sm text-gray-500">
                {t("sellers.registeredLabel")}{" "}
                {new Date(seller.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
