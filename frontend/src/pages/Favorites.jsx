import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import ListingCard from "../components/ListingCard";

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/prihlasenie");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await api.get("/api/favorites");
        setListings(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError(t("favorites.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, navigate, t]);

  if (loading) return <div className="p-6">{t("favorites.loading")}</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("favorites.title")}</h1>
        <Link to="/" className="text-blue-600">
          {t("common.backHome")}
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-600">{t("favorites.empty")}</p>
      ) : (
        <div className="flex flex-col gap-5">
          {listings.map((item) => (
            <ListingCard key={item.id} vehicle={item} />
          ))}
        </div>
      )}
    </div>
  );
}
