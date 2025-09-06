import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { geminiApi } from '@/services/geminiApi';
import { songPersistence, SongData } from '@/services/songPersistence';
import { postsPersistence } from '@/services/postsPersistence';
import { useToast } from '@/hooks/use-toast';

export const ArtistLanding: React.FC = () => {
  const [formData, setFormData] = useState<SongData>({
    song_title: '',
    song_lyrics: '',
    feature_words: '',
    target_audience: '',
    valence: 'positive',
    tone: 'inspirational',
    post_length: 500,
    use_emojis: true,
    recommend_hashtags: true,
    pov: 'first_person',
    cta: 'comments'
  });

  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    body: string;
    subreddits: any[];
    hashtags: string[];
  } | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const { toast } = useToast();

  const toneButtons = [
    { value: 'inspirational', label: 'Inspirational', color: 'bg-blue-500' },
    { value: 'factual', label: 'Factual', color: 'bg-green-500' },
    { value: 'fun', label: 'Fun', color: 'bg-yellow-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
    { value: 'fear-based', label: 'Fear-Based', color: 'bg-purple-500' }
  ];
  const povOptions = [
    { value: 'first_person', label: 'First Person (I/We)' },
    { value: 'second_person', label: 'Second Person (You)' },
    { value: 'third_person', label: 'Third Person (They/Artist)' },
    { value: 'omniscient', label: 'Omniscient Narrator' },
    { value: 'limited_third', label: 'Limited Third Person' },
    { value: 'objective', label: 'Objective/Neutral' }
  ];

  const ctaOptions = [
    { value: 'comments', label: 'Encourage Comments' },
    { value: 'feedback', label: 'Ask For Song Feedback' },
    { value: 'advice', label: 'Ask for Advice' },
    { value: 'stories', label: 'Ask for Similar Stories' }
  ];

  const handleInputChange = (field: keyof SongData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.song_title || !formData.song_lyrics) {
      toast({
        title: "Missing Information",
        description: "Please provide both song title and lyrics",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Starting generation process...');
      
      // Try to save/update song first
      let songId = currentSongId;
      if (!songId) {
        console.log('Saving new song...');
        songId = await songPersistence.saveSong(formData);
        setCurrentSongId(songId);
        console.log('Song saved with ID:', songId);
      } else {
        console.log('Updating existing song...');
        await songPersistence.updateSong(songId, formData);
        console.log('Song updated successfully');
      }

      console.log('Calling Gemini API...');
      const result = await geminiApi.suggestSubredditsAndHashtags(
        formData.song_lyrics,
        formData.song_title,
        formData.target_audience || 'music lovers',
        formData.feature_words || '',
        formData.tone,
        formData.valence,
        formData.post_length,
        formData.use_emojis,
        formData.recommend_hashtags
      );

      console.log('API result:', result);
      setGeneratedContent(result);

      console.log('Updating song with generated content...');
      await songPersistence.updateSong(songId, {
        suggested_subreddits: result.subreddits,
        suggested_hashtags: result.hashtags,
        generated_title: result.title,
        generated_body: result.body
      });

      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready"
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!generatedContent) return;

    try {
      await postsPersistence.savePost({
        song_id: currentSongId || undefined,
        post_title: generatedContent.title,
        post_content: generatedContent.body,
        suggested_subreddits: generatedContent.subreddits,
        suggested_hashtags: generatedContent.hashtags,
        post_length: formData.post_length,
        tone: formData.tone,
        valence: formData.valence
      });

      toast({
        title: "Saved!",
        description: "Post saved to your library"
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <Card className="h-fit bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Song Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="song-title" className="text-gray-200">Song Title</Label>
            <Input
              id="song-title"
              value={formData.song_title}
              onChange={(e) => handleInputChange('song_title', e.target.value)}
              placeholder="Enter your song title..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="song-lyrics" className="text-gray-200">Lyrics</Label>
            <Textarea
              id="song-lyrics"
              value={formData.song_lyrics}
              onChange={(e) => handleInputChange('song_lyrics', e.target.value)}
              placeholder="Paste your song lyrics here..."
              className="min-h-64 resize-none bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feature-words" className="text-gray-200">Feature Words</Label>
            <Input
              id="feature-words"
              value={formData.feature_words}
              onChange={(e) => handleInputChange('feature_words', e.target.value)}
              placeholder="Key themes, emotions, or concepts..."
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-200">Point of View</Label>
            <div className="grid grid-cols-2 gap-2">
              {povOptions.map((pov) => (
                <Button
                  key={pov.value}
                  variant={formData.pov === pov.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('pov', pov.value)}
                  className={formData.pov === pov.value ? 'bg-purple-600' : 'border-gray-600 text-gray-300'}
                >
                  {pov.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Call to Action</Label>
            <div className="grid grid-cols-2 gap-2">
              {ctaOptions.map((cta) => (
                <Button
                  key={cta.value}
                  variant={formData.cta === cta.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('cta', cta.value)}
                  className={formData.cta === cta.value ? 'bg-green-600' : 'border-gray-600 text-gray-300'}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-200">Post Length</Label>
              <span className="text-xs text-gray-400">characters</span>
            </div>
            <div className="px-3">
              <Slider
                value={[formData.post_length]}
                onValueChange={(value) => handleInputChange('post_length', value[0])}
                max={2000}
                min={100}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100</span>
                <span className="font-medium text-white">{formData.post_length}</span>
                <span>2000</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-gray-200">Sentiment</Label>
            <div className="flex items-center gap-3">
              <span className={formData.valence === 'negative' ? 'font-semibold text-white' : 'text-gray-400'}>
                Negative
              </span>
              <Switch
                checked={formData.valence === 'positive'}
                onCheckedChange={(checked) => handleInputChange('valence', checked ? 'positive' : 'negative')}
              />
              <span className={formData.valence === 'positive' ? 'font-semibold text-white' : 'text-gray-400'}>
                Positive
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Tone</Label>
            <div className="flex flex-wrap gap-2">
              {toneButtons.map((tone) => (
                <Button
                  key={tone.value}
                  variant={formData.tone === tone.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('tone', tone.value)}
                  className={formData.tone === tone.value ? tone.color : 'border-gray-600 text-gray-300'}
                >
                  {tone.label}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Right Column */}
      <div className="space-y-6">
        {generatedContent && (
          <>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Generated Content</CardTitle>
                <Button onClick={handleSaveToLibrary} variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Save className="mr-2 h-4 w-4" />
                  Save To Post Library
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-200">Title</Label>
                  <p className="mt-1 p-3 bg-gray-700 rounded-lg text-white">{generatedContent.title}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-gray-200">Content</Label>
                  <p className="mt-1 p-3 bg-gray-700 rounded-lg whitespace-pre-wrap text-white">
                    {generatedContent.body}
                  </p>
                </div>
              </CardContent>
            </Card>

            {generatedContent.hashtags.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Suggested Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-600 text-white">
                         {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedContent.subreddits.length > 0 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Best Places to Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedContent.subreddits.map((sub, index) => (
                      <div key={index} className="p-3 border border-gray-600 rounded-lg bg-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">r/{sub.name}</h4>
                          <Badge variant="outline" className="border-gray-500 text-gray-300">{sub.engagement_potential}</Badge>
                        </div>
                        <p className="text-sm text-gray-300">{sub.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!generatedContent && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">
                Fill out the form and click "Generate Content" to see AI-powered suggestions
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};