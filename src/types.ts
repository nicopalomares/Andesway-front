export interface Vehicle {
  id: string;
  name: string;
  year: number;
  category: 'SUV' | 'Sedan' | 'Económico' | 'Pick-up';
  pricePerDay: number;
  image: string;
  transmission: 'Manual' | 'Automático';
  passengers: number;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}
