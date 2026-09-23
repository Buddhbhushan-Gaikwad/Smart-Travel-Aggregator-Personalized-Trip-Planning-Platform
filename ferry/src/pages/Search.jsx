import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import TripCard from "../components/trip/TripCard";
import CategoryChip from "../components/trip/CategoryChip";
import { RowSkeleton } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import { searchTrips, getAllCategories } from "../services/tripApi";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setResults(null);
    searchTrips({ query, category: category || undefined, maxPrice, sort: sort || undefined }).then(setResults);
    const next = {};
    if (query) next.q = query;
    if (category) next.category = category;
    setParams(next, { replace: true });
  }, [query, category, maxPrice, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <CategoryChip key={c} label={c} active={category === c} onClick={() => setCategory(category === c ? "" : c)} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Max price: ₹{maxPrice.toLocaleString("en-IN")}</p>
        <input type="range" min={3000} max={30000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full" />
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Sort by</p>
        <div className="flex flex-col gap-2">
          {[
            { value: "", label: "Most relevant" },
            { value: "rating", label: "Highest rated" },
            { value: "price_asc", label: "Price: low to high" },
            { value: "price_desc", label: "Price: high to low" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input type="radio" name="sort" checked={sort === opt.value} onChange={() => setSort(opt.value)} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl md:text-3xl mb-4">Search trips</h1>
      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search by destination, trip name, or category"
          className="flex-1 h-11 px-4 rounded-full border border-line bg-white text-sm outline-none focus-visible:ring-2 focus-visible:ring-coral"
        />
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="md:hidden shrink-0 h-11 w-11 rounded-full border border-line bg-white flex items-center justify-center"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden md:block">{FilterPanel}</aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setFiltersOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold">Filters</p>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={18} /></button>
              </div>
              {FilterPanel}
            </div>
          </div>
        )}

        <div>
          {!results ? (
            <RowSkeleton count={6} />
          ) : results.length === 0 ? (
            <EmptyState title="No trips match your current filters." subtitle="Try widening your budget or clearing a filter." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((t) => <TripCard key={t.id} trip={t} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
