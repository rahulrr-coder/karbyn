/**
 * Karbyn Authentication Context - Complete Phase 3 Integration
 * 
 * This context provides authentication state management with Internet Identity,
 * user registration, profile management, and session handling for the Karbyn dApp
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { KarbynBackendService, User, RegisterUserInput, UpdateProfileInput, UserRole } from '../services/KarbynBackendServiceComplete';

// Import Principal type from the service to ensure consistency
type Principal = any; // We'll use the Principal type from the backend service

// ==================== AUTHENTICATION TYPES ====================

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  principal: Principal | null;
  user: User | null;
  error: string | null;
  identityProvider: 'InternetIdentity' | 'Local' | null;
}

export interface AuthActions {
  // Authentication actions
  login: () => Promise<void>;
  logout: () => Promise<void>;
  
  // User management actions
  registerUser: (userData: RegisterUserInput) => Promise<User>;
  updateProfile: (updates: UpdateProfileInput) => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Utility functions
  clearError: () => void;
  isUserRegistered: () => boolean;
  canMintNFT: () => boolean;
  getUserRole: () => UserRole | null;
}

export type AuthContextType = AuthState & AuthActions;

// ==================== CONTEXT CREATION ====================

const AuthContext = createContext<AuthContextType | null>(null);

// ==================== CONFIGURATION ====================

const AUTH_CONFIG = {
  // Internet Identity Provider URL
  identityProvider: process.env.NODE_ENV === 'production'
    ? 'https://identity.ic0.app'
    : 'http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai',
  
  // Maximum session time (8 hours)
  maxTimeToLive: 8 * 60 * 60 * 1000 * 1000 * 1000, // 8 hours in nanoseconds
  
  // Auto-refresh session before expiry
  sessionRefreshThreshold: 30 * 60 * 1000, // 30 minutes in milliseconds
};

// ==================== AUTH PROVIDER COMPONENT ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ==================== STATE MANAGEMENT ====================
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    principal: null,
    user: null,
    error: null,
    identityProvider: null,
  });

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  // ==================== UTILITY FUNCTIONS ====================

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  const setError = useCallback((error: string | null) => {
    updateState({ error });
  }, [updateState]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const setLoading = useCallback((isLoading: boolean) => {
    updateState({ isLoading });
  }, [updateState]);

  // ==================== SESSION MANAGEMENT ====================

  const scheduleSessionRefresh = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    const timer = setTimeout(async () => {
      console.log('Refreshing authentication session...');
      await initializeAuth();
    }, AUTH_CONFIG.sessionRefreshThreshold);

    setSessionTimer(timer);
  }, [sessionTimer]);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  }, [sessionTimer]);

  // ==================== AUTHENTICATION FUNCTIONS ====================

  const initializeAuthClient = useCallback(async (): Promise<AuthClient> => {
    try {
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: false,
          disableDefaultIdleCallback: true,
          idleTimeout: AUTH_CONFIG.maxTimeToLive / 1000000, // Convert to milliseconds
        }
      });
      setAuthClient(client);
      return client;
    } catch (error) {
      console.error('Failed to create auth client:', error);
      throw new Error('Failed to initialize authentication');
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      // Initialize auth client if not already done
      const client = authClient || await initializeAuthClient();

      // Check if user is already authenticated
      const isAuthenticated = await client.isAuthenticated();
      
      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();

        if (!principal.isAnonymous()) {
          // Initialize backend service
          await KarbynBackendService.initialize();
          
          // Load user data
          const user = await KarbynBackendService.getCurrentUser();
          
          updateState({
            isAuthenticated: true,
            principal: principal,
            user,
            identityProvider: 'InternetIdentity',
            error: null,
          });

          // Schedule session refresh
          scheduleSessionRefresh();
          
          console.log('User authenticated:', principal.toString());
          return;
        }
      }

      // Check for local development identity
      if (process.env.NODE_ENV === 'development') {
        try {
          // In development, we might use dfx identity
          await KarbynBackendService.initialize();
          const user = await KarbynBackendService.getCurrentUser();
          
          if (user) {
            updateState({
              isAuthenticated: true,
              principal: user.id,
              user,
              identityProvider: 'Local',
              error: null,
            });
            console.log('Using local development identity');
            return;
          }
        } catch (error) {
          console.log('No local identity available');
        }
      }

      // No authentication found
      updateState({
        isAuthenticated: false,
        principal: null,
        user: null,
        identityProvider: null,
        error: null,
      });

    } catch (error) {
      console.error('Authentication initialization failed:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [authClient, initializeAuthClient, updateState, setError, scheduleSessionRefresh]);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const client = authClient || await initializeAuthClient();

      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        console.log('User already authenticated');
        await initializeAuth();
        return;
      }

      // Start Internet Identity login flow
      await new Promise<void>((resolve, reject) => {
        client.login({
          identityProvider: AUTH_CONFIG.identityProvider,
          maxTimeToLive: BigInt(AUTH_CONFIG.maxTimeToLive),
          onSuccess: () => {
            console.log('Internet Identity login successful');
            resolve();
          },
          onError: (error) => {
            console.error('Internet Identity login failed:', error);
            reject(new Error('Login failed'));
          },
        });
      });

      // Re-initialize after login
      await initializeAuth();

    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [authClient, initializeAuthClient, initializeAuth, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      clearSessionTimer();

      if (authClient) {
        await authClient.logout();
      }

      updateState({
        isAuthenticated: false,
        principal: null,
        user: null,
        identityProvider: null,
        error: null,
      });

      console.log('User logged out successfully');

    } catch (error) {
      console.error('Logout failed:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  }, [authClient, updateState, setError, clearSessionTimer]);

  // ==================== USER MANAGEMENT FUNCTIONS ====================

  const registerUser = useCallback(async (userData: RegisterUserInput): Promise<User> => {
    try {
      setLoading(true);
      clearError();

      if (!authState.isAuthenticated) {
        throw new Error('Must be authenticated to register');
      }

      const newUser = await KarbynBackendService.registerUser(userData);
      
      updateState({ user: newUser });
      
      console.log('User registered successfully:', newUser.name);
      return newUser;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated, updateState, setError]);

  const updateProfile = useCallback(async (updates: UpdateProfileInput) => {
    try {
      setLoading(true);
      clearError();

      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('Must be authenticated with registered user');
      }

      await KarbynBackendService.updateProfile(updates);
      
      // Refresh user data
      const updatedUser = await KarbynBackendService.getCurrentUser();
      updateState({ user: updatedUser });
      
      console.log('Profile updated successfully');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated, authState.user, updateState, setError]);

  const refreshUser = useCallback(async () => {
    try {
      if (!authState.isAuthenticated) return;
      
      setLoading(true);
      const user = await KarbynBackendService.getCurrentUser();
      updateState({ user });
      
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      setError('Failed to refresh user data');
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated, updateState, setError]);

  // ==================== UTILITY FUNCTIONS ====================

  const isUserRegistered = useCallback((): boolean => {
    return authState.isAuthenticated && authState.user !== null;
  }, [authState.isAuthenticated, authState.user]);

  const canMintNFT = useCallback((): boolean => {
    if (!authState.user) return false;
    return KarbynBackendService.canMintFromBalance(BigInt(authState.user.total_carbon_offset * 1000));
  }, [authState.user]);

  const getUserRole = useCallback((): UserRole | null => {
    return authState.user?.role || null;
  }, [authState.user]);

  // ==================== EFFECTS ====================

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
    
    // Cleanup on unmount
    return () => {
      clearSessionTimer();
    };
  }, [initializeAuth, clearSessionTimer]);

  // Handle page visibility changes (refresh session when page becomes visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && authState.isAuthenticated) {
        initializeAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authState.isAuthenticated, initializeAuth]);

  // ==================== CONTEXT VALUE ====================

  const contextValue: AuthContextType = {
    // State
    ...authState,
    
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

// ==================== CUSTOM HOOK ====================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ==================== HIGHER-ORDER COMPONENTS ====================

/**
 * HOC to protect routes that require authentication
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please log in to access this page.</p>
            <LoginButton />
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

/**
 * HOC to protect routes that require user registration
 */
