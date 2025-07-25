import React, { useState, useEffect } from 'react';
import { useMultiWalletAuth } from '../../contexts/MultiWalletAuthContext';
import { useNavigate } from 'react-router-dom';
import WalletConnectModal from '../../components/auth/WalletConnectModal';

const Login = () => {
  const { 
    connectWallet, 
    isAuthenticated, 
    loading, 
    error: authError,
    availableWallets,
    walletManager 
  } = useMultiWalletAuth();
  
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleWalletConnect = async (walletId) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const success = await connectWallet(walletId);
      if (success) {
        setShowWalletModal(false);
        // Navigation will happen automatically via useEffect
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const quickConnectOptions = [
    {
      id: 'ii',
      name: 'Internet Identity',
      icon: '🔐',
      description: 'Secure & Private',
      available: availableWallets.includes('ii'),
      recommended: true
    },
    {
      id: 'plug',
      name: 'Plug Wallet',
      icon: '🔌',
      description: 'Browser Extension',
      available: availableWallets.includes('plug'),
      installUrl: 'https://plugwallet.ooo/'
    },
    {
      id: 'stoic',
      name: 'Stoic Wallet',
      icon: '🏛️',
      description: 'Mobile Friendly',
      available: availableWallets.includes('stoic'),
      installUrl: 'https://www.stoicwallet.com/'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-2xl">🌱</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome to Karbyn
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn your eco-actions into valuable carbon credits
          </p>
        </div>

        <div className="bg-card py-8 px-6 organic-shadow-prominent rounded-lg border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">⚠️</div>
                <div className="text-sm text-red-800">{error}</div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-card-foreground mb-4">
                Connect Your Wallet
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose your preferred wallet to access the Karbyn ecosystem
              </p>
            </div>

            {/* Quick Connect Options */}
            <div className="space-y-3">
              {quickConnectOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => wallet.available ? handleWalletConnect(wallet.id) : window.open(wallet.installUrl, '_blank')}
                  disabled={loading || isConnecting}
                  className={`
                    w-full flex items-center justify-between p-4 border rounded-lg transition-all
                    ${wallet.available 
                      ? 'border-gray-200 hover:border-green-300 hover:bg-gray-50 cursor-pointer' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-75'
                    }
                    ${wallet.recommended ? 'ring-2 ring-green-100' : ''}
                    ${(loading || isConnecting) ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{wallet.icon}</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-800 flex items-center">
                        {wallet.name}
                        {wallet.recommended && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{wallet.description}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {wallet.available ? (
                      <span className="text-green-600 text-sm">Connect</span>
                    ) : (
                      <span className="text-blue-600 text-sm">Install</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <button
              onClick={() => setShowWalletModal(true)}
              disabled={loading || isConnecting}
              className="w-full flex justify-center py-3 px-4 border border-accent rounded-md shadow-sm text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
            >
              <span className="mr-2">🔍</span>
              View All Wallet Options
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <div className="text-blue-600 mr-2">💡</div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">New to Web3?</p>
                  <p>
                    We recommend Internet Identity for the most secure and private experience. 
                    No downloads required and your privacy is protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
        availableWallets={availableWallets}
        isConnecting={isConnecting}
      />
    </div>
  );
};

export default Login;
