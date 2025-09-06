import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Hash, ExternalLink, Wand2, Loader2 } from 'lucide-react';

interface SteppedFormProps {
  onSubmit: (data: any) => void;
  isGenerating: boolean;
  generatedContent: any;
  subredditSuggestions: any[];
  onMorePlaces: () => void;
}

export const SteppedForm: React.FC<SteppedFormProps> = ({
  onSubmit,
  isGenerating,
  generatedContent,
  subredditSuggestions,
  onMorePlaces
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showContent, setShowContent] = useState(false);
  const [showSubreddits, setShowSubreddits] = useState(false);
  const [formData, setFormData] = useState({
    songTitle: '',
    lyrics: '',
    keyThemes: '',
    pov: '',
    cta: '',
    postLength: 500,
    sentiment: 'positive',
    tone: '',
    includeHashtags: false,
    includeEmojis: false,
    includeSongLink: false,
    songLink: ''
  });

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setShowContent(false);
    setShowSubreddits(false);
    onSubmit(formData);
  };

  // Show content after generation completes
  useEffect(() => {
    if (generatedContent && !isGenerating) {
      setShowContent(true);
      // Show subreddits after 15 seconds
      const timer = setTimeout(() => {
        setShowSubreddits(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [generatedContent, isGenerating]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Step 1: Song Information */}
        {currentStep >= 1 && (
          <div className={`transition-all duration-700 ease-in-out transform ${
            currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Song Information
                </h2>
                <Input
                  value={formData.songTitle}
                  onChange={(e) => handleInputChange('songTitle', e.target.value)}
                  placeholder="Song title..."
                  className="w-full"
                />
                <Textarea
                  value={formData.lyrics}
                  onChange={(e) => handleInputChange('lyrics', e.target.value)}
                  placeholder="Paste your lyrics here..."
                  className="w-full min-h-32"
                />
                <Input
                  value={formData.keyThemes}
                  onChange={(e) => handleInputChange('keyThemes', e.target.value)}
                  placeholder="Key themes, emotions, or concepts..."
                  className="w-full"
                />
                {currentStep === 1 && formData.lyrics && (
                  <Button onClick={handleNext} className="w-full mt-6">
                    Continue
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Point of View */}
        {currentStep >= 2 && (
          <div className={`transition-all duration-1000 ease-out transform ${
            currentStep >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}
          style={{
            animation: currentStep >= 2 ? 'magicalAppear 1s ease-out' : 'none'
          }}>
            <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  The Point of View You'd Like Your Post Written In
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'first-person', label: 'First Person (I/We)' },
                    { value: 'second-person', label: 'Second Person (You)' },
                    { value: 'third-person', label: 'Third Person (They/Artist)' },
                    { value: 'omniscient', label: 'Omniscient Narrator' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={formData.pov === option.value ? 'default' : 'outline'}
                      onClick={() => handleInputChange('pov', option.value)}
                      className="w-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {currentStep === 2 && formData.pov && (
                  <Button onClick={handleNext} className="w-full mt-6">
                    Continue
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Post Length */}
        {currentStep >= 3 && (
          <div className={`transition-all duration-1000 ease-out transform ${
            currentStep >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}
          style={{
            animation: currentStep >= 3 ? 'magicalAppear 1.2s ease-out' : 'none'
          }}>
            <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Post Length
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>115 characters</span>
                    <span className="font-medium text-purple-400">{formData.postLength} characters</span>
                    <span>1500 characters</span>
                  </div>
                  <Slider
                    value={[formData.postLength]}
                    onValueChange={(value) => handleInputChange('postLength', value[0])}
                    max={1500}
                    min={115}
                    step={50}
                    className="w-full"
                  />
                </div>
                {currentStep === 3 && (
                  <Button onClick={handleNext} className="w-full mt-6">
                    Continue
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generate Button with Glowing/Pulsing Effect */}
        {currentStep >= 4 && (
          <div className="text-center">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="px-8 py-4 bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-white font-semibold rounded-lg shadow-2xl shadow-purple-900/50 transition-all duration-300 flex items-center justify-center gap-3 text-lg animate-pulse hover:animate-none"
              style={{
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
                animation: isGenerating ? 'none' : 'pulse 2s infinite'
              }}
            >
              <Wand2 className="w-6 h-6" />
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
        )}


      </div>
      
      <style jsx>{`
        @keyframes magicalAppear {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            transform: translateY(-10px) scale(1.02);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SteppedForm;