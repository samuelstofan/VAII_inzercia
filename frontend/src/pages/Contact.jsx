export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Kontakt</h1>
      <p className="text-gray-700 mb-4">
        Máte otázku k inzerátu alebo potrebujete pomoc? Ozvite sa nám.
      </p>
      <div className="bg-white rounded-lg shadow p-6 space-y-3">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-gray-900">podpora@loremipsum.sk</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Telefón</p>
          <p className="text-gray-900">+421 900 123 456</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Adresa</p>
          <p className="text-gray-900">Žilina, Slovensko</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pracovné hodiny</p>
          <p className="text-gray-900">Po–Pia: 9:00 – 17:00</p>
        </div>
      </div>
    </div>
  );
}
