import React, { useState, useRef } from 'react';
import { Button } from './ui/button';

interface MusicPlayerProps {
  songTitle: string;
  artistName: string;
  audioUrl?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  songTitle, 
  artistName, 
  audioUrl = "/placeholder-audio.mp3" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-md mx-auto mb-12">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">{songTitle}</h3>
        <p className="text-gray-400">by {artistName}</p>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <Button
          onClick={togglePlay}
          size="lg"
          className="rounded-full w-16 h-16 bg-white text-black hover:bg-gray-200"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <div className="flex-1 mx-3 bg-gray-700 rounded-full h-1">
          <div 
            className="bg-white h-1 rounded-full transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicPlayer;