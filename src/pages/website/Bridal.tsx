import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { serviceService } from '@/src/services/services';
import { galleryService } from '@/src/services/gallery';

export default function Bridal() {
  const [bridalServices, setBridalServices] = useState<any[]>([]);
  const [bridalGallery, setBridalGallery] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Assuming 'Bridal' category has a specific name or we fetch all and filter
        const [services, gallery] = await Promise.all([
          serviceService.getActiveServices(),
          galleryService.getGalleryItems()
        ]);
        
        // Filter services by category name if possible, or just use a known ID. 
        // For now, we'll try to find a category named 'Bridal' or similar, or just show some services.
        // In a real app, you'd fetch the category ID first or have a specific endpoint.
        // Let's assume we filter by a category name containing 'Bridal' if we had categories, 
        // but since we only have services here, we might need to fetch categories first.
        const categories = await serviceService.getCategories();
        const bridalCategory = categories?.find(c => c.name.toLowerCase().includes('bridal'));
        
        if (bridalCategory) {
          setBridalServices(services?.filter(s => s.category_id === bridalCategory.id) || []);
        } else {
           // Fallback if no bridal category found
           setBridalServices([]);
        }

        setBridalGallery(gallery?.filter(g => g.category.toLowerCase().includes('bridal')) || []);
      } catch (error) {
        console.error('Failed to load bridal data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] w-full bg-black overflow-hidden flex items-center justify-center border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/bridal-luxury/1920/1080"
            alt="Bridal Makeup"
            className="h-full w-full object-cover opacity-40 scale-105 transform origin-center grayscale-[20%]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        </div>
        
        <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-2 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase backdrop-blur-sm">
              <Sparkles className="mr-2 h-3 w-3" /> The Perfect Look
            </span>
          </motion.div>
          
          <motion.h1 
            className="mb-8 max-w-5xl font-serif text-5xl font-medium leading-[1.1] text-zinc-50 md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            BRIDAL ELEGANCE <br/>
            <span className="text-gradient-gold italic font-light tracking-tight">REDEFINED</span>
          </motion.h1>
          
          <motion.p 
            className="mb-12 max-w-2xl text-lg text-zinc-400 md:text-xl font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Your special day deserves nothing less than perfection. Our expert bridal team ensures you look breathtaking from every angle.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button variant="luxury" size="lg" className="h-14 px-10 text-base tracking-wider uppercase font-semibold" asChild>
              <Link to="/book">Book Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 relative">
        <div className="absolute left-0 top-1/4 w-1/3 h-[500px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">The Collection</span>
            <h2 className="font-serif text-4xl font-medium text-zinc-50 md:text-6xl mb-6">BRIDAL PACKAGES</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading bridal packages...</div>
          ) : bridalServices.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No bridal packages available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {bridalServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Card className="group relative overflow-hidden border-zinc-800 bg-zinc-950/80 transition-all duration-500 hover:border-gold-500/50 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.15)] h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="relative p-10 text-center flex flex-col h-full z-10">
                      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 group-hover:scale-110 transition-transform duration-500">
                        <Heart className="h-8 w-8" />
                      </div>
                      <h3 className="mb-4 text-3xl font-serif font-medium text-zinc-100">{service.name}</h3>
                      <p className="mb-8 text-zinc-400 font-light leading-relaxed flex-1">{service.description}</p>
                      <p className="mb-10 text-4xl font-serif text-gold-400">₹{service.price}</p>
                      
                      <ul className="mb-10 space-y-4 text-left text-sm text-zinc-400 font-light border-t border-zinc-900 pt-8">
                        <li className="flex items-center"><CheckCircle2 className="mr-3 h-5 w-5 text-gold-500" /> Premium Products Used</li>
                        <li className="flex items-center"><CheckCircle2 className="mr-3 h-5 w-5 text-gold-500" /> Trial Session Available</li>
                        <li className="flex items-center"><CheckCircle2 className="mr-3 h-5 w-5 text-gold-500" /> Long-lasting Finish</li>
                      </ul>
                      
                      <Button variant="outline" className="w-full border-zinc-800 text-zinc-300 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 uppercase tracking-wider text-xs font-semibold h-12 mt-auto" asChild>
                        <Link to="/book">Book Now</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-32 bg-zinc-950 text-white relative border-y border-zinc-900">
        <div className="absolute right-0 top-1/4 w-1/3 h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">The Brides</span>
            <h2 className="font-serif text-4xl font-medium md:text-5xl mb-6">BRIDAL PORTFOLIO</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading gallery...</div>
          ) : bridalGallery.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No bridal gallery items available.</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {bridalGallery.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  className="group relative overflow-hidden rounded-xl bg-black aspect-[3/4] border border-zinc-800 hover:border-gold-500/50 transition-colors duration-500"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <img
                    src={item.media_url}
                    alt={item.title || "Bridal Makeup"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 scale-95 group-hover:scale-100">
                    <div className="h-12 w-12 rounded-full border border-gold-500/50 bg-black/50 backdrop-blur-sm flex items-center justify-center text-gold-400 mb-4">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
             <Button variant="luxuryOutline" className="uppercase tracking-wider text-xs h-12 px-8" asChild>
               <Link to="/gallery">View Full Gallery</Link>
             </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-pattern/1920/1080')] opacity-5 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="mb-6 font-serif text-4xl font-medium text-white md:text-6xl">LET'S DISCUSS YOUR <span className="text-gradient-gold italic">BIG DAY</span></h2>
          <p className="mb-12 text-xl text-zinc-400 max-w-2xl mx-auto font-light tracking-wide">
            Schedule a free consultation with our lead bridal makeup artist to plan your perfect look.
          </p>
          <Button variant="luxury" size="lg" className="h-16 px-12 text-sm tracking-[0.2em] uppercase font-semibold" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
