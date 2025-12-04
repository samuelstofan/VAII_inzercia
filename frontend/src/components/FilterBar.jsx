export default function FilterBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">

      {/* Filter controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <select className="border rounded-lg px-3 py-2">
          <option>Značka</option>
        </select>

        <select className="border rounded-lg px-3 py-2">
          <option>Model</option>
        </select>

        <div>
          <label className="text-sm">Cena</label>
          <input type="range" min="0" max="100" className="w-full" />
        </div>

        <input className="border px-3 py-2 rounded-lg" placeholder="Hľadať v popise" />

        <input className="border px-3 py-2 rounded-lg" placeholder="km od" />
        <input className="border px-3 py-2 rounded-lg" placeholder="km do" />
        <input className="border px-3 py-2 rounded-lg" placeholder="Rok výroby od" />
        <input className="border px-3 py-2 rounded-lg" placeholder="Rok výroby do" />

        <select className="border rounded-lg px-3 py-2">
          <option>Palivo</option>
        </select>

        <button className="bg-blue-500 text-white px-5 py-2 rounded-lg">Viac</button>

      </div>

      <button className="w-full bg-black text-white py-2 rounded-md mt-5">Hľadať</button>
    </div>
  );
}
