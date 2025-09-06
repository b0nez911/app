import { supabase } from '@/lib/supabase';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  selftext: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  author: string;
  permalink: string;
}

export interface RedditAPI {
  getAuthUrl: (state: string) => Promise<string>;
  exchangeCodeForToken: (code: string, state: string) => Promise<any>;
  getUserInfo: (accessToken: string) => Promise<any>;
  submitPost: (accessToken: string, subreddit: string, title: string, text: string) => Promise<any>;
  getSubredditPosts: (subreddit: string, limit?: number) => Promise<RedditPost[]>;
}

export const createRedditAPI = (): RedditAPI => {
  const getAuthUrl = async (state: string): Promise<string> => {
    try {
      console.log('Getting Reddit auth URL...');
      
      // Use the existing parse-document function to handle OAuth
      const { data, error } = await supabase.functions.invoke('parse-document', {
        body: { 
          action: 'reddit_auth_url',
          state,
          redirect_uri: `${window.location.origin}/reddit-callback`
        }
      });

      if (error) {
        console.error('Error getting auth URL:', error);
        throw new Error(`Reddit credentials not configured properly. Please check REDDIT_CLIENT_ID in Supabase secrets.`);
      }

      if (!data?.authUrl) {
        throw new Error('Reddit app not configured. Please set up Reddit OAuth app with redirect URI: ' + window.location.origin + '/reddit-callback');
      }

      console.log('Auth URL generated successfully');
      return data.authUrl;
    } catch (error) {
      console.error('Reddit auth URL error:', error);
      throw error;
    }
  };

  const exchangeCodeForToken = async (code: string, state: string): Promise<any> => {
    try {
      const { data, error } = await supabase.functions.invoke('parse-document', {
        body: { 
          action: 'reddit_token_exchange',
          code,
          state,
          redirect_uri: `${window.location.origin}/reddit-callback`
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  };

  const getUserInfo = async (accessToken: string): Promise<any> => {
    try {
      const response = await fetch('https://oauth.reddit.com/api/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'ArtistPlatform/1.0'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Get user info error:', error);
      throw error;
    }
  };

  const submitPost = async (accessToken: string, subreddit: string, title: string, text: string): Promise<any> => {
    try {
      const response = await fetch('https://oauth.reddit.com/api/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ArtistPlatform/1.0'
        },
        body: new URLSearchParams({
          api_type: 'json',
          kind: 'self',
          sr: subreddit,
          title,
          text
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Submit post error:', error);
      throw error;
    }
  };

  const getSubredditPosts = async (subreddit: string, limit = 10): Promise<RedditPost[]> => {
    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}.json?limit=${limit}`);
      const data = await response.json();
      return data.data.children.map((child: any) => child.data);
    } catch (error) {
      console.error('Get subreddit posts error:', error);
      return [];
    }
  };

  return {
    getAuthUrl,
    exchangeCodeForToken,
    getUserInfo,
    submitPost,
    getSubredditPosts
  };
};