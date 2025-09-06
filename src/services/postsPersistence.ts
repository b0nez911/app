import { supabase } from '@/lib/supabase';

export interface SavedPost {
  id?: string;
  song_id?: string;
  post_title: string;
  post_content: string;
  suggested_subreddits?: any;
  suggested_hashtags?: string[];
  post_length?: number;
  tone?: string;
  valence?: string;
  created_at?: string;
  updated_at?: string;
}

export const postsPersistence = {
  async savePost(postData: SavedPost): Promise<string> {
    // Check for local authentication instead of Supabase auth
    const authToken = localStorage.getItem('dealai_auth_token');
    if (!authToken) throw new Error('User not authenticated');
    const { data, error } = await supabase
      .from('saved_posts')
      .insert({
        ...postData,
        user_id: authToken, // Use auth token as user identifier
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async getSavedPosts(): Promise<SavedPost[]> {
    const { data, error } = await supabase
      .from('saved_posts')
      .select(`
        *,
        user_songs(song_title)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};