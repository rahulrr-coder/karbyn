import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectActions = ({ project }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this climate project: ${project.title}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  const shareOptions = [
    { id: 'twitter', label: 'Twitter', icon: 'Twitter' },
    { id: 'facebook', label: 'Facebook', icon: 'Facebook' },
    { id: 'linkedin', label: 'LinkedIn', icon: 'Linkedin' },
    { id: 'copy', label: 'Copy Link', icon: 'Copy' }
  ];

  return (
    <div className="bg-card rounded-lg p-6 organic-shadow-subtle sticky top-24">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Project Actions
      </h3>
      
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            iconName="Shield"
            iconPosition="left"
            onClick={() => {
              // Scroll to verification tab
              const verificationTab = document.querySelector('[data-tab="verification"]');
              if (verificationTab) {
                verificationTab.click();
                verificationTab.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Verify Project
          </Button>
          
          <Button
            variant={isFollowing ? "outline" : "secondary"}
            fullWidth
            iconName={isFollowing ? "Check" : "Plus"}
            iconPosition="left"
            onClick={handleFollow}
          >
            {isFollowing ? "Following" : "Follow Updates"}
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="relative">
            <Button
              variant="outline"
              fullWidth
              iconName="Share"
              iconPosition="left"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              Share Project
            </Button>
            
            {/* Share Menu */}
            {showShareMenu && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg organic-shadow-moderate z-10">
                <div className="p-2">
                  {shareOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option.id)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md organic-transition"
                    >
                      <Icon name={option.icon} size={16} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            fullWidth
            iconName="Flag"
            iconPosition="left"
            onClick={() => {
              // Mock report functionality
              alert('Report submitted. Thank you for helping maintain project quality.');
            }}
          >
            Report Issue
          </Button>
        </div>

        {/* Project Stats */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Community Engagement
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Eye" size={14} />
                <span>Views</span>
              </div>
              <span className="font-medium text-foreground">2,847</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Heart" size={14} />
                <span>Supporters</span>
              </div>
              <span className="font-medium text-foreground">156</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="MessageCircle" size={14} />
                <span>Comments</span>
              </div>
              <span className="font-medium text-foreground">43</span>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Trust Indicators
          </h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-muted-foreground">Verified by community</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Award" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">VCS certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-accent" />
              <span className="text-sm text-muted-foreground">Active community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;