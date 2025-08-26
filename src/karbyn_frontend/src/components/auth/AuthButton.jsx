import React, { useState } from 'react';
import { useSimpleNFIDAuth } from '../../contexts/SimpleNFIDAuthContext';
import SimpleAuthModal from './SimpleAuthModal';
import { motion } from 'framer-motion';

const AuthButton = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  showDropdown = false,
  className = '',
  children
}) => {
  const { 
    isAuthenticated, 
    user, 
    logout, 
    isLoading,
    authProvider,
    AUTH_PROVIDERS 
  } = useSimpleNFIDAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getProviderDisplay = (provider) => {
    switch (provider) {
      case AUTH_PROVIDERS.NFID_GOOGLE:
        return { name: 'Google', icon: '🔍' };
      case AUTH_PROVIDERS.NFID_INTERNET_IDENTITY:
        return { name: 'NFID', icon: '🔐' };
      case AUTH_PROVIDERS.INTERNET_IDENTITY:
        return { name: 'Internet Identity', icon: '🆔' };
      case AUTH_PROVIDERS.PLUG:
        return { name: 'Plug Wallet', icon: '🔌' };
      default:
        return { name: 'Unknown', icon: '❓' };
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
    outline: 'bg-transparent hover:bg-green-50 text-green-600 border-green-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent'
  };

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg border
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`${baseClasses} space-x-2`}
        >
          {/* Avatar */}
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-green-600">
              {user.name?.charAt(0)?.toUpperCase() || '👤'}
            </span>
          </div>
          <span className="truncate max-w-32">{user.name || 'User'}</span>
          
          {showDropdown && (
            <svg 
              className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </motion.button>

        {/* User dropdown menu */}
        {showDropdown && showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            {/* User info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600">
                    {user.name?.charAt(0)?.toUpperCase() || '👤'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email || user.id?.slice(0, 8) + '...'}
                  </p>
                </div>
              </div>
              
              {/* Auth provider indicator */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>{getProviderDisplay(authProvider).icon}</span>
                  <span>Connected via {getProviderDisplay(authProvider).name}</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Dashboard</span>
                </div>
              </a>
              <a
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span>👤</span>
                  <span>Profile</span>
                </div>
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Settings</span>
                </div>
              </a>
            </div>

            {/* Logout */}
            <div className="py-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span>🚪</span>
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Backdrop for closing dropdown */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </div>
    );
  }

  // Not authenticated - show login button
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAuthModal(true)}
        disabled={isLoading}
        className={baseClasses}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            <span>Connecting...</span>
          </>
        ) : (
          children || (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Sign In</span>
            </>
          )
        )}
      </motion.button>

      <SimpleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AuthButton;
