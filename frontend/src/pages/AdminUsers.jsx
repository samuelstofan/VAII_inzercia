import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function AdminUsers() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [brandsLoaded, setBrandsLoaded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [usersOpen, setUsersOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/prihlasenie");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const me = await api.get("/api/user");
        if (me.data?.role !== "admin") {
          navigate("/");
          return;
        }
        setIsAdmin(true);
      } catch (err) {
        console.error(err);
        setError(t("admin.errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, t]);

  const handleLoadUsers = async () => {
    if (usersLoaded) {
      setUsersOpen(true);
      return;
    }
    setLoadingUsers(true);
    setError("");
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data || []);
      setUsersLoaded(true);
      setUsersOpen(true);
    } catch (err) {
      console.error(err);
      setError(t("admin.errorUsersLoad"));
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLoadBrands = async () => {
    if (brandsLoaded) {
      setBrandsOpen(true);
      return;
    }
    setLoadingBrands(true);
    setError("");
    try {
      const res = await api.get("/api/admin/brands");
      setBrands(res.data || []);
      setBrandsLoaded(true);
      setBrandsOpen(true);
    } catch (err) {
      console.error(err);
      setError(t("admin.errorBrandsLoad"));
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleLoadModels = async () => {
    if (modelsLoaded) {
      setModelsOpen(true);
      return;
    }
    setLoadingModels(true);
    setError("");
    try {
      const res = await api.get("/api/admin/models");
      setModels(res.data || []);
      setModelsLoaded(true);
      setModelsOpen(true);
      if (!brandsLoaded) {
        const brandsRes = await api.get("/api/admin/brands");
        setBrands(brandsRes.data || []);
        setBrandsLoaded(true);
      }
    } catch (err) {
      console.error(err);
      setError(t("admin.errorModelsLoad"));
    } finally {
      setLoadingModels(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(t("admin.confirmDeleteUser"));
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error(err);
      setError(t("admin.errorDeleteUser"));
    }
  };

  const handleBrandChange = (id, value) => {
    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === id ? { ...brand, name: value } : brand
      )
    );
  };

  const handleModelChange = (id, value) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id ? { ...model, name: value } : model
      )
    );
  };

  const handleSaveBrand = async (brand) => {
    if (!brand.name.trim()) {
      setError(t("admin.errorEmptyBrand"));
      return;
    }

    try {
      const res = await api.put(`/api/admin/brands/${brand.id}`, {
        name: brand.name,
      });
      setBrands((prev) =>
        prev.map((item) => (item.id === brand.id ? res.data : item))
      );
    } catch (err) {
      console.error(err);
      setError(t("admin.errorUpdateBrand"));
    }
  };

  const handleSaveModel = async (model) => {
    if (!model.name.trim()) {
      setError(t("admin.errorEmptyModel"));
      return;
    }

    try {
      const res = await api.put(`/api/admin/models/${model.id}`, {
        name: model.name,
      });
      setModels((prev) =>
        prev.map((item) => (item.id === model.id ? res.data : item))
      );
    } catch (err) {
      console.error(err);
      setError(t("admin.errorUpdateModel"));
    }
  };

  const handleDeleteBrand = async (brandId) => {
    const confirmed = window.confirm(t("admin.confirmDeleteBrand"));
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/brands/${brandId}`);
      setBrands((prev) => prev.filter((brand) => brand.id !== brandId));
      setModels((prev) =>
        prev.filter((model) => model.brand_id !== brandId)
      );
      if (String(selectedBrandId) === String(brandId)) {
        setSelectedBrandId("");
      }
    } catch (err) {
      console.error(err);
      setError(t("admin.errorDeleteBrand"));
    }
  };

  const handleDeleteModel = async (modelId) => {
    const confirmed = window.confirm(t("admin.confirmDeleteModel"));
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/models/${modelId}`);
      setModels((prev) => prev.filter((model) => model.id !== modelId));
    } catch (err) {
      console.error(err);
      setError(t("admin.errorDeleteModel"));
    }
  };

  if (loading) {
    return <div className="text-center mt-10">{t("admin.loading")}</div>;
  }

  if (!isAdmin) {
    return null;
  }

  const filteredModels = selectedBrandId
    ? models.filter(
        (model) => String(model.brand_id) === String(selectedBrandId)
      )
    : models;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
        <Link to="/" className="text-blue-600">
          {t("common.backHome")}
        </Link>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("admin.users")}</h2>
          <div className="flex gap-2">
            {!usersOpen && (
              <button
                type="button"
                onClick={handleLoadUsers}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                disabled={loadingUsers}
              >
                {loadingUsers ? t("admin.loading") : t("admin.load")}
              </button>
            )}
            {usersLoaded && usersOpen && (
              <button
                type="button"
                onClick={() => setUsersOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                {t("admin.close")}
              </button>
            )}
          </div>
        </div>

        {usersLoaded && usersOpen && (
          <>
            {users.length === 0 ? (
              <p className="text-gray-600">{t("admin.noUsers")}</p>
            ) : (
              <div className="bg-white rounded-lg shadow divide-y">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="text-lg font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        {t("admin.role")}: {user.role}
                      </div>
                    </div>
                    {user.role === "admin" ? (
                      <span className="text-xs text-gray-500">
                        {t("admin.adminAccount")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        {t("admin.delete")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("admin.brands")}</h2>
          <div className="flex gap-2">
            {!brandsOpen && (
              <button
                type="button"
                onClick={handleLoadBrands}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                disabled={loadingBrands}
              >
                {loadingBrands ? t("admin.loading") : t("admin.load")}
              </button>
            )}
            {brandsLoaded && brandsOpen && (
              <button
                type="button"
                onClick={() => setBrandsOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                {t("admin.close")}
              </button>
            )}
          </div>
        </div>

        {brandsLoaded && brandsOpen && (
          <>
            {brands.length === 0 ? (
              <p className="text-gray-600">{t("admin.noBrands")}</p>
            ) : (
              <div className="bg-white rounded-lg shadow divide-y">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <input
                      type="text"
                      value={brand.name}
                      onChange={(event) =>
                        handleBrandChange(brand.id, event.target.value)
                      }
                      className="border rounded-md px-3 py-2 w-full sm:max-w-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveBrand(brand)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        {t("admin.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        {t("admin.delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t("admin.models")}</h2>
          <div className="flex gap-2">
            {!modelsOpen && (
              <button
                type="button"
                onClick={handleLoadModels}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                disabled={loadingModels}
              >
                {loadingModels ? t("admin.loading") : t("admin.load")}
              </button>
            )}
            {modelsLoaded && modelsOpen && (
              <button
                type="button"
                onClick={() => setModelsOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                {t("admin.close")}
              </button>
            )}
          </div>
        </div>

        {modelsLoaded && modelsOpen && (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="text-sm text-gray-600">
                {t("admin.filterByBrand")}
              </label>
              <select
                value={selectedBrandId}
                onChange={(event) => setSelectedBrandId(event.target.value)}
                className="border rounded-md px-3 py-2"
                disabled={!brandsLoaded || brands.length === 0}
              >
                <option value="">{t("admin.allBrands")}</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {filteredModels.length === 0 ? (
              <p className="text-gray-600">{t("admin.noModels")}</p>
            ) : (
              <div className="bg-white rounded-lg shadow divide-y">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="w-full sm:max-w-xs">
                      <div className="text-xs text-gray-500 mb-1">
                        {model.brand?.name || t("admin.unknownBrand")}
                      </div>
                      <input
                        type="text"
                        value={model.name}
                        onChange={(event) =>
                          handleModelChange(model.id, event.target.value)
                        }
                        className="border rounded-md px-3 py-2 w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveModel(model)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        {t("admin.save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteModel(model.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                      >
                        {t("admin.delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
