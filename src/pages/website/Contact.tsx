import React, { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { settingsService } from '@/src/services/settings';
import { enquiryService } from '@/src/services/enquiries';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service_interest: '',
    message: ''
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await enquiryService.createEnquiry({
        ...formData,
        status: 'new'
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send enquiry:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="relative py-32 text-center text-white overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-contact/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              Get In Touch
            </span>
            <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6 tracking-tight">CONTACT <span className="text-gradient-gold italic">US</span></h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              We'd love to hear from you. Reach out for enquiries, feedback, or to schedule your premium experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-32 relative">
        <div className="absolute left-0 top-1/4 w-1/3 h-[500px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute right-0 bottom-1/4 w-1/3 h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div 
              className="space-y-16"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="font-serif text-4xl font-medium text-zinc-50 mb-6">VISIT OUR <span className="text-gradient-gold italic">STUDIO</span></h2>
                <p className="text-zinc-400 font-light text-lg leading-relaxed max-w-md">
                  Our team is ready to assist you with any questions about our services, pricing, or availability. Step into a world of luxury.
                </p>
              </div>

              {isLoading ? (
                <div className="text-zinc-500 py-10">Loading contact information...</div>
              ) : settings ? (
                <div className="space-y-10">
                  <div className="flex items-start group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="ml-8 pt-2">
                      <h3 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase mb-2">Location</h3>
                      <p className="text-zinc-500 font-light leading-relaxed">{settings.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="ml-8 pt-2">
                      <h3 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase mb-2">Direct Line</h3>
                      <p className="text-zinc-500 font-light text-lg">{settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="ml-8 pt-2">
                      <h3 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase mb-2">Email</h3>
                      <p className="text-zinc-500 font-light text-lg">{settings.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="ml-8 pt-2">
                      <h3 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase mb-2">Opening Hours</h3>
                      <div className="space-y-2 text-zinc-500 font-light">
                        <p className="flex justify-between w-48"><span>Mon - Fri</span> <span>{settings.opening_hours?.monday || '10:00 AM - 08:00 PM'}</span></p>
                        <p className="flex justify-between w-48"><span>Saturday</span> <span>{settings.opening_hours?.saturday || '09:00 AM - 09:00 PM'}</span></p>
                        <p className="flex justify-between w-48"><span>Sunday</span> <span>{settings.opening_hours?.sunday || '09:00 AM - 09:00 PM'}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 py-10">Contact information not available.</div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] md:p-12 relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />
              
              {isSubmitted ? (
                <div className="flex h-full flex-col items-center justify-center text-center relative z-10 py-20">
                  <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <Send className="h-10 w-10" />
                  </div>
                  <h3 className="mb-4 text-3xl font-serif font-medium text-zinc-50">Message <span className="text-gradient-gold italic">Sent</span></h3>
                  <p className="text-zinc-400 font-light text-lg mb-10">Thank you for contacting us. We will get back to you shortly.</p>
                  <Button variant="luxuryOutline" className="uppercase tracking-wider text-xs font-semibold h-12 px-8" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <h3 className="text-3xl font-serif font-medium text-zinc-50 mb-10">Send an <span className="text-gradient-gold italic">Enquiry</span></h3>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Full Name</label>
                    <Input 
                      required 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name" 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Phone</label>
                      <Input 
                        required 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your Phone Number" 
                        className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Email</label>
                      <Input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email Address" 
                        className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Service Interest</label>
                    <Input 
                      name="service_interest"
                      value={formData.service_interest}
                      onChange={handleInputChange}
                      placeholder="e.g., Bridal Makeup, Hair Spa" 
                      className="h-14 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Message</label>
                    <Textarea 
                      required 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?" 
                      className="h-32 bg-black border-zinc-800 focus-visible:border-gold-500 focus-visible:ring-gold-500/20 text-white placeholder:text-zinc-600 resize-none" 
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="luxury" 
                    className="w-full h-16 text-sm tracking-[0.2em] uppercase font-semibold mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[500px] w-full bg-zinc-900 relative grayscale-[50%] contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        <iframe
          src={settings?.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.204554316278!2d72.9625!3d19.186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDExJzA5LjYiTiA3MsKwNTcnNDUuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Salon Location"
        ></iframe>
      </section>
    </div>
  );
}
