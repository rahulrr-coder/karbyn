/**
 * Karbyn Authentication Context - JSX Version
 * 
 * This context provides authentication state management with Internet Identity,
 * user registration, profile management, and session handling for the Karbyn dApp
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { KarbynBackendService } from '../services/KarbynBackendService';

// ==================== CONTEXT CREATION ====================

const AuthContext = createContext(null);

// ==================== CONFIGURATION ====================

const IDENTITY_PROVIDER_URL = process.env.NODE_ENV === 'production'
  ? "https://identity.ic0.app"
  : `http://localhost:4943?canisterId=${process.env.REACT_APP_INTERNET_IDENTITY_CANISTER_ID}`;

const MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000); // 7 days in nanoseconds

// ==================== PROVIDER COMPONENT ====================

export const AuthProvider = ({ children }) => {
  // Authentication state
  const [state, setState] = useState({
    isAuthenticated: false,
    isLoading: true,
    principal: null,
    user: null,
    error: null,
    identityProvider: null
  });

  const [authClient, setAuthClient] = useState(null);
  const [backendService, setBackendService] = useState(null);

  // ==================== UTILITY FUNCTIONS ====================

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const setError = useCallback((error) => {
    console.error('Auth Error:', error);
    setState(prev => ({ 
      ...prev, 
      error: typeof error === 'string' ? error : error.message || 'An unexpected error occurred'
    }));
  }, []);

  const setLoading = useCallback((isLoading) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // ==================== AUTHENTICATION CORE ====================

  const initAuthClient = useCallback(async () => {
    try {
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 60 * 24, // 24 hours
          disableDefaultIdleCallback: true
        }
      });

      setAuthClient(client);

      // Check if user is already authenticated
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        
        // Initialize backend service with authenticated identity
        const service = new KarbynBackendService(identity);
        setBackendService(service);

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          principal,
          identityProvider: 'InternetIdentity'
        }));

        // Load user data
        await loadUserData(service, principal);
      }
    } catch (error) {
      console.error('Failed to initialize auth client:', error);
      setError('Failed to initialize authentication');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async (service, principal) => {
    try {
      const userData = await service.getUser();
      setState(prev => ({ ...prev, user: userData }));
    } catch (error) {
      // User might not be registered yet - this is OK
      console.log('User not found in backend:', error);
      setState(prev => ({ ...prev, user: null }));
    }
  }, []);

  // ==================== AUTHENTICATION ACTIONS ====================

  const login = useCallback(async () => {
    if (!authClient) {
      setError('Authentication client not initialized');
      return;
    }

    try {
      setLoading(true);
      clearError();

      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: IDENTITY_PROVIDER_URL,
          maxTimeToLive: MAX_TIME_TO_LIVE,
          onSuccess: resolve,
          onError: reject,
        });
      });

      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();

      // Initialize backend service with authenticated identity
      const service = new KarbynBackendService(identity);
      setBackendService(service);

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        principal,
        identityProvider: 'InternetIdentity'
      }));

      // Load user data
      await loadUserData(service, principal);

    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [authClient, loadUserData]);

  const logout = useCallback(async () => {
    if (!authClient) return;

    try {
      setLoading(true);
      await authClient.logout();
      
      // Clear all state
      setState({
        isAuthenticated: false,
        isLoading: false,
        principal: null,
        user: null,
        error: null,
        identityProvider: null
      });
      
      setBackendService(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed');
    } finally {
      setLoading(false);
    }
  }, [authClient]);

  // ==================== USER MANAGEMENT ====================

  const registerUser = useCallback(async (userData) => {
    if (!backendService) {
      throw new Error('Backend service not available');
    }

    try {
      setLoading(true);
      clearError();

      const newUser = await backendService.registerUser(userData);
      setState(prev => ({ ...prev, user: newUser }));
      
      return newUser;
    } catch (error) {
      console.error('User registration failed:', error);
      const errorMessage = error.message || 'User registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [backendService]);

  const updateProfile = useCallback(async (updates) => {
    if (!backendService) {
      throw new Error('Backend service not available');
    }

    try {
      setLoading(true);
      clearError();

      await backendService.updateProfile(updates);
      
      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Profile update failed:', error);
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [backendService]);

  const refreshUser = useCallback(async () => {
    if (!backendService || !state.principal) {
      return;
    }

    try {
      await loadUserData(backendService, state.principal);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't set error for refresh failures as they're often non-critical
    }
  }, [backendService, state.principal, loadUserData]);

  // ==================== UTILITY FUNCTIONS ====================

  const isUserRegistered = useCallback(() => {
    return state.user !== null;
  }, [state.user]);

  const canMintNFT = useCallback(() => {
    return state.isAuthenticated && state.user !== null;
  }, [state.isAuthenticated, state.user]);

  const getUserRole = useCallback(() => {
    return state.user?.role || null;
  }, [state.user]);

  // ==================== INITIALIZATION ====================

  useEffect(() => {
    initAuthClient();
  }, [initAuthClient]);

  // ==================== CONTEXT VALUE ====================

  const contextValue = {
    // State
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    principal: state.principal,
    user: state.user,
    error: state.error,
    identityProvider: state.identityProvider,

    // Actions
    login,
    logout,
    registerUser,
    updateProfile,
    refreshUser,
    clearError,
    isUserRegistered,
    canMintNFT,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================== HOOK ====================

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
