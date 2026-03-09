export interface Settings {
  salonName: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  photo: string;
  speciality: string;
  shiftTime: string;
  activeStatus: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  validityDate: string;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  isFeatured: boolean;
  order: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  gender: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  date: string;
  time: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceInterest: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  gender?: string;
  visitHistory?: string[];
}
