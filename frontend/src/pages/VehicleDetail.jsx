import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const images = vehicle?.images || [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      //if (!lightboxOpen) return;
      if (!images.length) return;

      if (e.key === "ArrowRight") {
        setCurrentImage((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowLeft") {
        setCurrentImage((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }

      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images.length]);



  useEffect(() => {
    fetch(`http://localhost:8000/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setVehicle(data);
        setLoading(false);
        setCurrentImage(0);
      });
  }, [id]);

  if (loading) return <p className="text-center mt-10">Načítavam...</p>;
  if (!vehicle) return <p className="text-center mt-10">Inzerát neexistuje</p>;

  

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Nadpis */}
      <h1 className="text-3xl font-bold mb-6">{vehicle.title}</h1>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Galéria */}
        <div className="lg:col-span-2">
          {images.length > 0 && (
            <>
              <div className="relative">
                <img
                  src={images[currentImage].url}
                  alt=""
                  onClick={() => setLightboxOpen(true)}
                  className="w-full h-[280px] sm:h-[380px] lg:h-[450px] object-cover rounded-xl"
                />

                {/* Šípky */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center hover:bg-black"
                    >
                      ‹
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center hover:bg-black"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Náhľady */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <img
                    key={img.id}
                    src={img.url}
                    onClick={() => setCurrentImage(index)}
                    className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 transition ${
                      index === currentImage
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detail box */}
        <div className="bg-white rounded-xl shadow p-6 h-fit">
          <p className="text-3xl font-bold text-blue-600 mb-4">
            {vehicle.price.toLocaleString()} €
          </p>

          <div className="space-y-2 text-sm">
            <div><strong>Značka:</strong> {vehicle.brand.name}</div>
            <div><strong>Model:</strong> {vehicle.model.name}</div>
            <div><strong>Rok:</strong> {vehicle.year}</div>
            <div><strong>Nájazd:</strong> {vehicle.mileage.toLocaleString()} km</div>
            <div><strong>Palivo:</strong> {vehicle.fuel}</div>
            <div><strong>Prevodovka:</strong> {vehicle.transmission}</div>
            <div><strong>Lokalita:</strong> {vehicle.location}</div>
          </div>
        </div>
      </div>

      {/* Popis */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-3">Popis</h2>
        <p className="text-gray-700 leading-relaxed">
          {vehicle.description}
        </p>
      </div>
      {/* LIGHTBOX */}
{lightboxOpen && (
  <div
    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    onClick={() => setLightboxOpen(false)}
  >
    {/* Zavrieť */}
    <button
      onClick={() => setLightboxOpen(false)}
      className="absolute top-5 right-5 text-white text-3xl"
    >
      ✕
    </button>

    {/* Predošlá */}
    {images.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
        className="absolute left-5 text-white text-5xl"
      >
        ‹
      </button>
    )}

    {/* Obrázok */}
    <img
      src={images[currentImage].url}
      alt=""
      onClick={(e) => e.stopPropagation()}
      className="max-h-[90vh] max-w-[90vw] object-contain rounded"
    />

    {/* Ďalšia */}
    {images.length > 1 && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
        className="absolute right-5 text-white text-5xl"
      >
        ›
      </button>
    )}
  </div>
)}

    </div>
  );
}
