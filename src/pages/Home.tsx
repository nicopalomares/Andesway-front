import React, {useEffect, useState} from "react";
import Hero from "../components/Hero";
import VehicleCard from "../components/VehicleCard";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CorporateFleet from "../components/CorporateFleet";
import BookingCard from "../components/BookingCard";
import {VEHICLES as MOCK_VEHICLES} from "../constants";
import {motion} from "motion/react";
import {supabase} from "../services/supabase";
import {Vehicle} from "../types";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const {data, error} = await supabase
          .from("cars")
          .select("*, car_images(*)")
          .eq("status", "available");

        if (error) throw error;
        if (data && data.length > 0) {
          setVehicles(data as Vehicle[]);
        }
      } catch (err) {
        console.log(
          "Supabase fetch failed or table missing, using mock data:",
          err,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  return (
    <main className="flex-grow">
      <Hero />

      {/* Mobile Booking Search (Floating overlap) */}
      <div className="lg:hidden relative z-20 px-4 -mt-32 mb-12">
        <BookingCard />
      </div>

      {/* Vehicle Grid Section */}
      <section
        id="vehiculos"
        className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            className="text-3xl md:text-4xl font-display font-bold text-brand-navy mb-4">
            Nuestra <span className="text-brand-orange">Flota</span>
          </motion.h2>
          <motion.p
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.1}}
            className="text-gray-500 max-w-2xl mx-auto">
            Vehículos modernos, seguros y equipados para que disfrutes de cada
            kilómetro con total tranquilidad.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <button className="btn-secondary px-10">
            Ver todos los vehículos
          </button>
        </div>
      </section>

      <CorporateFleet />

      <Features />

      <Testimonials />

      {/* Call to Action Section */}
      <section className="py-20 bg-brand-orange text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                ¿Listo para tu próxima aventura?
              </h2>
              <p className="text-white/80 text-lg max-w-xl">
                Reservá hoy mismo y asegurá el mejor precio para tu viaje por
                los Andes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-navy text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all">
                Reservar Ahora
              </button>
              <button className="bg-white text-brand-orange px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all">
                Contactar Asesor
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
