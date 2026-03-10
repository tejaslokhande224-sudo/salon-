import { supabase } from '../lib/supabaseClient';

export const reviewService = {
  async getReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getVisibleReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_visible', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createReview(reviewData: any) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        customer_name: reviewData.customer_name,
        rating: reviewData.rating,
        comment: reviewData.comment,
        service_tag: reviewData.service_tag || null,
        is_visible: reviewData.is_visible ?? false,
        is_featured: reviewData.is_featured ?? false
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateReview(id: string, reviewData: any) {
    const { data, error } = await supabase
      .from('reviews')
      .update(reviewData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
