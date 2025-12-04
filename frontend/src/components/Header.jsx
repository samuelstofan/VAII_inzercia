import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-500 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">

        <Link to="/" className="text-2xl font-bold">Logo</Link>

        <nav className="flex gap-6 text-lg">
          <Link to="/pridat-inzerat" className="hover:text-gray-200">Pridať inzerát</Link>
          <Link to="/predajcovia" className="hover:text-gray-200">Zoznam predajcov</Link>
          <Link to="/registracia" className="hover:text-gray-200">Registrácia</Link>
        </nav>

        <Link
          to="/prihlasenie"
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Prihlásiť
        </Link>

      </div>
    </header>
  );
}
