import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { isAuthenticated, logout } = useAuth();

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
          <img
            src="/logo.png"
            alt="Logo"
            className="logo-img w-48 h-auto"
          />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="desktop-menu">
          <Link to="/pridat-inzerat">Pridať inzerát</Link>

          <Link to="/predajcovia">Zoznam predajcov</Link>

          {isAuthenticated && (
            <Link to="/oblubene">Obľúbené inzeráty</Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/spravy">Správy</Link>
              <Link to="/moj-ucet">Môj účet</Link>
              {isAdmin && <Link to="/admin/uzivatelia">Admin</Link>}
            </>
          ) : (
            <Link to="/registracia">Registrácia</Link>
          )}
        </nav>

        {!isAuthenticated ? (
          <Link to="/prihlasenie" className="desktop-btn login">
            Prihlásiť
          </Link>
        ) : (
          <button onClick={() => logout()} className="desktop-btn logout">
            Odhlásiť
          </button>
        )}

        {/* MOBILE MENU TOGGLE */}
        <button className="mobile-toggle" onClick={() => setOpen(!open)}>
          ?
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          <Link to="/pridat-inzerat" onClick={() => setOpen(false)}>
            Pridať inzerát
          </Link>

          <Link to="/predajcovia" onClick={() => setOpen(false)}>
            Zoznam predajcov
          </Link>

          {isAuthenticated && (
            <Link to="/oblubene" onClick={() => setOpen(false)}>
              Obľúbené inzeráty
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/spravy" onClick={() => setOpen(false)}>
                Správy
              </Link>
              <Link to="/moj-ucet" onClick={() => setOpen(false)}>
                Môj účet
              </Link>
              {isAdmin && (
                <Link to="/admin/uzivatelia" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="logout-btn"
              >
                Odhlásiť
              </button>
            </>
          ) : (
            <>
              <Link to="/registracia" onClick={() => setOpen(false)}>
                Registrácia
              </Link>

              <Link
                to="/prihlasenie"
                className="login-btn"
                onClick={() => setOpen(false)}
              >
                Prihlásiť
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
