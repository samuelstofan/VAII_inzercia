import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import ListingCard from "../components/ListingCard";
import Pagination from "../components/Pagination";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <FilterBar />

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-5">
        {loading && <p>Načítavam inzeráty...</p>}

        {!loading && listings.length === 0 && (
          <p>Žiadne inzeráty neboli nájdené</p>
        )}

        {listings.map((item) => (
          <ListingCard key={item.id} vehicle={item} />
        ))}
      </div>

      <Pagination />
    </div>
  );
}
