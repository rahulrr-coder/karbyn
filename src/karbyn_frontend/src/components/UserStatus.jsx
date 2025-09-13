import React from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';

const UserStatus = ({ className = "" }) => {
  const { principal, user } = useAuth();

  const displayName = user?.name || principal?.slice(0, 8) + '...' || 'User';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
        <span className="text-white text-sm font-bold">
          {displayName.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {displayName}
        </span>
        {principal && (
          <span className="text-xs text-muted-foreground">
            {principal.slice(0, 12)}...
          </span>
        )}
      </div>
    </div>
  );
};

export default UserStatus;
