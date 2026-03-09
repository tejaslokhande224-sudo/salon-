import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Search, Check, X, Star, Trash2, Sparkles } from 'lucide-react';
import { reviewService } from '@/src/services/reviews';

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setIsLoading(true);
      const data = await reviewService.getReviews();
      setReviews(data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      await reviewService.updateReview(id, { is_visible: !currentStatus });
      setReviews(reviews.map(r => r.id === id ? { ...r, is_visible: !currentStatus } : r));
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('Failed to update review status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review.');
      }
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight text-zinc-50 flex items-center">
            Reviews Management <Sparkles className="w-5 h-5 ml-3 text-gold-500" />
          </h1>
          <p className="text-zinc-400 mt-1 font-light">Manage customer feedback and testimonials</p>
        </div>
      </div>

      <Card className="bg-zinc-950/80 border-zinc-800 backdrop-blur-md">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search reviews..."
                className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-gold-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-900/50 text-xs uppercase text-zinc-500 font-semibold tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Comment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading reviews...</td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No reviews found.</td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-gold-500 font-medium border border-zinc-700">
                            {review.customer_name?.charAt(0)}
                          </div>
                          <div className="font-medium text-zinc-100">{review.customer_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex text-gold-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="line-clamp-2 italic text-zinc-300">"{review.comment}"</p>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {review.is_visible ? (
                          <Badge variant="success">Visible</Badge>
                        ) : (
                          <Badge variant="warning">Hidden</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className={`h-8 w-8 ${review.is_visible ? 'text-zinc-500 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
                            onClick={() => handleToggleApproval(review.id, review.is_visible)}
                            title={review.is_visible ? "Hide Review" : "Approve Review"}
                          >
                            {review.is_visible ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10" title="Delete Review" onClick={() => handleDelete(review.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
