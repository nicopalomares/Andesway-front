import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {supabase} from "../services/supabase";
import {Vehicle, CarImage} from "../types";
import {
  Users,
  Settings,
  Calendar,
  ChevronLeft,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Fuel,
  Car as CarIcon,
  Loader2,
  X,
} from "lucide-react";
import {motion, AnimatePresence} from "motion/react";
import {format, differenceInDays} from "date-fns";
import CalendarPicker from "../components/Calendar";

export default function VehicleDetail() {
  const {id} = useParams<{id: string}>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [unavailabilities, setUnavailabilities] = useState<any[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({start: null, end: null});
  const [pickupLocation, setPickupLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");

  useEffect(() => {
    async function fetchVehicleData() {
      if (!supabase || !id) return;

      setLoading(true);
      try {
        // Fetch vehicle details with images joined
        const {data: carData, error: carError} = await supabase
          .from("cars")
          .select("*, car_images(*)")
          .eq("id", id)
          .single();

        if (carError) throw carError;
        const vehicleData = carData as Vehicle;
        setVehicle(vehicleData);
        setActiveImage(vehicleData.preview_image_url);
        if (vehicleData.car_images) {
          setImages(vehicleData.car_images);
        }

        // Fetch unavailabilities for the calendar
        const {data: unavailData} = await supabase
          .from("car_unavailability")
          .select("*")
          .eq("car_id", id);
        if (unavailData) setUnavailabilities(unavailData);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicleData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2
          className="animate-spin text-brand-orange"
          size={48}
        />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-display font-bold text-brand-navy mb-4">
          Vehículo no encontrado
        </h2>
        <Link
          to="/"
          className="btn-primary px-8">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const whatsappNumber = "5492617608355";

  const effectiveLocation =
    pickupLocation === "Otra ubicación"
      ? customLocation.trim()
      : pickupLocation;
  const canSubmit = !!(dateRange.start && dateRange.end && effectiveLocation);

  const buildPickupWhatsappUrl = () => {
    if (!dateRange.start || !dateRange.end || !effectiveLocation) return "#";
    const isSingleDay =
      format(dateRange.start, "dd/MM/yyyy") ===
      format(dateRange.end, "dd/MM/yyyy");
    const dateStr = isSingleDay
      ? format(dateRange.start, "dd/MM/yyyy")
      : `${format(dateRange.start, "dd/MM/yyyy")} al ${format(dateRange.end, "dd/MM/yyyy")}`;
    const msg = encodeURIComponent(
      `Hola! Quisiera consultar sobre un retiro.\n� Vehículo: ${vehicle.title} (Modelo ${vehicle.year})\n�📍 Lugar de retiro: ${effectiveLocation}\n📅 Fecha/s: ${dateStr}`,
    );
    return `https://wa.me/${whatsappNumber}?text=${msg}`;
  };

  const allImages = [
    {id: "preview", image_url: vehicle.preview_image_url},
    ...images.map((img) => ({id: img.id, image_url: img.image_url})),
  ];

  return (
    <>
      <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs / Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors mb-8 group">
            <ChevronLeft
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Volver a la flota</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Gallery */}
            <div className="space-y-4">
              <motion.div
                layoutId={`image-${vehicle.id}`}
                className="aspect-16/10 rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.3}}
                    src={activeImage}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </motion.div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {allImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.image_url)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === img.image_url
                          ? "border-brand-orange scale-95 shadow-inner"
                          : "border-transparent hover:border-gray-200"
                      }`}>
                      <img
                        src={img.image_url}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {vehicle.category}
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Disponible
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-2">
                  {vehicle.title}
                </h1>
                <p className="text-xl text-gray-500">Modelo {vehicle.year}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                  <Users
                    className="mx-auto text-brand-orange mb-2"
                    size={24}
                  />
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Pasajeros
                  </p>
                  <p className="font-bold text-brand-navy">
                    {vehicle.passengers}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                  <Settings
                    className="mx-auto text-brand-orange mb-2"
                    size={24}
                  />
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Caja
                  </p>
                  <p className="font-bold text-brand-navy capitalize">
                    {vehicle.transmission}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                  <Fuel
                    className="mx-auto text-brand-orange mb-2"
                    size={24}
                  />
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Motor
                  </p>
                  <p className="font-bold text-brand-navy">Nafta / Diesel</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                  <CarIcon
                    className="mx-auto text-brand-orange mb-2"
                    size={24}
                  />
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Aire
                  </p>
                  <p className="font-bold text-brand-navy">Climatizador</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
                <h3 className="text-lg font-bold text-brand-navy mb-4">
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {vehicle.description ||
                    "Este vehículo está equipado con todas las comodidades necesarias para garantizar un viaje seguro y placentero por las rutas de los Andes. Mantenimiento al día y seguro contra todo riesgo incluido."}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2
                      className="text-green-500"
                      size={18}
                    />
                    <span>Kilometraje libre</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2
                      className="text-green-500"
                      size={18}
                    />
                    <span>Seguro contra todo riesgo</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck
                      className="text-green-500"
                      size={18}
                    />
                    <span>Asistencia en ruta 24/7</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto bg-brand-navy text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-white/60 text-sm mb-1 uppercase font-bold tracking-widest">
                    Precio por día
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-brand-orange">
                      ${vehicle.price_per_day}
                    </span>
                    <span className="text-white/60">USD</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/20">
                  <Calendar size={24} />
                  Elegir fechas y reservar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Modal */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) =>
              e.target === e.currentTarget && setShowCalendar(false)
            }>
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: 20}}
              transition={{type: "spring", stiffness: 300, damping: 25}}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-display font-bold text-brand-navy">
                    Seleccioná las fechas
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {vehicle.title} · ${vehicle.price_per_day} USD/día
                  </p>
                </div>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              {/* Calendar */}
              <div className="px-6 py-4">
                <CalendarPicker
                  carId={vehicle.id}
                  unavailabilities={unavailabilities}
                  onSelectRange={(start, end) => setDateRange({start, end})}
                />
              </div>

              {/* Pickup location */}
              <div className="px-6 pb-4">
                <label className="block text-sm font-semibold text-brand-navy mb-2">
                  Lugar de retiro
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => {
                    setPickupLocation(e.target.value);
                    setCustomLocation("");
                  }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all bg-white">
                  <option value="">Seleccioná un lugar de retiro</option>
                  <option value="Aeropuerto">Aeropuerto</option>
                  <option value="Terminal de buses">Terminal de buses</option>
                  <option value="Otra ubicación">Otra ubicación</option>
                </select>
                {pickupLocation === "Otra ubicación" && (
                  <input
                    type="text"
                    placeholder="Escribí tu ubicación..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full mt-3 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange transition-all"
                  />
                )}
              </div>

              {/* Summary + CTA */}
              <div className="px-6 pb-6">
                <div className="bg-brand-navy rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {canSubmit ? (
                    <a
                      href={buildPickupWhatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendar(false)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap">
                      <MessageCircle size={20} />
                      Confirmar por WhatsApp
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500/50 text-white px-6 py-3 rounded-xl font-bold whitespace-nowrap cursor-not-allowed">
                      <MessageCircle size={20} />
                      Confirmar por WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
