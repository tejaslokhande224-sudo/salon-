import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Star, Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { staffService } from '@/src/services/staff';

export default function About() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      try {
        setIsLoading(true);
        const data = await staffService.getActiveStaff();
        setStaff(data || []);
      } catch (error) {
        console.error('Failed to load staff:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStaff();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="relative py-32 text-center text-white overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-texture/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              Our Story
            </span>
            <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6 tracking-tight">ABOUT <span className="text-gradient-gold italic">GLOW UP</span></h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Discover the story behind Thane's premier luxury unisex salon, where beauty meets artistry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 relative">
        <div className="absolute left-0 top-1/2 w-1/3 h-[500px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none transform -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent mix-blend-overlay z-10" />
                <img
                  src="https://picsum.photos/seed/saloninterior-luxury/800/1000"
                  alt="Salon Interior"
                  className="w-full object-cover aspect-[4/5] grayscale-[20%] contrast-125"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 hidden h-48 w-48 rounded-full border border-gold-500/30 bg-black/80 backdrop-blur-md p-8 text-white lg:flex flex-col justify-center items-center text-center shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                <span className="text-5xl font-serif font-medium text-gold-400">10+</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] mt-2 text-zinc-400">Years of<br/>Excellence</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">The Vision</span>
                <h2 className="font-serif text-4xl font-medium text-zinc-50 md:text-5xl leading-tight">OUR PHILOSOPHY</h2>
              </div>
              
              <div className="space-y-6 text-lg text-zinc-400 font-light leading-relaxed">
                <p>
                  At Glow Up Unisex Salon, we believe that beauty is an experience, not just a service. Founded with a vision to bring world-class grooming to Thane, we have curated a space where luxury meets expertise.
                </p>
                <p>
                  Our team of passionate stylists and therapists are dedicated to understanding your unique needs, ensuring every visit leaves you feeling rejuvenated, confident, and glowing. We blend modern techniques with premium products to deliver unparalleled results.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-10 pt-10 border-t border-zinc-900">
                <div>
                  <h4 className="text-4xl font-serif font-medium text-gold-400 mb-2">5000+</h4>
                  <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Happy Clients</p>
                </div>
                <div>
                  <h4 className="text-4xl font-serif font-medium text-gold-400 mb-2">50+</h4>
                  <p className="text-zinc-500 text-sm uppercase tracking-wider font-semibold">Premium Services</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-zinc-950 py-32 text-white relative border-y border-zinc-900">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">The Pillars</span>
            <h2 className="font-serif text-4xl font-medium md:text-5xl mb-6">WHY CHOOSE US</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Premium Products', icon: Star, desc: 'We use only top-tier international brands for all our treatments.' },
              { title: 'Expert Professionals', icon: Award, desc: 'Our staff undergoes continuous training to master the latest trends.' },
              { title: 'Personalized Care', icon: Heart, desc: 'Every service is tailored to your specific hair and skin type.' },
              { title: 'Hygiene First', icon: ShieldCheck, desc: 'Strict sanitization protocols ensure a safe and clean environment.' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="rounded-xl border border-zinc-800 bg-black p-10 text-center transition-all duration-500 hover:border-gold-500/30 hover:-translate-y-2 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 transition-transform duration-500 group-hover:scale-110 group-hover:bg-gold-500/10">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-serif font-medium text-zinc-100">{item.title}</h3>
                <p className="text-zinc-400 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 relative">
        <div className="absolute right-0 top-1/2 w-1/3 h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none transform -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">The Artists</span>
            <h2 className="font-serif text-4xl font-medium text-zinc-50 md:text-5xl mb-6">MEET OUR EXPERTS</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading experts...</div>
          ) : staff.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No experts available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {staff.map((member, i) => (
                <motion.div 
                  key={member.id} 
                  className="group text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div className="mx-auto mb-8 h-72 w-72 overflow-hidden rounded-full border border-zinc-800 p-2 transition-all duration-500 group-hover:border-gold-500/50">
                    <div className="h-full w-full rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={member.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=18181b&color=eab308`}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-zinc-100 mb-2">{member.name}</h3>
                  <p className="text-gold-400 text-sm uppercase tracking-wider font-semibold">{member.speciality}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 text-center border-t border-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-pattern/1920/1080')] opacity-5 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="mb-6 font-serif text-4xl font-medium text-white md:text-6xl">EXPERIENCE THE <span className="text-gradient-gold italic">DIFFERENCE</span></h2>
          <p className="mb-12 text-xl text-zinc-400 max-w-2xl mx-auto font-light tracking-wide">
            Join thousands of satisfied clients who trust us with their beauty needs.
          </p>
          <Button variant="luxury" size="lg" className="h-16 px-12 text-sm tracking-[0.2em] uppercase font-semibold" asChild>
            <Link to="/book">Book Your Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
