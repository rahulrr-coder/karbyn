import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'africa', label: 'Africa' },
    { value: 'oceania', label: 'Oceania' }
  ];

  const projectTypeOptions = [
    { value: '', label: 'All Project Types' },
    { value: 'reforestation', label: 'Reforestation' },
    { value: 'renewable-energy', label: 'Renewable Energy' },
    { value: 'carbon-capture', label: 'Carbon Capture' },
    { value: 'sustainable-agriculture', label: 'Sustainable Agriculture' },
    { value: 'ocean-conservation', label: 'Ocean Conservation' },
    { value: 'waste-management', label: 'Waste Management' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending Verification' },
    { value: 'in-review', label: 'In Review' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleImpactRangeChange = (range) => {
    handleFilterChange('impactRange', range);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      location: '',
      projectType: '',
      status: '',
      impactRange: '',
      dateRange: '',
      minCarbonOffset: '',
      maxCarbonOffset: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => value !== '').length;
  };

  const panelContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        )}
      </div>

      {/* Location Filter */}
      <div>
        <Select
          label="Location"
          options={locationOptions}
          value={localFilters.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Select location"
        />
      </div>

      {/* Project Type Filter */}
      <div>
        <Select
          label="Project Type"
          options={projectTypeOptions}
          value={localFilters.projectType}
          onChange={(value) => handleFilterChange('projectType', value)}
          placeholder="Select project type"
        />
      </div>

      {/* Verification Status */}
      <div>
        <Select
          label="Verification Status"
          options={statusOptions}
          value={localFilters.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Select status"
        />
      </div>

      {/* Impact Score Range */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Impact Score Range
        </label>
        <div className="space-y-2">
          <Checkbox
            label="High Impact (80-100%)"
            checked={localFilters.impactRange === 'high'}
            onChange={(e) => handleImpactRangeChange(e.target.checked ? 'high' : '')}
          />
          <Checkbox
            label="Medium Impact (60-79%)"
            checked={localFilters.impactRange === 'medium'}
            onChange={(e) => handleImpactRangeChange(e.target.checked ? 'medium' : '')}
          />
          <Checkbox
            label="Low Impact (0-59%)"
            checked={localFilters.impactRange === 'low'}
            onChange={(e) => handleImpactRangeChange(e.target.checked ? 'low' : '')}
          />
        </div>
      </div>

      {/* Carbon Offset Range */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Carbon Offset Range (tons CO₂)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={localFilters.minCarbonOffset}
            onChange={(e) => handleFilterChange('minCarbonOffset', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={localFilters.maxCarbonOffset}
            onChange={(e) => handleFilterChange('maxCarbonOffset', e.target.value)}
          />
        </div>
      </div>

      {/* Date Range */}
      <div>
        <Select
          label="Date Range"
          options={[
            { value: '', label: 'All Time' },
            { value: 'last-week', label: 'Last Week' },
            { value: 'last-month', label: 'Last Month' },
            { value: 'last-3-months', label: 'Last 3 Months' },
            { value: 'last-year', label: 'Last Year' }
          ]}
          value={localFilters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Select date range"
        />
      </div>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button
          variant="outline"
          fullWidth
          iconName="RotateCcw"
          onClick={handleClearFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-card organic-shadow-prominent overflow-y-auto">
              <div className="p-6">
                {panelContent}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6 sticky top-6">
      {panelContent}
    </div>
  );
};

export default FilterPanel;