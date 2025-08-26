import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricsCard from './components/MetricsCard';
import ChartContainer from './components/ChartContainer';
import ActivityFeed from './components/ActivityFeed';
import FilterControls from './components/FilterControls';
import QuickActions from './components/QuickActions';
import LoadingSkeleton from './components/LoadingSkeleton';

const ImpactDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [category, setCategory] = useState('all');

  // Mock data for metrics
  const metricsData = [
    {
      title: "Total Carbon Offset",
      value: "2,847",
      unit: "tons CO₂",
      trend: "up",
      trendValue: "+12.5%",
      icon: "Leaf",
      color: "primary"
    },
    {
      title: "Active Projects",
      value: "156",
      unit: "projects",
      trend: "up",
      trendValue: "+8",
      icon: "TreePine",
      color: "accent"
    },
    {
      title: "Tokens Minted",
      value: "45,892",
      unit: "KRB",
      trend: "up",
      trendValue: "+23.1%",
      icon: "Coins",
      color: "secondary"
    },
    {
      title: "Community Members",
      value: "3,247",
      unit: "members",
      trend: "up",
      trendValue: "+156",
      icon: "Users",
      color: "success"
    }
  ];

  // Mock data for carbon offset trends
  const carbonTrendData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1450 },
    { name: 'Mar', value: 1680 },
    { name: 'Apr', value: 1890 },
    { name: 'May', value: 2100 },
    { name: 'Jun', value: 2350 },
    { name: 'Jul', value: 2847 }
  ];

  // Mock data for project distribution
  const projectDistributionData = [
    { name: 'North America', value: 45 },
    { name: 'Europe', value: 38 },
    { name: 'Asia Pacific', value: 42 },
    { name: 'Latin America', value: 21 },
    { name: 'Africa', value: 10 }
  ];

  // Mock data for impact categories
  const impactCategoriesData = [
    { name: 'Reforestation', value: 65 },
    { name: 'Renewable Energy', value: 42 },
    { name: 'Conservation', value: 28 },
    { name: 'Agriculture', value: 21 }
  ];

  // Mock data for recent activities
  const activitiesData = [
    {
      id: 1,
      type: 'project_submitted',
      user: {
        name: 'Sarah Chen',
        avatar: '/assets/avatars/avatar-1.svg'
      },
      description: 'Submitted a new reforestation project in Costa Rica',
      timestamp: new Date(Date.now() - 900000),
      project: {
        name: 'Costa Rica Forest Restoration',
        location: 'Guanacaste Province'
      }
    },
    {
      id: 2,
      type: 'verification_completed',
      user: {
        name: 'Michael Rodriguez',
        avatar: '/assets/avatars/avatar-2.svg'
      },
      description: 'Completed verification for solar panel installation project',
      timestamp: new Date(Date.now() - 1800000),
      project: {
        name: 'Community Solar Initiative',
        location: 'Maharashtra, India'
      }
    },
    {
      id: 3,
      type: 'tokens_minted',
      user: {
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
      },
      description: 'Received 250 KRB tokens for verified carbon offset',
      timestamp: new Date(Date.now() - 3600000),
      project: {
        name: 'Urban Tree Planting',
        location: 'London, UK'
      }
    },
    {
      id: 4,
      type: 'project_approved',
      user: {
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
      },
      description: 'Project approved by community governance vote',
      timestamp: new Date(Date.now() - 7200000),
      project: {
        name: 'Mangrove Restoration',
        location: 'Philippines'
      }
    },
    {
      id: 5,
      type: 'project_submitted',
      user: {
        name: 'Ana Silva',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150'
      },
      description: 'Submitted sustainable agriculture project proposal',
      timestamp: new Date(Date.now() - 10800000),
      project: {
        name: 'Organic Farming Initiative',
        location: 'São Paulo, Brazil'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <Breadcrumb />
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Impact Dashboard</h1>
            <p className="text-muted-foreground">Track climate action metrics and platform performance</p>
          </div>
          
          <LoadingSkeleton type="metrics" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LoadingSkeleton type="chart" />
            <LoadingSkeleton type="chart" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LoadingSkeleton type="activity" />
            </div>
            <LoadingSkeleton type="card" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Impact Dashboard</h1>
          <p className="text-muted-foreground">
            Track climate action metrics and platform performance in real-time
          </p>
        </div>

        {/* Filter Controls */}
        <FilterControls
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          category={category}
          setCategory={setCategory}
          onRefresh={handleRefresh}
        />

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              trend={metric.trend}
              trendValue={metric.trendValue}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Carbon Offset Trends"
            type="line"
            data={carbonTrendData}
            height={300}
          />
          
          <ChartContainer
            title="Projects by Region"
            type="bar"
            data={projectDistributionData}
            height={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Impact Categories"
            type="pie"
            data={impactCategoriesData}
            height={300}
            showLegend={false}
          />
          
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed activities={activitiesData} />
          </div>
          
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Platform Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Verification Rate</span>
                  <span className="text-sm font-medium text-foreground">94.2%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Project Value</span>
                  <span className="text-sm font-medium text-foreground">$12,450</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Community Growth</span>
                  <span className="text-sm font-medium text-success">+15.3%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Token Circulation</span>
                  <span className="text-sm font-medium text-foreground">78.6%</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Milestones</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">1M tons CO₂ offset milestone reached</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">100+ active projects milestone</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm text-muted-foreground">3,000+ community members joined</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImpactDashboard;