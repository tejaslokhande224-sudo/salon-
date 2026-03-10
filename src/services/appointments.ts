import { supabase } from '../lib/supabaseClient';

export const appointmentService = {
  async getAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (name, phone),
        services (name, price),
        staff (name)
      `)
      .order('booking_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const [
      { count: todayCount, error: todayError },
      { count: pendingCount, error: pendingError },
      { count: completedCount, error: completedError }
    ] = await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('booking_date', today),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed')
    ]);

    if (todayError) throw todayError;
    if (pendingError) throw pendingError;
    if (completedError) throw completedError;

    return {
      today: todayCount || 0,
      pending: pendingCount || 0,
      completed: completedCount || 0
    };
  },

  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('appointments')
      .select('services(price)')
      .eq('status', 'completed');
    
    if (error) throw error;
    
    const total = data.reduce((sum: number, item: any) => {
      return sum + (item.services?.price || 0);
    }, 0);
    
    return total;
  },

  async createAppointment(appointmentData: any) {
    const { error } = await supabase
      .from('appointments')
      .insert([appointmentData]);
    if (error) throw error;
    return true;
  },

  async updateAppointmentStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  }
};
