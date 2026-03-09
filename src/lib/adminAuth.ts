import { supabase } from './supabaseClient';

export async function verifyAdminStatus(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error verifying admin status:', err);
    return false;
  }
}
