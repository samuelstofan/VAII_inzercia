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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [sortOption, setSortOption] = useState("newest");

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageSizeChange = (event) => {
    const nextSize = Number(event.target.value);
    setPageSize(nextSize);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters(initialFilters);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize, sortOption]);

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
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [listings]);

  const modelOptions = useMemo(() => {
    const models = listings
      .filter((item) =>
        filters.brand ? item?.brand?.name === filters.brand : true
      )
      .map((item) => item?.model?.name)
      .filter(Boolean);
    return Array.from(new Set(models)).sort((a, b) => a.localeCompare(b));
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
      if (filters.fuel && item?.fuel?.code !== filters.fuel) {
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

  const sortedListings = useMemo(() => {
    const parseDate = (value) => {
      const timestamp = Date.parse(value);
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const items = [...filteredListings];

    switch (sortOption) {
      case "az":
        items.sort((a, b) =>
          (a?.title || "").localeCompare(b?.title || "", "sk", {
            sensitivity: "base",
          })
        );
        break;
      case "price-asc":
        items.sort((a, b) => (a?.price ?? 0) - (b?.price ?? 0));
        break;
      case "price-desc":
        items.sort((a, b) => (b?.price ?? 0) - (a?.price ?? 0));
        break;
      case "oldest":
        items.sort(
          (a, b) => parseDate(a?.created_at) - parseDate(b?.created_at)
        );
        break;
      case "newest":
      default:
        items.sort(
          (a, b) => parseDate(b?.created_at) - parseDate(a?.created_at)
        );
        break;
    }

    return items;
  }, [filteredListings, sortOption]);

  const totalPages = Math.ceil(sortedListings.length / pageSize);

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedListings.slice(start, start + pageSize);
  }, [currentPage, sortedListings, pageSize]);

  const needsBottomGap =
    !loading && sortedListings.length > 0 && paginatedListings.length < pageSize;

  return (
    <div>
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        brands={brandOptions}
        models={modelOptions}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      <div
        className={`max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-5 ${
          needsBottomGap ? "mb-16" : ""
        }`}
      >
        {loading && <p>Načítavam inzeráty...</p>}

        {!loading && sortedListings.length === 0 && (
          <p>Žiadne inzeráty neboli nájdené</p>
        )}

        {paginatedListings.map((item) => (
          <ListingCard key={item.id} vehicle={item} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
