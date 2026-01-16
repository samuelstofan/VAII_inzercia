import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <h2 className="footer-logo">
          <img src="/logo.png" alt="Logo" />
        </h2>

        <div className="footer-grid">
          <div>
            <h3 className="footer-column-title">O nás</h3>
            <p>
              <Link to="/kontakt">Kontakt</Link>
            </p>
            <p>
              <Link to="/o-nas">O nás</Link>
            </p>
          </div>

          <div>
            <h3 className="footer-column-title">Podpora</h3>
            <p>Nahlásenie inzerátu</p>
            <p>
              <Link to="/faq">FAQ</Link>
            </p>
          </div>

          {!isAuthenticated && (
            <div className="footer-actions">
              <Link
                to="/registracia"
                className="footer-button footer-button--inverse"
              >
                Registrovať
              </Link>
              <Link
                to="/prihlasenie"
                className="footer-button footer-button--inverse"
              >
                Prihlásiť
              </Link>
            </div>
          )}
        </div>

        <div className="footer-socials">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <img src="/brand-facebook.svg" alt="Facebook" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <img src="/brand-instagram.svg" alt="Instagram" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
          >
            <img src="/brand-x.svg" alt="X" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <img src="/brand-linkedin.svg" alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
}
