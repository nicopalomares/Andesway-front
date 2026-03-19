import React from "react";
import {motion} from "motion/react";
import BookingCard from "./BookingCard";
import img from "@/public/assets/headerImg.png"; // Placeholder image, replace with actual path

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={img}
          alt="Andean Landscape"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-navy/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.8, ease: "easeOut"}}
            className="text-white">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Alquilá tu auto con{" "}
              <span className="text-brand-orange">confianza</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-xl">
              Flota propia. Atención personalizada. Sin intermediarios. La mejor
              forma de recorrer los Andes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/#vehiculos">
                <button className="btn-primary text-lg px-8 py-4">
                  {" "}
                  Ver vehículos
                </button>
              </a>
            </div>
          </motion.div>

          {/* <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2, ease: "easeOut"}}
            className="hidden lg:block">
            <BookingCard />
          </motion.div> */}
        </div>
      </div>

      {/* Mobile Booking Card (Visible only on small screens below hero text) */}
      <div className="lg:hidden absolute bottom-0 left-0 w-full px-4 pb-10 translate-y-1/2">
        {/* This will be handled by layout in App.tsx or just shown here if preferred */}
      </div>
    </section>
  );
}
