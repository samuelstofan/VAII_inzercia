import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // uprav podľa tvojej štruktúry

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      // 🔥 1. Načítaj CSRF cookie zo Sanctumu
      await api.get("/sanctum/csrf-cookie");

      // 🔥 2. Pošli login request
      const res = await api.post("/login", form);

      console.log("Login OK:", res.data);
      alert("Prihlásenie úspešné!");
      // 🔥 Presmeruj po úspešnom logine
      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        // Laravel validation errors
        const first = Object.values(err.response.data.errors)[0][0];
        setError(first);
      } else if (err.response?.status === 422) {
        // Nesprávne prihlasovacie údaje
        setError("Nesprávny email alebo heslo.");
      } else {
        setError("Prihlásenie zlyhalo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Prihlásenie</h1>

      {error && (
        <div className="text-red-600 text-center mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="border rounded-lg px-3 py-2"
          placeholder="Email"
          required
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="border rounded-lg px-3 py-2"
          placeholder="Heslo"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Prihlasujem..." : "Prihlásiť"}
        </button>
      </form>
    </div>
  );
}
