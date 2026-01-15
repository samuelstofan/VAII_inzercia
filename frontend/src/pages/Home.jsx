import { useEffect, useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import ListingCard from "../components/ListingCard";
import Pagination from "../components/Pagination";

const initialFilters = {
  brand: "",
  model: "",
  priceMin: "",
  priceMax: "",
  mileageMin: "",
  mileageMax: "",
  yearMin: "",
  yearMax: "",
  fuel: "",
};

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterReset = () => {
    setFilters(initialFilters);
  };

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

  const brandOptions = useMemo(() => {
    const names = listings
      .map((item) => item?.brand?.name)
      .filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [listings]);

  const modelOptions = useMemo(() => {
    const models = listings
      .filter((item) =>
        filters.brand ? item?.brand?.name === filters.brand : true
      )
      .map((item) => item?.model?.name)
      .filter(Boolean);
    return Array.from(new Set(models)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [listings, filters.brand]);

  const filteredListings = useMemo(() => {
    const priceMin = filters.priceMin ? Number(filters.priceMin) : null;
    const priceMax = filters.priceMax ? Number(filters.priceMax) : null;
    const mileageMin = filters.mileageMin
      ? Number(filters.mileageMin)
      : null;
    const mileageMax = filters.mileageMax
      ? Number(filters.mileageMax)
      : null;
    const yearMin = filters.yearMin ? Number(filters.yearMin) : null;
    const yearMax = filters.yearMax ? Number(filters.yearMax) : null;
    return listings.filter((item) => {
      if (filters.brand && item?.brand?.name !== filters.brand) {
        return false;
      }
      if (filters.model && item?.model?.name !== filters.model) {
        return false;
      }
      if (filters.fuel && item?.fuel !== filters.fuel) {
        return false;
      }
      if (priceMin !== null && item?.price < priceMin) {
        return false;
      }
      if (priceMax !== null && item?.price > priceMax) {
        return false;
      }
      if (mileageMin !== null && item?.mileage < mileageMin) {
        return false;
      }
      if (mileageMax !== null && item?.mileage > mileageMax) {
        return false;
      }
      if (yearMin !== null && item?.year < yearMin) {
        return false;
      }
      if (yearMax !== null && item?.year > yearMax) {
        return false;
      }
      return true;
    });
  }, [filters, listings]);

  return (
    <div>
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        brands={brandOptions}
        models={modelOptions}
      />

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-5">
        {loading && <p>Načítavam inzeráty...</p>}

        {!loading && filteredListings.length === 0 && (
          <p>Žiadne inzeráty neboli nájdené</p>
        )}

        {filteredListings.map((item) => (
          <ListingCard key={item.id} vehicle={item} />
        ))}
      </div>

      <Pagination />
    </div>
  );
}
