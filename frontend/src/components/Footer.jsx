import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <h2 className="footer-logo">
          <img src="/logo.png" alt="Logo" />
        </h2>

        <div className="footer-grid">
          <div>
            <h3 className="footer-column-title">{t("footer.about")}</h3>
            <p>
              <Link to="/kontakt">{t("footer.contact")}</Link>
            </p>
            <p>
              <Link to="/o-nas">{t("footer.about")}</Link>
            </p>
          </div>

          <div>
            <h3 className="footer-column-title">{t("footer.support")}</h3>
            <p>{t("footer.reportListing")}</p>
            <p>
              <Link to="/faq">{t("footer.faq")}</Link>
            </p>
          </div>

          {!isAuthenticated && (
            <div className="footer-actions">
              <Link
                to="/registracia"
                className="footer-button footer-button--inverse"
              >
                {t("footer.register")}
              </Link>
              <Link
                to="/prihlasenie"
                className="footer-button footer-button--primary"
              >
                {t("footer.login")}
              </Link>
            </div>
          )}
        </div>

        <div className="footer-socials">
          <div className="lang-toggle">
            <button
              type="button"
              className={language === "sk" ? "is-active" : ""}
              onClick={() => setLanguage("sk")}
              aria-pressed={language === "sk"}
            >
              SK
            </button>
            <button
              type="button"
              className={language === "en" ? "is-active" : ""}
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>
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
