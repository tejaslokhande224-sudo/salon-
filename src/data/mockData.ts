import {
  ServiceCategory,
  Service,
  Staff,
  Offer,
  GalleryItem,
  Review,
  Settings,
  Appointment,
  Enquiry,
  User
} from '../types';

export const mockSettings: Settings = {
  salonName: 'Glow Up Unisex Salon',
  phone: '9167676133',
  email: 'hello@glowupsalon.com',
  address: 'Shop No. 7, White Rose Bldg., Near RTO & LIC Office, Louiswadi, Eastern Express Highway, Thane (W) 400604',
  mapUrl: 'https://maps.google.com/?q=Glow+Up+Unisex+Salon+Thane',
  socialLinks: {
    instagram: 'https://instagram.com/glowupsalon',
    facebook: 'https://facebook.com/glowupsalon',
    whatsapp: 'https://wa.me/919167676133'
  },
  openingHours: {
    monday: '10:00 AM - 8:00 PM',
    tuesday: '10:00 AM - 8:00 PM',
    wednesday: '10:00 AM - 8:00 PM',
    thursday: '10:00 AM - 8:00 PM',
    friday: '10:00 AM - 8:00 PM',
    saturday: '9:00 AM - 9:00 PM',
    sunday: '9:00 AM - 9:00 PM'
  }
};

export const mockCategories: ServiceCategory[] = [
  { id: 'c1', name: 'Manicure & Pedicure', description: 'Premium nail care services' },
  { id: 'c2', name: 'Hair Services', description: 'Expert haircuts and styling' },
  { id: 'c3', name: 'Hair Colour', description: 'Global colour and highlights' },
  { id: 'c4', name: 'Hair Spa', description: 'Relaxing and nourishing hair treatments' },
  { id: 'c5', name: 'Skin Care & Facial Treatments', description: 'Rejuvenating facials and bleach' },
  { id: 'c6', name: 'Bridal Makeup & Hairstyling', description: 'Complete bridal packages' },
  { id: 'c7', name: 'Permanent Beauty Treatments', description: 'Long-lasting beauty enhancements' }
];

export const mockServices: Service[] = [
  // Manicure & Pedicure
  { id: 's1', categoryId: 'c1', name: 'Luxury Manicure', description: 'Complete hand care with scrub and massage', price: 800, duration: 45, isActive: true, isFeatured: true },
  { id: 's2', categoryId: 'c1', name: 'Luxury Pedicure', description: 'Complete foot care with scrub and massage', price: 1000, duration: 60, isActive: true, isFeatured: true },
  { id: 's3', categoryId: 'c1', name: 'Acrylic Nail Extensions', description: 'Premium nail extensions with art', price: 2500, duration: 120, isActive: true, isFeatured: true },
  
  // Hair Services
  { id: 's4', categoryId: 'c2', name: 'Advanced Style Haircut (Female)', description: 'Modern styling by senior stylist', price: 800, duration: 45, isActive: true, isFeatured: true },
  { id: 's5', categoryId: 'c2', name: 'Creative Styling Haircut (Male)', description: 'Trendy haircut and styling', price: 500, duration: 30, isActive: true, isFeatured: true },
  { id: 's6', categoryId: 'c2', name: 'Beard Design & Shaping', description: 'Precision beard grooming', price: 300, duration: 20, isActive: true, isFeatured: false },
  
  // Hair Colour
  { id: 's7', categoryId: 'c3', name: 'L’Oreal Inoa Ammonia Free (Global)', description: 'Premium ammonia-free global colour', price: 3500, duration: 120, isActive: true, isFeatured: true },
  { id: 's8', categoryId: 'c3', name: 'Highlight Per Streak (Matrix)', description: 'Vibrant streaks', price: 400, duration: 30, isActive: true, isFeatured: false },
  
  // Hair Spa
  { id: 's9', categoryId: 'c4', name: 'Moroccan Oil Hair Spa', description: 'Deep conditioning luxury spa', price: 2000, duration: 60, isActive: true, isFeatured: true },
  { id: 's10', categoryId: 'c4', name: 'Keratin Hair Spa', description: 'Protein-rich hair treatment', price: 1500, duration: 60, isActive: true, isFeatured: false },
  
  // Skin Care
  { id: 's11', categoryId: 'c5', name: 'Lotus Diamond Facial', description: 'Radiant glow facial', price: 2500, duration: 75, isActive: true, isFeatured: true },
  { id: 's12', categoryId: 'c5', name: 'D-Tan Face Bleach', description: 'Instant tan removal', price: 500, duration: 30, isActive: true, isFeatured: false },
  
  // Bridal
  { id: 's13', categoryId: 'c6', name: 'HD Bridal Makeup', description: 'Flawless high-definition makeup', price: 15000, duration: 180, isActive: true, isFeatured: true },
  { id: 's14', categoryId: 'c6', name: 'Saree Draping Styling', description: 'Professional draping', price: 1000, duration: 30, isActive: true, isFeatured: false },
  
  // Permanent
  { id: 's15', categoryId: 'c7', name: 'Eyebrow Microblading', description: 'Semi-permanent eyebrow shaping', price: 8000, duration: 120, isActive: true, isFeatured: true }
];

