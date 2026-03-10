import { supabase } from '../lib/supabaseClient';

export const customerService = {
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getCustomerByPhone(phone: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createCustomer(customerData: any) {
    const { error } = await supabase
      .from('customers')
      .insert([customerData]);
    if (error) throw error;
    
    // Fetch the created customer by phone safely
    const { data: newCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', customerData.phone)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    return newCustomer;
  },

  async getCustomerCount() {
    const { count, error } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  }
};
