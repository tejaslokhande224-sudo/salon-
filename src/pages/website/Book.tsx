import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';
import { Calendar, Clock, User, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { serviceService } from '@/src/services/services';
import { staffService } from '@/src/services/staff';
import { customerService } from '@/src/services/customers';
import { appointmentService } from '@/src/services/appointments';

export default function Book() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [cats, srvs, stf] = await Promise.all([
          serviceService.getCategories(),
          serviceService.getActiveServices(),
          staffService.getActiveStaff()
        ]);
        setCategories(cats || []);
        setServices(srvs || []);
        setStaff(stf || []);
      } catch (error) {
        console.error('Failed to load booking data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredServices = selectedCategory
    ? services.filter(s => s.category_id === selectedCategory)
    : services;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    service_id: '',
    staff_id: '',
    booking_date: '',
    booking_time: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // 1. Check if customer exists or create new
      let customer = await customerService.getCustomerByPhone(formData.phone);
      
      if (!customer) {
        customer = await customerService.createCustomer({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          gender: formData.gender
        });
      }

      if (!customer) {
        throw new Error('Failed to create or retrieve customer');
      }

      // 2. Create appointment
      await appointmentService.createAppointment({
        customer_id: customer.id,
        service_id: formData.service_id,
        staff_id: formData.staff_id || null,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        notes: formData.notes,
        status: 'pending'
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setSelectedCategory(value);
      setFormData(prev => ({ ...prev, service_id: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-pattern/1920/1080')] opacity-5 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          className="relative z-10 flex flex-col items-center max-w-xl mx-auto p-12 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="mb-4 font-serif text-4xl font-medium text-zinc-50 md:text-5xl tracking-tight">BOOKING <span className="text-gradient-gold italic">CONFIRMED</span></h1>
          <p className="mb-10 text-lg text-zinc-400 font-light leading-relaxed">
            Thank you for choosing Glow Up Unisex Salon. We have received your appointment request and will contact you shortly to confirm your premium experience.
          </p>
          <Button variant="luxury" size="lg" onClick={() => setIsSubmitted(false)} className="uppercase tracking-wider text-xs font-semibold h-14 px-8">
            Book Another Session
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-dark/1920/1080')] opacity-10 mix-blend-overlay object-cover fixed" />
      <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-gold-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative overflow-hidden border-b border-zinc-900 bg-black px-8 py-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent" />
            <div className="relative z-10">
              <span className="mb-4 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
                <Sparkles className="w-4 h-4 mr-2" />
                Reservation
              </span>
              <h1 className="mb-4 font-serif text-4xl font-medium md:text-6xl text-white tracking-tight">BOOK <span className="text-gradient-gold italic">APPOINTMENT</span></h1>
              <p className="text-zinc-400 font-light text-lg">Schedule your premium salon experience</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Personal Details */}
              <div className="space-y-8 md:col-span-2">
                <div className="flex items-center border-b border-zinc-800 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 mr-4">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-zinc-100 tracking-wide">
                    Personal Details
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Full Name</label>
                    <Input 
                      required 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe" 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Phone Number</label>
                    <Input 
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210" 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Email Address</label>
                    <Input 
                      required 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com" 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Gender</label>
                    <Select 
                      required 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white"
                    >
                      <option value="" className="bg-zinc-900">Select Gender</option>
                      <option value="female" className="bg-zinc-900">Female</option>
                      <option value="male" className="bg-zinc-900">Male</option>
                      <option value="other" className="bg-zinc-900">Other</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-8 md:col-span-2 mt-4">
                <div className="flex items-center border-b border-zinc-800 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 mr-4">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-zinc-100 tracking-wide">
                    Service Selection
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Category</label>
                    <Select
                      required
                      name="category"
                      value={selectedCategory}
                      onChange={handleInputChange}
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white"
                      disabled={isLoading}
                    >
                      <option value="" className="bg-zinc-900">{isLoading ? 'Loading...' : 'Select Category'}</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Service</label>
                    <Select 
                      required 
                      name="service_id"
                      value={formData.service_id}
                      onChange={handleInputChange}
                      disabled={!selectedCategory || isLoading} 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white disabled:opacity-50"
                    >
                      <option value="" className="bg-zinc-900">{isLoading ? 'Loading...' : 'Select Service'}</option>
                      {filteredServices.map(s => (
                        <option key={s.id} value={s.id} className="bg-zinc-900">{s.name} - ₹{s.price}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Preferred Stylist (Optional)</label>
                    <Select 
                      name="staff_id"
                      value={formData.staff_id}
                      onChange={handleInputChange}
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white" 
                      disabled={isLoading}
                    >
                      <option value="" className="bg-zinc-900">{isLoading ? 'Loading...' : 'Any Available Stylist'}</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id} className="bg-zinc-900">{s.name} - {s.speciality}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-8 md:col-span-2 mt-4">
                <div className="flex items-center border-b border-zinc-800 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 mr-4">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-serif font-medium text-zinc-100 tracking-wide">
                    Date & Time
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Preferred Date</label>
                    <Input 
                      required 
                      type="date" 
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]} 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white [color-scheme:dark]" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Preferred Time</label>
                    <Select 
                      required 
                      name="booking_time"
                      value={formData.booking_time}
                      onChange={handleInputChange}
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white"
                    >
                      <option value="" className="bg-zinc-900">Select Time Slot</option>
                      <option value="10:00" className="bg-zinc-900">10:00 AM</option>
                      <option value="11:00" className="bg-zinc-900">11:00 AM</option>
                      <option value="12:00" className="bg-zinc-900">12:00 PM</option>
                      <option value="13:00" className="bg-zinc-900">01:00 PM</option>
                      <option value="14:00" className="bg-zinc-900">02:00 PM</option>
                      <option value="15:00" className="bg-zinc-900">03:00 PM</option>
                      <option value="16:00" className="bg-zinc-900">04:00 PM</option>
                      <option value="17:00" className="bg-zinc-900">05:00 PM</option>
                      <option value="18:00" className="bg-zinc-900">06:00 PM</option>
                      <option value="19:00" className="bg-zinc-900">07:00 PM</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3 md:col-span-2 mt-4">
                <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Additional Notes (Optional)</label>
                <Textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special requests or allergies we should know about?" 
                  className="h-32 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600 resize-none" 
                />
              </div>
            </div>

            <div className="mt-16 border-t border-zinc-900 pt-10">
              <Button type="submit" variant="luxury" size="lg" className="w-full text-sm tracking-[0.2em] uppercase font-semibold h-16" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Confirm Reservation'}
              </Button>
              <p className="mt-6 text-center text-xs text-zinc-500 tracking-wide uppercase">
                By booking, you agree to our premium cancellation policy.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
