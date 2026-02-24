import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Vehicle, CarImage } from '../types';
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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<CarImage[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicleData() {
      if (!supabase || !id) return;
      
      setLoading(true);
      try {
        // Fetch vehicle details
        const { data: carData, error: carError } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
        
        if (carError) throw carError;
        setVehicle(carData as Vehicle);
        setActiveImage(carData.preview_image_url);

        // Fetch additional images
        const { data: imageData, error: imageError } = await supabase
          .from('car_images')
          .select('*')
          .eq('car_id', id)
          .order('display_order', { ascending: true });
        
        if (imageError) throw imageError;
        setImages(imageData as CarImage[]);
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
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
        <Loader2 className="animate-spin text-brand-orange" size={48} />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-display font-bold text-brand-navy mb-4">Vehículo no encontrado</h2>
        <Link to="/" className="btn-primary px-8">Volver al inicio</Link>
      </div>
    );
  }

  const whatsappNumber = "5491123456789"; // Replace with real number
  const whatsappMessage = encodeURIComponent(`Hola Andes Way! Me gustaría consultar por el vehículo: ${vehicle.title} (Modelo ${vehicle.year}).`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const allImages = [
    { id: 'preview', image_url: vehicle.preview_image_url },
    ...images.map(img => ({ id: img.id, image_url: img.image_url }))
  ];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs / Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors mb-8 group">
          <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Volver a la flota</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <motion.div 
              layoutId={`image-${vehicle.id}`}
              className="aspect-[16/10] rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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
                      activeImage === img.image_url ? 'border-brand-orange scale-95 shadow-inner' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
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
              <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-2">{vehicle.title}</h1>
              <p className="text-xl text-gray-500">Modelo {vehicle.year}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                <Users className="mx-auto text-brand-orange mb-2" size={24} />
                <p className="text-xs text-gray-400 uppercase font-bold">Pasajeros</p>
                <p className="font-bold text-brand-navy">{vehicle.passengers}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                <Settings className="mx-auto text-brand-orange mb-2" size={24} />
                <p className="text-xs text-gray-400 uppercase font-bold">Caja</p>
                <p className="font-bold text-brand-navy capitalize">{vehicle.transmission}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                <Fuel className="mx-auto text-brand-orange mb-2" size={24} />
                <p className="text-xs text-gray-400 uppercase font-bold">Motor</p>
                <p className="font-bold text-brand-navy">Nafta / Diesel</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                <CarIcon className="mx-auto text-brand-orange mb-2" size={24} />
                <p className="text-xs text-gray-400 uppercase font-bold">Aire</p>
                <p className="font-bold text-brand-navy">Climatizador</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Descripción</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {vehicle.description || "Este vehículo está equipado con todas las comodidades necesarias para garantizar un viaje seguro y placentero por las rutas de los Andes. Mantenimiento al día y seguro contra todo riesgo incluido."}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="text-green-500" size={18} />
                  <span>Kilometraje libre</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 className="text-green-500" size={18} />
                  <span>Seguro contra todo riesgo</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="text-green-500" size={18} />
                  <span>Asistencia en ruta 24/7</span>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-brand-navy text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white/60 text-sm mb-1 uppercase font-bold tracking-widest">Precio por día</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-brand-orange">${vehicle.price_per_day}</span>
                  <span className="text-white/60">USD</span>
                </div>
              </div>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={24} />
                Reservar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
