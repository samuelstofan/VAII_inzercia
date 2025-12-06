import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyAccount() {
  const { isAuthenticated, logout } = useAuth(); 
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [deleting, setDeleting] = useState(false);

  // === NEW ===
  const [isSeller, setIsSeller] = useState(false);
  const [savingSeller, setSavingSeller] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/prihlasenie");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        setUser(res.data);
        setNewName(res.data.name);

        // === NEW ===
        setIsSeller(res.data.is_seller ?? false);

      } catch (err) {
        console.error(err);
        setError("Nepodarilo sa načítať údaje používateľa.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, navigate]);

  const handleNameChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newName.trim()) {
      setError("Meno nemôže byť prázdne.");
      return;
    }

    try {
      setSaving(true);

      const res = await api.put("/api/user/update", { name: newName });

      setUser(res.data.user);
      setSuccess("Meno bolo úspešne zmenené.");
    } catch (err) {
      console.error(err);
      setError("Meno sa nepodarilo zmeniť.");
    } finally {
      setSaving(false);
    }
  };

  // === NEW ===
  const handleSellerToggle = async () => {
    setSavingSeller(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.put("/api/user/update", {
        is_seller: !isSeller,
      });

      setUser(res.data.user);
      setIsSeller(res.data.user.is_seller);
      setSuccess("Nastavenie predajcu bolo aktualizované.");

    } catch (err) {
      console.error(err);
      setError("Nepodarilo sa upraviť mód predajcu.");
    } finally {
      setSavingSeller(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Naozaj chcete vymazať svoj účet? Táto akcia je nevratná."
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      await api.post("/logout"); 
      logout(); 

      await api.delete("/api/user/delete");

      alert("Váš účet bol úspešne vymazaný.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Nastala chyba pri vymazávaní účtu.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Načítavam údaje...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!user) return <div className="text-center mt-10">Údaje používateľa nie sú dostupné.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Môj účet</h1>

      <div className="space-y-4 text-lg">

        <div>
          <strong>Meno:</strong>
          <p>{user.name}</p>
        </div>

        <div>
          <strong>Email:</strong>
          <p>{user.email}</p>
        </div>

        <div>
          <strong>Dátum vytvorenia účtu:</strong>
          <p>{new Date(user.created_at).toLocaleString()}</p>
        </div>

        {/* === NEW === */}
        <div>
          <strong>Typ účtu:</strong>
          <p className={isSeller ? "text-green-700" : "text-gray-600"}>
            {isSeller ? "Registrovaný predajca" : "Bežný používateľ"}
          </p>
        </div>

      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-3">Zmeniť meno</h2>

      {success && <p className="text-green-600 mb-3">{success}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleNameChange} className="flex flex-col gap-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {saving ? "Ukladám..." : "Uložiť meno"}
        </button>
      </form>

      <hr className="my-6" />

      {/* === NEW === */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Režim predajcu</h2>
        <p className="text-gray-700 mb-2">
          Aktivovaním sa zobrazíte v zozname predajcov.
        </p>

        <button
          onClick={handleSellerToggle}
          disabled={savingSeller}
          className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {savingSeller
            ? "Ukladám..."
            : isSeller
              ? "Vypnúť režim predajcu"
              : "Stať sa registrovaným predajcom"}
        </button>
      </div>

      <hr className="my-6" />

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-red-600 mb-3">
          Vymazať účet
        </h2>

        <p className="mb-3 text-gray-700">
          Po vymazaní účtu budú všetky údaje nenávratne odstránené.
        </p>

        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {deleting ? "Mažem účet..." : "Vymazať môj účet"}
        </button>
      </div>
    </div>
  );
}
