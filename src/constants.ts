import {Testimonial, Feature} from "./types";

export const WHATSAPP_NUMBER = "5492617608355";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Carlos Rodriguez",
    rating: 5,
    text: "Excelente servicio. El auto estaba impecable y la entrega fue muy puntual en el aeropuerto. Muy recomendable para recorrer la montaña.",
    date: "Hace 2 semanas",
  },
  {
    id: "2",
    name: "Marina Soler",
    rating: 5,
    text: "Alquilamos una 4x4 para ir a la nieve. El proceso fue súper transparente y sin sorpresas. La atención de Andes Way es de primer nivel.",
    date: "Hace 1 mes",
  },
  {
    id: "3",
    name: "Juan Pablo Mendez",
    rating: 4,
    text: "Muy buena flota. Los autos son propios y se nota el mantenimiento. Volvería a alquilar con ellos sin duda.",
    date: "Hace 3 semanas",
  },
];

export const FEATURES: Feature[] = [
  {
    id: "1",
    title: "Flota propia",
    description:
      "Somos dueños de cada vehículo. Garantizamos el mejor mantenimiento y estado.",
    icon: "Car",
  },
  {
    id: "2",
    title: "Seguro incluido",
    description:
      "Viajá tranquilo con nuestra cobertura completa diseñada para la región.",
    icon: "ShieldCheck",
  },
  {
    id: "3",
    title: "Atención personalizada",
    description:
      "Te asesoramos para que elijas el vehículo ideal para tu itinerario.",
    icon: "UserCheck",
  },
  {
    id: "4",
    title: "Entrega flexible",
    description: "Entregamos en aeropuertos, hoteles o donde lo necesites.",
    icon: "MapPin",
  },
];
