import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { Textarea } from '@/src/components/ui/Textarea';
import { Search, Check, X, Star, Trash2, Sparkles, Plus, Edit, StarHalf } from 'lucide-react';
import { reviewService } from '@/src/services/reviews';

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
    service_tag: '',
    is_visible: true,
    is_featured: false
  });

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
      await loadReviews();
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('Failed to update review status.');
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      await reviewService.updateReview(id, { is_featured: !currentStatus });
      await loadReviews();
    } catch (error) {
      console.error('Failed to update featured status:', error);
      alert('Failed to update featured status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(id);
        await loadReviews();
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('Failed to delete review.');
      }
    }
  };

  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      customer_name: '',
      rating: 5,
      comment: '',
      service_tag: '',
      is_visible: true,
      is_featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (review: any) => {
    setEditingReview(review);
    setFormData({
      customer_name: review.customer_name || '',
      rating: review.rating || 5,
      comment: review.comment || '',
      service_tag: review.service_tag || '',
      is_visible: review.is_visible ?? true,
      is_featured: review.is_featured ?? false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, formData);
      } else {
        await reviewService.createReview(formData);
      }
      await loadReviews();
      setIsModalOpen(false);
      setEditingReview(null);
      setFormData({
        customer_name: '',
        rating: 5,
        comment: '',
        service_tag: '',
        is_visible: true,
        is_featured: false
      });
    } catch (error) {
      console.error('Failed to save review:', error);
      alert('Failed to save review.');
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
        <Button variant="luxury" onClick={openAddModal} className="uppercase tracking-wider text-xs font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Add Review
        </Button>
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
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">Loading reviews...</td>
                  </tr>
                ) : filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">No reviews found.</td>
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
                      <td className="px-6 py-4">
                        {review.is_featured ? (
                          <Badge variant="luxury">Featured</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">Standard</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className={`h-8 w-8 ${review.is_featured ? 'text-gold-500 border-gold-500/30 hover:bg-gold-500/10' : 'text-zinc-500 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300'}`}
                            onClick={() => handleToggleFeatured(review.id, review.is_featured)}
                            title={review.is_featured ? "Remove Featured" : "Mark as Featured"}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className={`h-8 w-8 ${review.is_visible ? 'text-zinc-500 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-300' : 'text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
                            onClick={() => handleToggleApproval(review.id, review.is_visible)}
                            title={review.is_visible ? "Hide Review" : "Show Review"}
                          >
                            {review.is_visible ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10" title="Edit Review" onClick={() => openEditModal(review)}>
                            <Edit className="h-4 w-4" />
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <h2 className="mb-6 text-2xl font-serif font-medium text-zinc-50">
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Customer Name</label>
                <Input
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Rating (1-5)</label>
                <Input
                  required
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Service Tag (Optional)</label>
                <Input
                  value={formData.service_tag}
                  onChange={(e) => setFormData({ ...formData, service_tag: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50"
                  placeholder="e.g., Bridal Makeup"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Comment</label>
                <Textarea
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="h-24 bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-gold-500/50 resize-none"
                  placeholder="Write the review here..."
                />
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-900 text-gold-500 focus:ring-gold-500/20"
                  />
                  <span>Visible on Website</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-zinc-700 bg-zinc-900 text-gold-500 focus:ring-gold-500/20"
                  />
                  <span>Featured Review</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-zinc-800 text-zinc-300 hover:bg-zinc-800">
                  Cancel
                </Button>
                <Button type="submit" variant="luxury">
                  {editingReview ? 'Save Changes' : 'Add Review'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
