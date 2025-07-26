import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import Leaderboard from '../../components/community/Leaderboard';

const CommunityDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [communityStats, setCommunityStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration purposes
  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock community stats
      setCommunityStats({
        totalUsers: 1248,
        totalActivities: 8754,
        totalCarbonOffset: 12580.5, // kg CO2
        activitiesThisWeek: 423,
        carbonOffsetThisWeek: 876.2 // kg CO2
      });
      
      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          user: { id: 1, name: 'Alex Johnson', avatar: '👨‍💼' },
          type: 'transport',
          subtype: 'bus',
          description: 'Commuted to work by bus instead of driving',
          carbonOffset: 3.2,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        },
        {
          id: 2,
          user: { id: 2, name: 'Maria Garcia', avatar: '👩‍🔬' },
          type: 'recycling',
          subtype: 'plastic',
          description: 'Recycled plastic bottles from community cleanup',
          carbonOffset: 5.6,
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 minutes ago
        },
        {
          id: 3,
          user: { id: 3, name: 'James Wilson', avatar: '🧑‍💻' },
          type: 'energy',
          subtype: 'solar',
          description: 'Generated electricity with home solar panels',
          carbonOffset: 12.8,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
        },
        {
          id: 4,
          user: { id: 4, name: 'Sarah Lee', avatar: '👩‍🎓' },
          type: 'transport',
          subtype: 'bike',
          description: 'Biked to campus instead of driving',
          carbonOffset: 2.4,
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString() // 1.5 hours ago
        },
        {
          id: 5,
          user: { id: 5, name: 'David Kim', avatar: '🧑‍🌾' },
          type: 'planting',
          subtype: 'trees',
          description: 'Planted 3 trees in local park',
          carbonOffset: 18.0,
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
        }
      ]);
      
      setLoading(false);
    };
    
    fetchCommunityData();
  }, []);

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'transport': return '🚌';
      case 'recycling': return '♻️';
      case 'energy': return '⚡';
      case 'planting': return '🌱';
      default: return '🌍';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Community</h1>
              <p className="text-muted-foreground mt-1">
                Connect with eco-minded individuals and track global impact
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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - left side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Community stats */}
              <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Community Impact</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{communityStats.totalCarbonOffset.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">kg CO₂ Offset</div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{communityStats.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{communityStats.totalActivities.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Activities</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-primary/5 rounded-lg p-4 border border-primary/10">
                  <h3 className="font-medium text-foreground mb-2">This Week's Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Activities</div>
                      <div className="text-lg font-medium text-foreground">{communityStats.activitiesThisWeek}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Carbon Offset</div>
                      <div className="text-lg font-medium text-primary">{communityStats.carbonOffsetThisWeek} kg</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent activity feed */}
              <div className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-medium text-foreground">Recent Activities</h3>
                </div>
                
                <div className="divide-y divide-border">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="p-4 hover:bg-muted/30 organic-transition">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm mr-2">{activity.user.avatar}</span>
                              <span className="font-medium text-foreground">{activity.user.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mt-1">{activity.description}</p>
                          <div className="mt-2 flex items-center">
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                              {activity.carbonOffset} kg CO₂ offset
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-border bg-muted/30">
                  <Link 
                    to="/community/activities" 
                    className="text-sm text-accent hover:text-accent/80 organic-transition flex items-center"
                  >
                    View all activities
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Sidebar - right side */}
            <div className="space-y-6">
              {/* User profile card - only shown when authenticated */}
              {isAuthenticated && (
                <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {user?.avatar || '👤'}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-foreground">{user?.name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">Carbon Hero</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Your Rank</span>
                      <span className="text-sm font-medium text-foreground">#42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Carbon Offset</span>
                      <span className="text-sm font-medium text-primary">32.5 kg</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link 
                      to="/profile" 
                      className="w-full py-2 px-4 bg-primary/10 text-primary text-sm text-center rounded-lg hover:bg-primary/20 organic-transition"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Leaderboard */}
              <Leaderboard timeframe="weekly" limit={5} />
              
              {/* Upcoming events */}
              <div className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-lg font-medium text-foreground">Upcoming Events</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground">Community Cleanup</h4>
                        <p className="text-xs text-muted-foreground mt-1">July 25, 2025 • 10:00 AM</p>
                      </div>
                      <span className="text-xl">🌊</span>
                    </div>
                    <div className="mt-2 flex">
                      <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                        12 participants
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground">Tree Planting Day</h4>
                        <p className="text-xs text-muted-foreground mt-1">August 5, 2025 • 9:00 AM</p>
                      </div>
                      <span className="text-xl">🌳</span>
                    </div>
                    <div className="mt-2 flex">
                      <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                        28 participants
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground">Sustainable Living Workshop</h4>
                        <p className="text-xs text-muted-foreground mt-1">August 12, 2025 • 2:00 PM</p>
                      </div>
                      <span className="text-xl">🏡</span>
                    </div>
                    <div className="mt-2 flex">
                      <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                        15 participants
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-border bg-muted/30">
                  <Link 
                    to="/community/events" 
                    className="text-sm text-accent hover:text-accent/80 organic-transition flex items-center"
                  >
                    View all events
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDashboard;
