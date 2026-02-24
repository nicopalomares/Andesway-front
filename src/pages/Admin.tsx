import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Vehicle } from '../types';
import { Plus, Trash2, Calendar, AlertCircle, CheckCircle2, Loader2, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  // Form state for new car
  const [newCar, setNewCar] = useState<Partial<Vehicle>>({
    title: '',
    year: 2024,
    category: 'economy',
    price_per_day: 50,
    preview_image_url: '',
    transmission: 'automatic',
    passengers: 5,
    status: 'available'
  });

  // Unavailability state
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [unavailability, setUnavailability] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    if (!supabase) {
      navigate('/');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    } else {
      setSession(session);
      fetchCars();
    }
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate('/login');
  }

  async function fetchCars() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (data) setCars(data as Vehicle[]);
    setLoading(false);
  }

  async function handleAddCar(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.from('cars').insert([newCar]);
    if (error) {
      setMessage({ type: 'error', text: 'Error al agregar vehículo: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Vehículo agregado correctamente' });
      setIsAdding(false);
      fetchCars();
      setNewCar({
        title: '',
        year: 2024,
        category: 'economy',
        price_per_day: 50,
        preview_image_url: '',
        transmission: 'automatic',
        passengers: 5,
        status: 'available'
      });
    }
  }

  async function handleUpdateStatus(id: string, status: Vehicle['status']) {
    if (!supabase) return;
    const { error } = await supabase.from('cars').update({ status }).eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: 'Error al actualizar estado' });
    } else {
      fetchCars();
    }
  }

  async function handleAddUnavailability(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !selectedCarId) return;

    const { error } = await supabase.from('car_unavailability').insert([{
      car_id: selectedCarId,
      ...unavailability
    }]);

    if (error) {
      setMessage({ type: 'error', text: 'Error al registrar indisponibilidad' });
    } else {
      setMessage({ type: 'success', text: 'Indisponibilidad registrada' });
      setSelectedCarId(null);
      setUnavailability({ start_date: '', end_date: '', reason: '' });
    }
  }

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-brand-navy">Panel de Administración</h1>
          <div className="flex gap-4">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-gray-500 font-semibold flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Vehículo
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl card-shadow mb-12 border border-gray-100"
          >
            <h2 className="text-xl font-bold mb-6">Agregar Nuevo Vehículo</h2>
            <form onSubmit={handleAddCar} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Título / Nombre</label>
                  <input 
                    required
                    type="text" 
                    value={newCar.title}
                    onChange={e => setNewCar({...newCar, title: e.target.value})}
                    className="w-full p-2 border rounded-lg" 
                    placeholder="Ej: Toyota Hilux 4x4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Año</label>
                    <input 
                      required
                      type="number" 
                      value={newCar.year}
                      onChange={e => setNewCar({...newCar, year: parseInt(e.target.value)})}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Pasajeros</label>
                    <input 
                      required
                      type="number" 
                      value={newCar.passengers}
                      onChange={e => setNewCar({...newCar, passengers: parseInt(e.target.value)})}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Categoría</label>
                  <select 
                    value={newCar.category}
                    onChange={e => setNewCar({...newCar, category: e.target.value as any})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="economy">Económico</option>
                    <option value="sedan">Sedán</option>
                    <option value="suv">SUV</option>
                    <option value="offroad">Offroad / 4x4</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Precio por día (USD)</label>
                  <input 
                    required
                    type="number" 
                    value={newCar.price_per_day}
                    onChange={e => setNewCar({...newCar, price_per_day: parseFloat(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Transmisión</label>
                  <select 
                    value={newCar.transmission}
                    onChange={e => setNewCar({...newCar, transmission: e.target.value as any})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="automatic">Automático</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">URL Imagen Preview</label>
                  <input 
                    required
                    type="url" 
                    value={newCar.preview_image_url}
                    onChange={e => setNewCar({...newCar, preview_image_url: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-gray-500 font-semibold">Cancelar</button>
                <button type="submit" className="btn-primary px-8">Guardar Vehículo</button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl card-shadow overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Vehículo</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Categoría</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Precio/Día</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Estado</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Loader2 className="animate-spin mx-auto text-brand-orange" size={32} />
                    </td>
                  </tr>
                ) : cars.map(car => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={car.preview_image_url} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div>
                          <p className="font-bold text-brand-navy">{car.title}</p>
                          <p className="text-xs text-gray-500">{car.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full capitalize">{car.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-orange">${car.price_per_day}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={car.status}
                        onChange={(e) => handleUpdateStatus(car.id, e.target.value as any)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${
                          car.status === 'available' ? 'bg-green-100 text-green-700' : 
                          car.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="available">Disponible</option>
                        <option value="unavailable">No Disponible</option>
                        <option value="maintenance">Mantenimiento</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedCarId(car.id)}
                          className="p-2 text-gray-400 hover:text-brand-orange transition-colors"
                          title="Gestionar Indisponibilidad"
                        >
                          <Calendar size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unavailability Modal/Section */}
        {selectedCarId && (
          <div className="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-2xl max-w-md w-full card-shadow"
            >
              <h3 className="text-xl font-bold mb-6">Registrar Indisponibilidad</h3>
              <form onSubmit={handleAddUnavailability} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha Inicio</label>
                  <input 
                    required
                    type="date" 
                    value={unavailability.start_date}
                    onChange={e => setUnavailability({...unavailability, start_date: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha Fin</label>
                  <input 
                    required
                    type="date" 
                    value={unavailability.end_date}
                    onChange={e => setUnavailability({...unavailability, end_date: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Motivo (Opcional)</label>
                  <textarea 
                    value={unavailability.reason}
                    onChange={e => setUnavailability({...unavailability, reason: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Ej: Reserva confirmada"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={() => setSelectedCarId(null)} className="px-4 py-2 text-gray-500 font-semibold">Cerrar</button>
                  <button type="submit" className="btn-primary px-6">Registrar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
