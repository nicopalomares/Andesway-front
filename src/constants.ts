import { Vehicle, Testimonial, Feature } from './types';

export const VEHICLES: Vehicle[] = [
  {
    id: '1',
    title: 'Toyota Hilux 4x4',
    year: 2024,
    category: 'offroad',
    price_per_day: 85,
    preview_image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
    transmission: 'manual',
    passengers: 5,
    status: 'available',
    description: 'La pick-up más confiable para recorrer los caminos más exigentes de la Patagonia.'
  },
  {
    id: '2',
    title: 'Volkswagen Taos',
    year: 2023,
    category: 'suv',
    price_per_day: 70,
    preview_image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800',
    transmission: 'automatic',
    passengers: 5,
    status: 'available',
    description: 'Confort y tecnología alemana para tus viajes en familia.'
  },
  {
    id: '3',
    title: 'Chevrolet Onix',
    year: 2024,
    category: 'economy',
    price_per_day: 45,
    preview_image_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
    transmission: 'manual',
    passengers: 5,
    status: 'available',
    description: 'Ágil y económico, ideal para moverte por la ciudad.'
  },
  {
    id: '4',
    title: 'Toyota Corolla',
    year: 2023,
    category: 'sedan',
    price_per_day: 60,
    preview_image_url: 'https://images.unsplash.com/photo-1623860841535-10a44c3f5218?auto=format&fit=crop&q=80&w=800',
    transmission: 'automatic',
    passengers: 5,
    status: 'available',
    description: 'Elegancia y suavidad de marcha en un sedán de referencia.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    rating: 5,
    text: 'Excelente servicio. El auto estaba impecable y la entrega fue muy puntual en el aeropuerto. Muy recomendable para recorrer la montaña.',
    date: 'Hace 2 semanas'
  },
  {
    id: '2',
    name: 'Marina Soler',
    rating: 5,
    text: 'Alquilamos una 4x4 para ir a la nieve. El proceso fue súper transparente y sin sorpresas. La atención de Andes Way es de primer nivel.',
    date: 'Hace 1 mes'
  },
  {
    id: '3',
    name: 'Juan Pablo Mendez',
    rating: 4,
    text: 'Muy buena flota. Los autos son propios y se nota el mantenimiento. Volvería a alquilar con ellos sin duda.',
    date: 'Hace 3 semanas'
  }
];

export const FEATURES: Feature[] = [
  {
    id: '1',
    title: 'Flota propia',
    description: 'Somos dueños de cada vehículo. Garantizamos el mejor mantenimiento y estado.',
    icon: 'Car'
  },
  {
    id: '2',
    title: 'Seguro incluido',
    description: 'Viajá tranquilo con nuestra cobertura completa diseñada para la región.',
    icon: 'ShieldCheck'
  },
  {
    id: '3',
    title: 'Atención personalizada',
    description: 'Te asesoramos para que elijas el vehículo ideal para tu itinerario.',
    icon: 'UserCheck'
  },
  {
    id: '4',
    title: 'Entrega flexible',
    description: 'Entregamos en aeropuertos, hoteles o donde lo necesites.',
    icon: 'MapPin'
  }
];
