import React from 'react';
import { motion } from 'motion/react';
import { Users, Settings, ChevronRight } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden card-shadow border border-gray-100 group"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-brand-navy text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {vehicle.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-display font-bold text-brand-navy">{vehicle.name}</h3>
            <p className="text-sm text-gray-500">Modelo {vehicle.year}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Desde</p>
            <p className="text-2xl font-bold text-brand-orange">${vehicle.pricePerDay}<span className="text-sm text-gray-400 font-normal">/día</span></p>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6 py-4 border-y border-gray-50">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} className="text-brand-orange" />
            <span className="text-sm">{vehicle.passengers} Pasajeros</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Settings size={18} className="text-brand-orange" />
            <span className="text-sm">{vehicle.transmission}</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-brand-navy text-brand-navy font-semibold transition-all hover:bg-brand-navy hover:text-white">
          Ver detalles
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default VehicleCard;
