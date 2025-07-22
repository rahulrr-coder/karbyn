import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities, showAll = false }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'project_submitted':
        return 'Plus';
      case 'verification_completed':
        return 'CheckCircle';
      case 'tokens_minted':
        return 'Coins';
      case 'project_approved':
        return 'Shield';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'project_submitted':
        return 'text-accent bg-accent/10';
      case 'verification_completed':
        return 'text-success bg-success/10';
      case 'tokens_minted':
        return 'text-warning bg-warning/10';
      case 'project_approved':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const displayActivities = showAll ? activities : activities.slice(0, 5);

  return (
    <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-primary/80 organic-transition">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              <Icon name={getActivityIcon(activity.type)} size={16} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Image
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-foreground">
                  {activity.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activity.description}
              </p>
              
              {activity.project && (
                <div className="mt-2 p-2 bg-muted/50 rounded-md">
                  <span className="text-xs font-medium text-foreground">
                    {activity.project.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {activity.project.location}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Activity" size={48} className="text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No recent activity</p>
          <p className="text-sm text-muted-foreground/80 mt-1">
            Activity will appear here as projects are submitted and verified
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;