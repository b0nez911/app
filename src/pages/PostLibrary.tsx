import { useQuery } from '@tanstack/react-query';
import ConnectRedditButton from '@/components/ConnectRedditButton';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, TrendingUp } from "lucide-react";

const checkRedditConnection = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase
    .from('user_reddit_tokens')
    .select('user_id')
    .eq('user_id', user.id)
    .single();
  return !!data && !error;
};

const fetchRedditPosts = async () => {
  const { data, error } = await supabase.functions.invoke('get-reddit-posts');
  if (error) throw new Error(error.message);
  return data;
};

const PostLibrary = () => {
  const { data: isConnected, isLoading: isCheckingConnection } = useQuery({
    queryKey: ['redditConnection'],
    queryFn: checkRedditConnection,
  });

  const { data: posts, isLoading: isLoadingPosts, error } = useQuery({
    queryKey: ['redditPosts'],
    queryFn: fetchRedditPosts,
    enabled: !!isConnected,
    refetchInterval: 30000,
  });

  if (isCheckingConnection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
          <p className="text-gray-600">Checking connection...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto text-center mt-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-800 mb-4">
                Post Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-lg">
                Connect your Reddit account to see your posts and analytics.
              </p>
              <ConnectRedditButton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoadingPosts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto text-center mt-20">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">Error fetching posts: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">Post Library</h1>
        <div className="space-y-6">
          {posts?.map((post: any) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {post.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <Badge variant="secondary">r/{post.subreddit}</Badge>
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {post.score} upvotes
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.num_comments} comments
                  </span>
                </div>
              </CardHeader>
              {post.selftext && (
                <CardContent>
                  <p className="text-gray-700 line-clamp-3">{post.selftext}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostLibrary;