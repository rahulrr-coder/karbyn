import React, { useState } from 'react';
import { useAuth } from '../contexts/CleanAuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ onRegisterAsNGO }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, walletType, principal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRegisterAsNGO = () => {
    setIsOpen(false);
    if (onRegisterAsNGO) {
      onRegisterAsNGO();
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg px-3 py-2 transition-colors"
      >
        <span className="text-lg">{getWalletIcon(walletType)}</span>
        <div className="text-sm">
          <div className="font-medium text-green-800">Profile</div>
          <div className="text-green-600 text-xs">
            {principal?.toText().slice(0, 8)}...{principal?.toText().slice(-8)}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-green-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-900">Connected Account</div>
              <div className="text-xs text-gray-500 font-mono">
                {principal?.toText()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Wallet: {walletType}
              </div>
            </div>
            <div className="py-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                📊 Dashboard
              </button>
              <button
                onClick={handleRegisterAsNGO}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                🌱 Register as NGO
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
