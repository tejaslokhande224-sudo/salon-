import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Calendar, Tag, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { offerService } from '@/src/services/offers';

export default function Offers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        setIsLoading(true);
        const data = await offerService.getActiveOffers();
        setOffers(data || []);
      } catch (error) {
        console.error('Failed to load offers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="relative py-32 text-center text-white overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-offers/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              Exclusive Deals
            </span>
            <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6 tracking-tight">SPECIAL <span className="text-gradient-gold italic">OFFERS</span></h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              Premium packages designed to give you the best value for your beauty journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-32 relative">
        <div className="absolute left-0 top-1/4 w-1/3 h-[500px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute right-0 bottom-1/4 w-1/3 h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No active offers at the moment. Check back later!</div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Card className="group relative overflow-hidden border-zinc-800 bg-zinc-950/80 transition-all duration-500 hover:border-gold-500/50 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.15)] h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Decorative Corner */}
                    <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gold-500/10 blur-2xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-gold-500/20" />
                    
                    <CardContent className="relative p-10 flex flex-col h-full z-10">
                      <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 group-hover:scale-110 transition-transform duration-500">
                        <Tag className="h-6 w-6" />
                      </div>
                      
                      <h3 className="mb-4 text-3xl font-serif font-medium text-zinc-100">{offer.title}</h3>
                      <p className="mb-8 text-zinc-400 font-light leading-relaxed flex-1">{offer.description}</p>
                      
                      <div className="mb-10 flex items-end space-x-4">
                        <span className="text-5xl font-serif text-gold-400">₹{offer.offer_price}</span>
                        {offer.original_price && offer.original_price > offer.offer_price && (
                          <span className="text-lg text-zinc-600 line-through mb-1">₹{offer.original_price}</span>
                        )}
                      </div>

                      <div className="mb-10 flex items-center text-xs tracking-wider uppercase font-semibold text-zinc-500 border-t border-zinc-900 pt-6">
                        <Calendar className="mr-3 h-4 w-4 text-gold-500" />
                        {offer.valid_to ? `Valid until ${new Date(offer.valid_to).toLocaleDateString()}` : 'Ongoing Offer'}
                      </div>

                      <Button variant="luxury" className="w-full uppercase tracking-wider text-xs font-semibold h-14" asChild>
                        <Link to="/book">Claim Offer</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
