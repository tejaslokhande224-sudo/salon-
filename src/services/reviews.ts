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
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createReview(reviewData: any) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateReview(id: string, reviewData: any) {
    const { data, error } = await supabase
      .from('reviews')
      .update(reviewData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteReview(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
