import React from 'react';
import { useActivity } from '../../contexts/ActivityContext';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Link } from 'react-router-dom';

const ActivityHistory = () => {
  const { activities, stats, loading } = useActivity();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your activity history</p>
          <Link
            to="/auth/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
              <p className="text-gray-600 mt-1">
                Track your eco-friendly actions and their verification status
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <Link
                to="/activities/submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Log New Activity
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Carbon Offset</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCarbonOffset} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">NFTs Generated</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNFTsGenerated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Weekly Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.weeklyStreak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : activities.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">
                          {activity.type === 'transport' && '🚌'}
                          {activity.type === 'recycling' && '♻️'}
                          {activity.type === 'energy' && '⚡'}
                          {activity.type === 'consumption' && '🛍️'}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.description}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()} • {activity.location || 'Location not specified'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {activity.distance && (
                          <div className="text-sm">
                            <span className="text-gray-600">Distance:</span>
                            <span className="ml-1 font-medium">{activity.distance} km</span>
                          </div>
                        )}
                        {activity.quantity && (
                          <div className="text-sm">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-1 font-medium">{activity.quantity} items</span>
                          </div>
                        )}
                        <div className="text-sm">
                          <span className="text-gray-600">Carbon Offset:</span>
                          <span className="ml-1 font-medium text-green-600">{activity.carbonOffset} kg CO2</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {activity.verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⏳ Pending
                          </span>
                        )}
                        
                        {activity.nftGenerated && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            🏆 NFT Generated
                          </span>
                        )}
                      </div>

                      {activity.verified && !activity.nftGenerated && (
                        <span className="text-xs text-gray-500">
                          NFT generation in progress...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
              <p className="text-gray-600 mb-6">
                Start logging your eco-friendly actions to build your activity history and earn NFTs.
              </p>
              <Link
                to="/activities/submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Log Your First Activity
              </Link>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Better Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <h4 className="font-medium text-gray-900">Be Specific with Locations</h4>
                <p className="text-sm text-gray-600">Include specific locations to help our AI verify your activities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📏</span>
              <div>
                <h4 className="font-medium text-gray-900">Accurate Measurements</h4>
                <p className="text-sm text-gray-600">Provide accurate distances and quantities for better carbon calculations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📝</span>
              <div>
                <h4 className="font-medium text-gray-900">Detailed Descriptions</h4>
                <p className="text-sm text-gray-600">Add context to help our verification system understand your activity</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⏰</span>
              <div>
                <h4 className="font-medium text-gray-900">Log Activities Promptly</h4>
                <p className="text-sm text-gray-600">Submit activities soon after completion for better verification accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHistory;
