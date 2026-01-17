import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }

    api
      .get("/api/user")
      .then((res) => {
        setIsAdmin(res.data?.role === "admin");
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [isAuthenticated]);

  return (
    <header className="header-container">
      <div className="inner">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="Logo" className="logo-img w-48 h-auto" />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="desktop-menu">
          <Link to="/pridat-inzerat">{t("header.addListing")}</Link>
          <Link to="/predajcovia">{t("header.sellers")}</Link>

          {isAuthenticated && (
            <Link to="/oblubene">{t("header.favorites")}</Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/spravy">{t("header.messages")}</Link>
              <Link to="/moj-ucet">{t("header.myAccount")}</Link>
              {isAdmin && <Link to="/admin/uzivatelia">{t("header.admin")}</Link>}
            </>
          ) : (
            <Link to="/registracia">{t("header.register")}</Link>
          )}
        </nav>

        {!isAuthenticated ? (
          <Link to="/prihlasenie" className="desktop-btn login">
            {t("header.login")}
          </Link>
        ) : (
          <button onClick={() => logout()} className="desktop-btn logout">
            {t("header.logout")}
          </button>
        )}

        {/* MOBILE MENU TOGGLE */}
        <button className="mobile-toggle" onClick={() => setOpen(!open)}>
          <img src="/menu-2.svg" alt="menu" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          <Link to="/pridat-inzerat" onClick={() => setOpen(false)}>
            {t("header.addListing")}
          </Link>

          <Link to="/predajcovia" onClick={() => setOpen(false)}>
            {t("header.sellers")}
          </Link>

          {isAuthenticated && (
            <Link to="/oblubene" onClick={() => setOpen(false)}>
              {t("header.favorites")}
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/spravy" onClick={() => setOpen(false)}>
                {t("header.messages")}
              </Link>
              <Link to="/moj-ucet" onClick={() => setOpen(false)}>
                {t("header.myAccount")}
              </Link>
              {isAdmin && (
                <Link to="/admin/uzivatelia" onClick={() => setOpen(false)}>
                  {t("header.admin")}
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="logout-btn"
              >
                {t("header.logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/registracia" onClick={() => setOpen(false)}>
                {t("header.register")}
              </Link>

              <Link
                to="/prihlasenie"
                className="login-btn"
                onClick={() => setOpen(false)}
              >
                {t("header.login")}
              </Link>
            </>
          )}

        </div>
      )}
    </header>
  );
}
