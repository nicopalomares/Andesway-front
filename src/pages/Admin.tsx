import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Vehicle, CarImage } from '../types';
import { Plus, Trash2, Calendar as CalendarIcon, AlertCircle, CheckCircle2, Loader2, LogOut, X, Edit2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { format } from 'date-fns';

export default function Admin() {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
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
    status: 'available',
    description: ''
  });

  // Unavailability state
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [carUnavailabilities, setCarUnavailabilities] = useState<any[]>([]);
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [unavailability, setUnavailability] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (selectedCarId) {
      fetchUnavailabilities(selectedCarId);
      fetchCarImages(selectedCarId);
    }
  }, [selectedCarId]);

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

  async function fetchUnavailabilities(carId: string) {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('car_unavailability')
      .select('*')
      .eq('car_id', carId);
    
    if (data) setCarUnavailabilities(data);
  }

  async function fetchCarImages(carId: string) {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('car_images')
      .select('*')
      .eq('car_id', carId)
      .order('display_order', { ascending: true });
    
    if (data) setCarImages(data as CarImage[]);
  }

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !selectedCarId || !newImageUrl) return;

    const { error } = await supabase.from('car_images').insert([{
      car_id: selectedCarId,
      image_url: newImageUrl,
      display_order: carImages.length
    }]);

    if (error) {
      setMessage({ type: 'error', text: 'Error al agregar imagen' });
    } else {
      setNewImageUrl('');
      fetchCarImages(selectedCarId);
      fetchCars(); // Refresh cars to update joined data
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!supabase || !selectedCarId || !files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}-${file.name}`;
        const filePath = `car-images/${selectedCarId}/${fileName}`;

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('car-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);

        // 3. Insert into car_images table
        const { error: dbError } = await supabase.from('car_images').insert([{
          car_id: selectedCarId,
          image_url: publicUrl,
          display_order: carImages.length + i
        }]);

        if (dbError) throw dbError;
      }

      setMessage({ type: 'success', text: 'Imágenes subidas correctamente' });
      fetchCarImages(selectedCarId);
      fetchCars();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error al subir imágenes: ' + error.message });
    } finally {
      setUploading(false);
      // Clear input
      e.target.value = '';
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!supabase || !selectedCarId) return;
    const { error } = await supabase.from('car_images').delete().eq('id', imageId);
    if (!error) fetchCarImages(selectedCarId);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate('/login');
  }

  async function fetchCars() {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('cars')
      .select('*, car_images(*)')
      .order('created_at', { ascending: false });
    
    if (data) setCars(data as Vehicle[]);
    setLoading(false);
  }

  async function handleAddCar(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    if (editingCarId) {
      const { error } = await supabase.from('cars').update(newCar).eq('id', editingCarId);
      if (error) {
        setMessage({ type: 'error', text: 'Error al actualizar vehículo: ' + error.message });
      } else {
        setMessage({ type: 'success', text: 'Vehículo actualizado correctamente' });
        setEditingCarId(null);
        setIsAdding(false);
        fetchCars();
        resetForm();
      }
    } else {
      const { error } = await supabase.from('cars').insert([newCar]);
      if (error) {
        setMessage({ type: 'error', text: 'Error al agregar vehículo: ' + error.message });
      } else {
        setMessage({ type: 'success', text: 'Vehículo agregado correctamente' });
        setIsAdding(false);
        fetchCars();
        resetForm();
      }
    }
  }

  function resetForm() {
    setNewCar({
      title: '',
      year: 2024,
      category: 'economy',
      price_per_day: 50,
      preview_image_url: '',
      transmission: 'automatic',
      passengers: 5,
      status: 'available',
      description: ''
    });
  }

  function handleEditClick(car: Vehicle) {
    const { id, created_at, updated_at, ...carData } = car as any;
    setNewCar(carData);
    setEditingCarId(id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      fetchUnavailabilities(selectedCarId);
      setUnavailability({ start_date: '', end_date: '', reason: '' });
    }
  }

  const handleRangeSelect = (start: Date, end: Date) => {
    setUnavailability({
      ...unavailability,
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(end, 'yyyy-MM-dd')
    });
  };

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
            <h2 className="text-xl font-bold mb-6">{editingCarId ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}</h2>
            <form onSubmit={handleAddCar} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Título / Nombre</label>
                  <input 
                    required
                    type="text" 
                    value={newCar.title || ''}
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
                <div>
                  <label className="block text-sm font-semibold mb-1">Descripción</label>
                  <textarea 
                    value={newCar.description || ''}
                    onChange={e => setNewCar({...newCar, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Descripción del vehículo..."
                    rows={3}
                  />
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
                    value={newCar.preview_image_url || ''}
                    onChange={e => setNewCar({...newCar, preview_image_url: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Estado</label>
                  <select 
                    value={newCar.status}
                    onChange={e => setNewCar({...newCar, status: e.target.value as any})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="available">Disponible</option>
                    <option value="unavailable">No Disponible</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => { setIsAdding(false); setEditingCarId(null); resetForm(); }} className="px-6 py-2 text-gray-500 font-semibold">Cancelar</button>
                <button type="submit" className="btn-primary px-8">{editingCarId ? 'Actualizar Vehículo' : 'Guardar Vehículo'}</button>
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
                          onClick={() => handleEditClick(car)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="Editar Vehículo"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => { setSelectedCarId(car.id); setShowImagesModal(true); }}
                          className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                          title="Gestionar Galería"
                        >
                          <ImageIcon size={18} />
                        </button>
                        <button 
                          onClick={() => { setSelectedCarId(car.id); setShowImagesModal(false); }}
                          className="p-2 text-gray-400 hover:text-brand-orange transition-colors"
                          title="Gestionar Indisponibilidad"
                        >
                          <CalendarIcon size={18} />
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
        {selectedCarId && !showImagesModal && (
          <div className="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-2xl max-w-4xl w-full card-shadow overflow-hidden flex flex-col md:flex-row gap-8"
            >
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-brand-navy">Calendario de Disponibilidad</h3>
                  <button onClick={() => setSelectedCarId(null)} className="md:hidden text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <Calendar 
                  carId={selectedCarId} 
                  unavailabilities={carUnavailabilities}
                  onSelectRange={handleRangeSelect}
                />
              </div>

              <div className="w-full md:w-80 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-brand-navy">Registrar Rango</h3>
                  <button onClick={() => setSelectedCarId(null)} className="hidden md:block text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleAddUnavailability} className="space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Desde</label>
                      <input 
                        required
                        readOnly
                        type="date" 
                        value={unavailability.start_date || ''}
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Hasta</label>
                      <input 
                        required
                        readOnly
                        type="date" 
                        value={unavailability.end_date || ''}
                        className="w-full p-2 border rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Motivo (Opcional)</label>
                    <textarea 
                      value={unavailability.reason || ''}
                      onChange={e => setUnavailability({...unavailability, reason: e.target.value})}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none"
                      placeholder="Ej: Mantenimiento preventivo"
                      rows={3}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                    <AlertCircle className="text-blue-500 shrink-0" size={18} />
                    <p className="text-xs text-blue-700">
                      Seleccioná las fechas directamente en el calendario para definir el rango.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-auto pt-6">
                    <button 
                      type="submit" 
                      disabled={!unavailability.start_date || !unavailability.end_date}
                      className="btn-primary w-full py-3 disabled:opacity-50"
                    >
                      Guardar Rango
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setSelectedCarId(null)} 
                      className="w-full py-2 text-gray-500 font-semibold text-sm"
                    >
                      Cerrar Panel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
        {/* Images Gallery Modal */}
        {selectedCarId && showImagesModal && (
          <div className="fixed inset-0 bg-brand-navy/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 rounded-2xl max-w-2xl w-full card-shadow"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-brand-navy">Galería de Imágenes</h3>
                <button onClick={() => { setSelectedCarId(null); setShowImagesModal(false); }} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <form onSubmit={handleAddImage} className="flex gap-2">
                  <input 
                    type="url" 
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="flex-grow p-2 border rounded-lg text-sm"
                    placeholder="URL de la imagen (opcional)"
                  />
                  <button type="submit" className="btn-primary px-4 py-2 flex items-center gap-2 text-sm">
                    <Plus size={18} />
                    URL
                  </button>
                </form>

                <div className="relative">
                  <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className={`w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-orange hover:bg-brand-orange/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {uploading ? (
                      <Loader2 className="animate-spin text-brand-orange" size={24} />
                    ) : (
                      <ImageIcon className="text-gray-400" size={24} />
                    )}
                    <span className="font-semibold text-gray-600">
                      {uploading ? 'Subiendo imágenes...' : 'Subir imágenes desde el equipo'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
                {carImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                    <img 
                      src={img.image_url} 
                      alt="Gallery" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {carImages.length === 0 && (
                  <div className="col-span-3 py-12 text-center text-gray-400">
                    No hay imágenes adicionales en la galería.
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => { setSelectedCarId(null); setShowImagesModal(false); }} 
                  className="px-6 py-2 text-gray-500 font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
