import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  const images = vehicle?.images || [];
  const features = vehicle?.features || [];
  const fuelCode = vehicle?.fuel?.code || "";
  const transmissionCode = vehicle?.transmission?.code || "";
  const featureLabelMap = {
    tempomat: "feature.cruiseControl",
    "adaptivny tempomat": "feature.adaptiveCruiseControl",
    "stresne okno": "feature.sunroof",
    klimatizacia: "feature.airConditioning",
    "automaticka klimatizacia": "feature.autoClimate",
    "parkovacie senzory": "feature.parkingSensors",
    "parkovacia kamera": "feature.parkingCamera",
    navigacia: "feature.navigation",
    bluetooth: "feature.bluetooth",
    "android auto": "feature.androidAuto",
    "apple carplay": "feature.appleCarPlay",
    "vyhrievane sedadla": "feature.heatedSeats",
    "kozeny interier": "feature.leatherInterior",
    "led svetla": "feature.ledLights",
    "xenonove svetla": "feature.xenonLights",
    "elektricke okna": "feature.powerWindows",
    "elektricke spatne zrkadla": "feature.powerMirrors",
    "asistent rozjazdu do kopca": "feature.hillStartAssist",
    "sledovanie mrtveho uhla": "feature.blindSpot",
    "bezklicove startovanie": "feature.keylessStart",
    "head-up displej": "feature.headUpDisplay",
    "tazne zariadenie": "feature.towBar",
  };
  const fuelLabel =
    {
      petrol: t("addListing.fuelPetrol"),
      diesel: t("addListing.fuelDiesel"),
      electric: t("addListing.fuelElectric"),
      hybrid: t("addListing.fuelHybrid"),
      lpg: t("addListing.fuelLpg"),
    }[fuelCode] || vehicle?.fuel?.label || fuelCode || "";
  const transmissionLabel =
    {
      manual: t("addListing.transmissionManual"),
      automatic: t("addListing.transmissionAutomatic"),
    }[transmissionCode] || vehicle?.transmission?.label || transmissionCode || "";
  const driveCode = vehicle?.drive?.code || "";
  const driveLabel =
    {
      fwd: t("drive.fwd"),
      rwd: t("drive.rwd"),
      awd: t("drive.awd"),
    }[driveCode] || vehicle?.drive?.label || driveCode || "";

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!images.length) return;

      if (event.key === "ArrowRight") {
        setCurrentImage((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      }

      if (event.key === "ArrowLeft") {
        setCurrentImage((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }

      if (event.key === "Escape") {
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
        setIsAdmin(res.data?.role === "admin");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isAuthenticated]);

  if (loading) return <p className="text-center mt-10">{t("common.loading")}</p>;
  if (!vehicle)
    return <p className="text-center mt-10">{t("vehicleDetail.notFound")}</p>;

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

    const confirmed = window.confirm(t("vehicleDetail.confirmDelete"));
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

  const handleSendMessage = () => {
    setContactOpen(false);
    navigate(`/spravy?user=${vehicle.user?.id}&vehicle=${vehicle.id}`);
  };

  const handleReportListing = async (customMessage) => {
    if (!isAuthenticated) {
      navigate("/prihlasenie");
      return;
    }
    if (!vehicle?.id || reporting) return;

    setReporting(true);
    try {
      const trimmed = (customMessage || "").trim();
      const baseMessage = `${t("vehicleDetail.reportMessage")} ${vehicle.title} (#${vehicle.id}).`;
      const message = trimmed ? `${baseMessage} \n${trimmed}` : baseMessage;
      await api.post(`/api/vehicles/${vehicle.id}/report`, { message });
      setReportMessage("");
      setReportOpen(false);
    } catch (err) {
      console.error(err);
      alert(t("vehicleDetail.reportError"));
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="vehicle-detail">
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
              alt={
                isFavorite
                  ? t("vehicleDetail.favoriteRemoveAlt")
                  : t("vehicleDetail.favoriteAddAlt")
              }
              className="vehicle-detail__favorite-icon"
            />
          </button>
        )}
        <h1 className="vehicle-detail__title">{vehicle.title}</h1>
      </div>

      <div className="vehicle-detail__layout">
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

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="vehicle-detail__nav vehicle-detail__nav--prev"
                    >
                      <img
                        src="/chevron-left.svg"
                        alt={t("vehicleDetail.previous")}
                        className="vehicle-detail__nav-icon"
                      />
                    </button>

                    <button
                      onClick={nextImage}
                      className="vehicle-detail__nav vehicle-detail__nav--next"
                    >
                      <img
                        src="/chevron-right.svg"
                        alt={t("vehicleDetail.next")}
                        className="vehicle-detail__nav-icon"
                      />
                    </button>
                  </>
                )}
              </div>

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

        <div className="vehicle-detail__box">
          <p className="vehicle-detail__price">
            {vehicle.price.toLocaleString()} EUR
          </p>

          <div className="vehicle-detail__specs">
            <div>
              <strong>{t("vehicleDetail.brandLabel")}</strong> {vehicle.brand.name}
            </div>
            <div>
              <strong>{t("vehicleDetail.modelLabel")}</strong> {vehicle.model.name}
            </div>
            <div>
              <strong>{t("vehicleDetail.yearLabel")}</strong> {vehicle.year}
            </div>
            <div>
              <strong>{t("vehicleDetail.mileageLabel")}</strong>{" "}
              {vehicle.mileage.toLocaleString()} km
            </div>
            <div>
              <strong>{t("vehicleDetail.fuelLabel")}</strong> {fuelLabel}
            </div>
            <div>
              <strong>{t("vehicleDetail.transmissionLabel")}</strong>{" "}
              {transmissionLabel}
            </div>
            <div>
              <strong>{t("vehicleDetail.driveLabel")}</strong> {driveLabel || "-"}
            </div>
            <div>
              <strong>{t("vehicleDetail.locationLabel")}</strong> {vehicle.location}
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              {t("vehicleDetail.contactTitle")}
            </h3>
            <div className="flex items-center gap-2">
              {vehicle.user?.email || vehicle.user?.phone ? (
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  {t("vehicleDetail.contactButton")}
                </button>
              ) : (
                <p className="text-sm text-gray-600">
                  {t("vehicleDetail.contactUnavailable")}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/prihlasenie");
                    return;
                  }
                  setReportOpen(true);
                }}
                className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                aria-label={t("vehicleDetail.reportTitle")}
                title={t("vehicleDetail.reportTitle")}
                disabled={reporting}
              >
                <img src="/flag.svg" alt="" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {features.length > 0 && (
        <div className="vehicle-detail__features">
          <h2 className="vehicle-detail__section-title">
            {t("vehicleDetail.featuresTitle")}
          </h2>
          <ul className="vehicle-detail__features-list">
            {features.map((feature) => {
              const featureKey =
                featureLabelMap[String(feature.name || "").toLowerCase()];
              const featureLabel = featureKey
                ? t(featureKey)
                : feature.name;
              return (
                <li key={feature.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span>{featureLabel}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="vehicle-detail__description">
        <h2 className="vehicle-detail__section-title">
          {t("vehicleDetail.descriptionTitle")}
        </h2>
        <pre className="vehicle-detail__description-text whitespace-pre-wrap">
          {vehicle.description}
        </pre>
      </div>

      {isAuthenticated && (currentUserId === vehicle.user?.id || isAdmin) && (
        <div className="mt-6 flex flex-col items-end gap-2">
          {isAdmin && currentUserId !== vehicle.user?.id && (
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t("vehicleDetail.adminBadge")}
            </span>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleEditListing}
              className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md"
            >
              {t("vehicleDetail.editButton")}
            </button>
            <button
              type="button"
              onClick={handleDeleteListing}
              className="bg-red-600 text-white px-5 py-2 rounded-md"
            >
              {t("vehicleDetail.deleteButton")}
            </button>
          </div>
        </div>
      )}

      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {t("vehicleDetail.contactModalTitle")}
              </h3>
              <button
                type="button"
                className="text-gray-500"
                onClick={() => setContactOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">
                  {t("vehicleDetail.emailLabel")}
                </span>{" "}
                {vehicle.user?.email || "-"}
              </div>
              <div>
                <span className="font-semibold">
                  {t("vehicleDetail.phoneLabel")}
                </span>{" "}
                {vehicle.user?.phone || "-"}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSendMessage}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                {t("vehicleDetail.sendMessage")}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setReportOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {t("vehicleDetail.reportModalTitle")}
              </h3>
              <button
                type="button"
                className="text-gray-500"
                onClick={() => setReportOpen(false)}
              >
                &times;
              </button>
            </div>
            <textarea
              value={reportMessage}
              onChange={(event) => setReportMessage(event.target.value)}
              placeholder={t("vehicleDetail.reportPlaceholder")}
              className="w-full border rounded-md p-3 text-sm"
              rows={3}
              maxLength={300}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setReportOpen(false)}
              >
                {t("vehicleDetail.reportCancel")}
              </button>
              <button
                type="button"
                onClick={() => handleReportListing(reportMessage)}
                className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
                disabled={reporting}
              >
                {reporting
                  ? t("vehicleDetail.reportSending")
                  : t("vehicleDetail.reportSend")}
              </button>
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            &times;
          </button>

          {images.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                prevImage();
              }}
              className="absolute left-5 text-white text-5xl"
            >
              <img
                src="/chevron-left.svg"
                alt={t("vehicleDetail.previous")}
                className="vehicle-detail__nav-icon"
              />
            </button>
          )}

          <img
            src={images[currentImage].url}
            alt=""
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded"
          />

          {images.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-5 text-white text-5xl"
            >
              <img
                src="/chevron-right.svg"
                alt={t("vehicleDetail.next")}
                className="vehicle-detail__nav-icon"
              />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
