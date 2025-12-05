import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header-container text-white relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">

        <Link to="/" className="text-2xl font-bold">
          <img
            src={isHovered ? "/logoHover.png" : "/logo.png"}
            alt="Logo"
            className="h-10 w-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex gap-6 text-lg">

          <Link to="/pridat-inzerat" className="hover:text-gray-200">
            Pridať inzerát
          </Link>

          <Link to="/predajcovia" className="hover:text-gray-200">
            Zoznam predajcov
          </Link>

          {isAuthenticated ? (
            <Link to="/moj-ucet" className="hover:text-gray-200">
              Môj účet
            </Link>
          ) : (
            <Link to="/registracia" className="hover:text-gray-200">
              Registrácia
            </Link>
          )}

        </nav>

        {!isAuthenticated ? (
          <Link
            to="/prihlasenie"
            className="hidden md:block bg-black text-white px-4 py-2 rounded-md"
          >
            Prihlásiť
          </Link>
        ) : (
          <button
            onClick={logout}
            className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Odhlásiť
          </button>
        )}

      {/* MOBILE MENU */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-blue-500 flex flex-col gap-4 py-4 px-6 text-lg">


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
                className="text-left bg-red-600 px-4 py-2 rounded-md text-white"
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
                className="bg-black px-4 py-2 rounded-md text-white"
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
