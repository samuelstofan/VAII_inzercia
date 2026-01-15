import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const images = vehicle?.images || [];
  const fuelLabel = vehicle?.fuel?.label || vehicle?.fuel?.code || "";
  const transmissionLabel =
    vehicle?.transmission?.label || vehicle?.transmission?.code || "";
  const driveLabel = vehicle?.drive?.label || vehicle?.drive?.code || "";

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
    api
      .get(`/api/vehicles/${id}`)
      .then((res) => {
        setVehicle(res.data);
        setIsFavorite(Boolean(res.data?.is_favorite));
        setLoading(false);
        setCurrentImage(0);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) return;

    api
      .get("/api/user")
      .then((res) => {
        setCurrentUserId(res.data?.id ?? null);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isAuthenticated]);

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

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate("/prihlasenie");
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/api/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async () => {
    if (!isAuthenticated || !vehicle?.id) return;

    const confirmed = window.confirm("Naozaj chcete odstrániť inzerát?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/vehicles/${vehicle.id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditListing = () => {
    if (!vehicle?.id) return;
    navigate(`/upravit-inzerat/${vehicle.id}`);
  };

  return (
    <div className="vehicle-detail">
      {/* Nadpis */}
      <div className="vehicle-detail__title-row">
        {isAuthenticated && (
          <button
            type="button"
            onClick={handleFavoriteToggle}
            className="vehicle-detail__favorite-btn"
            aria-pressed={isFavorite}
          >
            <img
              src={isFavorite ? "/heart-full.svg" : "/heart.svg"}
              alt={isFavorite ? "Remove favorite" : "Add favorite"}
              className="vehicle-detail__favorite-icon"
            />
          </button>
        )}
        <h1 className="vehicle-detail__title">{vehicle.title}</h1>
      </div>

      {/* Layout */}
      <div className="vehicle-detail__layout">
        {/* Galéria */}
        <div className="vehicle-detail__gallery">
          {images.length > 0 && (
            <>
              <div className="relative">
                <img
                  src={images[currentImage].url}
                  alt=""
                  onClick={() => setLightboxOpen(true)}
                  className="vehicle-detail__image"
                />

                {/* Šípky */}
                {images.length > 1 && (
                  <>
                  <button
                    onClick={prevImage}
                    className="vehicle-detail__nav vehicle-detail__nav--prev"
                  >
                    <img
                      src="/chevron-left.svg"
                      alt="Previous"
                      className="vehicle-detail__nav-icon"
                    />
                  </button>

                  <button
                    onClick={nextImage}
                    className="vehicle-detail__nav vehicle-detail__nav--next"
                  >
                    <img
                      src="/chevron-right.svg"
                      alt="Next"
                      className="vehicle-detail__nav-icon"
                    />
                  </button>
                  </>
                )}
              </div>

              {/* Náhľady */}
              <div className="vehicle-detail__thumbs">
                {images.map((img, index) => (
                  <img
                    key={img.id}
                    src={img.url}
                    onClick={() => setCurrentImage(index)}
                    className={`vehicle-detail__thumb ${
                      index === currentImage ? "is-active" : ""
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detail box */}
        <div className="vehicle-detail__box">
          <p className="vehicle-detail__price">
            {vehicle.price.toLocaleString()} €
          </p>

          <div className="vehicle-detail__specs">
            <div><strong>Značka:</strong> {vehicle.brand.name}</div>
            <div><strong>Model:</strong> {vehicle.model.name}</div>
            <div><strong>Rok:</strong> {vehicle.year}</div>
            <div><strong>Nájazd:</strong> {vehicle.mileage.toLocaleString()} km</div>
            <div><strong>Palivo:</strong> {fuelLabel}</div>
            <div><strong>Prevodovka:</strong> {transmissionLabel}</div>
            <div><strong>Pohon:</strong> {driveLabel || "-"}</div>
            <div><strong>Lokalita:</strong> {vehicle.location}</div>
          </div>
        </div>
      </div>

      {/* Popis */}
      <div className="vehicle-detail__description">
        <h2 className="vehicle-detail__section-title">Popis</h2>
        <pre className="vehicle-detail__description-text whitespace-pre-wrap">
          {vehicle.description}
        </pre>
      </div>

      {isAuthenticated && currentUserId === vehicle.user?.id && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleEditListing}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md"
          >
            Upraviť inzerát
          </button>
          <button
            type="button"
            onClick={handleDeleteListing}
            className="bg-red-600 text-white px-5 py-2 rounded-md"
          >
            Odstrániť inzerát
          </button>
        </div>
      )}
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
