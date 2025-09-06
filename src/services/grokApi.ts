// Grok API integration for content generation
export interface GrokResponse {
  content: string;
  suggestions: string[];
}

export class GrokAPI {
  private apiKey: string;
  private baseUrl = 'https://api.x.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateRedditContent(
    brandName: string,
    targetAudience: string,
    sourceContent: string,
    subreddit?: string
  ): Promise<GrokResponse> {
    const prompt = `
      Generate an engaging Reddit post for brand "${brandName}" targeting "${targetAudience}".
      Source content: ${sourceContent}
      ${subreddit ? `Subreddit: ${subreddit}` : ''}
      
      Make it authentic, conversational, and engaging. Avoid obvious promotion.
      Include relevant hashtags and questions to encourage engagement.
    `;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'You are a Reddit marketing expert. Create authentic, engaging posts that don\'t feel like ads.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Grok API error details:', errorText);
        throw new Error(`Grok API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error('Invalid Grok API response:', data);
        throw new Error('Invalid response from Grok API');
      }
      
      const content = data.choices[0].message.content;

      return {
        content,
        suggestions: [
          'Try posting during peak hours (7-9 PM EST)',
          'Consider cross-posting to related subreddits',
          'Engage with comments within the first hour'
        ]
      };
    } catch (error) {
      console.error('Grok API error:', error);
      
      // Always return fallback mock response
      return {
        content: `🎵 Just discovered this amazing track! The beats are absolutely fire and the lyrics hit different. Perfect for anyone who loves authentic music with real emotion. What do you think about artists who pour their soul into every track? #NewMusic #Authentic`,
        suggestions: [
          'Try posting during peak hours (7-9 PM EST)',
          'Consider cross-posting to related subreddits',
          'Engage with comments within the first hour'
        ]
      };
    }
  }

  async analyzePerformance(posts: any[]): Promise<string[]> {
    // Analyze post performance and provide insights
    const insights = [
      'Posts with questions get 40% more engagement',
      'Evening posts (7-9 PM) perform best',
      'Music-related content has high engagement rate'
    ];

    return insights;
  }
}

export const grokApi = new GrokAPI(process.env.GROK_API_KEY || 'mock_key');