import React, { useState, useEffect } from 'react';
import SteppedForm from '@/components/SteppedForm';
import { ModernNavigation } from '@/components/ModernNavigation';
import { SongHistoryEnhanced } from '@/components/SongHistoryEnhanced';
import { PostsLibrary } from '@/components/PostsLibrary';
import PostLibrary from '@/pages/PostLibrary';
import { geminiApi } from '@/services/geminiApi';
import { songPersistence, SongData } from '@/services/songPersistence';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Copy, Plus } from 'lucide-react';

const SteppedDashboard: React.FC = () => {
  const { includeHashtags, includeEmojis, includeSongLink, songLink } = useAppContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('generate');
  const [songTitle, setSongTitle] = useState('');
  const [songLyrics, setSongLyrics] = useState('');
  const [featureWords, setFeatureWords] = useState('');
  const [perspective, setPerspective] = useState('first-person');
  const [cta, setCta] = useState('encourage-comments');
  const [postLength, setPostLength] = useState(500);
  const [valence, setValence] = useState('positive');
  const [tone, setTone] = useState('inspirational');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [suggestedSubreddits, setSuggestedSubreddits] = useState<any[]>([]);
  const [expandedSubreddits, setExpandedSubreddits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState('');

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard"
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
        'General audience',
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

  const handleGenerateContent = async (formData: any) => {
    if (!formData.lyrics.trim()) return;
    setLoading(true);
    
    try {
      // Update form data state
      setSongTitle(formData.songTitle);
      setSongLyrics(formData.lyrics);
      setFeatureWords(formData.keyThemes);
      setPerspective(formData.pov);
      setPostLength(formData.postLength);
      
      // Generate content
      const response = await geminiApi.generateRedditContent(
        formData.songTitle || 'Your Song',
        'General audience',
        formData.lyrics,
        formData.pov,
        formData.postLength.toString(),
        includeEmojis,
        includeHashtags,
        formData.cta || 'encourage-comments',
        '',
        false,
        '',
        includeSongLink ? songLink : undefined
      );
      
      const lines = response.content.split('\n');
      const titleLine = lines.find(line => line.trim().length > 0) || '';
      const bodyLines = lines.slice(1).filter(line => line.trim().length > 0);
      
      setGeneratedTitle(titleLine.replace(/^(Title:|#)\s*/, ''));
      let processedBody = bodyLines.join('\n\n'); // 5 sentence paragraphs
      processedBody = processedBody.replace(/##/g, '#');
      setGeneratedBody(processedBody);

      // Generate subreddit suggestions
      const suggestions = await geminiApi.suggestSubredditsAndHashtags(
        formData.lyrics,
        formData.songTitle,
        'General audience',
        formData.keyThemes,
        tone,
        valence,
        formData.postLength,
        includeEmojis,
        includeHashtags
      );
      setSuggestedSubreddits(suggestions.subreddits || []);
      
      setShowResults(true);
      
      // Save to database
      await saveSongData();
    } catch (error) {
      setGeneratedTitle('Just discovered this amazing track!');
      setGeneratedBody('🎵 The beats are absolutely fire and the lyrics hit different. Perfect for anyone who loves authentic music with real emotion. What do you think about artists who pour their soul into every track? The way they craft each verse tells a story that resonates with so many people. Music like this reminds me why I fell in love with discovering new artists in the first place.\n\nThere\'s something magical about finding that perfect song. I\'d love to hear your thoughts on what makes a song truly memorable. Do you have any similar tracks that give you the same feeling? Drop your recommendations below - always looking for more music that hits this hard! #NewMusic #Authentic');
      setShowResults(true);
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
        target_audience: 'General audience',
        valence,
        tone,
        post_length: postLength,
        use_emojis: includeEmojis,
        recommend_hashtags: includeHashtags,
        suggested_subreddits: suggestedSubreddits,
        suggested_hashtags: [],
        generated_title: generatedTitle,
        generated_body: generatedBody
      };

      await songPersistence.saveSong(songData);
    } catch (error) {
      console.error('Failed to save song data:', error);
    }
  };

  const handleLoadSong = (song: SongData) => {
    setSongTitle(song.song_title || '');
    setSongLyrics(song.song_lyrics || '');
    setFeatureWords(song.feature_words || '');
    setValence(song.valence || 'positive');
    setTone(song.tone || 'inspirational');
    setPostLength(song.post_length || 500);
    setGeneratedTitle(song.generated_title || '');
    setGeneratedBody(song.generated_body || '');
    setActiveTab('generate');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <ModernNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'generate' && (
        <div className="relative">
          <SteppedForm
            onSubmit={handleGenerateContent}
            isGenerating={loading}
            generatedContent={generatedBody ? { body: generatedBody } : null}
            subredditSuggestions={suggestedSubreddits}
            onMorePlaces={handleMorePlaces}
          />
          
          {/* Generated Content */}
          {/* Enhanced Your Post Section with All Functionality */}
          {showResults && (generatedTitle || generatedBody) && (
            <div className="max-w-2xl mx-auto px-6 pb-12">
              <div className="relative">
                {/* Neon purple glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 rounded-xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-slate-800/90 border-2 border-purple-500 rounded-xl p-8 space-y-6 shadow-2xl shadow-purple-500/25">
                  <h3 className="text-2xl font-bold text-center text-white mb-6">Your Post</h3>
                  
                  {/* Title Section */}
                  {generatedTitle && (
                    <div className="bg-slate-700/80 border border-slate-600 p-4 rounded-lg hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-orange-400">Title</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedTitle, 'title')}
                          className="border-slate-600 hover:bg-slate-600 hover:border-purple-400 transition-all duration-300"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {copied === 'title' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <input
                        value={generatedTitle}
                        onChange={(e) => setGeneratedTitle(e.target.value)}
                        className="w-full bg-transparent text-white border-none outline-none text-lg placeholder-slate-400 focus:text-purple-300 transition-colors"
                        placeholder="Your post title..."
                      />
                    </div>
                  )}

                  {/* Body Section */}
                  {generatedBody && (
                    <div className="bg-slate-700/80 border border-slate-600 p-4 rounded-lg hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-blue-400">Body</h4>
                          <span className="text-xs text-slate-400">({generatedBody.length}/1500 characters)</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedBody, 'body')}
                          className="border-slate-600 hover:bg-slate-600 hover:border-purple-400 transition-all duration-300"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {copied === 'body' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <textarea
                        value={generatedBody}
                        onChange={(e) => setGeneratedBody(e.target.value)}
                        maxLength={1500}
                        className="w-full bg-transparent text-white border-none outline-none resize-none whitespace-pre-wrap min-h-32 placeholder-slate-400 focus:text-purple-300 transition-colors"
                        rows={8}
                        placeholder="Your post content..."
                      />
                    </div>
                  )}

                  {/* Tags Section */}
                  <div className="bg-slate-700/80 border border-slate-600 p-4 rounded-lg hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-green-400">Tags</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard('#Roses #NewMusic #Heartbreak #BONEZBOI #IndieMusic', 'tags')}
                        className="border-slate-600 hover:bg-slate-600 hover:border-purple-400 transition-all duration-300"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copied === 'tags' ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <input
                      defaultValue="#Roses #NewMusic #Heartbreak #BONEZBOI #IndieMusic"
                      className="w-full bg-transparent text-white border-none outline-none text-sm placeholder-slate-400 focus:text-purple-300 transition-colors"
                      placeholder="Add your hashtags..."
                    />
                  </div>
                  
                  {/* Subreddit Suggestions */}
                  {suggestedSubreddits.length > 0 && (
                    <div className="bg-slate-700/80 border border-slate-600 p-6 rounded-lg hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                      <h4 className="font-medium text-purple-400 mb-4 text-lg">Suggested Subreddits</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {suggestedSubreddits.slice(0, 4).map((subreddit, index) => (
                          <div key={index} className="bg-slate-600/80 border border-slate-500 p-3 rounded-lg hover:border-purple-400 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10">
                            <div className="flex justify-between items-center mb-1">
                              <h5 className="font-medium text-white text-sm">{subreddit.name || `r/${['gaymusic', 'indiemusic', 'Music', 'lgbt'][index]}`}</h5>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                (subreddit.engagement_potential || ['high', 'medium', 'high', 'medium'][index]) === 'high' ? 'bg-green-600 text-white' :
                                (subreddit.engagement_potential || ['high', 'medium', 'high', 'medium'][index]) === 'medium' ? 'bg-yellow-600 text-black' :
                                'bg-gray-600 text-white'
                              }`}>
                                {subreddit.engagement_potential || ['high', 'medium', 'high', 'medium'][index]}
                              </span>
                            </div>
                            <a
                              href={`https://reddit.com/${subreddit.name || `r/${['gaymusic', 'indiemusic', 'Music', 'lgbt'][index]}`}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors font-medium"
                            >
                              Post Here
                            </a>
                          </div>
                        ))}
                        
                        {expandedSubreddits.map((subreddit, index) => (
                          <div key={`expanded-${index}`} className="bg-slate-600/80 border border-slate-500 p-3 rounded-lg hover:border-purple-400 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10">
                            <div className="flex justify-between items-center mb-1">
                              <h5 className="font-medium text-white text-sm">{subreddit.name}</h5>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                subreddit.engagement_potential === 'high' ? 'bg-green-600 text-white' :
                                subreddit.engagement_potential === 'medium' ? 'bg-yellow-600 text-black' :
                                'bg-gray-600 text-white'
                              }`}>
                                {subreddit.engagement_potential}
                              </span>
                            </div>
                            <a
                              href={`https://reddit.com/${subreddit.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors font-medium"
                            >
                              Post Here
                            </a>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        onClick={handleMorePlaces}
                        disabled={loadingMore}
                        variant="outline"
                        className="w-full mt-6 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-300 py-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {loadingMore ? 'Loading...' : 'More Places to Promote'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="max-w-7xl mx-auto p-6">
          <SongHistoryEnhanced onLoadSong={handleLoadSong} />
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="max-w-7xl mx-auto p-6">
          <PostsLibrary />
        </div>
      )}

      {activeTab === 'reddit' && (
        <div className="max-w-7xl mx-auto p-6">
          <PostLibrary />
        </div>
      )}
    </div>
  );
};

export default SteppedDashboard;