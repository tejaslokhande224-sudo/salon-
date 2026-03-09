import { supabase } from '../lib/supabaseClient';

export const settingsService = {
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateSettings(settingsData: any) {
    // Check if settings exist
    const { data: existing } = await supabase.from('settings').select('id').limit(1).single();
    
    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update(settingsData)
        .eq('id', existing.id)
        .select();
      if (error) throw error;
      return data[0];
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert([settingsData])
        .select();
      if (error) throw error;
      return data[0];
    }
  }
};
