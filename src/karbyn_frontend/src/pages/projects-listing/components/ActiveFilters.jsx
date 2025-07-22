import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const getFilterDisplayValue = (key, value) => {
    const filterLabels = {
      location: {
        'north-america': 'North America',
        'south-america': 'South America',
        'europe': 'Europe',
        'asia': 'Asia',
        'africa': 'Africa',
        'oceania': 'Oceania'
      },
      projectType: {
        'reforestation': 'Reforestation',
        'renewable-energy': 'Renewable Energy',
        'carbon-capture': 'Carbon Capture',
        'sustainable-agriculture': 'Sustainable Agriculture',
        'ocean-conservation': 'Ocean Conservation',
        'waste-management': 'Waste Management'
      },
      status: {
        'verified': 'Verified',
        'pending': 'Pending Verification',
        'in-review': 'In Review'
      },
      impactRange: {
        'high': 'High Impact (80-100%)',
        'medium': 'Medium Impact (60-79%)',
        'low': 'Low Impact (0-59%)'
      },
      dateRange: {
        'last-week': 'Last Week',
        'last-month': 'Last Month',
        'last-3-months': 'Last 3 Months',
        'last-year': 'Last Year'
      }
    };

    if (key === 'minCarbonOffset' || key === 'maxCarbonOffset') {
      return `${value} tons CO₂`;
    }

    return filterLabels[key]?.[value] || value;
  };

  const getFilterLabel = (key) => {
    const labels = {
      location: 'Location',
      projectType: 'Project Type',
      status: 'Status',
      impactRange: 'Impact Range',
      dateRange: 'Date Range',
      minCarbonOffset: 'Min Carbon Offset',
      maxCarbonOffset: 'Max Carbon Offset'
    };
    return labels[key] || key;
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => value !== '');

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Icon name="Filter" size={16} />
        <span>Active filters:</span>
      </div>
      
      {activeFilters.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
        >
          <span className="font-medium">{getFilterLabel(key)}:</span>
          <span>{getFilterDisplayValue(key, value)}</span>
          <button
            onClick={() => onRemoveFilter(key)}
            className="ml-1 text-primary hover:text-primary/80 organic-transition"
            aria-label={`Remove ${getFilterLabel(key)} filter`}
          >
            <Icon name="X" size={14} />
          </button>
        </div>
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground ml-2"
        >
          Clear All
        </Button>
      )}
    </div>
  );
};

export default ActiveFilters;