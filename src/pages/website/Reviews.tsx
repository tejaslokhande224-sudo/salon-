import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { Star, Quote, Sparkles } from 'lucide-react';
import { reviewService } from '@/src/services/reviews';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
    service_tag: '',
    is_visible: false, // Pending admin approval
    is_featured: false
  });

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setIsLoading(true);
      const data = await reviewService.getVisibleReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await reviewService.createReview(formData);
      setIsSubmitted(true);
      setFormData({
        customer_name: '',
        rating: 5,
        comment: '',
        service_tag: '',
        is_visible: false,
        is_featured: false
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="relative py-32 text-center text-white overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/luxury-reviews/1920/1080')] opacity-10 mix-blend-overlay object-cover" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <span className="mb-6 inline-flex items-center text-gold-500 text-sm font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-4 h-4 mr-2" />
            Client Testimonials
          </span>
          <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6 tracking-tight">CLIENT <span className="text-gradient-gold italic">REVIEWS</span></h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Read what our clients have to say about their Glow Up experience, or share your own.
          </p>
        </div>
      </section>

      {/* Leave a Review Form */}
      <section className="py-24 bg-zinc-950/50 border-b border-zinc-900 relative">
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="rounded-2xl border border-zinc-800 bg-black p-8 md:p-12 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/30">
                  <Star className="h-10 w-10 fill-current" />
                </div>
                <h3 className="text-3xl font-serif font-medium text-white mb-4">Thank You!</h3>
                <p className="text-zinc-400 font-light text-lg mb-8">Your review has been submitted and is pending approval.</p>
                <Button variant="luxuryOutline" onClick={() => setIsSubmitted(false)}>Submit Another Review</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-serif font-medium text-white mb-2">Leave a <span className="text-gradient-gold italic">Review</span></h2>
                  <p className="text-zinc-400 font-light">We value your feedback and would love to hear about your experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Your Name</label>
                    <Input 
                      required 
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      className="bg-zinc-900 border-zinc-800 text-white focus-visible:border-gold-500" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Service Received</label>
                    <Input 
                      value={formData.service_tag}
                      onChange={(e) => setFormData({...formData, service_tag: e.target.value})}
                      className="bg-zinc-900 border-zinc-800 text-white focus-visible:border-gold-500" 
                      placeholder="e.g., Haircut, Bridal Makeup"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className={`p-2 transition-colors ${formData.rating >= star ? 'text-gold-500' : 'text-zinc-700 hover:text-gold-500/50'}`}
                      >
                        <Star className={`h-8 w-8 ${formData.rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">Your Review</label>
                  <Textarea 
                    required 
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="h-32 bg-zinc-900 border-zinc-800 text-white focus-visible:border-gold-500 resize-none" 
                    placeholder="Tell us about your experience..."
                  />
                </div>

                <Button type="submit" variant="luxury" className="w-full h-14 text-sm tracking-[0.2em] uppercase font-semibold mt-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-32 relative">
        <div className="absolute top-1/2 right-0 w-1/3 h-[600px] bg-gold-500/5 blur-[150px] rounded-full pointer-events-none transform -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No reviews available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <Card key={review.id} className="bg-zinc-950 border-zinc-900 shadow-none h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -right-4 -top-4 text-zinc-900/50 group-hover:text-gold-500/5 transition-colors duration-500">
                    <Quote className="h-32 w-32" />
                  </div>
                  <CardContent className="p-10 flex-1 flex flex-col relative z-10">
                    <div className="mb-8 flex text-gold-500 space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mb-10 text-lg italic text-zinc-300 font-serif leading-relaxed flex-1">"{review.comment}"</p>
                    <div className="flex items-center justify-between border-t border-zinc-800/50 pt-6 mt-auto">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-lg font-serif text-gold-400">
                          {review.customer_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-100 tracking-wide">{review.customer_name}</p>
                          <p className="text-xs text-gold-500/70 uppercase tracking-wider mt-1">{review.service_tag || 'Verified Client'}</p>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-600">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
