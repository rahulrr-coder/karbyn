import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'metrics') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="w-16 h-4 bg-muted rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-muted rounded"></div>
              <div className="w-24 h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border animate-pulse">
        <div className="w-48 h-6 bg-muted rounded mb-4"></div>
        <div className="w-full h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (type === 'activity') {
    return (
      <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-32 h-6 bg-muted rounded"></div>
          <div className="w-16 h-4 bg-muted rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-muted rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-muted rounded-full"></div>
                  <div className="w-24 h-4 bg-muted rounded"></div>
                  <div className="w-12 h-3 bg-muted rounded"></div>
                </div>
                <div className="w-full h-4 bg-muted rounded"></div>
                <div className="w-3/4 h-4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border animate-pulse">
      <div className="w-full h-32 bg-muted rounded"></div>
    </div>
  );
};

export default LoadingSkeleton;