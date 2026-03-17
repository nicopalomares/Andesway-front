import React from "react";
import {Calendar, MapPin, Search} from "lucide-react";

export default function BookingCard() {
  return (
    <div className="bg-white rounded-2xl p-8 card-shadow w-full max-w-md mx-auto">
      <h3 className="text-2xl font-display font-bold text-brand-navy mb-6">
        Buscá tu vehículo
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <MapPin
              size={16}
              className="text-brand-orange"
            />
            Lugar de retiro
          </label>
          <select className="w-full p-3 bg-brand-gray-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all">
            <option>Aeropuerto Internacional</option>
            <option>Centro Ciudad</option>
            <option>Terminal de Ómnibus</option>
            <option>Entrega en Hotel</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Calendar
                size={16}
                className="text-brand-orange"
              />
              Fecha retiro
            </label>
            <input
              type="date"
              className="w-full p-3 bg-brand-gray-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <Calendar
                size={16}
                className="text-brand-orange"
              />
              Fecha devolución
            </label>
            <input
              type="date"
              className="w-full p-3 bg-brand-gray-light border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
            />
          </div>
        </div>

        <button className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-4">
          <Search size={20} />
          Buscar disponibilidad
        </button>
      </div>
    </div>
  );
}