export const withRegistration = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isUserRegistered, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (!isUserRegistered()) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Required</h2>
            <p className="text-gray-600 mb-6">Please complete your profile to access this page.</p>
            {/* This would redirect to registration page */}
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// ==================== UTILITY COMPONENTS ====================

/**
 * Login button component
 */
export const LoginButton: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <button
      onClick={login}
      disabled={isLoading}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : (
        'Login with Internet Identity'
      )}
    </button>
  );
};

/**
 * Logout button component
 */
export const LogoutButton: React.FC = () => {
  const { logout, isLoading } = useAuth();

  return (
    <button
      onClick={logout}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

/**
 * User profile display component
 */
export const UserProfile: React.FC = () => {
  const { user, principal, identityProvider } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">User Profile</h3>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Role</dt>
          <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Principal ID</dt>
          <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{principal?.toString()}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Identity Provider</dt>
          <dd className="mt-1 text-sm text-gray-900">{identityProvider}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Total Carbon Offset</dt>
          <dd className="mt-1 text-sm text-gray-900">{user.total_carbon_offset} kg CO₂</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Total Activities</dt>
          <dd className="mt-1 text-sm text-gray-900">{user.total_activities}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">NFTs Earned</dt>
          <dd className="mt-1 text-sm text-gray-900">{user.nfts_earned}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
          <dd className="mt-1 text-sm text-gray-900">{user.verification_status}</dd>
        </div>
      </dl>
    </div>
  );
};

export default AuthContext;
