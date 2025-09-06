import { supabase } from '@/lib/supabase';

export interface SongData {
  id?: string;
  song_title: string;
  song_lyrics?: string;
  feature_words?: string;
  target_audience?: string;
  valence: string;
  tone: string;
  post_length: number;
  use_emojis: boolean;
  recommend_hashtags: boolean;
  pov?: string;
  cta?: string;
  suggested_subreddits?: any;
  suggested_hashtags?: string[];
  generated_title?: string;
  generated_body?: string;
}

export const songPersistence = {
  async saveSong(songData: SongData): Promise<string> {
    // Check for local authentication instead of Supabase auth
    const authToken = localStorage.getItem('dealai_auth_token');
    if (!authToken) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_songs')
      .insert({
        ...songData,
        user_id: authToken, // Use auth token as user identifier
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async updateSong(id: string, songData: Partial<SongData>): Promise<void> {
    const { error } = await supabase
      .from('user_songs')
      .update({
        ...songData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  },

  async getSongs(): Promise<SongData[]> {
    const { data, error } = await supabase
      .from('user_songs')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSong(id: string): Promise<SongData | null> {
    const { data, error } = await supabase
      .from('user_songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  async deleteSong(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_songs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};