import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ListingCard from "../components/ListingCard";

export default function Favorites() {
  const { isAuthenticated } = useAuth();
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
        setError("Nepodarilo sa načítať obľúbené inzeráty.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="p-6">Loading favorites...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-6">
        <Link to="/moj-ucet" className="text-blue-600">
          Naspäť na môj účet
        </Link>
        <h1 className="text-2xl font-bold">Obľúbené inzeráty</h1>
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-600">Žiadne obľúbené inzeráty.</p>
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
