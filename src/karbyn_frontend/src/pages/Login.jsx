import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { 
    connectWallet, 
    isAuthenticated, 
    loading, 
    error: authError,
    availableWallets
  } = useAuth();
  
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = localStorage.getItem('karbyn_redirect_after_login') || '/dashboard';
      localStorage.removeItem('karbyn_redirect_after_login');
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleQuickConnect = async (walletId) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (rememberMe) {
        localStorage.setItem('karbyn_preferred_wallet', walletId);
      }
      
      const success = await connectWallet(walletId);
      if (!success) {
        setError('Connection failed. Please try again.');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError(error.message || 'Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const preferredWallet = localStorage.getItem('karbyn_preferred_wallet');
    if (preferredWallet && !isAuthenticated && !loading && !isConnecting) {
      const timer = setTimeout(() => {
        if (availableWallets.includes(preferredWallet)) {
          handleQuickConnect(preferredWallet);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [availableWallets, isAuthenticated, loading, isConnecting]);

  const quickConnectOptions = [
    {
      id: 'ii',
      name: 'Internet Identity',
      icon: '🔐',
      description: 'Quick & Secure',
      available: availableWallets.includes('ii'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'plug',
      name: 'Plug Wallet',
      icon: '🔌',
      description: 'Browser Extension',
      available: availableWallets.includes('plug'),
      color: 'from-purple-500 to-purple-600',
      installUrl: 'https://plugwallet.ooo/'
    },
    {
      id: 'stoic',
      name: 'Stoic Wallet',
      icon: '🏛️',
      description: 'Mobile Friendly',
      available: availableWallets.includes('stoic'),
      color: 'from-green-500 to-green-600',
      installUrl: 'https://www.stoicwallet.com/'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl">🌱</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600">
            Continue tracking your carbon impact
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800 text-sm">
                <span className="mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">
              Choose Your Login Method
            </h2>

            {quickConnectOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => wallet.available ? handleQuickConnect(wallet.id) : window.open(wallet.installUrl, '_blank')}
                disabled={loading || isConnecting}
                className={`
                  w-full flex items-center p-4 rounded-xl transition-all duration-200 transform hover:scale-105
                  ${wallet.available 
                    ? 'bg-gradient-to-r ' + wallet.color + ' text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }
                  ${(loading || isConnecting) ? 'opacity-60 cursor-wait' : ''}
                `}
              >
                <div className="text-2xl mr-3">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm opacity-90">{wallet.description}</div>
                </div>
                {wallet.available ? (
                  <div className="text-sm opacity-90">
                    {isConnecting ? '⏳' : '→'}
                  </div>
                ) : (
                  <div className="text-xs bg-white/20 px-2 py-1 rounded">
                    Install
                  </div>
                )}
              </button>
            ))}

            <div className="flex items-center justify-center mt-6">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span>Remember my choice for quick login</span>
              </label>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            No account needed • Connect once, use everywhere • Your data stays private
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
