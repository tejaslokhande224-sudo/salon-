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

  async createCategory(categoryData: any) {
    const { data, error } = await supabase
      .from('service_categories')
      .insert([categoryData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, categoryData: any) {
    const { data, error } = await supabase
      .from('service_categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
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
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateService(id: string, serviceData: any) {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteService(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    if (error) {
      if (error.code === '23503') {
        const { error: updateError } = await supabase
          .from('services')
          .update({ is_active: false })
          .eq('id', id);
        if (updateError) throw updateError;
      } else {
        throw error;
      }
    }
  }
};
