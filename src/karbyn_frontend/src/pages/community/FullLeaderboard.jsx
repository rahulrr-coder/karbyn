import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';

const FullLeaderboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState('weekly');
  const [activeFilter, setActiveFilter] = useState('all');
  const [userRank, setUserRank] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Mock data for demonstration purposes
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate 100 mock users
      const generateMockUsers = (count) => {
        const users = [];
        const activities = ['transport', 'energy', 'recycling', 'planting'];
        const badges = [
          'Early Adopter', 'Carbon Champion', 'Eco Warrior', 'Recycling Pro', 
          'Public Transit Hero', 'Tree Planter', 'Energy Saver', 'Plastic Reducer'
        ];
        const avatars = ['👨‍💼', '👩‍🔬', '🧑‍💻', '👩‍🎓', '🧑‍🌾', '👩‍🏫', '👨‍🍳', '👩‍🔧', '🧑‍🚀', '👩‍⚕️'];
        
        for (let i = 1; i <= count; i++) {
          // Generate random carbon offset between 5 and 200
          const carbonOffset = Math.round((5 + Math.random() * 195) * 10) / 10;
          // Generate random activity count between 1 and 30
          const activityCount = Math.floor(1 + Math.random() * 30);
          // Assign random badges (0-3)
          const userBadges = [];
          const badgeCount = Math.floor(Math.random() * 4);
          for (let j = 0; j < badgeCount; j++) {
            const badge = badges[Math.floor(Math.random() * badges.length)];
            if (!userBadges.includes(badge)) {
              userBadges.push(badge);
            }
          }
          // Assign random activity types
          const userActivities = [];
          const activityTypeCount = Math.floor(1 + Math.random() * 4);
          for (let j = 0; j < activityTypeCount; j++) {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            if (!userActivities.includes(activity)) {
              userActivities.push(activity);
            }
          }
          
          users.push({
            id: i,
            name: `User ${i}`,
            avatar: avatars[Math.floor(Math.random() * avatars.length)],
            carbonOffset,
            activityCount,
            badges: userBadges,
            activities: userActivities
          });
        }
        
        // Sort by carbon offset (descending)
        return users.sort((a, b) => b.carbonOffset - a.carbonOffset);
      };
      
      // Generate mock data
      let mockUsers = generateMockUsers(100);
      
      // Apply activity type filter
      if (activeFilter !== 'all') {
        mockUsers = mockUsers.filter(user => 
          user.activities.includes(activeFilter)
        );
      }
      
      // Calculate total pages
      const total = Math.ceil(mockUsers.length / itemsPerPage);
      setTotalPages(total);
      
      // Paginate results
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedUsers = mockUsers.slice(startIndex, endIndex);
      
      // Set user rank if authenticated
      if (isAuthenticated && user) {
        // In a real app, this would come from the backend
        // For mock purposes, we'll set a random rank
        setUserRank(Math.floor(Math.random() * 100) + 1);
      }
      
      setLeaderboardData(paginatedUsers);
      setLoading(false);
    };
    
    fetchLeaderboardData();
  }, [activeTimeframe, activeFilter, page, isAuthenticated, user]);

  const timeframeOptions = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'alltime', label: 'All Time' }
  ];
  
  const filterOptions = [
    { id: 'all', label: 'All Activities' },
    { id: 'transport', label: 'Transport' },
    { id: 'energy', label: 'Energy' },
    { id: 'recycling', label: 'Recycling' },
    { id: 'planting', label: 'Planting' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Carbon Impact Leaderboard</h1>
              <p className="text-muted-foreground mt-1">
                See who's making the biggest difference in carbon reduction
              </p>
            </div>
            <Link
              to="/community"
              className="text-muted-foreground hover:text-foreground organic-transition"
            >
              ← Back to Community
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Timeframe selector */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeframe</h3>
                <div className="flex flex-wrap gap-2">
                  {timeframeOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setActiveTimeframe(option.id);
                        setPage(1); // Reset to first page on filter change
                      }}
                      className={`px-3 py-1 text-sm rounded-full organic-transition ${
                        activeTimeframe === option.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Activity type filter */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by Activity</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setActiveFilter(option.id);
                        setPage(1); // Reset to first page on filter change
                      }}
                      className={`px-3 py-1 text-sm rounded-full organic-transition ${
                        activeFilter === option.id 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* User's rank - only shown when authenticated */}
          {isAuthenticated && userRank && (
            <div className="p-4 bg-primary/5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl mr-3">
                    {user?.avatar || '👤'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{user?.name || 'You'}</div>
                    <div className="text-xs text-muted-foreground">Your position on the leaderboard</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm font-medium text-muted-foreground mr-2">Rank:</div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    #{userRank}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading leaderboard...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                        Rank
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Carbon Offset
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        Activities
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Badges
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {leaderboardData.map((user, index) => {
                      const actualRank = (page - 1) * itemsPerPage + index + 1;
                      return (
                        <tr 
                          key={user.id}
                          className={actualRank <= 3 ? 'bg-primary/5' : ''}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`
                              flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                              ${actualRank === 1 ? 'bg-amber-100 text-amber-800' : 
                                actualRank === 2 ? 'bg-gray-100 text-gray-800' : 
                                actualRank === 3 ? 'bg-amber-50 text-amber-700' : 
                                'text-muted-foreground'}
                            `}>
                              {actualRank}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-2xl mr-3">{user.avatar}</div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-primary font-medium">{user.carbonOffset} kg</div>
                            <div className="mt-1 w-24 bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${Math.min(100, (user.carbonOffset / 200) * 100)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-muted-foreground">{user.activityCount}</div>
                            <div className="flex mt-1 space-x-1">
                              {user.activities.map((activity, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                                >
                                  {activity === 'transport' && '🚌'}
                                  {activity === 'energy' && '⚡'}
                                  {activity === 'recycling' && '♻️'}
                                  {activity === 'planting' && '🌱'}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {user.badges.map((badge, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent"
                                >
                                  {badge}
                                </span>
                              ))}
                              {user.badges.length === 0 && (
                                <span className="text-xs text-muted-foreground">No badges yet</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="ml-3 px-4 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(page * itemsPerPage, (page - 1) * itemsPerPage + leaderboardData.length)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{(totalPages - 1) * itemsPerPage + leaderboardData.length}</span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Only show current page, first, last, and pages around current
                        if (
                          pageNum === 1 || 
                          pageNum === totalPages || 
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium organic-transition ${
                                page === pageNum
                                  ? 'z-10 bg-primary border-primary text-primary-foreground'
                                  : 'bg-card border-border text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && page > 3) || 
                          (pageNum === totalPages - 1 && page < totalPages - 2)
                        ) {
                          // Show ellipsis
                          return (
                            <span
                              key={pageNum}
                              className="relative inline-flex items-center px-4 py-2 border border-border bg-card text-sm font-medium text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullLeaderboard;
