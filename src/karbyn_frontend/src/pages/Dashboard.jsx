import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useActivity } from '../contexts/ActivityContext';
import { useNFT } from '../contexts/NFTContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { principal, logout } = useAuth();
  const { stats } = useActivity();
  const { userNFTs } = useNFT();

  const quickActions = [
    {
      title: 'Log Activity',
      description: 'Record your daily eco-actions',
      icon: '📝',
      link: '/activities/submit',
      color: 'bg-primary'
    },
    {
      title: 'Browse Marketplace',
      description: 'Discover carbon credit NFTs',
      icon: '🛒',
      link: '/marketplace',
      color: 'bg-accent'
    },
    {
      title: 'Submit Project',
      description: 'Register an ecological project',
      icon: '🌳',
      link: '/submit-project',
      color: 'bg-secondary'
    },
    {
      title: 'My NFTs',
      description: 'View your carbon credit collection',
      icon: '🏆',
      link: '/marketplace/my-nfts',
      color: 'bg-primary/80'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-foreground text-lg">🌱</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Karbyn Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {principal?.slice(0, 8)}...{principal?.slice(-8)}
              </span>
              <button
                onClick={logout}
                className="text-sm text-muted-foreground hover:text-foreground organic-transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-muted-foreground">
            Track your environmental impact and turn your eco-actions into valuable carbon credits.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-accent/10 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Carbon Offset</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCarbonOffset} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">NFTs Earned</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalNFTsGenerated}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-2 bg-primary/20 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Weekly Streak</p>
                <p className="text-2xl font-bold text-foreground">{stats.weeklyStreak}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border hover:organic-shadow-moderate organic-transition group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 organic-transition`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{action.title}</h4>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent NFTs */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent NFTs</h3>
              <Link
                to="/marketplace/my-nfts"
                className="text-sm text-green-600 hover:text-green-700"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {userNFTs.slice(0, 3).map((nft) => (
                <div key={nft.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">
                      {nft.type === 'micro-carbon' ? '🎫' : '🏆'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{nft.title}</p>
                    <p className="text-xs text-gray-500">{nft.carbonOffset}</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {nft.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
              {userNFTs.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No NFTs yet. Start logging activities to earn your first NFT!
                </p>
              )}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌳</span>
                  <span className="font-medium text-gray-900">Trees Equivalent</span>
                </div>
                <span className="font-bold text-green-600">
                  {Math.round(stats.totalCarbonOffset / 22)} trees
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🚗</span>
                  <span className="font-medium text-gray-900">Car Miles Avoided</span>
                </div>
                <span className="font-bold text-blue-600">
                  {Math.round(stats.totalCarbonOffset * 2.3)} miles
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  <span className="font-medium text-gray-900">Energy Saved</span>
                </div>
                <span className="font-bold text-purple-600">
                  {Math.round(stats.totalCarbonOffset * 1.2)} kWh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
