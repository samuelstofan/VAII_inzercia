import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVehicle(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Načítavam...</p>;
  if (!vehicle) return <p>Inzerát neexistuje</p>;
  console.log("V:",vehicle.images);
  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4">{vehicle.title}</h1>

        
      {/* Obrázky */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {vehicle.images?.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt=""
            className="w-full h-40 object-cover rounded"
          />
        ))}
      </div>

      <p className="text-xl font-semibold mb-2">
        {vehicle.price.toLocaleString()} €
      </p>

      <p className="text-gray-700 mb-4">{vehicle.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Značka:</strong> {vehicle.brand.name}</div>
        <div><strong>Model:</strong> {vehicle.model.name}</div>
        <div><strong>Rok:</strong> {vehicle.year}</div>
        <div><strong>Nájazd:</strong> {vehicle.mileage.toLocaleString()} km</div>
        <div><strong>Palivo:</strong> {vehicle.fuel}</div>
        <div><strong>Prevodovka:</strong> {vehicle.transmission}</div>
        <div><strong>Lokalita:</strong> {vehicle.location}</div>
      </div>
    </div>
  );
}
