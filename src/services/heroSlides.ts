import { supabase } from '../lib/supabaseClient';

export const heroSlideService = {
  async getSlides() {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getActiveSlides() {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createSlide(slideData: any) {
    const { data, error } = await supabase
      .from('hero_slides')
      .insert([slideData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSlide(id: string, slideData: any) {
    const { data, error } = await supabase
      .from('hero_slides')
      .update(slideData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSlide(id: string) {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getSlideCount() {
    const { count, error } = await supabase
      .from('hero_slides')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};
