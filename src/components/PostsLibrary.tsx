import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Calendar } from 'lucide-react';
import { postsPersistence, SavedPost } from '@/services/postsPersistence';
import { useToast } from '@/hooks/use-toast';

export const PostsLibrary: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const posts = await postsPersistence.getSavedPosts();
      setSavedPosts(posts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load saved posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await postsPersistence.deletePost(id);
      setSavedPosts(prev => prev.filter(post => post.id !== id));
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const handleCopyPost = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Post content copied to clipboard"
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Posts Library</h2>
        <div className="badge-modern">
          {savedPosts.length} saved posts
        </div>
      </div>

      {savedPosts.length === 0 ? (
        <div className="card-modern p-8 text-center">
          <p className="text-white/60">No saved posts yet. Generate some content and save your favorites!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedPosts.map((post) => (
            <div key={post.id} className="card-modern p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{post.post_title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="badge-modern">{post.tone}</span>
                    <span className={post.valence === 'positive' ? 'badge-positive' : 'badge-modern'}>
                      {post.valence}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.created_at || '').toLocaleDateString()}
                </div>

                <div className="content-area">
                  <p className="whitespace-pre-wrap">{post.post_content}</p>
                </div>
                
                {post.suggested_hashtags && post.suggested_hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.suggested_hashtags.map((tag, index) => (
                      <span key={index} className="badge-modern text-xs">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button
                    className="btn-modern btn-secondary"
                    onClick={() => handleCopyPost(post.post_content)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    className="btn-modern btn-secondary hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300"
                    onClick={() => handleDeletePost(post.id!)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};