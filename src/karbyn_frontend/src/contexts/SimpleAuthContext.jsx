import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/karbyn_backend';
import { KarbynBackendService } from '../services/KarbynBackendService.jsx';

const SimpleAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

// Backend setup function
const setBackend = (actor) => {
  if (actor) {
    try {
      KarbynBackendService.setActor(actor);
      console.log('Backend actor set successfully');
    } catch (error) {
      console.error('Error setting backend actor:', error);
    }
  }
};

// Simple wallet manager
const WalletManager = {
  isPlugAvailable: () => {
    return typeof window !== 'undefined' && window.ic && window.ic.plug;
  },

  connectPlug: async (canisterId) => {
    if (!WalletManager.isPlugAvailable()) {
      throw new Error('Plug wallet not found. Please install Plug wallet extension.');
    }

    try {
      const isLocal = window.location.hostname.includes('localhost') || 
                     window.location.hostname === '127.0.0.1';
      
      const host = isLocal ? 'http://localhost:4943' : 'https://ic0.app';
      
      console.log('Connecting to Plug wallet...');

      const connectionResult = await window.ic.plug.requestConnect({
        whitelist: [canisterId],
        host: host,
        timeout: 30000
      });

      if (!connectionResult) {
        throw new Error('Connection denied by user');
      }

      // Skip fetchRootKey for local development
      if (!isLocal) {
        try {
          await window.ic.plug.agent.fetchRootKey();
        } catch (error) {
          console.warn('fetchRootKey failed, continuing anyway:', error);
        }
      }

      const principal = await window.ic.plug.agent.getPrincipal();
      console.log('Plug connected with principal:', principal.toText());
      
      return {
        agent: window.ic.plug.agent,
        principal: principal,
        type: 'plug'
      };

    } catch (error) {
      console.error('Plug connection error:', error);
      
      if (error.message?.includes('fetchRootKey') || 
          error.message?.includes('Method not implemented')) {
        throw new Error('Please use Internet Identity for local development');
      }
      
      throw new Error(`Plug wallet failed: ${error.message}`);
    }
  }
};