export const mockStaff: Staff[] = [
  { id: 'st1', name: 'Aisha Sharma', email: 'aisha@glowup.com', phone: '9876543210', role: 'staff', photo: 'https://picsum.photos/seed/stylist1/400/400', speciality: 'Bridal Makeup & Hair', shiftTime: '10:00 AM - 7:00 PM', activeStatus: true },
  { id: 'st2', name: 'Rahul Verma', email: 'rahul@glowup.com', phone: '9876543211', role: 'staff', photo: 'https://picsum.photos/seed/stylist2/400/400', speciality: 'Creative Hair Styling', shiftTime: '11:00 AM - 8:00 PM', activeStatus: true },
  { id: 'st3', name: 'Priya Desai', email: 'priya@glowup.com', phone: '9876543212', role: 'staff', photo: 'https://picsum.photos/seed/stylist3/400/400', speciality: 'Skin Care & Facials', shiftTime: '10:00 AM - 7:00 PM', activeStatus: true }
];

export const mockOffers: Offer[] = [
  { id: 'o1', title: 'Thursday Haircut ₹99', description: 'Get a classic haircut every Thursday for just ₹99.', originalPrice: 300, offerPrice: 99, validityDate: '2026-12-31', isActive: true },
  { id: 'o2', title: '20% Off Any Facial', description: 'Pamper your skin with our premium facials at a discount.', originalPrice: 2500, offerPrice: 2000, validityDate: '2026-06-30', isActive: true },
  { id: 'o3', title: 'Bridal Consultation Offer', description: 'Free trial makeup with every bridal package booking.', originalPrice: 2000, offerPrice: 0, validityDate: '2026-12-31', isActive: true }
];

export const mockGallery: GalleryItem[] = [
  { id: 'g1', url: 'https://picsum.photos/seed/hair1/800/600', category: 'Hair', isFeatured: true, order: 1 },
  { id: 'g2', url: 'https://picsum.photos/seed/bridal1/800/600', category: 'Bridal', isFeatured: true, order: 2 },
  { id: 'g3', url: 'https://picsum.photos/seed/nails1/800/600', category: 'Nails', isFeatured: true, order: 3 },
  { id: 'g4', url: 'https://picsum.photos/seed/skin1/800/600', category: 'Skin', isFeatured: false, order: 4 },
  { id: 'g5', url: 'https://picsum.photos/seed/interior1/800/600', category: 'Salon Interior', isFeatured: true, order: 5 },
  { id: 'g6', url: 'https://picsum.photos/seed/hair2/800/600', category: 'Hair', isFeatured: false, order: 6 }
];

export const mockReviews: Review[] = [
  { id: 'r1', customerName: 'Neha Kapoor', rating: 5, comment: 'Absolutely loved my bridal makeup! Aisha is a magician.', isApproved: true, createdAt: '2026-02-15T10:00:00Z' },
  { id: 'r2', customerName: 'Vikram Singh', rating: 4, comment: 'Great haircut by Rahul. The salon is very clean and premium.', isApproved: true, createdAt: '2026-02-20T14:30:00Z' },
  { id: 'r3', customerName: 'Sneha Joshi', rating: 5, comment: 'The Moroccan Oil Hair Spa was incredibly relaxing. Highly recommend!', isApproved: true, createdAt: '2026-03-01T11:15:00Z' }
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', customerId: 'cu1', customerName: 'Aditi Rao', customerPhone: '9988776655', customerEmail: 'aditi@example.com', gender: 'female', serviceId: 's13', serviceName: 'HD Bridal Makeup', staffId: 'st1', date: '2026-03-10', time: '10:00', status: 'Approved', totalPrice: 15000, createdAt: '2026-03-01T09:00:00Z' },
  { id: 'a2', customerId: 'cu2', customerName: 'Karan Patel', customerPhone: '9988776644', customerEmail: 'karan@example.com', gender: 'male', serviceId: 's5', serviceName: 'Creative Styling Haircut', staffId: 'st2', date: '2026-03-08', time: '14:00', status: 'Pending', totalPrice: 500, createdAt: '2026-03-05T15:30:00Z' }
];

export const mockEnquiries: Enquiry[] = [
  { id: 'e1', name: 'Riya Sen', phone: '9123456780', email: 'riya@example.com', serviceInterest: 'Bridal Package', message: 'I want to know the pricing for a destination wedding package.', status: 'New', createdAt: '2026-03-07T10:20:00Z' },
  { id: 'e2', name: 'Amit Kumar', phone: '9123456781', email: 'amit@example.com', serviceInterest: 'Keratin Treatment', message: 'Do you use formaldehyde-free products?', status: 'Contacted', createdAt: '2026-03-06T16:45:00Z' }
];

export const mockCustomers: User[] = [
  { id: 'cu1', name: 'Aditi Rao', email: 'aditi@example.com', phone: '9988776655', role: 'customer', gender: 'female', visitHistory: ['a1'] },
  { id: 'cu2', name: 'Karan Patel', email: 'karan@example.com', phone: '9988776644', role: 'customer', gender: 'male', visitHistory: ['a2'] }
];
