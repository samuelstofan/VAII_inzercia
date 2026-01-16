import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      alert(t("register.errorPasswordMatch"));
      return;
    }

    try {
      setLoading(true);

      await api.get("/sanctum/csrf-cookie");
      await api.post("/register", form);
      await api.post("/logout");

      navigate("/prihlasenie");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0][0];
        setError(first);
      } else {
        setError(t("register.errorGeneric"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {t("register.title")}
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          placeholder={t("register.placeholderName")}
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          type="email"
          placeholder={t("register.placeholderEmail")}
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          type="password"
          placeholder={t("register.placeholderPassword")}
          required
        />

        <input
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          type="password"
          placeholder={t("register.placeholderPasswordConfirm")}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? t("register.buttonLoading") : t("register.button")}
        </button>
      </form>
    </div>
  );
}
