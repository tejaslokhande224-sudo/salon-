import { supabase } from '../lib/supabaseClient';

export const aboutService = {
  async getAboutContent() {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching about content:', error);
      return null;
    }
    return data;
  },

  async updateAboutContent(id: string | undefined, contentData: any) {
    if (!id) {
      const { data, error } = await supabase
        .from('about_content')
        .insert([contentData])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('about_content')
        .update({ ...contentData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }
};
