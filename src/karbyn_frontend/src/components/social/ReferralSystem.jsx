import React, { useState } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import ShareButtons from './ShareButtons';

/**
 * Referral system component for inviting friends to join Karbyn
 * 
 * @param {Object} props
 * @param {Function} props.onReferralSent - Callback when referral is sent
 * @param {string} props.variant - Visual variant: 'default', 'card', or 'minimal'
 */
const ReferralSystem = ({ 
  onReferralSent = () => {},
  variant = 'default'
}) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Generate unique referral code
  const getReferralCode = () => {
    // In a real app, this would be stored in the user profile
    // For now, generate a simple code based on user ID or timestamp
    const userId = user?.id || '';
    return `KARBYN${userId.substring(0, 4)}${Date.now().toString(36).substring(4, 8).toUpperCase()}`;
  };
  
  const referralCode = getReferralCode();
  
  // Generate referral link
  const getReferralLink = () => {
    return `${window.location.origin}/join?ref=${referralCode}`;
  };
  
  const referralLink = getReferralLink();
  
  // Handle email referral
  const handleEmailReferral = (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      setEmail('');
      onReferralSent({ type: 'email', email, referralCode });
    }, 1000);
  };
  
  // Handle copy referral code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };
  
  // Get component classes based on variant
  const getContainerClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-card rounded-lg organic-shadow-subtle border border-border p-6';
      case 'minimal':
        return '';
      case 'default':
      default:
        return 'bg-muted/30 rounded-lg p-6';
    }
  };
  
  return (
    <div className={getContainerClasses()}>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-1">Invite Friends to Karbyn</h3>
        <p className="text-sm text-muted-foreground">
          Help grow our community and earn rewards when friends join using your referral code
        </p>
      </div>
      
      {/* Referral benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl mb-2">🌱</div>
          <h4 className="text-sm font-medium text-foreground mb-1">Plant Trees</h4>
          <p className="text-xs text-muted-foreground">
            We'll plant a tree for each friend who joins
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl mb-2">🏆</div>
          <h4 className="text-sm font-medium text-foreground mb-1">Earn Badges</h4>
          <p className="text-xs text-muted-foreground">
            Unlock special community builder badges
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl mb-2">💎</div>
          <h4 className="text-sm font-medium text-foreground mb-1">Bonus Credits</h4>
          <p className="text-xs text-muted-foreground">
            Get bonus carbon credits for your account
          </p>
        </div>
      </div>
      
      {/* Referral code */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Your Referral Code
        </label>
        <div className="flex">
          <div className="flex-grow bg-muted/50 border border-border rounded-l-lg px-4 py-2 text-foreground font-mono">
            {referralCode}
          </div>
          <button 
            onClick={handleCopyCode}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-r-lg hover:bg-primary/90 organic-transition"
          >
            Copy
          </button>
        </div>
      </div>
      
      {/* Email referral */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-2">Invite via Email</h4>
        <form onSubmit={handleEmailReferral} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-grow bg-muted/50 border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <button
            type="submit"
            disabled={loading || emailSent}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
          >
            {loading ? 'Sending...' : emailSent ? 'Sent!' : 'Send Invite'}
          </button>
        </form>
        {emailSent && (
          <p className="text-xs text-primary mt-2">
            Invitation email sent successfully!
          </p>
        )}
      </div>
      
      {/* Social sharing */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Share Your Referral Link</h4>
        <ShareButtons 
          title="Join me on Karbyn to track and reduce your carbon footprint!"
          description={`I'm using Karbyn to track my carbon footprint and take climate action. Join me using my referral code: ${referralCode}`}
          url={referralLink}
          hashtags="karbyn,sustainability,climateaction,carbonfootprint"
          variant="outline"
          size="sm"
        />
      </div>
    </div>
  );
};

export default ReferralSystem;
