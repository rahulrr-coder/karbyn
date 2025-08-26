import React from 'react';
import { ConnectWallet } from '@nfid/identitykit/react';
import { useSimpleNFIDAuth } from '../contexts/SimpleNFIDAuthContext';

const NFIDAuthButton = () => {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    error, 
    loginWithNFIDGoogle, 
    logout,
    clearError 
  } = useSimpleNFIDAuth();

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Authentication Error: {error}</p>
          <button 
            onClick={clearError}
            className="mt-2 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
          >
            Dismiss
          </button>
        </div>
        <ConnectWallet />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
        <span className="text-gray-600">Connecting...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800">✓ Connected via NFID</h3>
          <p className="text-sm text-green-700 mt-1">Principal: {user.principal}</p>
          {user.subAccount && (
            <p className="text-sm text-green-700">SubAccount: {user.subAccount}</p>
          )}
          <button
            onClick={logout}
            className="mt-2 px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect with NFID to access the carbon credit platform
        </p>
      </div>
      
      {/* Use the official NFID ConnectWallet component */}
      <ConnectWallet />
      
      {/* Alternative button for direct Google auth */}
      <div className="text-center">
        <button
          onClick={loginWithNFIDGoogle}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Connect with NFID (Alternative)
        </button>
      </div>
    </div>
  );
};

export default NFIDAuthButton;
