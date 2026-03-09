import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/Button';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { galleryService } from '@/src/services/gallery';

const categories = ['All', 'Hair', 'Nails', 'Bridal', 'Skin', 'Salon Interior'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        setIsLoading(true);
        const data = await galleryService.getGalleryItems();
        setGalleryItems(data || []);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadGallery();
  }, []);

  const filteredGallery = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="relative py-32 text-center text-white overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-gallery/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-6 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-4 h-4 mr-2" />
              The Portfolio
            </span>
            <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6 tracking-tight">OUR <span className="text-gradient-gold italic">GALLERY</span></h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              A glimpse into the premium transformations and luxurious ambiance at Glow Up Unisex Salon.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'luxury' : 'outline'}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-8 h-12 text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${
                  activeCategory !== category 
                    ? 'border-zinc-800 text-zinc-400 hover:border-gold-500 hover:text-gold-400 bg-transparent' 
                    : ''
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-32 relative">
        <div className="absolute left-0 top-1/4 w-1/3 h-[500px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute right-0 bottom-1/4 w-1/3 h-[500px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading gallery...</div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No images found for this category.</div>
          ) : (
            <motion.div 
              layout
              className="columns-1 gap-8 sm:columns-2 lg:columns-3 [&>div:not(:first-child)]:mt-8"
            >
              <AnimatePresence>
                {filteredGallery.map((item, i) => (
                  <motion.div 
                    key={item.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative overflow-hidden rounded-xl bg-zinc-900 break-inside-avoid border border-zinc-800 hover:border-gold-500/50 transition-colors duration-500"
                  >
                    <img
                      src={item.media_url}
                      alt={item.title || item.category}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 scale-95 group-hover:scale-100">
                      <div className="h-12 w-12 rounded-full border border-gold-500/50 bg-black/50 backdrop-blur-sm flex items-center justify-center text-gold-400 mb-4">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-white font-serif text-2xl font-medium tracking-wide">
                        {item.category}
                      </span>
                      {item.title && (
                        <span className="text-zinc-300 text-sm mt-2">{item.title}</span>
                      )}
                      <div className="w-8 h-px bg-gold-500 mt-4" />
                    </div>

                    {/* Default Label */}
                    <div className="absolute bottom-6 left-6 right-6 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                      <span className="rounded-full border border-zinc-700 bg-black/60 px-4 py-1.5 text-xs font-semibold tracking-widest text-zinc-300 uppercase backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
