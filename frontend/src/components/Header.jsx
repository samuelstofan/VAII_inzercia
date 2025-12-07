import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header-container">
      <div className="inner">

        <Link to="/" className="logo-link">
          <img
            src={isHovered ? "/logoHover.png" : "/logo.png"}
            alt="Logo"
            className="logo-img"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="desktop-menu">

          <Link to="/pridat-inzerat">
            Pridať inzerát
          </Link>

          <Link to="/predajcovia">
            Zoznam predajcov
          </Link>

          {isAuthenticated ? (
            <Link to="/moj-ucet">
              Môj účet
            </Link>
          ) : (
            <Link to="/registracia">
              Registrácia
            </Link>
          )}

        </nav>

        {!isAuthenticated ? (
          <Link
            to="/prihlasenie"
            className="desktop-btn login"
          >
            Prihlásiť
          </Link>
        ) : (
          <button
            onClick={() => logout()}
            className="desktop-btn logout"
          >
            Odhlásiť
          </button>
        )}

        {/* MOBILE MENU TOGGLE */}
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          ☰
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

          {isAuthenticated ? (
            <>
              <Link to="/moj-ucet" onClick={() => setOpen(false)}>
                Môj účet
              </Link>

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
