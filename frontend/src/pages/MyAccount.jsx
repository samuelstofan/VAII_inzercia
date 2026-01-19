import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function MyAccount() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [savingSeller, setSavingSeller] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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
        setNewPhone(res.data.phone ?? "");
        setIsSeller(res.data.is_seller ?? false);
      } catch (err) {
        console.error(err);
        setLoadError(t("myAccount.errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, navigate, t]);

  const handleNameChange = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (!newName.trim()) {
      setFormError(t("myAccount.errorEmptyName"));
      return;
    }

    try {
      setSaving(true);

      const res = await api.put("/api/user/update", {
        name: newName,
        phone: newPhone,
      });

      setUser(res.data.user);
      setSuccess(t("myAccount.successName"));
    } catch (err) {
      console.error(err);
      setFormError(t("myAccount.errorUpdate"));
    } finally {
      setSaving(false);
    }
  };

  const handleSellerToggle = async () => {
    setSavingSeller(true);
    setFormError("");
    setSuccess("");

    try {
      const res = await api.put("/api/user/update", {
        is_seller: !isSeller,
      });

      setUser(res.data.user);
      setIsSeller(res.data.user.is_seller);
      setSuccess(t("myAccount.successSeller"));
    } catch (err) {
      console.error(err);
      setFormError(t("myAccount.errorSeller"));
    } finally {
      setSavingSeller(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(t("myAccount.confirmDelete"));
    if (!confirmDelete) return;

    try {
      setDeleting(true);

      await api.post("/logout");
      logout();
      await api.delete("/api/user/delete");

      alert(t("myAccount.alertDeleted"));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(t("myAccount.alertDeleteError"));
    } finally {
      setDeleting(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError(t("myAccount.passwordErrorMismatch"));
      return;
    }

    try {
      setPasswordSaving(true);
      await api.put("/api/user/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(t("myAccount.passwordSuccess"));
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || t("myAccount.passwordErrorGeneric");
      setPasswordError(message);
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">{t("myAccount.loading")}</div>;
  }

  if (loadError) {
    return <div className="text-center text-red-600 mt-10">{loadError}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10">{t("myAccount.userMissing")}</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="flex items-center justify-end mb-2">
        <Link to="/" className="text-blue-600">
          {t("common.backHome")}
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {t("myAccount.title")}
        </h1>

        <div className="space-y-4 text-lg">
          <div>
            <strong>{t("myAccount.nameLabel")}</strong>
            <p>{user.name}</p>
          </div>

          <div>
            <strong>{t("myAccount.emailLabel")}</strong>
            <p>{user.email}</p>
          </div>

          <div>
            <strong>{t("myAccount.phoneLabel")}</strong>
            <p>{user.phone || "-"}</p>
          </div>

          <div>
            <strong>{t("myAccount.createdAtLabel")}</strong>
            <p>{new Date(user.created_at).toLocaleString()}</p>
          </div>

          <div>
            <strong>{t("myAccount.accountTypeLabel")}</strong>
            <p className={isSeller ? "text-green-700" : "text-gray-600"}>
              {isSeller
                ? t("myAccount.accountTypeSeller")
                : t("myAccount.accountTypeUser")}
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-3">
          {t("myAccount.sectionEditTitle")}
        </h2>

        {success && <p className="text-green-600 mb-3">{success}</p>}
        {formError && <p className="text-red-600 mb-3">{formError}</p>}

        <form onSubmit={handleNameChange} className="flex flex-col gap-3">
          <label className="text-sm text-gray-600">
            {t("myAccount.formPhoneLabel")}
          </label>
          <input
            type="tel"
            value={newPhone}
            onChange={(event) => setNewPhone(event.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="+421..."
          />
          <label className="text-sm text-gray-600">
            {t("myAccount.formNameLabel")}
          </label>
          <input
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className="border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white py-2 rounded disabled:opacity-50"
          >
            {saving ? t("myAccount.saving") : t("myAccount.save")}
          </button>
        </form>

        <hr className="my-6" />

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">
            {t("myAccount.passwordSectionTitle")}
          </h2>

          {passwordSuccess && (
            <p className="text-green-600 mb-3">{passwordSuccess}</p>
          )}
          {passwordError && (
            <p className="text-red-600 mb-3">{passwordError}</p>
          )}

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
            <label className="text-sm text-gray-600">
              {t("myAccount.currentPasswordLabel")}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <label className="text-sm text-gray-600">
              {t("myAccount.newPasswordLabel")}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <label className="text-sm text-gray-600">
              {t("myAccount.confirmPasswordLabel")}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="border px-3 py-2 rounded"
              required
            />
            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {passwordSaving
                ? t("myAccount.passwordSaving")
                : t("myAccount.passwordSave")}
            </button>
          </form>
        </div>

        <hr className="my-6" />

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">
            {t("myAccount.sellerModeTitle")}
          </h2>
          <p className="text-gray-700 mb-2">
            {t("myAccount.sellerModeDescription")}
          </p>

          <button
            onClick={handleSellerToggle}
            disabled={savingSeller}
            className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {savingSeller
              ? t("myAccount.sellerModeSaving")
              : isSeller
                ? t("myAccount.sellerModeDisable")
                : t("myAccount.sellerModeEnable")}
          </button>
        </div>

        <hr className="my-6" />

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-red-600 mb-3">
            {t("myAccount.deleteTitle")}
          </h2>

          <p className="mb-3 text-gray-700">
            {t("myAccount.deleteDescription")}
          </p>

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {deleting
              ? t("myAccount.deleteButtonLoading")
              : t("myAccount.deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
