import { Link } from "react-router-dom";

export default function ListingCard({ vehicle }) {
  const primaryImage =
    vehicle.images?.find((img) => img.is_primary)?.url ||
    vehicle.images?.[0]?.url;

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="block border rounded-lg shadow-sm p-4 flex gap-4 bg-white hover:shadow-md transition"
    >
      <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={vehicle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">🖼</span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-lg">{vehicle.title}</h3>

        <p className="text-gray-600 text-sm">
          {vehicle.year} • {vehicle.mileage.toLocaleString()} km •{" "}
          {vehicle.location}
        </p>

        <p className="font-semibold mt-1">
          {vehicle.price.toLocaleString()} €
        </p>
      </div>
    </Link>
  );
}
