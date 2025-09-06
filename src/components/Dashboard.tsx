import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Copy, ExternalLink, Wand2, MapPin, Hash, Plus } from 'lucide-react';
import { geminiApi } from '@/services/geminiApi';
import { songPersistence, SongData } from '@/services/songPersistence';
import { PostsLibrary } from '@/components/PostsLibrary';
import { SongHistory } from '@/components/SongHistory';
import { useAppContext } from '@/contexts/AppContext';
const Dashboard: React.FC = () => {
  const { includeHashtags, includeEmojis, toggleHashtags, toggleEmojis, includeSongLink, songLink, toggleSongLink, setSongLink } = useAppContext();
  const [activeTab, setActiveTab] = useState('generate');
  const [songTitle, setSongTitle] = useState('');
  const [featureWords, setFeatureWords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [songLyrics, setSongLyrics] = useState('');
  const [perspective, setPerspective] = useState('first-person');
  const [postLength, setPostLength] = useState(30);
  const [postLengthInput, setPostLengthInput] = useState('30');
  const [valence, setValence] = useState('positive');
  const [tone, setTone] = useState('inspirational');
  const [useEmojis, setUseEmojis] = useState(false);
  const [recommendHashtags, setRecommendHashtags] = useState(false);
  const [cta, setCta] = useState('generate-comments');
  const [ctaLink, setCtaLink] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [suggestedSubreddits, setSuggestedSubreddits] = useState<any[]>([]);
  const [expandedSubreddits, setExpandedSubreddits] = useState<any[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [copied, setCopied] = useState('');
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const toneOptions = [
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'factual', label: 'Factual' },
    { value: 'fun', label: 'Fun' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'fear-based', label: 'Fear-Based' }
  ];

  useEffect(() => {
    setPostLengthInput(postLength.toString());
  }, [postLength]);

  const handleLengthInputChange = (value: string) => {
    setPostLengthInput(value);
    const numValue = parseInt(value) || 30;
    if (numValue >= 30 && numValue <= 30000) {
      setPostLength(numValue);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!songTitle.trim() || !songLyrics.trim()) return;
    setLoadingSuggestions(true);
    
    try {
      const suggestions = await geminiApi.suggestSubredditsAndHashtags(
        songTitle,
        songLyrics,
        featureWords,
        targetAudience || 'General audience',
        tone
      );
      setSuggestedSubreddits(suggestions.subreddits || []);
      setSuggestedHashtags(suggestions.hashtags || []);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      setSuggestedSubreddits([
        {name: "r/Music", reason: "General music community", engagement_potential: "high"},
        {name: "r/listentothis", reason: "New music discovery", engagement_potential: "medium"}
      ]);
      setSuggestedHashtags(["#NewMusic", "#IndieMusic", "#MusicLovers"]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleMorePlaces = async () => {
    if (!songTitle.trim() || !songLyrics.trim()) return;
    setLoadingMore(true);
    
    try {
      const suggestions = await geminiApi.suggestSubredditsAndHashtags(
        songTitle,
        songLyrics,
        featureWords,
        targetAudience || 'General audience',
        tone
      );
      const moreSubreddits = suggestions.subreddits?.slice(5) || [
        {name: "r/WeAreTheMusicMakers", reason: "Music creators community", engagement_potential: "high"},
        {name: "r/IndieFolk", reason: "Indie folk music lovers", engagement_potential: "medium"},
        {name: "r/songwriters", reason: "Songwriting community", engagement_potential: "high"}
      ];
      setExpandedSubreddits(prev => [...prev, ...moreSubreddits]);
    } catch (error) {
      console.error('Failed to load more suggestions:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!songLyrics.trim()) return;
    setLoading(true);
    
    // Auto-generate subreddit suggestions when generating content
    if (suggestedSubreddits.length === 0) {
      await handleGenerateSuggestions();
    }
    
    try {
      const response = await geminiApi.generateRedditContent(
        songTitle || 'Your Song',
        targetAudience || 'General audience',
        songLyrics,
        perspective,
        postLength.toString(),
        includeEmojis,
        includeHashtags,
        cta,
        ctaLink,
        false,
        '',
        includeSongLink ? songLink : undefined
      );
      const lines = response.content.split('\n');
      const titleLine = lines.find(line => line.trim().length > 0) || '';
      const bodyLines = lines.slice(1).filter(line => line.trim().length > 0);
      
      setGeneratedTitle(titleLine.replace(/^(Title:|#)\s*/, ''));
      let processedBody = bodyLines.join('\n');
      
      // Fix double hashtags to single hashtags
      processedBody = processedBody.replace(/##/g, '#');
      
      setGeneratedBody(processedBody);
      
      // Save to database
      await saveSongData();
    } catch (error) {
      setGeneratedTitle('Just discovered this amazing track!');
      setGeneratedBody('🎵 The beats are absolutely fire and the lyrics hit different. Perfect for anyone who loves authentic music with real emotion. What do you think about artists who pour their soul into every track? #NewMusic #Authentic');
    } finally {
      setLoading(false);
    }
  };
  const saveSongData = async () => {
    try {
      const songData: SongData = {
        song_title: songTitle,
        song_lyrics: songLyrics,
        feature_words: featureWords,
        target_audience: targetAudience,
        valence,
        tone,
        post_length: postLength,
        use_emojis: useEmojis,
        recommend_hashtags: recommendHashtags,
        suggested_subreddits: suggestedSubreddits,
        suggested_hashtags: suggestedHashtags,
        generated_title: generatedTitle,
        generated_body: generatedBody
      };

      if (currentSongId) {
        await songPersistence.updateSong(currentSongId, songData);
      } else {
        const newId = await songPersistence.saveSong(songData);
        setCurrentSongId(newId);
      }
    } catch (error) {
      console.error('Failed to save song data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'generate'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Generate Posts
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Posts Library
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'saved'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Saved Posts
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="space-y-6">
              {/* Song Title & Lyrics */}
              <div className="card-modern p-6 space-y-4">
                <input
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="Song title..."
                  className="input-modern w-full text-lg"
                />
                <textarea
                  value={songLyrics}
                  onChange={(e) => setSongLyrics(e.target.value)}
                  placeholder="Paste your lyrics here..."
                  className="textarea-modern w-full min-h-32"
                />
                <input
                  value={featureWords}
                  onChange={(e) => setFeatureWords(e.target.value)}
                  placeholder="Key themes, emotions, or concepts..."
                  className="input-modern w-full"
                />
              </div>

              {/* Point of View */}
              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Point of View</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'first-person', label: 'First Person (I/We)' },
                    { value: 'second-person', label: 'Second Person (You)' },
                    { value: 'third-person', label: 'Third Person (They/Artist)' },
                    { value: 'omniscient', label: 'Omniscient Narrator' },
                    { value: 'limited-third', label: 'Limited Third Person' },
                    { value: 'objective', label: 'Objective/Neutral' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`btn-modern ${perspective === option.value ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setPerspective(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Call to Action</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'encourage-comments', label: 'Encourage Comments' },
                    { value: 'ask-feedback', label: 'Ask For Song Feedback' },
                    { value: 'ask-advice', label: 'Ask for Advice' },
                    { value: 'ask-stories', label: 'Ask for Similar Stories' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`btn-modern ${cta === option.value ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setCta(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Length */}
              <div className="card-modern p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Post Length</h3>
                  <span className="text-sm text-white/60">{postLength} characters</span>
                </div>
                <Slider
                  value={[postLength]}
                  onValueChange={(value) => setPostLength(value[0])}
                  max={30000}
                  min={30}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>30</span>
                  <span>1000</span>
                  <span>30000</span>
                </div>
              </div>
              {/* Sentiment & Tone */}
              <div className="card-modern p-6 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Sentiment</h3>
                    <div className="flex items-center gap-4">
                      <span className={valence === 'negative' ? 'text-white' : 'text-white/50'}>Negative</span>
                      <Switch
                        checked={valence === 'positive'}
                        onCheckedChange={(checked) => setValence(checked ? 'positive' : 'negative')}
                      />
                      <span className={valence === 'positive' ? 'text-white' : 'text-white/50'}>Positive</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Tone</h3>
                  <div className="flex flex-wrap gap-3">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`btn-modern ${tone === option.value ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTone(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Options */}
              <div className="card-modern p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white">Content Options</h3>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Include Hashtags</span>
                  </div>
                  <Switch
                    checked={includeHashtags}
                    onCheckedChange={toggleHashtags}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">😊</span>
                    <span className="text-white">Include Emojis</span>
                  </div>
                  <Switch
                    checked={includeEmojis}
                    onCheckedChange={toggleEmojis}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Feature Song Link in Post</span>
                  </div>
                  <Switch
                    checked={includeSongLink}
                    onCheckedChange={toggleSongLink}
                  />
                </div>

                {includeSongLink && (
                  <div className="mt-4">
                    <input
                      value={songLink}
                      onChange={(e) => setSongLink(e.target.value)}
                      placeholder="Enter your song link (Spotify, YouTube, etc.)"
                      className="input-modern w-full"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={handleGenerateContent} 
                disabled={loading || !songLyrics.trim()}
                className="btn-modern btn-primary w-full py-4 text-lg"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {loading ? 'Generating...' : 'Generate Content'}
              </button>


            </div>

            {/* Right Panel - Subreddit Suggestions */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Subreddit Suggestions</h3>
                    <Button
                      onClick={handleGenerateSuggestions}
                      disabled={loadingSuggestions || !songTitle.trim() || !songLyrics.trim()}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 hover:bg-slate-700"
                    >
                      {loadingSuggestions ? 'Loading...' : 'Refresh'}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {suggestedSubreddits.length > 0 ? suggestedSubreddits.map((subreddit, index) => (
                      <div key={index} className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white">{subreddit.name}</h4>
                          <div className="flex gap-2">
                            <a
                              href={`https://reddit.com/${subreddit.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                            >
                              Post Here
                            </a>
                            <span className={`px-2 py-1 rounded text-xs ${
                              subreddit.engagement_potential === 'high' ? 'bg-green-600 text-white' :
                              subreddit.engagement_potential === 'medium' ? 'bg-yellow-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {subreddit.engagement_potential}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300">{subreddit.reason}</p>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-400">
                        <p>Generate content to see subreddit suggestions</p>
                      </div>
                    )}
                  </div>

                  {/* More Places to Promote */}
                  {suggestedSubreddits.length > 0 && (
                    <div className="mt-4">
                      <Button
                        onClick={handleMorePlaces}
                        disabled={loadingMore}
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {loadingMore ? 'Loading...' : 'More Places to Promote'}
                      </Button>
                      
                      {expandedSubreddits.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {expandedSubreddits.map((subreddit, index) => (
                            <div key={`expanded-${index}`} className="bg-slate-700 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">{subreddit.name}</h4>
                                <div className="flex gap-2">
                                  <a
                                    href={`https://reddit.com/${subreddit.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                                  >
                                    Post Here
                                  </a>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    subreddit.engagement_potential === 'high' ? 'bg-green-600 text-white' :
                                    subreddit.engagement_potential === 'medium' ? 'bg-yellow-600 text-white' :
                                    'bg-gray-600 text-white'
                                  }`}>
                                    {subreddit.engagement_potential}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-300">{subreddit.reason}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generated Content */}
              {(generatedTitle || generatedBody) && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Your Post</h3>
                    
                    {generatedTitle && (
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-orange-400">Title</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedTitle, 'title')}
                            className="border-slate-600 hover:bg-slate-600"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {copied === 'title' ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                        <input
                          value={generatedTitle}
                          onChange={(e) => setGeneratedTitle(e.target.value)}
                          className="w-full bg-transparent text-white border-none outline-none resize-none"
                        />
                      </div>
                    )}

                    {generatedBody && (
                      <div className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-blue-400">Body</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generatedBody, 'body')}
                            className="border-slate-600 hover:bg-slate-600"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            {copied === 'body' ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                        <textarea
                          value={generatedBody}
                          onChange={(e) => setGeneratedBody(e.target.value)}
                          className="w-full bg-transparent text-white border-none outline-none resize-none whitespace-pre-wrap min-h-20"
                          rows={4}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="max-w-7xl mx-auto p-6">
          <PostsLibrary />
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="max-w-7xl mx-auto p-6">
          <SongHistory />
        </div>
      )}
    </div>
  );
};

export default Dashboard;