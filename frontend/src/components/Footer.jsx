export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-10 py-10">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold mb-6">Logo</h2>

        <div className="grid grid-cols-3 gap-6 mb-10">

          <div>
            <h3 className="font-semibold mb-3">O nás</h3>
            <p>Kontakt</p>
            <p>O nás</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Podpora</h3>
            <p>Nahlásenie inzerátu</p>
            <p>FAQ</p>
          </div>

          <div className="flex flex-col gap-3">
            <button className="bg-black text-white px-5 py-2 rounded-md w-fit">Registrovať</button>
            <button className="bg-blue-500 text-white px-5 py-2 rounded-md w-fit">Prihlásiť</button>
          </div>

        </div>

        <div className="flex gap-4 text-xl">
          <span>📘</span>
          <span>🔗</span>
          <span>▶️</span>
          <span>📸</span>
        </div>

      </div>
    </footer>
  );
}
