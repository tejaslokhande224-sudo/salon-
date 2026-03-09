import { supabase } from '../lib/supabaseClient';

export const galleryService = {
  async getGalleryItems() {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async createGalleryItem(itemData: any) {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert([itemData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateGalleryItem(id: string, itemData: any) {
    const { data, error } = await supabase
      .from('gallery_items')
      .update(itemData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteGalleryItem(id: string) {
    const { error } = await supabase
      .from('gallery_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
