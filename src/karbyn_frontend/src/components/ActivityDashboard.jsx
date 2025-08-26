import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';
import { KarbynBackendService } from '../services/KarbynBackendService.jsx';

// Activity Form Component
export const ActivityForm = ({ onActivitySubmitted, onError }) => {
  const { isAuthenticated, user, actor } = useAuth();
  const [formData, setFormData] = useState({
    activity_type: '',
    description: '',
    location: '',
    quantity: 1,
    proof_url: '',
    additional_notes: ''
  });
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);

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

    if (isAuthenticated && actor) {
      // Set the actor in the service before making calls
      KarbynBackendService.setActor(actor);
      loadActivityTypes();
    }
  }, [isAuthenticated, actor]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      onError?.('You must be logged in to submit activities');
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
      console.error('Failed to submit activity:', error);
      onError?.('Failed to submit activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Please sign in to track your activities.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Submit New Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Type
          </label>
          <select
            name="activity_type"
            value={formData.activity_type}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {activityTypes.map(([type, details]) => (
              <option key={type} value={type}>
                {KarbynBackendService.formatActivityType(type)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your activity..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="3"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where did this take place?"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proof URL (Optional)
          </label>
          <input
            type="url"
            name="proof_url"
            value={formData.proof_url}
            onChange={handleInputChange}
            placeholder="https://example.com/proof"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="additional_notes"
            value={formData.additional_notes}
            onChange={handleInputChange}
            placeholder="Any additional information..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Activity'}
        </button>
      </form>
    </div>
  );
};

// Activity History Component
export const ActivityHistory = ({ refreshTrigger }) => {
  const { isAuthenticated, actor } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadActivities = async () => {
      if (!isAuthenticated || !actor) return;

      try {
        setLoading(true);
        // Set the actor in the service before making calls
        KarbynBackendService.setActor(actor);
        const userActivities = await KarbynBackendService.getUserActivities();
        setActivities(userActivities);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [isAuthenticated, actor, refreshTrigger]);

  const getStatusBadge = (status) => {
    const statusText = KarbynBackendService.formatVerificationStatus(status);
    const statusClasses = {
      'Verified': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[statusText] || 'bg-gray-100 text-gray-800'}`}>
        {statusText}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Please sign in to view your activity history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Activity History</h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No activities recorded yet.</p>
          <p className="text-sm text-gray-500 mt-2">Submit your first activity to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">
                  {KarbynBackendService.formatActivityType(activity.activity_type)}
                </h3>
                {getStatusBadge(activity.verification_status)}
              </div>
              
              <p className="text-gray-600 mb-2">{activity.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <p className="text-gray-600">{activity.quantity}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Carbon Impact:</span>
                  <p className="text-gray-600">{activity.carbon_impact?.toFixed(2)} kg CO₂</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Tokens Earned:</span>
                  <p className="text-gray-600">{activity.tokens_earned} KCT</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <p className="text-gray-600">{new Date(activity.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Token Rewards Component
export const TokenRewards = () => {
  const { isAuthenticated, actor } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (!isAuthenticated || !actor) return;

      try {
        setLoading(true);
        // Set the actor in the service before making calls
        KarbynBackendService.setActor(actor);
        const userStats = await KarbynBackendService.getUserStats();
        setStats(userStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAuthenticated, actor]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Please sign in to view your rewards.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Impact & Rewards</h2>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.total_activities}
            </div>
            <div className="text-gray-700 font-medium">Total Activities</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.total_carbon_impact?.toFixed(1)}
            </div>
            <div className="text-gray-700 font-medium">kg CO₂ Offset</div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.total_tokens_earned}
            </div>
            <div className="text-gray-700 font-medium">KCT Tokens Earned</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.verified_activities}
            </div>
            <div className="text-gray-700 font-medium">Verified Activities</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.pending_activities}
            </div>
            <div className="text-gray-700 font-medium">Pending Verification</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Activity Dashboard Component
export const ActivityDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState(null);

  const handleActivitySubmitted = (activity) => {
    setNotification({
      type: 'success',
      message: 'Activity submitted successfully!'
    });
    setRefreshTrigger(prev => prev + 1);
    
    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const handleError = (error) => {
    setNotification({
      type: 'error',
      message: error
    });
    
    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Token Rewards Stats */}
      <TokenRewards />
      
      {/* Activity Form */}
      <ActivityForm 
        onActivitySubmitted={handleActivitySubmitted}
        onError={handleError}
      />
      
      {/* Activity History */}
      <ActivityHistory refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default ActivityDashboard;
