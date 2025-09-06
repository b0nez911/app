import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { createRedditAPI } from '@/services/redditApi';

interface RedditAuthProps {
  onAuthSuccess: (token: string, username: string) => void;
}

export const RedditAuth: React.FC<RedditAuthProps> = ({ onAuthSuccess }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is returning from Reddit OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      setError(`Reddit authorization failed: ${errorParam}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && state) {
      handleOAuthCallback(code, state);
    }

    // Check existing auth
    const existingToken = localStorage.getItem('reddit_access_token');
    const existingUsername = localStorage.getItem('reddit_username');
    if (existingToken && existingUsername) {
      setIsConnected(true);
      setUsername(existingUsername);
    }
  }, []);

  const handleOAuthCallback = async (code: string, state: string) => {
    setIsConnecting(true);
    setError(null);

    try {
      const redditAPI = createRedditAPI();
      const tokenData = await redditAPI.exchangeCodeForToken(code, state);
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      const userInfo = await redditAPI.getUserInfo(tokenData.access_token);
      
      localStorage.setItem('reddit_access_token', tokenData.access_token);
      localStorage.setItem('reddit_refresh_token', tokenData.refresh_token || '');
      localStorage.setItem('reddit_username', userInfo.name);
      
      setIsConnected(true);
      setUsername(userInfo.name);
      onAuthSuccess(tokenData.access_token, userInfo.name);
      
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const redditAPI = createRedditAPI();
      const state = Math.random().toString(36).substring(2, 15);
      const authUrl = await redditAPI.getAuthUrl(state);
      
      localStorage.setItem('reddit_oauth_state', state);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Connect error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('reddit_access_token');
    localStorage.removeItem('reddit_refresh_token');
    localStorage.removeItem('reddit_username');
    localStorage.removeItem('reddit_oauth_state');
    setIsConnected(false);
    setUsername(null);
  };

  if (isConnected && username) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Reddit Connected
            <Badge variant="default">Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Logged in as: <strong>u/{username}</strong>
          </p>
          <Button onClick={handleDisconnect} variant="destructive" size="sm">
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connect Reddit Account</CardTitle>
        <CardDescription>
          Connect your Reddit account to post content directly from the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Configuration Required:</strong><br/>
              {error}
              <br/><br/>
              <strong>Setup Instructions:</strong><br/>
              1. Go to <a href="https://www.reddit.com/prefs/apps" target="_blank" className="underline">reddit.com/prefs/apps</a><br/>
              2. Create a new app (web app type)<br/>
              3. Set redirect URI to: <code className="bg-gray-100 px-1 rounded">{window.location.origin}/reddit-callback</code><br/>
              4. Add your Reddit app's Client ID and Secret to Supabase secrets as REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect Reddit Account'}
        </Button>
      </CardContent>
    </Card>
  );
};