export const SimpleAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [user, setUser] = useState(null);
  const [actor, setActor] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletType, setWalletType] = useState(null);

  const getProviderUrl = () => {
    const isLocal = window.location.hostname.includes('localhost');
    return isLocal 
      ? 'http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai'
      : 'https://identity.ic0.app';
  };

  const getCanisterId = () => {
    return import.meta.env.VITE_CANISTER_ID_KARBYN_BACKEND || 'umunu-kh777-77774-qaaca-cai';
  };

  // Initialize auth client
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      setIsLoading(true);
      
      const client = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });
      
      setAuthClient(client);
      
      // Check if already authenticated with Internet Identity
      const isAuthenticatedII = await client.isAuthenticated();
      if (isAuthenticatedII) {
        const identity = client.getIdentity();
        await setupUserSession(identity, 'internet-identity');
      }
      
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupUserSession = async (userIdentity, walletTypeValue) => {
    try {
      setIdentity(userIdentity);
      setWalletType(walletTypeValue);
      
      const principal = userIdentity.getPrincipal();
      console.log('Setting up session for principal:', principal.toText());
      
      // Create backend actor
      const backendActor = createActor(getCanisterId(), {
        agentOptions: {
          identity: userIdentity,
          host: window.location.hostname.includes('localhost') 
            ? 'http://localhost:4943' 
            : 'https://ic0.app',
          verifyQuerySignatures: false // Disable for local development
        }
      });
      
      setActor(backendActor);
      setBackend(backendActor);
      
      // Try to get user info
      try {
        const userInfo = await backendActor.get_user();
        console.log('User info retrieved:', userInfo);
        
        if (userInfo && userInfo.length > 0) {
          setUser(userInfo[0]);
        } else {
          // Create user if not exists
          console.log('Creating new user...');
          const newUser = await backendActor.register_user({
            username: `user_${principal.toText().slice(0, 8)}`,
            bio: null,
            avatar_url: null
          });
          setUser(newUser);
        }
      } catch (userError) {
        console.warn('Could not get/create user (using demo mode):', userError);
        // Set a basic user object for demo
        setUser({
          principal: principal.toText(),
          username: `user_${principal.toText().slice(0, 8)}`,
          created_at: new Date().toISOString()
        });
      }
      
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Session setup error:', error);
      throw error;
    }
  };

  const loginWithInternetIdentity = async () => {
    try {
      setIsLoading(true);
      
      if (!authClient) {
        throw new Error('Auth client not initialized');
      }

      return new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: getProviderUrl(),
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
          onSuccess: async () => {
            try {
              const identity = authClient.getIdentity();
              await setupUserSession(identity, 'internet-identity');
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            console.error('Internet Identity login error:', error);
            reject(new Error('Internet Identity login failed'));
          }
        });
      });
      
    } catch (error) {
      console.error('Internet Identity login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPlug = async () => {
    try {
      setIsLoading(true);
      
      const connection = await WalletManager.connectPlug(getCanisterId());
      
      // Get the principal and agent from Plug
      const principal = connection.principal;
      const agent = connection.agent;
      
      // For Plug, we need to use the agent directly since it has the signing capabilities
      // Create backend actor using Plug's agent
      let backendActor;
      try {
        // Import the actor creation function
        const { createActor } = await import('../../../declarations/karbyn_backend');
        
        // Create actor with Plug's agent
        backendActor = createActor(getCanisterId(), {
          agent: agent,
          agentOptions: {
            host: window.location.hostname.includes('localhost') 
              ? 'http://localhost:4943' 
              : 'https://ic0.app',
            verifyQuerySignatures: false
          }
        });
        
        console.log('Backend actor created with Plug agent');
        
      } catch (actorError) {
        console.warn('Failed to create Plug actor, creating fallback:', actorError);
        
        // Create a proper fallback actor with all methods
        backendActor = {
          // User management
          get_user_activity_stats: async () => {
            console.log('Demo: get_user_activity_stats called');
            return {
              totalActivities: 5,
              totalCarbonOffset: 12.34,
              currentLevel: 2,
              nextLevelTarget: 20
            };
          },
          get_user: async () => {
            console.log('Demo: get_user called');
            return [{
              principal: principal.toText(),
              username: `plug_${principal.toText().slice(0, 8)}`,
              created_at: new Date().toISOString()
            }];
          },
          register_user: async (username) => {
            console.log('Demo: register_user called with:', username);
            return { 
              principal: principal.toText(),
              username: username || `plug_${principal.toText().slice(0, 8)}`,
              created_at: new Date().toISOString()
            };
          },
          
          // Activity management - using the correct function names
          submit_activity: async (activity) => {
            console.log('Demo: submit_activity called with:', activity);
            
            // Calculate carbon offset based on activity
            let carbonOffset = 0;
            const quantity = activity.quantity || 1;
            
            if (activity.type === 'recycling') {
              if (activity.subtype === 'plastic_bottles') {
                carbonOffset = quantity * 0.003; // 3g CO2 per bottle
              } else if (activity.subtype === 'paper') {
                carbonOffset = quantity * 0.001; // 1g CO2 per kg
              } else if (activity.subtype === 'glass') {
                carbonOffset = quantity * 0.002; // 2g CO2 per item
              }
            } else if (activity.type === 'transport') {
              const distance = activity.distance || 1;
              if (activity.subtype === 'cycling') {
                carbonOffset = distance * 0.0; // 0g CO2 per km
              } else if (activity.subtype === 'public_transit') {
                carbonOffset = distance * 0.04; // 40g CO2 per km
              }
            } else if (activity.type === 'energy') {
              if (activity.subtype === 'solar_panels') {
                carbonOffset = quantity * 0.5; // 500g CO2 per kWh
              } else if (activity.subtype === 'led_bulbs') {
                carbonOffset = quantity * 0.1; // 100g CO2 per bulb
              }
            }
            
            // Round to 2 decimal places
            carbonOffset = Math.round(carbonOffset * 100) / 100;
            
            const activityResult = {
              success: true,
              id: Date.now().toString(),
              carbonOffset: carbonOffset,
              activity: {
                ...activity,
                carbonOffset: carbonOffset,
                timestamp: new Date().toISOString(),
                user_principal: principal.toText()
              }
            };
            
            console.log('Activity submitted successfully with carbon offset:', carbonOffset);
            return activityResult;
          },
          
          add_activity: async (activity) => {
            console.log('Demo: add_activity called with:', activity);
            return await backendActor.submit_activity(activity);
          },
          
          get_user_activities: async () => {
            console.log('Demo: get_user_activities called');
            return [];
          },
          
          get_activities: async () => {
            console.log('Demo: get_activities called');
            return [];
          }
        };
      }
      
      setActor(backendActor);
      setBackend(backendActor);
      setIdentity(principal);
      setWalletType('plug');
      
      // Set basic user info
      const userInfo = {
        principal: principal.toText(),
        username: `plug_${principal.toText().slice(0, 8)}`,
        created_at: new Date().toISOString()
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      
      console.log('Plug authentication completed successfully');
      console.log('User:', userInfo);
      console.log('Is Authenticated:', true);
      
      return userInfo;
      
    } catch (error) {
      console.error('Plug login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (walletType === 'internet-identity' && authClient) {
        await authClient.logout();
      } else if (walletType === 'plug' && window.ic?.plug) {
        await window.ic.plug.disconnect();
      }
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setActor(null);
      setIdentity(null);
      setWalletType(null);
      
      console.log('Logout successful');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableWallets = () => {
    const wallets = [
      { id: 'internet-identity', name: 'Internet Identity', available: true }
    ];
    
    if (WalletManager.isPlugAvailable()) {
      wallets.push({ id: 'plug', name: 'Plug Wallet', available: true });
    }
    
    return wallets;
  };

  const value = {
    isAuthenticated,
    user,
    actor,
    identity,
    isLoading,
    walletType,
    authClient,
    
    // Methods
    loginWithInternetIdentity,
    loginWithPlug,
    logout,
    getAvailableWallets,
    
    // Helper methods
    getPrincipal: () => {
      try {
        if (!identity) return null;
        
        // For Plug wallet, identity is the principal object itself
        if (walletType === 'plug' && identity.toText) {
          return identity.toText();
        }
        
        // For Internet Identity, identity has getPrincipal method
        if (identity.getPrincipal) {
          const principal = identity.getPrincipal();
          return principal ? principal.toText() : null;
        }
        
        return null;
      } catch (error) {
        console.error('Error getting principal:', error);
        return null;
      }
    },
    isReady: () => !isLoading && authClient !== null
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export default SimpleAuthProvider;
