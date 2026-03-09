import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { serviceService } from '@/src/services/services';

export default function Services() {
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [cats, srvs] = await Promise.all([
          serviceService.getCategories(),
          serviceService.getActiveServices()
        ]);
        setCategories(cats || []);
        setServices(srvs || []);
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="relative py-32 text-center text-white overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-services/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              Luxury Grooming
            </span>
            <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6 tracking-tight">OUR <span className="text-gradient-gold italic">SERVICES</span></h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Explore our comprehensive range of premium salon services, tailored to enhance your natural beauty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 relative">
        <div className="absolute left-0 top-1/4 w-1/3 h-[500px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute right-0 bottom-1/4 w-1/3 h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading services...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No services available at the moment.</div>
          ) : (
            <div className="space-y-32">
              {categories.map((category, index) => {
                const categoryServices = services.filter(s => s.category_id === category.id);
                if (categoryServices.length === 0) return null;

                return (
                  <motion.div 
                    key={category.id} 
                    className="scroll-mt-32" 
                    id={category.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="mb-16 flex flex-col items-center justify-between border-b border-zinc-800 pb-8 md:flex-row">
                      <div>
                        <h2 className="font-serif text-3xl font-medium text-zinc-50 md:text-5xl mb-2">{category.name}</h2>
                        <p className="text-zinc-400 font-light text-lg">{category.description}</p>
                      </div>
                      <Button variant="luxuryOutline" className="mt-8 md:mt-0 uppercase tracking-wider text-xs h-12 px-8" asChild>
                        <Link to="/book">Book {category.name}</Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {categoryServices.map((service, i) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                          <Card className="flex flex-col justify-between border-zinc-800 bg-zinc-950/80 transition-all duration-500 hover:border-gold-500/50 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.1)] h-full group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="p-8 flex-1 flex flex-col relative z-10">
                              <div className="mb-6 flex items-start justify-between">
                                <h3 className="text-xl font-serif font-medium text-zinc-100 pr-4">{service.name}</h3>
                                <span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-sm font-medium text-gold-400 whitespace-nowrap">
                                  ₹{service.price}
                                </span>
                              </div>
                              <p className="mb-8 text-sm text-zinc-400 font-light leading-relaxed flex-1">{service.description}</p>
                              <div className="flex items-center justify-between text-sm text-zinc-500 border-t border-zinc-900 pt-6 mt-auto">
                                <span className="uppercase tracking-wider text-xs font-semibold">{service.duration_minutes} mins</span>
                                <Link to="/book" className="flex items-center font-medium text-gold-500 hover:text-gold-400 uppercase tracking-wider text-xs transition-colors group/link">
                                  Book Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
