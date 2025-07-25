import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/karbyn_backend';
import { KarbynBackendService } from '../services/KarbynBackendService.jsx';

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

  // Connect to Plug wallet
  connectPlug: async (canisterId) => {
    if (!WalletManager.isPlugAvailable()) {
      throw new Error('Plug wallet not found. Please install Plug wallet extension.');
    }

    try {
      const connected = await window.ic.plug.requestConnect({
        whitelist: [canisterId],
        host: 'http://localhost:4943', // For local development
      });

      if (!connected) {
        throw new Error('Plug wallet connection denied');
      }

      return {
        agent: window.ic.plug.agent,
        principal: await window.ic.plug.agent.getPrincipal(),
        type: 'plug'
      };
    } catch (error) {
      console.error('Plug connection error:', error);
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
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      console.log('Initializing auth...');
      
      // Check for existing wallet connections
      const savedWalletType = localStorage.getItem('karbyn_wallet_type');
      
      if (savedWalletType === 'plug' && WalletManager.isPlugAvailable()) {
        try {
          const plugConnection = await WalletManager.connectPlug(getCanisterId());
          await initializeWithCustomAgent(plugConnection.agent, plugConnection.principal, 'plug');
          return;
        } catch (error) {
          console.log('Stored Plug connection failed, falling back to Internet Identity');
          localStorage.removeItem('karbyn_wallet_type');
        }
      }

      if (savedWalletType === 'stoic' && WalletManager.isStoicAvailable()) {
        try {
          const stoicConnection = await WalletManager.connectStoic(getCanisterId());
          await initializeWithCustomAgent(stoicConnection.agent, stoicConnection.principal, 'stoic');
          return;
        } catch (error) {
          console.log('Stored Stoic connection failed, falling back to Internet Identity');
          localStorage.removeItem('karbyn_wallet_type');
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
        
        // Create actor with authenticated identity
        const authenticatedActor = createActor(getCanisterId(), {
          agentOptions: { identity },
        });
        setActor(authenticatedActor);
        
        // Set the actor in the backend service
        KarbynBackendService.setActor(authenticatedActor);
        console.log('Authenticated actor created');

        // Get user data from backend
        await loadUserData(authenticatedActor, identity);
      } else {
        // Create anonymous actor for public operations
        const anonymousActor = createActor(getCanisterId());
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
  const loginWithWallet = async (walletId) => {
    setIsLoading(true);
    
    try {
      switch (walletId) {
        case 'plug':
          return await loginWithPlug();
        case 'stoic':
          return await loginWithStoic();
        case 'internet-identity':
        default:
          return await loginWithInternetIdentity();
      }
    } catch (error) {
      console.error('Wallet login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithPlug = async () => {
    try {
      const plugConnection = await WalletManager.connectPlug(getCanisterId());
      localStorage.setItem('karbyn_wallet_type', 'plug');
      await initializeWithCustomAgent(plugConnection.agent, plugConnection.principal, 'plug');
      return true;
    } catch (error) {
      console.error('Plug login failed:', error);
      throw new Error('Failed to connect with Plug wallet. Please make sure Plug is installed and try again.');
    }
  };

  const loginWithStoic = async () => {
    try {
      const stoicConnection = await WalletManager.connectStoic(getCanisterId());
      localStorage.setItem('karbyn_wallet_type', 'stoic');
      await initializeWithCustomAgent(stoicConnection.agent, stoicConnection.principal, 'stoic');
      return true;
    } catch (error) {
      console.error('Stoic login failed:', error);
      throw new Error('Failed to connect with Stoic wallet. Please make sure Stoic is available and try again.');
    }
  };

  const loginWithInternetIdentity = async () => {
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
            localStorage.setItem('karbyn_wallet_type', 'internet-identity');
            
            const identity = authClient.getIdentity();
            setIdentity(identity);
            console.log('Login identity:', identity.getPrincipal().toString());
            
            // Create authenticated actor
            const authenticatedActor = createActor(getCanisterId(), {
              agentOptions: { identity },
            });
            setActor(authenticatedActor);
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
      
      // Clear stored wallet type
      localStorage.removeItem('karbyn_wallet_type');
      
      if (walletType === 'internet-identity' && authClient) {
        await authClient.logout();
      } else if (walletType === 'plug' && WalletManager.isPlugAvailable()) {
        await window.ic.plug.disconnect();
      } else if (walletType === 'stoic' && WalletManager.isStoicAvailable()) {
        await window.ic.stoic.disconnect();
      }
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setIdentity(null);
      setWalletType(null);
      
      // Reset to anonymous actor
      const anonymousActor = createActor(getCanisterId());
      setActor(anonymousActor);
      KarbynBackendService.setActor(anonymousActor);
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
