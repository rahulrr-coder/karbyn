import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ChartContainer = ({ title, type, data, height = 300, showLegend = true }) => {
  const colors = ['#2D5A3D', '#4A7C59', '#7FB069', '#22C55E', '#F59E0B', '#DC2626'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 90, 61, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#4A5D4F"
                fontSize={12}
              />
              <YAxis 
                stroke="#4A5D4F"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(45, 90, 61, 0.12)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(45, 90, 61, 0.08)'
                }}
              />
              {showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2D5A3D" 
                strokeWidth={2}
                dot={{ fill: '#2D5A3D', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2D5A3D' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 90, 61, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#4A5D4F"
                fontSize={12}
              />
              <YAxis 
                stroke="#4A5D4F"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(45, 90, 61, 0.12)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(45, 90, 61, 0.08)'
                }}
              />
              {showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                fill="#2D5A3D"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(45, 90, 61, 0.12)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(45, 90, 61, 0.08)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="flex items-center justify-center h-full text-muted-foreground">Chart type not supported</div>;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="w-full">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartContainer;