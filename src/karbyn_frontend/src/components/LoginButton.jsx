import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/CleanAuthContext';
import WalletModal from './WalletModal';

const LoginButton = ({ className = '', children = 'Login' }) => {
  const { isAuthenticated, isLoading, principal, walletType, login, logout } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowWalletModal(true);
  };

  const handleWalletSelect = async (selectedWalletType) => {
    try {
      const result = await login(selectedWalletType);
      setShowWalletModal(false);
      
      // Navigate to dashboard after successful login
      if (result && result.principal) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Let WalletModal handle the error display
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getWalletIcon = (type) => {
    switch (type) {
      case 'plug': return '🔌';
      case 'ii': return '🆔';
      case 'nfid': return '🎭';
      case 'metamask': return '🦊';
      default: return '👤';
    }
  };

  if (isAuthenticated && principal) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="text-lg">{getWalletIcon(walletType)}</span>
          <div className="text-sm">
            <div className="font-medium text-green-800">Connected</div>
            <div className="text-green-600 text-xs">
              {principal.toText().slice(0, 8)}...{principal.toText().slice(-8)}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${className}`}
      >
        {isLoading ? 'Connecting...' : children}
      </button>
      
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
};

export default LoginButton;
