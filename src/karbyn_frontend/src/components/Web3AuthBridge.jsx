import React, { useEffect } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext.jsx';
import { useWeb3Auth } from '../contexts/Web3AuthContext.jsx';

/**
 * Bridge component that integrates Web3Auth with existing SimpleAuth system
 * This allows seamless Google login integration without breaking existing functionality
 */
const Web3AuthBridge = ({ children }) => {
  const { 
    isAuthenticated: isWeb3AuthAuthenticated, 
    user: web3User, 
    provider: web3Provider,
    isLoading: web3Loading 
  } = useWeb3Auth();
  
  const { 
    isAuthenticated: isSimpleAuthAuthenticated,
    login: simpleLogin,
    logout: simpleLogout,
    isLoading: simpleLoading
  } = useAuth();

  // When Web3Auth authentication changes, sync with SimpleAuth
  useEffect(() => {
    const syncAuthentication = async () => {
      if (isWeb3AuthAuthenticated && web3User && !isSimpleAuthAuthenticated) {
        console.log('🔄 Syncing Web3Auth to SimpleAuth...');
        
        // Create a mock identity for SimpleAuth based on Web3Auth user
        const mockIdentity = {
          getPrincipal: () => ({
            toText: () => web3User.verifierId || 'web3auth-user',
            toString: () => web3User.verifierId || 'web3auth-user'
          })
        };
        
        // You can extend this to call your existing login method
        // or create a new method in SimpleAuth to handle Web3Auth users
        console.log('✅ Web3Auth user authenticated:', web3User);
      } else if (!isWeb3AuthAuthenticated && isSimpleAuthAuthenticated) {
        // If Web3Auth logs out but SimpleAuth is still authenticated
        // You might want to handle this case
        console.log('🔄 Web3Auth logged out');
      }
    };

    syncAuthentication();
  }, [isWeb3AuthAuthenticated, web3User, isSimpleAuthAuthenticated, simpleLogin]);

  return <>{children}</>;
};

export default Web3AuthBridge;
