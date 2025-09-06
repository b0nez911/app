import React from 'react';

interface VideoTeaserProps {
  videoUrl: string;
  title?: string;
}

const VideoTeaser: React.FC<VideoTeaserProps> = ({ videoUrl, title }) => {
  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const videoId = getYouTubeId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1`;

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        <iframe
          src={embedUrl}
          title={title || "Video Teaser"}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoTeaser;