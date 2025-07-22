import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingState = ({ viewMode = 'grid' }) => {
  const SkeletonCard = ({ isListView = false }) => (
    <div className={`bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden animate-pulse ${
      isListView ? 'p-4' : ''
    }`}>
      {isListView ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-32 h-32 bg-muted rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-muted rounded w-16"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="h-48 bg-muted"></div>
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </div>
            <div className="flex space-x-2 pt-2">
              <div className="h-8 bg-muted rounded flex-1"></div>
              <div className="h-8 bg-muted rounded flex-1"></div>
              <div className="h-8 bg-muted rounded flex-1"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Loading Header */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="animate-spin">
            <Icon name="Loader2" size={24} />
          </div>
          <span className="text-sm">Loading climate projects...</span>
        </div>
      </div>

      {/* Loading Cards */}
      <div className={
        viewMode === 'list' ?'space-y-4' :'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      }>
        {Array.from({ length: viewMode === 'list' ? 6 : 8 }).map((_, index) => (
          <SkeletonCard key={index} isListView={viewMode === 'list'} />
        ))}
      </div>
    </div>
  );
};

export default LoadingState;