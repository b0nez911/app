// Supabase integration for data persistence
export interface BrandAgent {
  id: string;
  name: string;
  target_audience: string;
  aesthetic: string;
  created_at: Date;
  user_id: string;
}

export interface Post {
  id: string;
  brand_agent_id: string;
  title: string;
  content: string;
  subreddit: string;
  reddit_post_id?: string;
  status: 'draft' | 'approved' | 'posted';
  upvotes: number;
  comments: number;
  created_at: Date;
  posted_at?: Date;
}

export class SupabaseService {
  private apiUrl: string;
  private apiKey: string;

  constructor(url: string, key: string) {
    this.apiUrl = url;
    this.apiKey = key;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.apiUrl}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        'apikey': this.apiKey,
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    return response.json();
  }

  async createBrandAgent(agent: Omit<BrandAgent, 'id' | 'created_at'>): Promise<BrandAgent> {
    try {
      const data = await this.request('brand_agents', {
        method: 'POST',
        body: JSON.stringify({
          ...agent,
          created_at: new Date().toISOString()
        })
      });

      return data[0];
    } catch (error) {
      console.error('Error creating brand agent:', error);
      
      // Mock response for development
      return {
        id: 'mock_' + Date.now(),
        ...agent,
        created_at: new Date()
      };
    }
  }

  async getBrandAgents(userId: string): Promise<BrandAgent[]> {
    try {
      return await this.request(`brand_agents?user_id=eq.${userId}`);
    } catch (error) {
      console.error('Error fetching brand agents:', error);
      return [];
    }
  }

  async createPost(post: Omit<Post, 'id' | 'created_at'>): Promise<Post> {
    try {
      const data = await this.request('posts', {
        method: 'POST',
        body: JSON.stringify({
          ...post,
          created_at: new Date().toISOString()
        })
      });

      return data[0];
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Mock response for development
      return {
        id: 'mock_' + Date.now(),
        ...post,
        created_at: new Date()
      };
    }
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    try {
      const data = await this.request(`posts?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });

      return data[0];
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async getPosts(brandAgentId: string): Promise<Post[]> {
    try {
      return await this.request(`posts?brand_agent_id=eq.${brandAgentId}&order=created_at.desc`);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async getAnalytics(brandAgentId: string) {
    try {
      const posts = await this.getPosts(brandAgentId);
      
      return {
        totalPosts: posts.length,
        totalUpvotes: posts.reduce((sum, post) => sum + post.upvotes, 0),
        totalComments: posts.reduce((sum, post) => sum + post.comments, 0),
        avgEngagement: posts.length > 0 ? 
          (posts.reduce((sum, post) => sum + post.upvotes + post.comments, 0) / posts.length).toFixed(1) : '0'
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        totalPosts: 0,
        totalUpvotes: 0,
        totalComments: 0,
        avgEngagement: '0'
      };
    }
  }
}

export const supabase = new SupabaseService(
  process.env.SUPABASE_URL || 'https://mock.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'mock_key'
);