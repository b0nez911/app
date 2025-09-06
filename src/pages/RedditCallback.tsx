import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const RedditCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Reddit authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        return;
      }

      try {
        // First check if user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // If no user, redirect to login or handle gracefully
          setStatus('error');
          setMessage('Please log in first to connect your Reddit account.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        const { data, error } = await supabase.functions.invoke('reddit-auth-callback', {
          body: { code, userId: user.id },
        });

        if (error) throw error;
        
        setStatus('success');
        setMessage('Successfully connected to Reddit!');

        setTimeout(() => navigate('/post-library'), 2000);
      } catch (error) {
        console.error("Reddit callback error:", error);
        setStatus('error');
        setMessage('Failed to connect to Reddit. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-purple-800">
            Reddit Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
              <p className="text-gray-600">{message}</p>
            </>
          )}
          {status === 'success' && (
            <p className="text-green-600 font-medium">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 font-medium">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RedditCallback;