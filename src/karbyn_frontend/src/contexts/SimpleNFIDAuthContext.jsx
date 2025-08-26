import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useIdentityKit, useIsInitializing, useIdentity } from '@nfid/identitykit/react';
import { createActor } from '../../../declarations/karbyn_backend';

// Simple NFID Auth Context using React hooks
const SimpleNFIDAuthContext = createContext();

export const useSimpleNFIDAuth = () => {
  const context = useContext(SimpleNFIDAuthContext);
  if (!context) {
    throw new Error('useSimpleNFIDAuth must be used within a SimpleNFIDAuthProvider');
  }
  return context;
};

export const SimpleNFIDAuthProvider = ({ children }) => {
  // Use NFID React hooks
  const { user, isConnecting, connect, disconnect } = useAuth();
  const identity = useIdentity();
  const identityKit = useIdentityKit();
  const isInitializing = useIsInitializing();
  
  // Determine if connected based on user presence
  const isConnected = !!user;
  
  // Local state for our app
  const [actor, setActor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create actor when user connects
  useEffect(() => {
    const setupActor = async () => {
      if (isConnected && identity) {
        try {
          setIsLoading(true);
          setError(null);
          
          const canisterId = import.meta.env.VITE_CANISTER_ID_KARBYN_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai';
          const backendActor = createActor(canisterId, {
            agentOptions: {
              identity: identity,
              host: import.meta.env.MODE === 'development' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
            },
          });
          
          setActor(backendActor);
          console.log('✓ Actor created successfully with NFID identity');
        } catch (err) {
          console.error('Failed to create actor:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } else {
        setActor(null);
      }
    };

    setupActor();
  }, [isConnected, identity]);

  // NFID authentication function
  const loginWithNFIDGoogle = async () => {
    try {
      setError(null);
      console.log('🚀 Starting NFID authentication...');
      await connect();
    } catch (error) {
      console.error('NFID login failed:', error);
      setError(error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await disconnect();
      setActor(null);
      console.log('✓ Successfully logged out from NFID');
    } catch (error) {
      console.error('NFID logout failed:', error);
      setError(error.message);
    }
  };

  // Get user info
  const getUserInfo = () => {
    if (!isConnected || !user) return null;
    
    return {
      principal: user.principal?.toString() || 'anonymous',
      isAuthenticated: isConnected,
      authProvider: 'NFID',
      subAccount: user.subAccount || null
    };
  };

  // Available auth methods for the modal
  const getAvailableAuthMethods = () => [
    {
      id: 'nfid-google',
      name: 'Google (via NFID)',
      icon: '🔐',
      description: 'Sign in with your Google account through NFID',
      primary: true
    }
  ];

  // Placeholder methods for compatibility
  const loginWithNFIDIdentity = async () => {
    console.warn('loginWithNFIDIdentity not implemented in SimpleNFIDAuthContext');
    return false;
  };

  const loginWithInternetIdentity = async () => {
    console.warn('loginWithInternetIdentity not implemented in SimpleNFIDAuthContext');
    return false;
  };

  const loginWithPlug = async () => {
    console.warn('loginWithPlug not implemented in SimpleNFIDAuthContext');
    return false;
  };

  const contextValue = {
    // Authentication state
    isAuthenticated: isConnected,
    user: getUserInfo(),
    identity: identity,
    actor,
    
    // Loading states
    isLoading: isLoading || isConnecting || isInitializing,
    error,
    
    // Authentication methods
    loginWithNFIDGoogle,
    loginWithNFIDIdentity,
    loginWithInternetIdentity,
    loginWithPlug,
    logout,
    getAvailableAuthMethods,
    
    // Utility
    clearError: () => setError(null),
  };

  return (
    <SimpleNFIDAuthContext.Provider value={contextValue}>
      {children}
    </SimpleNFIDAuthContext.Provider>
  );
};

export default SimpleNFIDAuthProvider;
