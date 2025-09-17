import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/karbyn_backend';
import { KarbynBackendService } from '../services/KarbynBackendService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
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

  // Check if MetaMask is available
  isMetaMaskAvailable: () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  },

  // Connect to MetaMask wallet
  connectMetaMask: async () => {
    if (!WalletManager.isMetaMaskAvailable()) {
      throw new Error('MetaMask wallet not found. Please install MetaMask extension.');
    }

    try {
      console.log('Attempting MetaMask wallet connection');

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      const address = accounts[0];
      console.log('MetaMask connected with address:', address);

      // Get network info
      const chainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });

      return {
        address,
        chainId,
        provider: window.ethereum
      };
    } catch (error) {
      console.error('MetaMask connection error:', error);
      
      if (error.code === 4001) {
        throw new Error('MetaMask connection was rejected by the user');
      } else if (error.code === -32002) {
        throw new Error('MetaMask connection request is already pending');
      }
      
      throw new Error(`MetaMask connection failed: ${error.message}`);
    }
  },

  // Connect to Plug wallet
  connectPlug: async (canisterId) => {
    if (!WalletManager.isPlugAvailable()) {
      throw new Error('Plug wallet not found. Please install Plug wallet extension.');
    }

    try {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLocal = hostname === 'localhost' || hostname.includes('localhost') || hostname === '127.0.0.1';
      const host = isLocal ? 'http://localhost:4943' : 'https://ic0.app';
      
      console.log('Attempting Plug wallet connection with host:', host);

      // First check if Plug is already connected
      const isConnected = await window.ic.plug.isConnected();
      if (!isConnected) {
        const connected = await window.ic.plug.requestConnect({
          whitelist: [canisterId],
          host: host,
          timeout: 50000
        });

        if (!connected) {
          throw new Error('Plug wallet connection denied by user');
        }
      }

      // Create agent if not exists
      if (!window.ic.plug.agent) {
        await window.ic.plug.createAgent({
          whitelist: [canisterId],
          host: host
        });
      }

      // For local development, handle root key
      if (isLocal && window.ic.plug.agent) {
        try {
          if (typeof window.ic.plug.agent.fetchRootKey === 'function') {
            await window.ic.plug.agent.fetchRootKey();
            console.log('Successfully fetched root key for local development');
          }
        } catch (rootKeyError) {
          console.warn('Could not fetch root key for local development:', rootKeyError.message);
          // Continue anyway - this is often not fatal for local dev
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
      
      // Provide better error messages
      if (error.message.includes('No keychain found')) {
        throw new Error('Please set up your Plug wallet first. Create an account in the Plug extension and try again.');
      } else if (error.message.includes('denied')) {
        throw new Error('Connection was denied. Please approve the connection in your Plug wallet.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Connection timed out. Please try again.');
      }
      
      throw new Error(`Plug wallet connection failed: ${error.message}`);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [principal, setPrincipal] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [actor, setActor] = useState(null);

  // Get canister ID from environment or declarations
  const getCanisterId = () => {
    try {
      return process.env.CANISTER_ID_KARBYN_BACKEND || 
             process.env.VITE_CANISTER_ID_KARBYN_BACKEND ||
             'rrkah-fqaaa-aaaaa-aaaaq-cai'; // fallback for local development
    } catch (error) {
      console.warn('Could not get canister ID from environment, using fallback');
      return 'rrkah-fqaaa-aaaaa-aaaaq-cai';
    }
  };

  const canisterId = getCanisterId();

  // Initialize auth on component mount
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Internet Identity auth client
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });
      setAuthClient(client);

      // Check if already authenticated with Internet Identity
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        
        if (!principal.isAnonymous()) {
          setPrincipal(principal);
          setIsAuthenticated(true);
          setWalletType('ii');
          
          // Create actor with authenticated identity
          const actor = createActor(canisterId, {
            agentOptions: {
              identity,
              host: window.location.hostname === 'localhost' ? 'http://localhost:4943' : 'https://ic0.app',
            },
          });
          setActor(actor);
          setBackend(actor);
          
          console.log('Auto-authenticated with Internet Identity:', principal.toText());
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (walletType) => {
    try {
      setIsLoading(true);

      switch (walletType) {
        case 'ii':
          return await loginWithInternetIdentity();
        case 'plug':
          return await loginWithPlug();
        case 'nfid':
          return await loginWithNFID();
        case 'metamask':
          return await loginWithMetaMask();
        default:
          throw new Error('Unsupported wallet type');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithInternetIdentity = async () => {
    if (!authClient) {
      throw new Error('Auth client not initialized');
    }

    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname.includes('localhost');
    
    const identityProvider = isLocal 
      ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai'}.localhost:4943`
      : 'https://identity.ic0.app';

    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          try {
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal();
            
            setPrincipal(principal);
            setIsAuthenticated(true);
            setWalletType('ii');
            
            // Create actor with authenticated identity
            const actor = createActor(canisterId, {
              agentOptions: {
                identity,
                host: isLocal ? 'http://localhost:4943' : 'https://ic0.app',
              },
            });
            setActor(actor);
            setBackend(actor);
            
            console.log('Internet Identity login successful:', principal.toText());
            resolve({ principal, walletType: 'ii' });
          } catch (error) {
            console.error('Error setting up after II login:', error);
            reject(error);
          }
        },
        onError: (error) => {
          console.error('Internet Identity login error:', error);
          reject(new Error('Internet Identity login failed'));
        },
      });
    });
  };

  const loginWithPlug = async () => {
    try {
      const connection = await WalletManager.connectPlug(canisterId);
      
      setPrincipal(connection.principal);
      setIsAuthenticated(true);
      setWalletType('plug');
      
      // Create actor with Plug agent
      const actor = createActor(canisterId, {
        agent: connection.agent,
      });
      setActor(actor);
      setBackend(actor);
      
      console.log('Plug wallet login successful:', connection.principal.toText());
      return { principal: connection.principal, walletType: 'plug' };
    } catch (error) {
      console.error('Plug login error:', error);
      throw error;
    }
  };

  const loginWithNFID = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!authClient) {
          throw new Error('Auth client not initialized');
        }

        await authClient.login({
          identityProvider: 'https://nfid.one',
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
          windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=' + 
            (screen.width / 2 - 250) + ',top=' + (screen.height / 2 - 250),
          onSuccess: async () => {
            try {
              const identity = authClient.getIdentity();
              const principal = identity.getPrincipal();
              
              if (principal.isAnonymous()) {
                throw new Error('NFID authentication failed - anonymous principal');
              }
              
              setPrincipal(principal);
              setIsAuthenticated(true);
              setWalletType('nfid');
              
              // Create agent and actor
              const agent = new HttpAgent({
                host: process.env.NODE_ENV === 'production' 
                  ? 'https://ic0.app' 
                  : 'http://localhost:4943',
                identity,
              });
              
              if (process.env.NODE_ENV !== 'production') {
                await agent.fetchRootKey();
              }
              
              const actor = createActor(canisterId, { agent });
              setActor(actor);
              setBackend(actor);
              
              // Set up backend service
              KarbynBackendService.setActor(actor);
              
              console.log('NFID login successful:', principal.toText());
              resolve({ principal, walletType: 'nfid' });
            } catch (error) {
              console.error('Error setting up after NFID login:', error);
              reject(error);
            }
          },
          onError: (error) => {
            console.error('NFID login error:', error);
            reject(new Error('NFID authentication failed'));
          },
        });
      } catch (error) {
        console.error('NFID login setup error:', error);
        reject(error);
      }
    });
  };

  const loginWithMetaMask = async () => {
    try {
      console.log('Starting MetaMask authentication...');
      
      // Connect to MetaMask
      const walletData = await WalletManager.connectMetaMask();
      
      // Create a pseudo-principal from Ethereum address
      // Note: This is a simplified approach for demo purposes
      // In production, you'd want to integrate with IC-ETH bridge or similar
      const addressHash = walletData.address.toLowerCase();
      const pseudoPrincipal = {
        toText: () => `metamask:${addressHash}`,
        isAnonymous: () => false,
        toString: () => `metamask:${addressHash}`
      };
      
      setPrincipal(pseudoPrincipal);
      setIsAuthenticated(true);
      setWalletType('metamask');
      
      // For MetaMask, we'll create a mock actor since we don't have IC integration yet
      // In production, this would integrate with IC-ETH bridge
      const mockActor = {
        // Add mock methods as needed for MetaMask users
        getUserProfile: async () => ({ id: addressHash, walletType: 'metamask' }),
        // Add other necessary methods
      };
      
      setActor(mockActor);
      
      console.log('MetaMask login successful:', addressHash);
      return { 
        principal: pseudoPrincipal, 
        walletType: 'metamask',
        address: walletData.address,
        chainId: walletData.chainId
      };
    } catch (error) {
      console.error('MetaMask login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if ((walletType === 'ii' || walletType === 'nfid') && authClient) {
        await authClient.logout();
      } else if (walletType === 'plug' && window.ic?.plug) {
        // Plug doesn't have a logout method, just disconnect
        console.log('Disconnecting from Plug wallet');
      } else if (walletType === 'metamask') {
        // MetaMask doesn't require explicit logout from our side
        console.log('Disconnecting from MetaMask wallet');
      }
      
      // Reset all state
      setIsAuthenticated(false);
      setPrincipal(null);
      setWalletType(null);
      setActor(null);
      setBackend(null);
      
      // Clear backend
      KarbynBackendService.setActor(null);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    isAuthenticated,
    isLoading,
    principal,
    walletType,
    actor,
    login,
    logout,
    canisterId,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
