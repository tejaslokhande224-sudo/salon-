import { supabase } from '../lib/supabaseClient';

export const enquiryService = {
  async getEnquiries() {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createEnquiry(enquiryData: any) {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([enquiryData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateEnquiryStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async getEnquiryCount() {
    const { count, error } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};
