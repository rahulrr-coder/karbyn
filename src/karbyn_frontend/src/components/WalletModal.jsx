import React, { useState } from 'react';
import { X } from 'lucide-react';

const WalletModal = ({ isOpen, onClose, onSelectWallet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [error, setError] = useState(null);

  const wallets = [
    {
      id: 'ii',
      name: 'Internet Identity',
      description: 'Official Internet Computer identity provider',
      icon: '🆔',
      available: true
    },
    {
      id: 'plug',
      name: 'Plug Wallet',
      description: 'Browser extension wallet for Internet Computer',
      icon: '🔌',
      available: typeof window !== 'undefined' && window.ic?.plug,
      downloadUrl: 'https://chrome.google.com/webstore/detail/plug/cfbfdhimifdmdehjmkdobpcjfefblkjm'
    },
    {
      id: 'nfid',
      name: 'NFID',
      description: 'Google-based Web3 authentication',
      icon: '🎭',
      available: true
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Ethereum wallet for Web3 authentication',
      icon: '🦊',
      available: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      downloadUrl: 'https://metamask.io'
    }
  ];

  const handleWalletSelect = async (wallet) => {
    if (!wallet.available) {
      if (wallet.downloadUrl) {
        window.open(wallet.downloadUrl, '_blank');
      }
      return;
    }

    setIsLoading(true);
    setSelectedWallet(wallet.id);
    setError(null);

    try {
      await onSelectWallet(wallet.id);
      onClose();
    } catch (error) {
      console.error(`Error connecting to ${wallet.name}:`, error);
      setError(`Failed to connect to ${wallet.name}: ${error.message}`);
    } finally {
      setIsLoading(false);
      setSelectedWallet(null);
    }
  };

  const closeModal = () => {
    if (!isLoading) {
      setError(null);
      setSelectedWallet(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Login</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet)}
              disabled={isLoading}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left relative ${
                wallet.available
                  ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
              } ${
                selectedWallet === wallet.id
                  ? 'border-blue-500 bg-blue-50'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{wallet.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                    {!wallet.available && (
                      <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">
                        Install Required
                      </span>
                    )}
                    {selectedWallet === wallet.id && isLoading && (
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{wallet.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Choose your preferred authentication method to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
