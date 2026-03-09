import { supabase } from '../lib/supabaseClient';

export const serviceService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getActiveServices() {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createService(serviceData: any) {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateService(id: string, serviceData: any) {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteService(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
