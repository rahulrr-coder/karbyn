import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/karbyn_backend';
import { KarbynBackendService } from '../services/KarbynBackendService.js';

const MultiWalletAuthContext = createContext();

export const useMultiWalletAuth = () => {
  const context = useContext(MultiWalletAuthContext);
  if (!context) {
    throw new Error('useMultiWalletAuth must be used within a MultiWalletAuthProvider');
  }
  return context;
};

// Backward compatibility export
export const useAuth = () => {
  const context = useContext(MultiWalletAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a MultiWalletAuthProvider');
  }
  return context;
};

// Simple backend setup function
const setBackend = (actor) => {
  if (actor) {
    KarbynBackendService.setActor(actor);
    console.log('Backend actor set successfully');
  }
};

// Wallet detection and management
const WalletManager = {
  // Check if Plug wallet is available
  isPlugAvailable: () => {
    return typeof window !== 'undefined' && window.ic && window.ic.plug;
  },

  // Check if Stoic wallet is available
  isStoicAvailable: () => {
    return typeof window !== 'undefined' && window.ic && window.ic.stoic;
  },

  // Connect to Plug wallet with improved error handling
  connectPlug: async (canisterId) => {
    if (!WalletManager.isPlugAvailable()) {
      throw new Error('Plug wallet not found. Please install Plug wallet extension.');
    }

    try {
      // For local development, we need to use the local host
      const isLocal = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('localhost') ||
                     window.location.hostname === '127.0.0.1';
      
      const host = isLocal ? 'http://localhost:4943' : 'https://ic0.app';
      
      console.log('Attempting Plug wallet connection with host:', host);

      const connected = await window.ic.plug.requestConnect({
        whitelist: [canisterId],
        host: host,
        timeout: 50000
      });

      if (!connected) {
        throw new Error('Plug wallet connection denied');
      }

      // For local development, handle root key carefully
      if (isLocal) {
        try {
          // Check if fetchRootKey method exists before calling it
          if (window.ic.plug.agent && typeof window.ic.plug.agent.fetchRootKey === 'function') {
            await window.ic.plug.agent.fetchRootKey();
            console.log('Successfully fetched root key for local development');
          } else {
            console.warn('fetchRootKey method not available on Plug agent - using alternative approach');
            // Alternative: Set the agent to use insecure local development
            if (window.ic.plug.agent && window.ic.plug.agent.rootKey === undefined) {
              // For local development, we can work without root key
              console.log('Working without root key for local development');
            }
          }
        } catch (rootKeyError) {
          // This is not fatal - continue without root key for local development
          console.warn('Could not fetch root key for local development (this may be normal):', rootKeyError.message);
          
          // Don't throw error - just continue
          if (rootKeyError.message.includes('not implemented')) {
            console.log('fetchRootKey not implemented - continuing with local development setup');
          }
        }
      }

      const principal = await window.ic.plug.agent.getPrincipal();
      console.log('Plug wallet connected successfully with principal:', principal.toText());

      return {
        agent: window.ic.plug.agent,
        principal: principal,
        type: 'plug'
      };
    } catch (error) {
      console.error('Plug connection error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('not implemented') || error.message.includes('fetchRootKey')) {
        // For local development, this is often not a fatal error
        console.warn('Plug wallet fetchRootKey issue in local development - attempting to continue...');
        
        // Try to continue without root key if we have a connection
        if (window.ic.plug && window.ic.plug.agent) {
          try {
            const principal = await window.ic.plug.agent.getPrincipal();
            console.log('Plug wallet connected successfully with principal (without root key):', principal.toText());
            
            return {
              agent: window.ic.plug.agent,
              principal: principal,
              type: 'plug'
            };
          } catch (principalError) {
            console.error('Could not get principal from Plug wallet:', principalError);
            throw new Error('Local development setup issue with Plug wallet. Please try Internet Identity instead.');
          }
        }
        
        throw new Error('Local development setup issue with Plug wallet. Please try Internet Identity instead.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Plug wallet connection timed out. Please try again.');
      } else if (error.message.includes('denied')) {
        throw new Error('Plug wallet connection was denied. Please approve the connection request.');
      }
      
      throw error;
    }
  },

  // Connect to Stoic wallet
  connectStoic: async (canisterId) => {
    if (!WalletManager.isStoicAvailable()) {
      // Redirect to Stoic wallet
      window.open('https://www.stoicwallet.com', '_blank');
      throw new Error('Please install Stoic wallet and try again.');
    }

    try {
      const connected = await window.ic.stoic.connect();
      
      if (!connected) {
        throw new Error('Stoic wallet connection denied');
      }

      return {
        agent: window.ic.stoic.agent,
        principal: await window.ic.stoic.agent.getPrincipal(),
        type: 'stoic'
      };
    } catch (error) {
      console.error('Stoic connection error:', error);
      throw error;
    }
  }
};

