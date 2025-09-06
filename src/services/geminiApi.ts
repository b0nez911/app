const GEMINI_API_KEY = 'AIzaSyBGAyZVuInaMwfWhV3N6DOtX3ATimXmHzQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const geminiApi = {
  async generateRedditContent(
    brandName: string,
    targetAudience: string,
    contentInput: string,
    perspective: string = 'first-person',
    postLength?: string,
    useEmojis?: boolean,
    recommendHashtags?: boolean,
    cta?: string,
    ctaLink?: string,
    useSpecificContent?: boolean,
    specificContent?: string,
    songLink?: string
  ) {
    try {
      // CRITICAL: Ensure first-person perspective is from the artist's POV
      let perspectiveText;
      if (perspective === 'first-person') {
        perspectiveText = 'CRITICAL: Write in first person from the artist\'s perspective who created this song. Use "I", "me", "my" as the artist themselves speaking about THEIR OWN song that THEY wrote and created.';
      } else if (perspective === 'second-person') {
        perspectiveText = 'in second person (you, your)';
      } else if (perspective === 'third-person') {
        perspectiveText = 'in third person referring to the artist';
      } else {
        perspectiveText = 'in a neutral tone';
      }
      
      const lengthConstraint = postLength ? `The post should be approximately ${postLength} characters long.` : '';
      const emojiInstruction = useEmojis ? 'Include relevant emojis in the content.' : 'Do not include emojis in the content.';
      const hashtagInstruction = recommendHashtags ? 'Include relevant hashtags at the end. Use only single # symbols, never double ##.' : 'Do not include hashtags.';
    const prompt = `Create a Reddit post for the song "${brandName}" targeting ${targetAudience}. 

Song lyrics: ${contentInput}

Requirements:
- Write from ${perspectiveText}
- Target length: approximately ${postLength} characters
- ${emojiInstruction}
- ${hashtagInstruction}
- Call-to-action: ${cta}
- Write in 5-sentence paragraphs for better readability
- Make it engaging and authentic
${songLink ? `- Include this song link: ${songLink}` : ''}

Format the response as:
Title: [engaging title]
[body content in 5-sentence paragraphs]

The post should feel natural and encourage genuine engagement.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return { content: data.candidates[0].content.parts[0].text };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  },

  async suggestSubredditsAndHashtags(
    songLyrics: string,
    songTitle: string,
    targetAudience: string,
    featureWords: string,
    tone: string,
    valence: string,
    postLength: number,
    useEmojis: boolean,
    recommendHashtags: boolean
  ) {
    try {
      const emojiInstruction = useEmojis ? 'Include relevant emojis in the content.' : 'Do not include emojis.';
      const hashtagInstruction = recommendHashtags ? 'Include 8-12 trending hashtags.' : 'Do not include hashtags.';
      
      const prompt = `Create a comprehensive social media strategy for this song:

Song Title: ${songTitle}
Song Lyrics: ${songLyrics}
Feature Words: ${featureWords}
Target Audience: ${targetAudience}
Tone: ${tone}
Valence: ${valence}
Post Length: ${postLength} characters
${emojiInstruction}
${hashtagInstruction}

Generate:
1. An engaging post title
2. A ${postLength}-character social media post about this song
3. 5-8 relevant subreddits where this content would perform well
4. 8-12 trending hashtags (if requested)

Format as JSON:
{
  "title": "Engaging post title",
  "body": "Social media post content (${postLength} chars)",
  "subreddits": [
    {"name": "subredditname", "description": "why perfect for this content", "engagement_potential": "high/medium/low"}
  ],
  "hashtags": ["hashtag1", "hashtag2", ...]
}

Make the content authentic, ${valence}, and ${tone} in tone.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON from the response
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Could not parse JSON response, using fallback');
      }
      
      // Fallback if JSON parsing fails
      return {
        title: `Check out "${songTitle}" - ${tone} ${valence} vibes!`,
        body: `Just dropped my latest track "${songTitle}"! This one's all about ${featureWords || 'amazing vibes'}. Perfect for ${targetAudience}. What do you think? ${useEmojis ? '🎵✨' : ''}`,
        subreddits: [
          {name: "Music", description: "General music community with high engagement", engagement_potential: "high"},
          {name: "listentothis", description: "Perfect for new music discovery", engagement_potential: "high"},
          {name: "WeAreTheMusicMakers", description: "Community of music creators", engagement_potential: "medium"},
          {name: "indie", description: "Independent music lovers", engagement_potential: "medium"},
          {name: "newmusic", description: "Dedicated to fresh releases", engagement_potential: "high"}
        ],
        hashtags: recommendHashtags ? ["NewMusic", "IndieMusic", "MusicLovers", "NowPlaying", "MusicProducer", "SongWriter", "MusicLife", "IndieArtist"] : []
      };
    } catch (error) {
      console.error('Content generation error:', error);
      throw error;
    }
  }
};