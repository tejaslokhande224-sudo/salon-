import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import { ArrowRight, Star, CheckCircle2, MapPin, Clock, Phone, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { heroSlideService } from '@/src/services/heroSlides';
import { serviceService } from '@/src/services/services';
import { offerService } from '@/src/services/offers';
import { reviewService } from '@/src/services/reviews';

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [topReviews, setTopReviews] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHero() {
      try {
        const slidesData = await heroSlideService.getActiveSlides();
        if (slidesData && slidesData.length > 0) {
          setSlides(slidesData);
        } else {
          setSlides([{
            id: 'fallback',
            title: 'YOUR BEAUTY JOURNEY',
            subtitle: 'STARTS HERE',
            media_url: 'https://picsum.photos/seed/luxury-salon-dark/1920/1080',
            media_type: 'image',
            button_text: 'Book Your Appointment',
            button_link: '/book'
          }]);
        }
      } catch (error) {
        console.error('Failed to load hero slides:', error);
      } finally {
        setIsLoading(false);
      }
    }

    async function loadOtherData() {
      try {
        const [servicesData, offersData, reviewsData] = await Promise.all([
          serviceService.getActiveServices(),
          offerService.getActiveOffers(),
          reviewService.getVisibleReviews()
        ]);

        setFeaturedServices((servicesData || []).filter((s: any) => s.is_featured).slice(0, 6));
        setOffers((offersData || []).slice(0, 3));
        setTopReviews((reviewsData || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to load other home data:', error);
      }
    }

    loadHero();
    loadOtherData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const duration = slides[currentSlide]?.duration_seconds || 5;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration * 1000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide, slides]);

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] w-full bg-black overflow-hidden flex items-center justify-center">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {!isLoading && slides.length > 0 && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                {slides[currentSlide].media_type === 'video' ? (
                  <video
                    src={slides[currentSlide].media_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover opacity-40"
                  />
                ) : (
                  <img
                    src={slides[currentSlide].media_url}
                    alt={slides[currentSlide].title}
                    className="h-full w-full object-cover opacity-30"
                    referrerPolicy="no-referrer"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          
          {/* Gold Light Streaks */}
          <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-gold-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none transform -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-1/3 h-[400px] bg-amber-600/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none transform translate-y-1/2" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-6 inline-flex items-center rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-2 text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-2" />
              Premium Unisex Salon
            </span>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isLoading && slides.length > 0 && (
              <motion.div
                key={`content-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <h1 className="mb-8 max-w-5xl font-serif text-5xl font-medium leading-[1.1] text-zinc-50 md:text-7xl lg:text-8xl uppercase">
                  {slides[currentSlide].title?.split(' ').slice(0, -1).join(' ')} <br/>
                  <span className="text-gradient-gold italic font-light tracking-tight">
                    {slides[currentSlide].title?.split(' ').slice(-1)}
                  </span>
                </h1>
                
                <p className="mb-12 max-w-2xl text-lg text-zinc-400 md:text-xl font-light tracking-wide uppercase">
                  {slides[currentSlide].subtitle || 'AESTHETIC • SKIN • HAIR • NAILS • MAKEUP'}
                </p>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
                  <Button variant="luxury" size="lg" className="h-14 px-10 text-base tracking-wider uppercase font-semibold" asChild>
                    <Link to={slides[currentSlide].button_link || '/book'}>
                      {slides[currentSlide].button_text || 'Book Your Appointment'}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-14 px-10 text-base tracking-wider uppercase font-semibold border-zinc-700 text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-500" asChild>
                    <Link to="/services">Explore Services</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        {!isLoading && slides.length > 1 && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? 'w-8 bg-gold-500' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-3">Scroll to discover</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="border-y border-zinc-900 bg-zinc-950/50 py-16 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5 text-center">
            {[
              { title: 'Premium Products', icon: Star },
              { title: 'Expert Stylists', icon: CheckCircle2 },
              { title: 'Luxury Ambiance', icon: Sparkles },
              { title: 'Bridal Specialists', icon: Star },
              { title: 'Easy Booking', icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center space-y-4 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 transition-all duration-500 group-hover:bg-gold-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold tracking-widest text-zinc-400 uppercase group-hover:text-gold-400 transition-colors">{item.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-32 bg-black relative">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-0 w-1/3 h-[600px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none transform -translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Luxury Grooming</span>
            <h2 className="font-serif text-4xl font-medium text-zinc-50 md:text-6xl mb-6">SIGNATURE SERVICES</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Card className="group overflow-hidden border-zinc-800 bg-zinc-950/80 transition-all duration-500 hover:border-gold-500/50 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.15)] h-full flex flex-col">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${service.id}/800/600`}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-serif text-2xl font-medium text-white mb-2">{service.name}</h3>
                      <p className="text-gold-400 font-medium tracking-wide">₹{service.price}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col justify-between bg-zinc-950">
                    <p className="mb-8 text-sm text-zinc-400 leading-relaxed font-light">{service.description}</p>
                    <Button variant="outline" className="w-full border-zinc-800 text-zinc-300 hover:bg-gold-500 hover:text-black hover:border-gold-500 transition-all duration-300 uppercase tracking-wider text-xs font-semibold h-12" asChild>
                      <Link to="/book">Book Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Button variant="link" className="text-gold-500 text-sm tracking-[0.2em] uppercase font-semibold hover:text-gold-400" asChild>
              <Link to="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="bg-zinc-950 py-32 relative border-y border-zinc-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://picsum.photos/seed/texture-dark/1000/1000')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute left-1/4 top-1/4 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 flex flex-col items-center justify-between md:flex-row border-b border-zinc-800 pb-8">
            <div>
              <h2 className="font-serif text-4xl font-medium text-white md:text-5xl mb-4">EXCLUSIVE OFFERS</h2>
              <p className="text-lg text-zinc-400 font-light">Limited time luxury deals for our premium clients</p>
            </div>
            <Button variant="luxuryOutline" className="mt-8 md:mt-0 uppercase tracking-wider text-xs h-12 px-8" asChild>
              <Link to="/offers">View All Offers</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {offers.map((offer, i) => (
              <motion.div 
                key={offer.id} 
                className="relative rounded-xl border border-zinc-800 bg-black p-10 transition-all duration-500 hover:border-gold-500/50 group overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="mb-4 font-serif text-2xl font-medium text-gold-400">{offer.title}</h3>
                <p className="mb-8 text-zinc-400 font-light leading-relaxed">{offer.description}</p>
                <div className="mb-10 flex items-end space-x-4">
                  <span className="text-5xl font-serif text-white">₹{offer.offer_price}</span>
                  <span className="text-lg text-zinc-600 line-through mb-1">₹{offer.original_price}</span>
                </div>
                <Button variant="luxury" className="w-full uppercase tracking-wider text-xs font-semibold h-12" asChild>
                  <Link to="/book">Claim Offer</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-black relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-20 text-center flex flex-col items-center">
            <span className="text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase mb-4">Client Stories</span>
            <h2 className="font-serif text-4xl font-medium text-zinc-50 md:text-5xl mb-6">THE GLOW UP EXPERIENCE</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {topReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Card className="bg-zinc-950 border-zinc-900 shadow-none h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-10 flex-1 flex flex-col">
                    <div className="mb-8 flex text-gold-500 space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mb-10 text-lg italic text-zinc-300 font-serif leading-relaxed flex-1">"{review.comment}"</p>
                    <div className="flex items-center space-x-4 mt-auto">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-lg font-serif text-gold-400">
                        {review.customer_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100 tracking-wide">{review.customer_name}</p>
                        <p className="text-xs text-gold-500/70 uppercase tracking-wider mt-1">Verified Client</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-32 overflow-hidden border-t border-zinc-900">
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-pattern/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
        
        {/* Dramatic Lighting */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 text-center flex flex-col items-center">
          <h2 className="mb-6 font-serif text-5xl font-medium md:text-7xl text-white">READY FOR YOUR <span className="text-gradient-gold italic">GLOW UP?</span></h2>
          <p className="mb-12 text-xl text-zinc-400 max-w-2xl mx-auto font-light tracking-wide">
            Book your appointment today and let our experts transform your look with our premium luxury services.
          </p>
          <Button variant="luxury" size="lg" className="h-16 px-12 text-sm tracking-[0.2em] uppercase font-semibold" asChild>
            <Link to="/book">Book Your Session Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
