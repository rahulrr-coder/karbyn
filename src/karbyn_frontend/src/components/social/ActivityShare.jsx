import React, { useState } from 'react';
import ShareButtons from './ShareButtons';

/**
 * Activity sharing component for completed eco-activities
 * 
 * @param {Object} props
 * @param {Object} props.activity - Activity data to share
 * @param {boolean} props.expanded - Whether the component is expanded by default
 */
const ActivityShare = ({ activity, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  if (!activity) return null;
  
  // Format carbon offset for display
  const formatCarbonOffset = (value) => {
    return typeof value === 'number' ? value.toFixed(1) : '0.0';
  };
  
  // Generate share text based on activity type
  const getShareText = () => {
    const baseText = `I just ${activity.type === 'transport' ? 'took sustainable transport' : 
                      activity.type === 'recycling' ? 'recycled' : 
                      activity.type === 'energy' ? 'saved energy' : 
                      'completed an eco-activity'} on Karbyn!`;
                      
    return `${baseText} Offset: ${formatCarbonOffset(activity.carbonOffset)}kg CO₂`;
  };
  
  // Generate share description with more details
  const getShareDescription = () => {
    return `I just offset ${formatCarbonOffset(activity.carbonOffset)}kg of CO₂ by ${activity.description || 'completing an eco-friendly activity'}. Join me on Karbyn to track your own carbon impact!`;
  };
  
  // Get activity icon based on type
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'transport': return '🚌';
      case 'recycling': return '♻️';
      case 'energy': return '⚡';
      case 'planting': return '🌱';
      default: return '🌍';
    }
  };

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 organic-transition"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl mr-3">
            {getActivityIcon()}
          </div>
          <div>
            <h3 className="font-medium text-foreground">Share Your Impact</h3>
            <p className="text-sm text-muted-foreground">Let others know about your eco-activity</p>
          </div>
        </div>
        <div>
          <svg 
            className={`w-5 h-5 text-muted-foreground organic-transition ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-border">
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="text-xl mr-2">{getActivityIcon()}</div>
              <div className="text-sm font-medium text-foreground">{getShareText()}</div>
            </div>
            <div className="text-xs text-muted-foreground">{getShareDescription()}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Share on social media</h4>
              <p className="text-xs text-muted-foreground">Inspire others to join the movement</p>
            </div>
            <ShareButtons 
              title={getShareText()}
              description={getShareDescription()}
              hashtags={`karbyn,sustainability,${activity.type || 'eco'}`}
              size="sm"
              variant="outline"
            />
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => {
                // In a real implementation, this would navigate to the certificate page
                // For now, we'll just alert
                alert('This would navigate to a full impact certificate');
              }}
              className="w-full py-2 px-4 bg-primary/10 text-primary text-sm text-center rounded-lg hover:bg-primary/20 organic-transition flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Generate Impact Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityShare;
