import { supabase } from '../lib/supabaseClient';

export const staffService = {
  async getStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getActiveStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createStaff(staffData: any) {
    const { data, error } = await supabase
      .from('staff')
      .insert([staffData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateStaff(id: string, staffData: any) {
    const { data, error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteStaff(id: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
