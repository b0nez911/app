import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Copy, RefreshCw, Music } from 'lucide-react';
import { songPersistence, SongData } from '@/services/songPersistence';
import { useToast } from '@/hooks/use-toast';

interface SongHistoryEnhancedProps {
  onLoadSong?: (song: SongData) => void;
}

export const SongHistoryEnhanced: React.FC<SongHistoryEnhancedProps> = ({ onLoadSong }) => {
  const [songs, setSongs] = useState<SongData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const songList = await songPersistence.getSongs();
      setSongs(songList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load song history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      await songPersistence.deleteSong(id);
      setSongs(prev => prev.filter(song => song.id !== id));
      toast({
        title: "Success",
        description: "Song deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete song",
        variant: "destructive"
      });
    }
  };

  const handleCopyContent = async (song: SongData) => {
    const content = `${song.generated_title}\n\n${song.generated_body}`;
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Post content copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive"
      });
    }
  };

  const handleRepost = (song: SongData) => {
    // This would typically open a dialog or redirect to Reddit
    const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(song.generated_title || '')}&text=${encodeURIComponent(song.generated_body || '')}`;
    window.open(redditUrl, '_blank');
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Song Posts Library</h2>
        <div className="modern-badge">
          {songs.length} songs
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="modern-card p-8 text-center">
          <Music className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-300">No songs saved yet. Create your first song entry!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {songs.map((song) => (
            <div key={song.id} className="modern-card hover:bg-white/10 transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Music className="h-5 w-5 text-purple-400" />
                    {song.song_title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="modern-badge">
                      {song.tone}
                    </div>
                    <div className={`modern-badge ${song.valence === 'positive' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                      {song.valence}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {song.generated_title && (
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Generated Title:</p>
                      <p className="text-sm text-gray-300">{song.generated_title}</p>
                    </div>
                  )}
                  
                  {song.generated_body && (
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Generated Post:</p>
                      <p className="text-sm text-gray-300 line-clamp-3">{song.generated_body}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <button
                        className="modern-button-secondary"
                        onClick={() => handleRepost(song)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Repost
                      </button>
                      <button
                        className="modern-button-secondary"
                        onClick={() => handleCopyContent(song)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </button>
                      {onLoadSong && (
                        <button
                          className="modern-button-secondary"
                          onClick={() => onLoadSong(song)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      )}
                    </div>
                    <button
                      className="modern-button-secondary text-red-300 hover:text-red-200"
                      onClick={() => handleDeleteSong(song.id!)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};