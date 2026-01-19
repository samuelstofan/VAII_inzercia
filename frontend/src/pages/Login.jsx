import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      await api.get("/sanctum/csrf-cookie");
      await api.post("/login", form);

      login();
      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0][0];
        setError(first);
      } else if (err.response?.status === 422) {
        setError(t("login.errorInvalid"));
      } else {
        setError(t("login.errorGeneric"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {t("login.title")}
      </h1>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="border rounded-lg px-3 py-2"
          placeholder={t("login.placeholderEmail")}
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="border rounded-lg px-3 py-2"
          placeholder={t("login.placeholderPassword")}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? t("login.buttonLoading") : t("login.button")}
        </button>
      </form>

    </div>
  );
}
