export type Role = 'admin' | 'staff' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  gender?: 'male' | 'female' | 'other';
  notes?: string;
  visitHistory?: string[]; // Appointment IDs
}

export interface Staff extends User {
  role: 'staff';
  photo: string;
  speciality: string;
  shiftTime: string;
  activeStatus: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
}

export type AppointmentStatus = 'Pending' | 'Approved' | 'Rescheduled' | 'Completed' | 'Cancelled' | 'No-show';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  gender: string;
  serviceId: string;
  serviceName: string;
  staffId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Converted' | 'Closed';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceInterest: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  validityDate: string;
  bannerImage?: string;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: 'Hair' | 'Nails' | 'Bridal' | 'Skin' | 'Salon Interior';
  isFeatured: boolean;
  order: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Settings {
  salonName: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
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
