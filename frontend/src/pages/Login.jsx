import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Prihlasovacie údaje:", form);

    // TODO: API request /login

    // Zatiaľ fake login:
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Prihlásenie</h1>

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
          className="bg-black text-white py-2 rounded-lg"
        >
          Prihlásiť
        </button>
      </form>
    </div>
  );
}
