import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import ListingCard from "../components/ListingCard";

export default function SellerListings() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [sellerRes, vehiclesRes] = await Promise.all([
          api.get(`/api/sellers/${id}`),
          api.get(`/api/sellers/${id}/vehicles`),
        ]);

        if (!isMounted) return;

        setSeller(sellerRes.data);
        setListings(vehiclesRes.data.data || []);
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("Nepodarilo sa načítať Inzeráty predajcu.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Načítavam inzeráty...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-6">
        <Link to="/predajcovia" className="text-blue-600">
          Naspäť na zoznam predajcov
        </Link>
        <h1 className="text-2xl font-bold">
          Inzeráty predajcu {seller?.name || "seller"}
        </h1>
        {seller?.email && (
          <p className="text-sm text-gray-600">{seller.email}</p>
        )}
      </div>

      {listings.length === 0 ? (
        <p className="text-gray-600">Pre tohto predajcu neboli nájdené žiadne inzeráty.</p>
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