export const MultiWalletAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [user, setUser] = useState(null);
  const [actor, setActor] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletType, setWalletType] = useState(null); // 'internet-identity', 'plug', 'stoic'

  // Determine the correct provider URL based on environment
  const getProviderUrl = () => {
    const isLocal = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';
    if (isLocal) {
      return 'http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai';
    }
    return 'https://identity.ic0.app';
  };

  // Get canister ID from environment or use default
  const getCanisterId = () => {
    return import.meta.env.VITE_CANISTER_ID_KARBYN_BACKEND || 'umunu-kh777-77774-qaaca-cai';
  };

  useEffect(() => {
    // Only initialize basic auth client, don't auto-connect to wallets
    initBasicAuth();
  }, []);

  const initBasicAuth = async () => {
    try {
      console.log('Initializing basic auth...');
      
      // Only create AuthClient for Internet Identity, don't auto-connect to wallets
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });

      setAuthClient(client);
      console.log('AuthClient created successfully');

      // Check if Internet Identity is already authenticated (but don't auto-connect to wallets)
      const isAuthenticated = await client.isAuthenticated();
      console.log('Internet Identity authentication status:', isAuthenticated);
      
      if (isAuthenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setIsAuthenticated(true);
        setWalletType('internet-identity');
        setPrincipal(identity.getPrincipal().toString());
        console.log('Internet Identity restored:', identity.getPrincipal().toString());
        
        // Create actor with authenticated identity
        const actorOptions = {
          agentOptions: { 
            identity,
            host: import.meta.env.MODE === 'development' ? 'http://localhost:4943' : 'https://ic0.app'
          },
        };
        
        const authenticatedActor = createActor(getCanisterId(), actorOptions);
        
        // For local development, ensure root key is fetched
        if (import.meta.env.MODE === 'development') {
          try {
            await authenticatedActor.agent.fetchRootKey();
          } catch (error) {
            console.warn('Could not fetch root key (this is normal for local development):', error.message);
          }
        }
        
        setBackend(authenticatedActor);
        KarbynBackendService.setActor(authenticatedActor);
      } else {
        // Create anonymous actor for unauthenticated users
        const actorOptions = import.meta.env.MODE === 'development' ? {
          agentOptions: {
            host: 'http://localhost:4943',
            verifyQuerySignatures: false
          }
        } : {};
        
        const anonymousActor = createActor(getCanisterId(), actorOptions);
        setBackend(anonymousActor);
        console.log('Anonymous actor created');
      }

      console.log('Basic auth initialization complete');
    } catch (error) {
      console.error('Error during basic auth initialization:', error);
      
      // Create fallback anonymous actor
      try {
        const actorOptions = import.meta.env.MODE === 'development' ? {
          agentOptions: {
            host: 'http://localhost:4943',
            verifyQuerySignatures: false
          }
        } : {};
        
        const fallbackActor = createActor(getCanisterId(), actorOptions);
        setBackend(fallbackActor);
        console.log('Fallback anonymous actor created');
      } catch (fallbackError) {
        console.error('Failed to create fallback actor:', fallbackError);
      }
    } finally {
      // Always set loading to false when basic auth initialization completes
      setIsLoading(false);
    }
  };

  const initAuth = async () => {
    try {
      console.log('Initializing auth...');
      
      // Check for existing wallet connections ONLY if user previously connected
      const savedWalletType = localStorage.getItem('karbyn_wallet_type');
      const autoConnectEnabled = localStorage.getItem('karbyn_auto_connect') === 'true';
      
      // Only auto-connect if explicitly enabled by user
      if (autoConnectEnabled && savedWalletType === 'plug' && WalletManager.isPlugAvailable()) {
        try {
          console.log('Attempting to restore Plug connection...');
          const plugConnection = await WalletManager.connectPlug(getCanisterId());
          await initializeWithCustomAgent(plugConnection.agent, plugConnection.principal, 'plug');
          console.log('Plug connection restored successfully');
          return;
        } catch (error) {
          console.warn('Stored Plug connection failed:', error.message);
          // Don't throw here, just fall back to Internet Identity
          localStorage.removeItem('karbyn_wallet_type');
          localStorage.removeItem('karbyn_auto_connect');
        }
      }

      if (autoConnectEnabled && savedWalletType === 'stoic' && WalletManager.isStoicAvailable()) {
        try {
          const stoicConnection = await WalletManager.connectStoic(getCanisterId());
          await initializeWithCustomAgent(stoicConnection.agent, stoicConnection.principal, 'stoic');
          return;
        } catch (error) {
          console.log('Stored Stoic connection failed, falling back to Internet Identity');
          localStorage.removeItem('karbyn_wallet_type');
          localStorage.removeItem('karbyn_auto_connect');
        }
      }

      // Default to Internet Identity
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });

      setAuthClient(client);
      console.log('AuthClient created successfully');

      const isAuthenticated = await client.isAuthenticated();
      console.log('Authentication status:', isAuthenticated);
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const identity = client.getIdentity();
        setIdentity(identity);
        setWalletType('internet-identity');
        console.log('User identity:', identity.getPrincipal().toString());
        
        // Create actor with authenticated identity and proper local development handling
        const actorOptions = {
          agentOptions: { 
            identity,
            host: import.meta.env.MODE === 'development' ? 'http://localhost:4943' : 'https://ic0.app'
          },
        };
        
        const authenticatedActor = createActor(getCanisterId(), actorOptions);
        
        // For local development, ensure root key is fetched
        if (import.meta.env.MODE === 'development') {
          try {
            await authenticatedActor.agent?.fetchRootKey?.();
            console.log('Root key fetched for local development');
          } catch (error) {
            console.warn('Could not fetch root key (this might be normal):', error.message);
          }
        }
        
        setActor(authenticatedActor);
        
        // Set the actor in the backend service
        KarbynBackendService.setActor(authenticatedActor);
        console.log('Authenticated actor created');

        // Get user data from backend
        await loadUserData(authenticatedActor, identity);
      } else {
        // Create anonymous actor for public operations with proper local development handling
        const actorOptions = import.meta.env.MODE === 'development' ? {
          agentOptions: {
            host: 'http://localhost:4943'
          }
        } : {};
        
        const anonymousActor = createActor(getCanisterId(), actorOptions);
        
        // For local development, ensure root key is fetched for anonymous actor too
        if (import.meta.env.MODE === 'development') {
          try {
            await anonymousActor.agent?.fetchRootKey?.();
            console.log('Root key fetched for anonymous actor in local development');
          } catch (error) {
            console.warn('Could not fetch root key for anonymous actor (this might be normal):', error.message);
          }
        }
        
        setActor(anonymousActor);
        KarbynBackendService.setActor(anonymousActor);
        console.log('Anonymous actor created');
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
      console.log('Auth initialization complete');
    }
  };

  const initializeWithCustomAgent = async (agent, principal, type) => {
    setIsAuthenticated(true);
    setWalletType(type);
    
    // Create a mock identity for compatibility
    const mockIdentity = {
      getPrincipal: () => principal,
      transformRequest: () => agent.transformRequest(),
    };
    
    setIdentity(mockIdentity);
    
    // Create actor with custom agent
    const customActor = createActor(getCanisterId(), {
      agent: agent,
    });
    
    setActor(customActor);
    KarbynBackendService.setActor(customActor);
    
    // Load user data
    await loadUserData(customActor, mockIdentity);
    setIsLoading(false);
  };

  const loadUserData = async (actorInstance, userIdentity) => {
    try {
      const principal = userIdentity.getPrincipal();
      
      // Try to get existing user from backend
      const userResult = await actorInstance.get_user_profile(principal);
      
      if (userResult && userResult.length > 0) {
        // User exists, set user data
        const userData = userResult[0];
        setUser({
          id: principal.toString(),
          principal: principal,
          name: userData.name || 'Unknown User',
          email: userData.email || '',
          role: userData.role || { Individual: null },
          credits: userData.total_credits || 0,
          joinedDate: userData.created_at ? new Date(Number(userData.created_at) / 1000000) : new Date(),
          profileComplete: !!(userData.name && userData.email),
          walletType: walletType,
          ...userData
        });
      } else {
        // New user, set basic data
        setUser({
          id: principal.toString(),
          principal: principal,
          name: '',
          email: '',
          role: { Individual: null },
          credits: 0,
          joinedDate: new Date(),
          profileComplete: false,
          walletType: walletType
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Set basic user data even if backend call fails
      const principal = userIdentity.getPrincipal();
      setUser({
        id: principal.toString(),
        principal: principal,
        name: 'User',
        email: '',
        role: { Individual: null },
        credits: 0,
        joinedDate: new Date(),
        profileComplete: false,
        walletType: walletType
      });
    }
  };

  // Multi-wallet login function
  const loginWithWallet = async (walletId, rememberChoice = false) => {
    setIsLoading(true);
    
    try {
      let result;
      switch (walletId) {
        case 'plug':
          result = await loginWithPlug(rememberChoice);
          break;
        case 'stoic':
          result = await loginWithStoic(rememberChoice);
          break;
        case 'internet-identity':
        default:
          result = await loginWithInternetIdentity(rememberChoice);
          break;
      }
      
      // Only enable auto-connect if user explicitly chooses to remember
      if (rememberChoice) {
        localStorage.setItem('karbyn_auto_connect', 'true');
      } else {
        localStorage.removeItem('karbyn_auto_connect');
      }
      
      return result;
    } catch (error) {
      console.error('Wallet login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithPlug = async (rememberChoice = false) => {
    try {
      console.log('Attempting Plug wallet connection...');
      
      // Check if Plug is available
      if (!window.ic?.plug) {
        throw new Error('Plug wallet extension not detected. Please install Plug wallet.');
      }

      const plugConnection = await WalletManager.connectPlug(getCanisterId());
      
      // Only save wallet type if user wants to remember
      if (rememberChoice) {
        localStorage.setItem('karbyn_wallet_type', 'plug');
      }
      
      await initializeWithCustomAgent(plugConnection.agent, plugConnection.principal, 'plug');
      console.log('Plug wallet connected successfully');
      return true;
    } catch (error) {
      console.error('Plug login failed:', error);
      
      // Provide specific error messages
      if (error.message.includes('fetchRootKey')) {
        throw new Error('Local development setup issue with Plug wallet. Please try Internet Identity instead.');
      } else if (error.message.includes('denied')) {
        throw new Error('Plug wallet connection was denied. Please approve the connection.');
      } else if (error.message.includes('not detected')) {
        throw new Error('Plug wallet not found. Please install Plug wallet extension.');
      } else {
        throw new Error('Failed to connect with Plug wallet. Please try again or use Internet Identity.');
      }
    }
  };

  const loginWithStoic = async (rememberChoice = false) => {
    try {
      const stoicConnection = await WalletManager.connectStoic(getCanisterId());
      
      // Only save wallet type if user wants to remember
      if (rememberChoice) {
        localStorage.setItem('karbyn_wallet_type', 'stoic');
      }
      await initializeWithCustomAgent(stoicConnection.agent, stoicConnection.principal, 'stoic');
      return true;
    } catch (error) {
      console.error('Stoic login failed:', error);
      throw new Error('Failed to connect with Stoic wallet. Please make sure Stoic is available and try again.');
    }
  };

  const loginWithInternetIdentity = async (rememberChoice = false) => {
    if (!authClient) {
      console.error('AuthClient not initialized');
      throw new Error('Authentication system not ready. Please try again.');
    }

    try {
      console.log('Starting Internet Identity login process...');
      
      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: getProviderUrl(),
          onSuccess: async () => {
            console.log('Internet Identity login successful');
            setIsAuthenticated(true);
            setWalletType('internet-identity');
            
            // Only save wallet type if user wants to remember
            if (rememberChoice) {
              localStorage.setItem('karbyn_wallet_type', 'internet-identity');
            }
            
            const identity = authClient.getIdentity();
            setIdentity(identity);
            setPrincipal(identity.getPrincipal().toString());
            console.log('Login identity:', identity.getPrincipal().toString());
            
            // Create authenticated actor
            const authenticatedActor = createActor(getCanisterId(), {
              agentOptions: { identity },
            });
            setBackend(authenticatedActor);
            KarbynBackendService.setActor(authenticatedActor);

            // Load user data
            await loadUserData(authenticatedActor, identity);
            setIsLoading(false);
            console.log('Internet Identity login process complete');
            resolve(true);
          },
          onError: (error) => {
            console.error('Internet Identity login failed:', error);
            setIsLoading(false);
            reject(new Error('Internet Identity login failed. Please try again.'));
          },
        });
      });
    } catch (error) {
      console.error('Internet Identity login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  // Legacy login function for backward compatibility
  const login = loginWithInternetIdentity;

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear all stored authentication data
      localStorage.removeItem('karbyn_wallet_type');
      localStorage.removeItem('karbyn_auto_connect');
      
      if (walletType === 'internet-identity' && authClient) {
        await authClient.logout();
      } else if (walletType === 'plug' && WalletManager.isPlugAvailable()) {
        try {
          await window.ic.plug.disconnect();
        } catch (error) {
          console.warn('Plug disconnect failed:', error);
        }
      } else if (walletType === 'stoic' && WalletManager.isStoicAvailable()) {
        try {
          await window.ic.stoic.disconnect();
        } catch (error) {
          console.warn('Stoic disconnect failed:', error);
        }
      }
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setIdentity(null);
      setWalletType(null);
      setPrincipal(null);
      
      // Reset to anonymous actor
      const actorOptions = import.meta.env.MODE === 'development' ? {
        agentOptions: {
          host: 'http://localhost:4943',
          verifyQuerySignatures: false
        }
      } : {};
      
      const anonymousActor = createActor(getCanisterId(), actorOptions);
      setBackend(anonymousActor);
      KarbynBackendService.setActor(anonymousActor);
      
      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!actor || !isAuthenticated || !identity) {
      throw new Error('User not authenticated');
    }

    try {
      const principal = identity.getPrincipal();
      
      // Create user profile data for backend
      const userProfile = {
        name: profileData.name,
        email: profileData.email,
        role: profileData.role || user.role,
        organization: profileData.organization || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        linkedin: profileData.linkedin || '',
        twitter: profileData.twitter || '',
        notification_preferences: {
          activity_updates: true,
          marketplace_updates: true,
          token_updates: true,
          newsletter: false
        }
      };

      const result = await actor.update_user_profile(principal, userProfile);
      
      if (result && result.Ok) {
        // Update local user state
        setUser(prevUser => ({
          ...prevUser,
          ...profileData,
          profileComplete: !!(profileData.name && profileData.email)
        }));
        return { success: true };
      } else {
        throw new Error(result?.Err || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const getUserBalance = async () => {
    if (!actor || !isAuthenticated || !identity) {
      return 0;
    }

    try {
      const principal = identity.getPrincipal();
      const balance = await actor.get_user_balance(principal);
      return Number(balance) || 0;
    } catch (error) {
      console.error('Failed to get user balance:', error);
      return 0;
    }
  };

  const refreshUserData = async () => {
    if (!actor || !isAuthenticated || !identity) return;

    try {
      await loadUserData(actor, identity);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const formatRole = (role) => {
    if (!role) return 'Individual';
    
    if (typeof role === 'string') {
      return role;
    }
    
    if (typeof role === 'object') {
      if (role.Individual !== undefined) return 'Individual';
      if (role.Organization !== undefined) return 'Organization';
      if (role.Verifier !== undefined) return 'Verifier';
      if (role.Admin !== undefined) return 'Admin';
    }
    
    return 'Individual';
  };

  // Get available wallets
  const availableWallets = ['ii']; // Internet Identity is always available
  if (WalletManager.isPlugAvailable()) availableWallets.push('plug');
  if (WalletManager.isStoicAvailable()) availableWallets.push('stoic');

  const value = {
    isAuthenticated,
    user,
    actor,
    identity,
    isLoading,
    loading: isLoading, // Add alias for compatibility
    principal: user?.id, // Add principal for compatibility
    walletType,
    error: null, // Add error state
    
    // Wallet connection methods
    connectWallet: loginWithWallet, // Alias for Login.jsx compatibility
    loginWithWallet,
    loginWithPlug,
    loginWithStoic,
    loginWithInternetIdentity,
    
    // Legacy methods for backward compatibility
    login,
    demoLogin: loginWithInternetIdentity,
    
    logout,
    updateProfile,
    getUserBalance,
    refreshUserData,
    formatRole,
    
    // Wallet availability
    availableWallets,
    walletManager: WalletManager,
    isPlugAvailable: WalletManager.isPlugAvailable(),
    isStoicAvailable: WalletManager.isStoicAvailable(),
  };

  return (
    <MultiWalletAuthContext.Provider value={value}>
      {children}
    </MultiWalletAuthContext.Provider>
  );
};

export default MultiWalletAuthContext;

// Backward compatibility exports
export const AuthProvider = MultiWalletAuthProvider;
