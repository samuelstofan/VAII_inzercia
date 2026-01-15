import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const initialFormState = {
  title: "",
  brand_name: "",
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
};

export default function AddListing() {
  const { isAuthenticated } = useAuth();
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  useEffect(() => {
    if (!isEditMode || !isAuthenticated) return;

    setLoadingListing(true);
    setError(null);

    api
      .get(`/api/vehicles/${id}`)
      .then((response) => {
        const data = response.data || {};
        setForm({
          title: data.title ?? "",
          brand_name: data.brand?.name ?? "",
          model_name: data.model?.name ?? "",
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
        });
        const nextPreviews = Array(10).fill(null);
        (data.images || []).slice(0, 10).forEach((image, index) => {
          nextPreviews[index] = image.url;
        });
        setImagePreviews(nextPreviews);
        setImageSlots(Array(10).fill(null));
      })
      .catch((loadError) => {
        console.error(loadError);
        setError("Nepodarilo sa nacitat inzerat.");
      })
      .finally(() => {
        setLoadingListing(false);
      });
  }, [id, isAuthenticated, isEditMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        payload.append(key, value);
      }
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
      setSuccess("Inzerát bol vytvorený.");
      setSuccess(isEditMode ? "Inzerát bol upravený." : "Inzerát bol vytvorený.");
      if (!isEditMode) {
        setForm(initialFormState);
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
        "Inzerát sa nepodarilo vytvoriť.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Pridať inzerát</h1>
        <p className="text-gray-600 mb-6">
          Na pridanie inzerátu sa prosím prihláste.
        </p>
        <Link
          to="/prihlasenie"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Prihlásiť sa
        </Link>
      </div>
    );
  }

  if (isEditMode && loadingListing) {
    return <p className="text-center mt-10">Načítavam...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Zmeniť inzerát" : "Pridať inzerát"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Názov</label>
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
            <label className="block text-sm font-medium mb-1">Lokalita</label>
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
            <label className="block text-sm font-medium mb-1">Značka</label>
            <input
              type="text"
              name="brand_name"
              value={form.brand_name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <input
              type="text"
              name="model_name"
              value={form.model_name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rok</label>
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
            <label className="block text-sm font-medium mb-1">Nájazd</label>
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
              Objem motora (cc)
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
            <label className="block text-sm font-medium mb-1">Výkon (kW)</label>
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
            <label className="block text-sm font-medium mb-1">Palivo</label>
            <select
              name="fuel"
              value={form.fuel}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="petrol">Benzín</option>
              <option value="diesel">Nafta</option>
              <option value="electric">Elektrina</option>
              <option value="hybrid">Hybrid</option>
              <option value="lpg">LPG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Prevodovka
            </label>
            <select
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="manual">Manuálna</option>
              <option value="automatic">Automatická</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pohon</label>
            <select
              name="drive"
              value={form.drive}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Nezadané</option>
              <option value="fwd">FWD</option>
              <option value="rwd">RWD</option>
              <option value="awd">AWD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cena</label>
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
            <label className="block text-sm font-medium mb-1">Mena</label>
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
          <label className="block text-sm font-medium mb-1">Popis</label>
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
            Fotky (poradie 1–10)
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
                    alt={`Náhľad ${index + 1}`}
                    className="h-16 w-24 object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-500">Vybrať fotku</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSlotChange(index)}
                  className="hidden"
                />
                {imagePreviews[index] && (
                  <span className="text-blue-600 text-xs">Nahradiť</span>
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
              ? "Ukladám..."
              : isEditMode
              ? "Upraviť inzerát"
              : "Vytvoriť inzerát"}
          </button>
        </div>
      </form>
    </div>
  );
}
