export default function ListingCard({ title }) {
  return (
    <div className="border rounded-lg shadow-sm p-4 flex gap-4 bg-white">
      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-400">🖼</span>
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">
          Body text for whatever you'd like to say. Add main takeaway points or a short story.
        </p>
        <button className="border mt-3 px-4 py-1 rounded-md">Kontaktovať</button>
      </div>
    </div>
  );
}
