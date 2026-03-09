import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/src/components/ui/Card';
import { Star, Quote } from 'lucide-react';
import { reviewService } from '@/src/services/reviews';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    loadReviews();
  }, []);

  return (
    <div className="bg-zinc-50 min-h-screen">
      {/* Header */}
      <section className="bg-zinc-950 py-24 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-5xl font-medium md:text-7xl mb-6">Client Reviews</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Read what our clients have to say about their Glow Up experience.
          </p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No reviews available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <Card key={review.id} className="relative overflow-hidden border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute -right-4 -top-4 text-zinc-100">
                    <Quote className="h-24 w-24" />
                  </div>
                  <CardContent className="relative p-8">
                    <div className="mb-6 flex text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="mb-8 text-lg italic text-zinc-700 leading-relaxed">"{review.comment}"</p>
                    <div className="flex items-center space-x-4 border-t border-zinc-100 pt-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
                        {review.customer_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{review.customer_name}</p>
                        <p className="text-sm text-zinc-500">{new Date(review.created_at).toLocaleDateString()}</p>
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
