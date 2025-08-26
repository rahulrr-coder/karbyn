import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  web3auth, 
  initWeb3Auth, 
  connectWallet, 
  disconnectWallet, 
  getUserInfo, 
  isConnected 
} from '../config/web3authConfig.js';

// Create context
const Web3AuthContext = createContext(undefined);

// Provider component
export const Web3AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Web3Auth on component mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await initWeb3Auth();
        setIsInitialized(true);
        
        // Check if user is already connected
        if (isConnected()) {
          setIsAuthenticated(true);
          setProvider(web3auth.provider);
          
          // Get user info
          const userInfo = await getUserInfo();
          setUser(userInfo);
        }
      } catch (err) {
        console.error('Failed to initialize Web3Auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Login function
  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isInitialized) {
        throw new Error('Web3Auth not initialized');
      }

      const web3authProvider = await connectWallet();
      
      if (web3authProvider) {
        setProvider(web3authProvider);
        setIsAuthenticated(true);
        
        // Get user information
        const userInfo = await getUserInfo();
        setUser(userInfo);
        
        console.log('✅ Login successful:', userInfo);
      } else {
        throw new Error('Failed to get provider after login');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
      setIsAuthenticated(false);
      setUser(null);
      setProvider(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await disconnectWallet();
      
      setIsAuthenticated(false);
      setUser(null);
      setProvider(null);
      
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue = {
    isInitialized,
    isLoading,
    isAuthenticated,
    user,
    provider,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
};

// Custom hook to use Web3Auth context
export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};

export default Web3AuthProvider;
