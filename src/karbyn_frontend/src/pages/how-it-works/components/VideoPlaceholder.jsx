import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const VideoPlaceholder = ({ title, description, thumbnail, duration = "3:45" }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // In a real implementation, this would trigger video playback
    setTimeout(() => setIsPlaying(false), 2000); // Reset for demo
  };

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle overflow-hidden">
      <div className="relative">
        <Image
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center organic-transition hover:scale-110 ${
              isPlaying ? 'animate-pulse' : 'hover:bg-primary/90'
            }`}
            aria-label="Play video"
          >
            {isPlaying ? (
              <Icon name="Loader2" size={24} className="animate-spin" />
            ) : (
              <Icon name="Play" size={24} className="ml-1" />
            )}
          </button>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {duration}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default VideoPlaceholder;