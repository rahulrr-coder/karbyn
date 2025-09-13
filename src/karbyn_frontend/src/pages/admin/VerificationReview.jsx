import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
// Removed AIVerificationInterface - using simplified verification instead

const VerificationReview = () => {
  const { isAuthenticated } = useAuth();
  const [pendingActivities, setPendingActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationResults, setVerificationResults] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data for pending activities
  useEffect(() => {
    // In a real implementation, this would fetch from the backend
    const mockPendingActivities = [
      {
        id: '1',
        type: 'transport',
        subtype: 'bus',
        description: 'Commuted to work by bus instead of driving',
        distance: 12.5,
        location: 'Downtown to Uptown',
        date: new Date().toISOString(),
        user: {
          id: 'user1',
          name: 'Alex Johnson',
          trustScore: 85
        },
        proofFiles: [
          new File([''], 'bus_ticket.jpg', { type: 'image/jpeg' }),
          new File([''], 'bus_selfie.jpg', { type: 'image/jpeg' })
        ],
        carbonOffset: 3.2,
        status: 'pending'
      },
      {
        id: '2',
        type: 'recycling',
        subtype: 'plastic',
        description: 'Recycled plastic bottles from community cleanup',
        quantity: 45,
        location: 'Riverside Park',
        date: new Date(Date.now() - 86400000).toISOString(),
        user: {
          id: 'user2',
          name: 'Sam Rivera',
          trustScore: 92
        },
        proofFiles: [
          new File([''], 'recycling_pile.jpg', { type: 'image/jpeg' })
        ],
        carbonOffset: 5.6,
        status: 'pending'
      },
      {
        id: '3',
        type: 'energy',
        subtype: 'solar',
        description: 'Generated electricity with home solar panels',
        duration: 8.5,
        location: 'Home',
        date: new Date(Date.now() - 172800000).toISOString(),
        user: {
          id: 'user3',
          name: 'Taylor Kim',
          trustScore: 78
        },
        proofFiles: [
          new File([''], 'solar_meter.jpg', { type: 'image/jpeg' }),
          new File([''], 'solar_panels.jpg', { type: 'image/jpeg' })
        ],
        carbonOffset: 12.8,
        status: 'pending'
      }
    ];

    setPendingActivities(mockPendingActivities);
    setLoading(false);
  }, []);

  const handleVerificationComplete = (activityId, result) => {
    setVerificationResults(prev => ({
      ...prev,
      [activityId]: result
    }));
    setVerificationMode(false);
  };

  const approveActivity = (activityId) => {
    // In a real implementation, this would call the backend
    setPendingActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: 'approved' } 
          : activity
      )
    );
  };

  const rejectActivity = (activityId) => {
    // In a real implementation, this would call the backend
    setPendingActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: 'rejected' } 
          : activity
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please login to access the verification dashboard</p>
          <Link
            to="/auth/login"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 organic-transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Verification Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Review and verify eco-activity submissions
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground organic-transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {verificationMode && selectedActivity ? (
          <div>
            <button
              onClick={() => setVerificationMode(false)}
              className="mb-6 text-muted-foreground hover:text-foreground organic-transition"
            >
              ← Back to Activities
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Verifying Activity: {selectedActivity.description}
              </h2>
              <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Activity Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium text-foreground capitalize">{selectedActivity.type} - {selectedActivity.subtype}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carbon Offset:</span>
                        <span className="font-medium text-primary">{selectedActivity.carbonOffset} kg CO2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="text-foreground">{new Date(selectedActivity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-foreground">{selectedActivity.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User:</span>
                        <span className="text-foreground">{selectedActivity.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trust Score:</span>
                        <span className={`font-medium ${
                          selectedActivity.user.trustScore > 85 ? 'text-primary' :
                          selectedActivity.user.trustScore > 70 ? 'text-accent' :
                          'text-destructive'
                        }`}>
                          {selectedActivity.user.trustScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-4">Proof Submission</h3>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        {selectedActivity.proofFiles.length} file(s) submitted
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedActivity.proofFiles.map((file, index) => (
                          <div key={index} className="border border-border rounded-lg p-2 text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <div className="text-xs text-muted-foreground truncate">{file.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <AIVerificationInterface 
              onVerificationComplete={(result) => handleVerificationComplete(selectedActivity.id, result)}
              proofFiles={selectedActivity.proofFiles}
            />
          </div>
        ) : (
          <>
            <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Pending Verification</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading activities...</p>
                </div>
              ) : pendingActivities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">
                    There are no pending activities to verify at the moment.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Activity</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">User</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Carbon Offset</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pendingActivities.map(activity => (
                        <tr key={activity.id} className={activity.status !== 'pending' ? 'opacity-60' : ''}>
                          <td className="py-4 px-4">
                            <div className="font-medium text-foreground">{activity.description}</div>
                            <div className="text-xs text-muted-foreground capitalize">{activity.type} - {activity.subtype}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-foreground">{activity.user.name}</div>
                            <div className="text-xs text-muted-foreground">Trust: {activity.user.trustScore}%</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-primary">
                            {activity.carbonOffset} kg
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              activity.status === 'approved' ? 'bg-primary/10 text-primary' :
                              activity.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                              'bg-accent/10 text-accent'
                            }`}>
                              {activity.status === 'approved' ? 'Approved' :
                               activity.status === 'rejected' ? 'Rejected' :
                               'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {activity.status === 'pending' ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedActivity(activity);
                                    setVerificationMode(true);
                                  }}
                                  className="px-3 py-1 bg-accent text-accent-foreground text-xs rounded-lg hover:bg-accent/90 organic-transition"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => approveActivity(activity.id)}
                                  className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-lg hover:bg-primary/90 organic-transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectActivity(activity.id)}
                                  className="px-3 py-1 bg-destructive text-destructive-foreground text-xs rounded-lg hover:bg-destructive/90 organic-transition"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">
                                {activity.status === 'approved' ? 'Approved' : 'Rejected'}
                                {verificationResults[activity.id] && ' with AI verification'}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Verification Results Summary */}
            {Object.keys(verificationResults).length > 0 && (
              <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Verification Results</h2>
                <div className="space-y-4">
                  {Object.entries(verificationResults).map(([activityId, result]) => {
                    const activity = pendingActivities.find(a => a.id === activityId);
                    return activity ? (
                      <div key={activityId} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium text-foreground">{activity.description}</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.success ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {result.success ? 'Verification Passed' : 'Verification Failed'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Liveness Score:</span>
                            <span className="ml-2 font-medium text-foreground">{result.livenessScore}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expression Verified:</span>
                            <span className="ml-2 font-medium text-foreground">{result.expressionVerified ? 'Yes' : 'No'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span className="ml-2 text-foreground">{new Date(result.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationReview;
