export default function FilterBar({
  filters,
  onChange,
  onReset,
  brands,
  models,
}) {
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== ""
  );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      {/* Filter controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm block mb-1">Znacka</label>
          <select
            name="brand"
            value={filters.brand}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Všetky</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="text-sm block mb-1">Model</label>
          <select
            name="model"
            value={filters.model}
            onChange={onChange}
            disabled={!filters.brand}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Všetky</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">Cena od</label>
          <input
            type="number"
            name="priceMin"
            value={filters.priceMin}
            onChange={onChange}
            min="0"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Cena do</label>
          <input
            type="number"
            name="priceMax"
            value={filters.priceMax}
            onChange={onChange}
            min="0"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="20000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Nájazd od</label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="mileageMin"
            value={filters.mileageMin}
            onChange={onChange}
            placeholder="10000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Nájazd do</label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="mileageMax"
            value={filters.mileageMax}
            onChange={onChange}
            placeholder="80000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Rok výroby od</label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="yearMin"
            value={filters.yearMin}
            onChange={onChange}
            placeholder="2000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Rok výroby do</label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="yearMax"
            value={filters.yearMax}
            onChange={onChange}
            placeholder="2010"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Palivo</label>
          <select
            name="fuel"
            value={filters.fuel}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Všetky</option>
            <option value="petrol">BenzA?n</option>
            <option value="diesel">Nafta</option>
            <option value="electric">Elektrina</option>
            <option value="hybrid">Hybrid</option>
            <option value="lpg">LPG</option>
          </select>
        </div>

        <div>
          <span className="block text-sm mb-1 opacity-0">Spacer</span>
          <button
            type="button"
            onClick={onReset}
            className={
              hasActiveFilters
                ? "w-full h-10 bg-red-600 text-white px-5 py-2 rounded-lg"
                : "w-full h-10 bg-gray-200 text-gray-800 px-5 py-2 rounded-lg"
            }
          >
            Zrušiť filtre
          </button>
        </div>
      </div>
    </div>
  );
}


