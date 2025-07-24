/**
 * Karbyn Activity Tracking Components - Complete Phase 3 Integration
 * 
 * This file provides comprehensive activity tracking functionality including:
 * - Activity submission forms
 * - Activity history display
 * - Token rewards tracking
 * - NFT minting capabilities
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  KarbynBackendService, 
  SubmitActivityInput, 
  ActivityType, 
  ActivityHistoryItem,
  UserActivityStats,
  ActivityVerificationStatus
} from '../services/KarbynBackendServiceComplete';

// ==================== ACTIVITY FORM COMPONENT ====================

interface ActivityFormProps {
  onActivitySubmitted?: (activity: any) => void;
  onError?: (error: string) => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ 
  onActivitySubmitted, 
  onError 
}) => {
  const { isUserRegistered } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activityTypes, setActivityTypes] = useState<Array<[string, number, string]>>([]);
  const [formData, setFormData] = useState<SubmitActivityInput>({
    activity_type: '',
    description: '',
    location: '',
    quantity: 1,
    proof_url: '',
    additional_notes: ''
  });

  // Load available activity types
  useEffect(() => {
    const loadActivityTypes = async () => {
      try {
        const types = await KarbynBackendService.getActivityTypes();
        setActivityTypes(types);
        if (types.length > 0) {
          setFormData(prev => ({ ...prev, activity_type: types[0][0] }));
        }
      } catch (error) {
        console.error('Failed to load activity types:', error);
      }
    };

    if (isUserRegistered()) {
      loadActivityTypes();
    }
  }, [isUserRegistered]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isUserRegistered()) {
      onError?.('You must be registered to submit activities');
      return;
    }

    try {
      setLoading(true);
      const activity = await KarbynBackendService.submitActivity(formData);
      
      // Reset form
      setFormData({
        activity_type: activityTypes[0]?.[0] || '',
        description: '',
        location: '',
        quantity: 1,
        proof_url: '',
        additional_notes: ''
      });

      onActivitySubmitted?.(activity);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit activity';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedActivityType = activityTypes.find(([type]) => type === formData.activity_type);
  const estimatedTokens = selectedActivityType ? Math.round(formData.quantity * selectedActivityType[1]) : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Submit Eco-Activity</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Type */}
        <div>
          <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700">
            Activity Type
          </label>
          <select
            id="activity_type"
            name="activity_type"
            value={formData.activity_type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          >
            {activityTypes.map(([type, tokensPerUnit, description]) => (
              <option key={type} value={type}>
                {KarbynBackendService.formatActivityType(type as ActivityType)} 
                ({tokensPerUnit} KCT per unit)
              </option>
            ))}
          </select>
          {selectedActivityType && (
            <p className="mt-1 text-sm text-gray-500">{selectedActivityType[2]}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            placeholder="Describe your environmental activity..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="0.1"
            step="0.1"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
          {estimatedTokens > 0 && (
            <p className="mt-1 text-sm text-green-600">
              Estimated reward: {estimatedTokens} KCT
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="City, State or GPS coordinates"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Proof URL */}
        <div>
          <label htmlFor="proof_url" className="block text-sm font-medium text-gray-700">
            Proof URL (Optional)
          </label>
          <input
            type="url"
            id="proof_url"
            name="proof_url"
            value={formData.proof_url}
            onChange={handleInputChange}
            placeholder="https://example.com/photo-or-document"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            id="additional_notes"
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleInputChange}
            rows={2}
            placeholder="Any additional information..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading || !isUserRegistered()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Activity'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==================== ACTIVITY HISTORY COMPONENT ====================

interface ActivityHistoryProps {
  refreshTrigger?: number;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ refreshTrigger }) => {
  const { isUserRegistered } = useAuth();
  const [activities, setActivities] = useState<ActivityHistoryItem[]>([]);
  const [stats, setStats] = useState<UserActivityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    if (!isUserRegistered()) return;

    try {
      setLoading(true);
      setError(null);
      
      const [userActivities, userStats] = await Promise.all([
        KarbynBackendService.getUserActivities(),
        KarbynBackendService.getUserActivityStats()
      ]);
      
      setActivities(userActivities);
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [isUserRegistered]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities, refreshTrigger]);

  const getStatusBadge = (status: ActivityVerificationStatus) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'Verified':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'UnderReview':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (!isUserRegistered()) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center">Please register to view your activity history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Stats Header */}
      {stats && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total_activities}</div>
              <div className="text-sm text-gray-500">Total Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.verified_activities}</div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total_carbon_offset} kg</div>
              <div className="text-sm text-gray-500">CO₂ Offset</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.nfts_generated}</div>
              <div className="text-sm text-gray-500">NFTs Earned</div>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activities submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id.toString()} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {KarbynBackendService.formatActivityType(activity.activity_type)}
                      </h4>
                      <span className={getStatusBadge(activity.verification_status)}>
                        {activity.verification_status}
                      </span>
                      {activity.nft_generated && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          NFT Generated
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Quantity: {activity.quantity}</span>
                      <span>CO₂ Offset: {activity.calculated_carbon_offset} kg</span>
                      {activity.location && <span>Location: {activity.location}</span>}
                      <span>Score: {activity.verification_score}/100</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      +{Math.round(activity.calculated_carbon_offset * 1000)} KCT
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(Number(activity.submitted_at) / 1000000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== TOKEN REWARDS COMPONENT ====================

export const TokenRewards: React.FC = () => {
  const { isUserRegistered, canMintNFT } = useAuth();
  const [tokenBalance, setTokenBalance] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mintingNFT, setMintingNFT] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadTokenData = useCallback(async () => {
    if (!isUserRegistered()) return;

    try {
      setLoading(true);
      setError(null);
      
      const [balance, userPortfolio] = await Promise.all([
        KarbynBackendService.getTokenBalance(),
        KarbynBackendService.getUserPortfolio()
      ]);
      
      setTokenBalance(balance);
      setPortfolio(userPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load token data');
    } finally {
      setLoading(false);
    }
  }, [isUserRegistered]);

  const handleMintNFT = async () => {
    try {
      setMintingNFT(true);
      setError(null);
      setSuccess(null);
      
      const nft = await KarbynBackendService.mintNFT();
      setSuccess(`Successfully minted NFT #${nft.nft_id}! 🎉`);
      
      // Refresh token data
      await loadTokenData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setMintingNFT(false);
    }
  };

  useEffect(() => {
    loadTokenData();
  }, [loadTokenData]);

  if (!isUserRegistered()) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center">Please register to view your token rewards.</p>
      </div>
    );
  }

  const carbonOffset = tokenBalance ? KarbynBackendService.formatCarbonOffset(Number(tokenBalance.balance) / 1000) : null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Token Rewards & NFTs</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Token Balance */}
          {tokenBalance && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {KarbynBackendService.formatKCT(tokenBalance.balance)}
                </div>
                <div className="text-sm text-green-700">Current Balance</div>
                {carbonOffset && (
                  <div className="text-xs text-green-600 mt-1">
                    ≈ {carbonOffset.tons} tons CO₂ offset
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Portfolio Stats */}
          {portfolio && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {KarbynBackendService.formatKCT(portfolio.total_tokens_earned)}
                </div>
                <div className="text-sm text-gray-500">Total Earned</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{portfolio.nfts_minted}</div>
                <div className="text-sm text-gray-500">NFTs Minted</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">{portfolio.total_carbon_offset} kg</div>
                <div className="text-sm text-gray-500">Total Offset</div>
              </div>
            </div>
          )}

          {/* NFT Minting */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">NFT Minting</h4>
            
            {canMintNFT() ? (
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 mb-4">
                  🎉 Congratulations! You have enough tokens to mint a Carbon Credit NFT.
                  Each NFT represents 1 ton (1000 kg) of CO₂ offset.
                </p>
                <button
                  onClick={handleMintNFT}
                  disabled={mintingNFT}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mintingNFT ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Minting NFT...
                    </>
                  ) : (
                    'Mint Carbon Credit NFT (1000 KCT)'
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  You need 1000 KCT to mint a Carbon Credit NFT.
                </p>
                {tokenBalance && (
                  <div className="text-xs text-gray-500">
                    Progress: {Number(tokenBalance.balance)}/1000 KCT 
                    ({Math.round((Number(tokenBalance.balance) / 1000) * 100)}%)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== MAIN ACTIVITY DASHBOARD ====================

export const ActivityDashboard: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleActivitySubmitted = (activity: any) => {
    setNotification({
      type: 'success',
      message: `Activity "${activity.description}" submitted successfully! Earned ${Math.round(activity.calculated_carbon_offset * 1000)} KCT tokens.`
    });
    setRefreshTrigger(prev => prev + 1);
    
    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const handleError = (error: string) => {
    setNotification({
      type: 'error',
      message: error
    });
    
    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Eco-Activity Tracking</h1>
        <p className="mt-2 text-gray-600">
          Submit your environmental activities to earn Karbyn Carbon Tokens (KCT) and mint NFTs!
        </p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 rounded-md p-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`text-sm ${
            notification.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {notification.message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form and Rewards */}
        <div className="space-y-8">
          <ActivityForm 
            onActivitySubmitted={handleActivitySubmitted}
            onError={handleError}
          />
          <TokenRewards />
        </div>

        {/* Right Column - History */}
        <div>
          <ActivityHistory refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
