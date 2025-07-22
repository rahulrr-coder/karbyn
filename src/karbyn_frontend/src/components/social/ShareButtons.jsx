import React, { useState } from 'react';

/**
 * Social sharing component for activities, achievements, and certificates
 * 
 * @param {Object} props
 * @param {string} props.title - Title to share
 * @param {string} props.description - Description to share
 * @param {string} props.url - URL to share (defaults to current URL)
 * @param {string} props.hashtags - Comma-separated hashtags
 * @param {string} props.image - Image URL to share (optional)
 * @param {boolean} props.showCopyLink - Whether to show copy link button
 * @param {string} props.size - Size of buttons: 'sm', 'md', or 'lg'
 * @param {string} props.variant - Visual variant: 'default', 'outline', or 'minimal'
 */
const ShareButtons = ({ 
  title = 'Check out my eco-impact on Karbyn!',
  description = 'I\'m reducing my carbon footprint with Karbyn. Join me!',
  url = window.location.href,
  hashtags = 'karbyn,sustainability,climateaction',
  image = '',
  showCopyLink = true,
  size = 'md',
  variant = 'default'
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Encode parameters for sharing
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(url);
  const encodedHashtags = encodeURIComponent(hashtags);
  
  // Share URLs for different platforms
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedDescription}&url=${encodedUrl}&hashtags=${encodedHashtags.replace(',', '')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedDescription}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedDescription}`
  };
  
  // Handle copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setShowTooltip(true);
      
      // Hide tooltip after 2 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    });
  };
  
  // Get button size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      case 'md':
      default:
        return 'w-10 h-10';
    }
  };
  
  // Get button variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'border border-border bg-transparent hover:bg-muted';
      case 'minimal':
        return 'bg-transparent hover:bg-muted/50';
      case 'default':
      default:
        return 'bg-muted hover:bg-muted/80';
    }
  };
  
  const buttonClasses = `${getSizeClasses()} ${getVariantClasses()} rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground organic-transition`;

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-2">
        {/* Twitter/X */}
        <a 
          href={shareUrls.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on Twitter/X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>
        
        {/* Facebook */}
        <a 
          href={shareUrls.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
          </svg>
        </a>
        
        {/* LinkedIn */}
        <a 
          href={shareUrls.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
          </svg>
        </a>
        
        {/* WhatsApp */}
        <a 
          href={shareUrls.whatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>
        
        {/* Telegram */}
        <a 
          href={shareUrls.telegram} 
          target="_blank" 
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-label="Share on Telegram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </a>
        
        {/* Copy Link Button */}
        {showCopyLink && (
          <div className="relative">
            <button 
              onClick={handleCopyLink}
              className={buttonClasses}
              aria-label="Copy link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
            
            {/* Copy success tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded shadow-md whitespace-nowrap">
                Link copied!
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-accent"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;
