import FilterBar from "../components/FilterBar";
import ListingCard from "../components/ListingCard";
import Pagination from "../components/Pagination";

export default function Home() {
  return (
    <div>
      <FilterBar />

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <ListingCard key={i} title={`Inzerát ${i + 1}`} />
        ))}
      </div>

      <Pagination />
    </div>
  );
}
