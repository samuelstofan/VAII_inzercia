import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const [form, setForm] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (event) => {
    setImages(Array.from(event.target.files || []));
  };

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
    images.forEach((file) => payload.append("images[]", file));

    try {
      const response = await api.post("/api/vehicles", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Listing created.");
      setForm(initialFormState);
      setImages([]);
      navigate(`/vehicles/${response.data.id}`);
    } catch (submitError) {
      const message =
        submitError.response?.data?.message ||
        Object.values(submitError.response?.data?.errors || {})
          .flat()
          .join(", ") ||
        "Failed to create listing.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Add listing</h1>
        <p className="text-gray-600 mb-6">
          Please sign in to create a new listing.
        </p>
        <Link
          to="/prihlasenie"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Add listing</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
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
            <label className="block text-sm font-medium mb-1">Location</label>
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
            <label className="block text-sm font-medium mb-1">Brand</label>
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
            <label className="block text-sm font-medium mb-1">Year</label>
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
            <label className="block text-sm font-medium mb-1">Mileage</label>
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
              Engine capacity (cc)
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
            <label className="block text-sm font-medium mb-1">Power (kW)</label>
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
            <label className="block text-sm font-medium mb-1">Fuel</label>
            <select
              name="fuel"
              value={form.fuel}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="lpg">LPG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Transmission
            </label>
            <select
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Drive</label>
            <select
              name="drive"
              value={form.drive}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Not set</option>
              <option value="fwd">FWD</option>
              <option value="rwd">RWD</option>
              <option value="awd">AWD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
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
            <label className="block text-sm font-medium mb-1">Currency</label>
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
          <label className="block text-sm font-medium mb-1">Description</label>
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
            Images (up to 10)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded-md disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Create listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
