import { supabase } from '../lib/supabaseClient';

export const offerService = {
  async getOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getActiveOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createOffer(offerData: any) {
    const { data, error } = await supabase
      .from('offers')
      .insert([offerData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateOffer(id: string, offerData: any) {
    const { data, error } = await supabase
      .from('offers')
      .update(offerData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteOffer(id: string) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getActiveOfferCount() {
    const { count, error } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    if (error) throw error;
    return count || 0;
  }
};
