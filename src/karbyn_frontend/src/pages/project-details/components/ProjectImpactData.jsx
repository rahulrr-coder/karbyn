import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ProjectImpactData = ({ project }) => {
  const monthlyData = [
    { month: 'Jan', offset: 45, target: 50 },
    { month: 'Feb', offset: 52, target: 55 },
    { month: 'Mar', offset: 48, target: 60 },
    { month: 'Apr', offset: 65, target: 65 },
    { month: 'May', offset: 71, target: 70 },
    { month: 'Jun', offset: 68, target: 75 }
  ];

  const impactBreakdown = [
    { name: 'Tree Planting', value: 45, color: '#2D5A3D' },
    { name: 'Soil Conservation', value: 25, color: '#4A7C59' },
    { name: 'Water Management', value: 20, color: '#7FB069' },
    { name: 'Community Education', value: 10, color: '#A8D5A8' }
  ];

  const verificationHistory = [
    { date: '2024-01', score: 85 },
    { date: '2024-02', score: 88 },
    { date: '2024-03', score: 92 },
    { date: '2024-04', score: 89 },
    { date: '2024-05', score: 94 },
    { date: '2024-06', score: 96 }
  ];

  return (
    <div className="space-y-8">
      {/* Key Impact Metrics */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-6">
          Key Impact Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {project.impactMetrics.map((metric, index) => (
            <div key={index} className="bg-surface rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name={metric.icon} size={24} color="white" />
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                {metric.label}
              </div>
              <div className={`text-xs font-medium ${
                metric.trend === 'up' ? 'text-success' : 'text-warning'
              }`}>
                <Icon 
                  name={metric.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={12} 
                  className="inline mr-1" 
                />
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Carbon Offset Progress */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Monthly Carbon Offset Progress
        </h3>
        <div className="bg-surface rounded-lg p-6">
          <div className="h-64" aria-label="Monthly Carbon Offset Bar Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 90, 61, 0.1)" />
                <XAxis dataKey="month" stroke="#4A5D4F" />
                <YAxis stroke="#4A5D4F" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid rgba(45, 90, 61, 0.12)',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="offset" fill="#2D5A3D" name="Actual Offset (tons)" />
                <Bar dataKey="target" fill="#7FB069" name="Target (tons)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Impact Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Impact Breakdown
          </h3>
          <div className="bg-surface rounded-lg p-6">
            <div className="h-64" aria-label="Impact Breakdown Pie Chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {impactBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {impactBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Verification Score Trend
          </h3>
          <div className="bg-surface rounded-lg p-6">
            <div className="h-64" aria-label="Verification Score Line Chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={verificationHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 90, 61, 0.1)" />
                  <XAxis dataKey="date" stroke="#4A5D4F" />
                  <YAxis domain={[80, 100]} stroke="#4A5D4F" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid rgba(45, 90, 61, 0.12)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2D5A3D" 
                    strokeWidth={3}
                    dot={{ fill: '#2D5A3D', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Methodology */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Carbon Calculation Methodology
        </h3>
        <div className="bg-surface rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Measurement Standards</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>IPCC Guidelines for National Greenhouse Gas Inventories</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Verified Carbon Standard (VCS) methodology</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Gold Standard for Global Goals certification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <span>Third-party verification by accredited bodies</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Data Collection</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Icon name="Satellite" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Satellite imagery analysis for forest coverage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Camera" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Ground-based photography and measurements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Users" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Community-reported data validation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Database" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>Blockchain-recorded measurement logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectImpactData;