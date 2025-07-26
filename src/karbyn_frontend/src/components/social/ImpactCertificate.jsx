import React, { useRef } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import ShareButtons from './ShareButtons';

/**
 * Shareable impact certificate component
 * 
 * @param {Object} props
 * @param {number} props.carbonOffset - Total carbon offset in kg
 * @param {number} props.activityCount - Number of eco-activities completed
 * @param {Array} props.badges - Array of earned badges
 * @param {string} props.timeframe - Timeframe of the certificate (weekly, monthly, yearly)
 * @param {boolean} props.showShare - Whether to show sharing options
 */
const ImpactCertificate = ({ 
  carbonOffset = 0,
  activityCount = 0,
  badges = [],
  timeframe = 'monthly',
  showShare = true
}) => {
  const { user } = useAuth();
  const certificateRef = useRef(null);
  
  // Format date for certificate
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get certificate ID (for uniqueness)
  const getCertificateId = () => {
    return `KARBYN-${Date.now().toString(36).toUpperCase()}`;
  };
  
  // Get equivalent impact metrics
  const getEquivalentImpact = () => {
    // Conversion factors (approximate)
    const treesPlanted = (carbonOffset / 21).toFixed(1); // 1 tree absorbs ~21kg CO2 per year
    const carMiles = (carbonOffset * 2.5).toFixed(0); // 1kg CO2 ≈ 2.5 miles not driven
    const phoneCharges = (carbonOffset * 121).toFixed(0); // 1kg CO2 ≈ 121 smartphone charges
    
    return { treesPlanted, carMiles, phoneCharges };
  };
  
  const equivalentImpact = getEquivalentImpact();
  const certificateId = getCertificateId();
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Certificate */}
      <div 
        ref={certificateRef}
        className="bg-card border-4 border-accent/20 rounded-lg p-6 organic-shadow-subtle"
      >
        <div className="text-center mb-6">
          <div className="inline-block bg-accent/10 px-4 py-1 rounded-full text-accent text-sm font-medium mb-2">
            {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Impact Certificate
          </div>
          <h2 className="text-2xl font-bold text-foreground">Carbon Impact Achievement</h2>
          <p className="text-muted-foreground">Issued on {formatDate()}</p>
          <p className="text-xs text-muted-foreground mt-1">Certificate ID: {certificateId}</p>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl mr-4">
            {user?.avatar || '👤'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{user?.name || 'Eco Hero'}</h3>
            <p className="text-muted-foreground">Karbyn Community Member</p>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{carbonOffset.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">kg CO₂ Offset</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{activityCount}</div>
              <div className="text-xs text-muted-foreground">Activities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{badges.length}</div>
              <div className="text-xs text-muted-foreground">Badges Earned</div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary/5 rounded-lg p-4 mb-6 border border-primary/10">
          <h4 className="text-sm font-medium text-foreground mb-2">Your Impact Equals</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-card p-2 rounded-lg">
              <div className="text-2xl mb-1">🌳</div>
              <div className="text-sm font-medium">{equivalentImpact.treesPlanted}</div>
              <div className="text-xs text-muted-foreground">Trees Planted</div>
            </div>
            <div className="bg-card p-2 rounded-lg">
              <div className="text-2xl mb-1">🚗</div>
              <div className="text-sm font-medium">{equivalentImpact.carMiles}</div>
              <div className="text-xs text-muted-foreground">Car Miles Saved</div>
            </div>
            <div className="bg-card p-2 rounded-lg">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-sm font-medium">{equivalentImpact.phoneCharges}</div>
              <div className="text-xs text-muted-foreground">Phone Charges</div>
            </div>
          </div>
        </div>
        
        {badges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-2">Badges Earned</h4>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-6">
          <div className="text-xs text-muted-foreground">
            Verified by Karbyn - Building a sustainable future together
          </div>
          <div className="mt-2">
            <svg className="h-8 w-auto mx-auto text-primary" viewBox="0 0 100 30" fill="currentColor">
              <path d="M20 5L40 25L30 30L10 10L20 5Z" />
              <path d="M60 5L80 25L70 30L50 10L60 5Z" />
              <path d="M40 15L50 5L60 15L50 25L40 15Z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Share options */}
      {showShare && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Share Your Impact</h3>
            <button 
              onClick={() => {
                // In a real implementation, this would generate an image from the certificate
                // For now, we'll just alert
                alert('Certificate download feature would be implemented here');
              }}
              className="text-sm text-primary hover:text-primary/80 flex items-center organic-transition"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
          
          <ShareButtons 
            title={`I've offset ${carbonOffset.toFixed(1)}kg of CO₂ with Karbyn!`}
            description={`I've completed ${activityCount} eco-activities and offset ${carbonOffset.toFixed(1)}kg of CO₂. Join me in fighting climate change!`}
            hashtags="karbyn,sustainability,climateaction,carbonfootprint"
            variant="outline"
          />
        </div>
      )}
    </div>
  );
};

export default ImpactCertificate;
