import { useLanguage } from "../context/LanguageContext";

export default function FilterBar({
  filters,
  onChange,
  onReset,
  brands,
  models,
  pageSize,
  onPageSizeChange,
  sortOption,
  onSortChange,
}) {
  const { t } = useLanguage();
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== ""
  );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm block mb-1">{t("filterBar.brand")}</label>
          <select
            name="brand"
            value={filters.brand}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">{t("filterBar.all")}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">{t("filterBar.model")}</label>
          <select
            name="model"
            value={filters.model}
            onChange={onChange}
            disabled={!filters.brand}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">{t("filterBar.all")}</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">
            {t("filterBar.priceFrom")}
          </label>
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
          <label className="text-sm block mb-1">
            {t("filterBar.priceTo")}
          </label>
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
          <label className="text-sm block mb-1">
            {t("filterBar.mileageFrom")}
          </label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="mileageMin"
            value={filters.mileageMin}
            onChange={onChange}
            placeholder="10000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">
            {t("filterBar.mileageTo")}
          </label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="mileageMax"
            value={filters.mileageMax}
            onChange={onChange}
            placeholder="80000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">
            {t("filterBar.yearFrom")}
          </label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="yearMin"
            value={filters.yearMin}
            onChange={onChange}
            placeholder="2000"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">
            {t("filterBar.yearTo")}
          </label>
          <input
            className="w-full border px-3 py-2 rounded-lg"
            name="yearMax"
            value={filters.yearMax}
            onChange={onChange}
            placeholder="2010"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">{t("filterBar.fuel")}</label>
          <select
            name="fuel"
            value={filters.fuel}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">{t("filterBar.all")}</option>
            <option value="petrol">{t("filterBar.fuelPetrol")}</option>
            <option value="diesel">{t("filterBar.fuelDiesel")}</option>
            <option value="electric">{t("filterBar.fuelElectric")}</option>
            <option value="hybrid">{t("filterBar.fuelHybrid")}</option>
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
            {t("filterBar.reset")}
          </button>
        </div>

        <div>
          <label className="text-sm block mb-1">{t("filterBar.sort")}</label>
          <select
            name="sortOption"
            value={sortOption}
            onChange={onSortChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="az">A-Z</option>
            <option value="price-asc">{t("filterBar.sortPriceAsc")}</option>
            <option value="price-desc">{t("filterBar.sortPriceDesc")}</option>
            <option value="newest">{t("filterBar.sortNewest")}</option>
            <option value="oldest">{t("filterBar.sortOldest")}</option>
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">
            {t("filterBar.pageSize")}
          </label>
          <select
            name="pageSize"
            value={pageSize}
            onChange={onPageSizeChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
      </div>
    </div>
  );
}
