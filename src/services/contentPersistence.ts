// Content persistence service for saving user data
export interface ContentData {
  content_type: 'manual' | 'generated' | 'posted';
  content: string;
  brand_name?: string;
  target_audience?: string;
  perspective?: string;
  use_emojis?: boolean;
  recommend_hashtags?: boolean;
  cta_type?: string;
  cta_link?: string;
  reddit_post_id?: string;
  subreddit?: string;
}

export class ContentPersistenceService {
  private storageKey = 'reddit_brand_promoter_content';

  async saveContent(data: ContentData): Promise<void> {
    try {
      // Get existing content from localStorage
      const existingData = this.getStoredContent();
      
      // Add timestamp and ID
      const contentWithMetadata = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user_preferences: {
          brand_name: data.brand_name,
          target_audience: data.target_audience,
          perspective: data.perspective,
          use_emojis: data.use_emojis,
          recommend_hashtags: data.recommend_hashtags,
          cta_type: data.cta_type
        }
      };

      // Add to existing content array
      existingData.push(contentWithMetadata);
      
      // Keep only last 50 entries to prevent storage bloat
      if (existingData.length > 50) {
        existingData.splice(0, existingData.length - 50);
      }

      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(existingData));
      
      console.log('Content saved successfully:', contentWithMetadata);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  }

  getStoredContent(): any[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving stored content:', error);
      return [];
    }
  }

  getUserPreferences(): any {
    const content = this.getStoredContent();
    if (content.length === 0) return null;
    
    // Get most recent user preferences
    const recent = content[content.length - 1];
    return recent.user_preferences || null;
  }

  getContentHistory(type?: string): any[] {
    const content = this.getStoredContent();
    if (!type) return content;
    
    return content.filter(item => item.content_type === type);
  }
}

export const contentPersistence = new ContentPersistenceService();