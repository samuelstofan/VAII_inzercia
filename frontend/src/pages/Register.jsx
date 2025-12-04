import { useState } from "react";
import api from "../api/axios"; // <-- pridaj import

export default function Register() {

  console.log("ENV FROM VITE:", import.meta.env.VITE_API_URL);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      alert("Heslá sa nezhodujú.");
      return;
    }

    try {
      setLoading(true);

      // 🔥 1. Zavolaj sanctum cookie
      await api.get("/sanctum/csrf-cookie");

      // 🔥 2. Pošli dáta na backend
      const res = await api.post("/register", form);

      console.log("Registrácia OK:", res.data);
      alert("Registrácia úspešná!");
      await api.post("/logout");
    } catch (err) {
      console.error(err);

      // Backend validation errors
      if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0][0];
        setError(first);
      } else {
        setError("Registrácia zlyhala.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrácia</h1>

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
          placeholder="Meno"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          type="email"
          placeholder="Email"
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          type="password"
          placeholder="Heslo"
          required
        />

        <input
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          type="password"
          placeholder="Potvrdenie hesla"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Registrujem..." : "Registrovať"}
        </button>
      </form>
    </div>
  );
}
