export interface Vehicle {
  id: string;
  title: string;
  year: number;
  category: 'suv' | 'offroad' | 'sedan' | 'economy';
  price_per_day: number;
  preview_image_url: string;
  transmission: 'automatic' | 'manual';
  passengers: number;
  status: 'available' | 'unavailable' | 'maintenance';
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
