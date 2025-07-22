import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  timeframe, 
  setTimeframe, 
  category, 
  setCategory, 
  onRefresh 
}) => {
  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'reforestation', label: 'Reforestation' },
    { value: 'renewable', label: 'Renewable Energy' },
    { value: 'conservation', label: 'Conservation' },
    { value: 'agriculture', label: 'Sustainable Agriculture' }
  ];

  return (
    <div className="bg-card rounded-lg p-4 organic-shadow-subtle border border-border mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Timeframe Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-sm bg-transparent border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {timeframes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-sm bg-transparent border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRefresh}
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;