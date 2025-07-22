import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const SearchAndSort = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  onFilterToggle,
  activeFiltersCount = 0,
  resultsCount = 0
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'impact-score', label: 'Highest Impact Score' },
    { value: 'newest', label: 'Newest First' },
    { value: 'verification', label: 'Verification Progress' },
    { value: 'carbon-offset', label: 'Carbon Offset (High to Low)' },
    { value: 'participants', label: 'Most Participants' }
  ];

  const searchSuggestions = [
    'Reforestation projects',
    'Solar energy initiatives',
    'Ocean conservation',
    'Carbon capture technology',
    'Sustainable agriculture',
    'Wind energy projects',
    'Waste management solutions',
    'Biodiversity conservation'
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(localSearchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearchQuery, onSearchChange]);

  const handleSearchInputChange = (e) => {
    setLocalSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearchChange(suggestion);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setShowSuggestions(false);
    onSearchChange('');
  };

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(localSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={20} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search projects by name, type, or location..."
            value={localSearchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => setShowSuggestions(localSearchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
          />
          {localSearchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground organic-transition"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg organic-shadow-moderate z-10 max-h-60 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted organic-transition border-b border-border last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Search" size={16} className="text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Side - Filter Toggle & Results Count */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            onClick={onFilterToggle}
            className="lg:hidden"
          >
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {resultsCount > 0 ? (
              <span>{resultsCount.toLocaleString()} projects found</span>
            ) : (
              <span>No projects found</span>
            )}
          </div>
        </div>

        {/* Right Side - Sort & View Mode */}
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="min-w-[200px]">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortChange}
              placeholder="Sort by"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md organic-transition ${
                viewMode === 'grid' ?'bg-background text-foreground organic-shadow-subtle' :'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="Grid view"
            >
              <Icon name="Grid3X3" size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md organic-transition ${
                viewMode === 'list' ?'bg-background text-foreground organic-shadow-subtle' :'text-muted-foreground hover:text-foreground'
              }`}
              aria-label="List view"
            >
              <Icon name="List" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSort;