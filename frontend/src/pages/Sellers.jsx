import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sellers() {
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
        setError("Nepodarilo sa načítať zoznam predajcov.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) return <div className="p-6">Načítavam zoznam predajcov...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Zoznam predajcov</h1>

      {sellers.length === 0 ? (
        <p className="text-gray-600">Zatiaľ tu nie sú žiadni registrovaní predajcovia.</p>
      ) : (
        <div className="space-y-4">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="p-4 bg-white shadow rounded border border-gray-200"
            >
              <h2 className="text-xl font-semibold">{seller.name}</h2>
              <p className="text-gray-700">{seller.email}</p>
              <p className="text-sm text-gray-500">
                Registrovaný: {new Date(seller.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
