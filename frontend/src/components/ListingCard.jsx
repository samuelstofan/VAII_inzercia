import { Link } from "react-router-dom";

export default function ListingCard({ vehicle }) {
  const primaryImage =
    vehicle.images?.find((img) => img.is_primary)?.url ||
    vehicle.images?.[0]?.url;
  const getLabel = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.label || value.code || "";
  };
  const fuelLabel = getLabel(vehicle.fuel);

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="block border rounded-xl shadow-sm p-6 flex gap-6 bg-white hover:shadow-md transition"
    >
      <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={vehicle.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400"></span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-xl">{vehicle.title}</h3>

        <p className="text-gray-600 text-base">
          {fuelLabel} - {vehicle.year} - {vehicle.mileage.toLocaleString()} km -{" "}
          {vehicle.location}
        </p>

        <p className="font-semibold mt-2 text-lg">
          {vehicle.price.toLocaleString()} EUR
        </p>
      </div>
    </Link>
  );
}
