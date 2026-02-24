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
  description?: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  display_order: number;
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
