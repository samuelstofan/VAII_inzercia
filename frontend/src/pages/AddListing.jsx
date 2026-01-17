import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const initialFormState = {
  title: "",
  brand_id: "",
  brand_name: "",
  model_id: "",
  model_name: "",
  description: "",
  year: "",
  mileage: "",
  engine_capacity: "",
  power: "",
  fuel: "petrol",
  transmission: "manual",
  drive: "",
  price: "",
  currency: "EUR",
  location: "",
  features: [],
};

export default function AddListing() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialFormState);
  const [imageSlots, setImageSlots] = useState(Array(10).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(10).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);

  const [brandChoice, setBrandChoice] = useState("");
  const [modelChoice, setModelChoice] = useState("");
  const [features, setFeatures] = useState([]);
  const [loadingFeatures, setLoadingFeatures] = useState(true);
  const featureLabelMap = {
    tempomat: "feature.cruiseControl",
    "adaptivny tempomat": "feature.adaptiveCruiseControl",
    "stresne okno": "feature.sunroof",
    klimatizacia: "feature.airConditioning",
    "automaticka klimatizacia": "feature.autoClimate",
    "parkovacie senzory": "feature.parkingSensors",
    "parkovacia kamera": "feature.parkingCamera",
    navigacia: "feature.navigation",
    bluetooth: "feature.bluetooth",
    "android auto": "feature.androidAuto",
    "apple carplay": "feature.appleCarPlay",
    "vyhrievane sedadla": "feature.heatedSeats",
    "kozeny interier": "feature.leatherInterior",
    "led svetla": "feature.ledLights",
    "xenonove svetla": "feature.xenonLights",
    "elektricke okna": "feature.powerWindows",
    "elektricke spatne zrkadla": "feature.powerMirrors",
    "asistent rozjazdu do kopca": "feature.hillStartAssist",
    "sledovanie mrtveho uhla": "feature.blindSpot",
    "bezklicove startovanie": "feature.keylessStart",
    "head-up displej": "feature.headUpDisplay",
    "tazne zariadenie": "feature.towBar",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (event) => {
    const value = event.target.value;
    if (value === "other") {
      setBrandChoice("other");
      setForm((prev) => ({
        ...prev,
        brand_id: "",
        brand_name: "",
        model_id: "",
        model_name: "",
      }));
      setModels([]);
      setModelChoice("");
      return;
    }

    setBrandChoice(value);
    setForm((prev) => ({
      ...prev,
      brand_id: value,
      brand_name: "",
      model_id: "",
      model_name: "",
    }));
    setModelChoice("");
  };

  const handleModelChange = (event) => {
    const value = event.target.value;
    if (value === "other") {
      setModelChoice("other");
      setForm((prev) => ({ ...prev, model_id: "", model_name: "" }));
      return;
    }

    setModelChoice(value);
    setForm((prev) => ({ ...prev, model_id: value, model_name: "" }));
  };

  const handleSlotChange = (index) => (event) => {
    const file = event.target.files?.[0] || null;
    setImageSlots((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    setImagePreviews((prev) => {
      const next = [...prev];
      if (next[index] && next[index].startsWith("blob:")) {
        URL.revokeObjectURL(next[index]);
      }
      next[index] = file ? URL.createObjectURL(file) : null;
      return next;
    });
  };

  const handleFeatureToggle = (featureId) => {
    setForm((prev) => {
      const hasFeature = prev.features.includes(featureId);
      const nextFeatures = hasFeature
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId];
      return { ...prev, features: nextFeatures };
    });
  };

  useEffect(() => {
    let isMounted = true;
    setLoadingBrands(true);

    api
      .get("/api/brands")
      .then((res) => {
        if (!isMounted) return;
        setBrands(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setError(t("addListing.errorBrands"));
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingBrands(false);
      });

    return () => {
      isMounted = false;
    };
  }, [t]);

  useEffect(() => {
    let isMounted = true;
    setLoadingFeatures(true);

    api
      .get("/api/features")
      .then((res) => {
        if (!isMounted) return;
        setFeatures(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setFeatures([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingFeatures(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!form.brand_id) {
      setModels([]);
      setForm((prev) => ({ ...prev, model_id: "", model_name: "" }));
      return;
    }

    let isMounted = true;
    setLoadingModels(true);

    api
      .get(`/api/brands/${form.brand_id}/models`)
      .then((res) => {
        if (!isMounted) return;
        const nextModels = res.data || [];
        setModels(nextModels);
        setForm((prev) => {
          if (!prev.model_id) return prev;
          const match = nextModels.some(
            (model) => String(model.id) === String(prev.model_id)
          );
          return match ? prev : { ...prev, model_id: "" };
        });
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setModels([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingModels(false);
      });

    return () => {
      isMounted = false;
    };
  }, [form.brand_id]);

  useEffect(() => {
    if (!isEditMode || !isAuthenticated) return;

    setLoadingListing(true);
    setError(null);

    api
      .get(`/api/vehicles/${id}`)
      .then((response) => {
        const data = response.data || {};
        const brandId = data.brand?.id ? String(data.brand.id) : "";
        const modelId = data.model?.id ? String(data.model.id) : "";
        setForm({
          title: data.title ?? "",
          brand_id: brandId,
          brand_name: "",
          model_id: modelId,
          model_name: "",
          description: data.description ?? "",
          year: data.year ?? "",
          mileage: data.mileage ?? "",
          engine_capacity: data.engine_capacity ?? "",
          power: data.power ?? "",
          fuel: data.fuel?.code ?? "petrol",
          transmission: data.transmission?.code ?? "manual",
          drive: data.drive?.code ?? "",
          price: data.price ?? "",
          currency: data.currency ?? "EUR",
          location: data.location ?? "",
          features: (data.features || []).map((feature) => Number(feature.id)),
        });
        setBrandChoice(brandId);
        setModelChoice(modelId);
        const nextPreviews = Array(10).fill(null);
        (data.images || []).slice(0, 10).forEach((image, index) => {
          nextPreviews[index] = image.url;
        });
        setImagePreviews(nextPreviews);
        setImageSlots(Array(10).fill(null));
      })
      .catch((loadError) => {
        console.error(loadError);
        setError(t("addListing.errorLoad"));
      })
      .finally(() => {
        setLoadingListing(false);
      });
  }, [id, isAuthenticated, isEditMode, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "features") return;
      if (value !== "" && value !== null) {
        payload.append(key, value);
      }
    });
    payload.append("features_present", "1");
    form.features.forEach((featureId) => {
      payload.append("features[]", String(featureId));
    });
    imageSlots.forEach((file, index) => {
      if (!file) return;
      if (index === 0) {
        payload.append("primary_image", file);
      } else {
        payload.append("images[]", file);
      }
    });

    try {
      if (isEditMode) {
        payload.append("_method", "PUT");
      }
      const response = isEditMode
        ? await api.post(`/api/vehicles/${id}`, payload)
        : await api.post("/api/vehicles", payload);
      setSuccess(
        isEditMode ? t("addListing.successEdit") : t("addListing.successCreate")
      );
      if (!isEditMode) {
        setForm(initialFormState);
        setBrandChoice("");
        setModelChoice("");
        setModels([]);
        setImageSlots(Array(10).fill(null));
        setImagePreviews((prev) => {
          prev.forEach((url) => {
            if (url) URL.revokeObjectURL(url);
          });
          return Array(10).fill(null);
        });
      }
      navigate(`/vehicles/${response.data.id}`);
    } catch (submitError) {
      const message =
        submitError.response?.data?.message ||
        Object.values(submitError.response?.data?.errors || {})
          .flat()
          .join(", ") ||
        t("addListing.errorCreate");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const showBrandOther = brandChoice === "other";
  const showModelOther = modelChoice === "other" || brandChoice === "other";

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t("addListing.loginTitle")}</h1>
          <Link to="/" className="text-blue-600">
            {t("common.backHome")}
          </Link>
        </div>
        <p className="text-gray-600 mb-6">{t("addListing.loginText")}</p>
        <Link
          to="/prihlasenie"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {t("addListing.loginButton")}
        </Link>
      </div>
    );
  }

  if (isEditMode && loadingListing) {
    return <p className="text-center mt-10">{t("addListing.loading")}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? t("addListing.titleEdit") : t("addListing.titleAdd")}
        </h1>
        <Link to="/" className="text-blue-600">
          {t("common.backHome")}
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelTitle")}
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelLocation")}
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelBrand")}
            </label>
            <select
              name="brand_id"
              value={brandChoice}
              onChange={handleBrandChange}
              className="w-full border rounded-md px-3 py-2"
              required
              disabled={loadingBrands}
            >
              <option value="">
                {loadingBrands
                  ? t("addListing.brandLoading")
                  : t("addListing.brandPlaceholder")}
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </option>
              ))}
              <option value="other">{t("addListing.otherBrand")}</option>
            </select>
          </div>

          {showBrandOther && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("addListing.labelBrandOther")}
              </label>
              <input
                type="text"
                name="brand_name"
                value={form.brand_name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelModel")}
            </label>
            <select
              name="model_id"
              value={modelChoice}
              onChange={handleModelChange}
              className="w-full border rounded-md px-3 py-2"
              required
              disabled={loadingModels || showBrandOther || !form.brand_id}
            >
              <option value="">
                {showBrandOther
                  ? t("addListing.modelPlaceholderFillBrand")
                  : loadingModels
                  ? t("addListing.modelLoading")
                  : form.brand_id
                  ? t("addListing.modelPlaceholder")
                  : t("addListing.modelPlaceholderSelectBrand")}
              </option>
              {models.map((model) => (
                <option key={model.id} value={String(model.id)}>
                  {model.name}
                </option>
              ))}
              {!showBrandOther && (
                <option value="other">{t("addListing.otherModel")}</option>
              )}
            </select>
          </div>

          {showModelOther && (
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("addListing.labelModelOther")}
              </label>
              <input
                type="text"
                name="model_name"
                value={form.model_name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelYear")}
            </label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="1900"
              max="2100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelMileage")}
            </label>
            <input
              type="number"
              name="mileage"
              value={form.mileage}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelEngine")}
            </label>
            <input
              type="number"
              name="engine_capacity"
              value={form.engine_capacity}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelPower")}
            </label>
            <input
              type="number"
              name="power"
              value={form.power}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelFuel")}
            </label>
            <select
              name="fuel"
              value={form.fuel}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="petrol">{t("addListing.fuelPetrol")}</option>
              <option value="diesel">{t("addListing.fuelDiesel")}</option>
              <option value="electric">{t("addListing.fuelElectric")}</option>
              <option value="hybrid">{t("addListing.fuelHybrid")}</option>
              <option value="lpg">{t("addListing.fuelLpg")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelTransmission")}
            </label>
            <select
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="manual">
                {t("addListing.transmissionManual")}
              </option>
              <option value="automatic">
                {t("addListing.transmissionAutomatic")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelDrive")}
            </label>
            <select
              name="drive"
              value={form.drive}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">{t("addListing.driveEmpty")}</option>
              <option value="fwd">FWD</option>
              <option value="rwd">RWD</option>
              <option value="awd">AWD</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              {t("addListing.labelFeatures")}
            </label>
            {loadingFeatures ? (
              <p className="text-sm text-gray-500">
                {t("addListing.featuresLoading")}
              </p>
            ) : features.length === 0 ? (
              <p className="text-sm text-gray-500">
                {t("addListing.featuresEmpty")}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {features.map((feature) => {
                  const featureId = Number(feature.id);
                  const featureKey =
                    featureLabelMap[String(feature.name || "").toLowerCase()];
                  const featureLabel = featureKey
                    ? t(featureKey)
                    : feature.name;
                  return (
                    <label
                      key={featureId}
                      className="flex items-center gap-2 text-sm text-gray-700 border rounded-md px-3 py-2 bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.features.includes(featureId)}
                        onChange={() => handleFeatureToggle(featureId)}
                      />
                      <span>{featureLabel}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelPrice")}
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("addListing.labelCurrency")}
            </label>
            <input
              type="text"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              maxLength="3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addListing.labelDescription")}
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 min-h-[120px]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("addListing.labelPhotos")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {imageSlots.map((_, index) => (
              <label
                key={index}
                className="flex items-center gap-3 text-sm text-gray-700 border rounded-md p-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <span className="w-6 text-right">{index + 1}.</span>
                {imagePreviews[index] ? (
                  <img
                    src={imagePreviews[index]}
                    alt={`${t("addListing.labelPhotos")} ${index + 1}`}
                    className="h-16 w-24 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500">
                    {t("addListing.photoChoose")}
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSlotChange(index)}
                  className="hidden"
                />
                {imagePreviews[index] && (
                  <span className="text-blue-600 text-xs">
                    {t("addListing.photoReplace")}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-60"
          >
            {submitting
              ? t("addListing.submitting")
              : isEditMode
              ? t("addListing.submitEdit")
              : t("addListing.submitCreate")}
          </button>
        </div>
      </form>
    </div>
  );
}
