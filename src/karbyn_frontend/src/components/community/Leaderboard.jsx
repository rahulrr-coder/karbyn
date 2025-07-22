import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = ({ timeframe = 'weekly', limit = 10 }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState(timeframe);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data for demonstration purposes
  // In a real implementation, this would be fetched from the backend
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockUsers = [
        { id: 1, name: 'Alex Johnson', avatar: '👨‍💼', carbonOffset: 128.5, activityCount: 23, badges: ['Early Adopter', 'Carbon Champion'] },
        { id: 2, name: 'Maria Garcia', avatar: '👩‍🔬', carbonOffset: 112.7, activityCount: 19, badges: ['Eco Warrior'] },
        { id: 3, name: 'James Wilson', avatar: '🧑‍💻', carbonOffset: 98.3, activityCount: 15, badges: ['Recycling Pro'] },
        { id: 4, name: 'Sarah Lee', avatar: '👩‍🎓', carbonOffset: 87.2, activityCount: 14, badges: ['Public Transit Hero'] },
        { id: 5, name: 'David Kim', avatar: '🧑‍🌾', carbonOffset: 76.9, activityCount: 12, badges: ['Tree Planter'] },
        { id: 6, name: 'Emma Brown', avatar: '👩‍🏫', carbonOffset: 65.4, activityCount: 11, badges: [] },
        { id: 7, name: 'Michael Davis', avatar: '👨‍🍳', carbonOffset: 54.8, activityCount: 9, badges: ['Energy Saver'] },
        { id: 8, name: 'Sophia Martinez', avatar: '👩‍🔧', carbonOffset: 43.2, activityCount: 8, badges: [] },
        { id: 9, name: 'Daniel Taylor', avatar: '🧑‍🚀', carbonOffset: 32.6, activityCount: 6, badges: ['Plastic Reducer'] },
        { id: 10, name: 'Olivia Anderson', avatar: '👩‍⚕️', carbonOffset: 21.9, activityCount: 4, badges: [] },
        { id: 11, name: 'Ethan Wilson', avatar: '👨‍🎨', carbonOffset: 18.5, activityCount: 3, badges: [] },
        { id: 12, name: 'Ava Thomas', avatar: '👩‍🚒', carbonOffset: 15.2, activityCount: 3, badges: [] }
      ];
      
      // Apply timeframe filter (in a real app, this would be done on the server)
      let filteredData = [...mockUsers];
      
      // Apply activity type filter (in a real app, this would be done on the server)
      if (activeFilter !== 'all') {
        // Simulate filtering by activity type
        filteredData = filteredData.filter((_, index) => index % 2 === (activeFilter === 'transport' ? 0 : 1));
      }
      
      // Sort by carbon offset (descending)
      filteredData.sort((a, b) => b.carbonOffset - a.carbonOffset);
      
      // Limit results
      filteredData = filteredData.slice(0, limit);
      
      setLeaderboardData(filteredData);
      setLoading(false);
    };
    
    fetchLeaderboardData();
  }, [activeTimeframe, activeFilter, limit]);

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
    { id: 'recycling', label: 'Recycling' }
  ];

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">Carbon Impact Leaderboard</h3>
        
        {/* Timeframe selector */}
        <div className="mt-4 flex flex-wrap gap-2">
          {timeframeOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveTimeframe(option.id)}
              className={`px-3 py-1 text-xs rounded-full organic-transition ${
                activeTimeframe === option.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Activity type filter */}
        <div className="mt-3 flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setActiveFilter(option.id)}
              className={`px-3 py-1 text-xs rounded-full organic-transition ${
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
      
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading leaderboard...</span>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              {leaderboardData.map((user, index) => (
                <tr 
                  key={user.id}
                  className={index < 3 ? 'bg-primary/5' : ''}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                      ${index === 0 ? 'bg-amber-100 text-amber-800' : 
                        index === 1 ? 'bg-gray-100 text-gray-800' : 
                        index === 2 ? 'bg-amber-50 text-amber-700' : 
                        'text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-xl mr-2">{user.avatar}</div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-primary font-medium">{user.carbonOffset} kg</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-muted-foreground">{user.activityCount}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="p-4 border-t border-border bg-muted/30">
        <Link 
          to="/community/leaderboard" 
          className="text-sm text-accent hover:text-accent/80 organic-transition flex items-center"
        >
          View full leaderboard
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;
