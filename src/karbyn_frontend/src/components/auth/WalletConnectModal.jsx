import React, { useState } from 'react';

const WalletConnectModal = ({ isOpen, onClose, onConnect, availableWallets = [], isConnecting: externalConnecting = false }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  
  const connecting = isConnecting || externalConnecting;

  const walletOptions = [
    {
      id: 'ii',
      name: 'Internet Identity',
      description: 'Secure, anonymous authentication by DFINITY',
      icon: '🔐',
      isRecommended: true,
      available: availableWallets.includes('ii')
    },
    {
      id: 'plug',
      name: 'Plug Wallet',
      description: 'Browser extension wallet for Internet Computer',
      icon: '🔌',
      isPopular: true,
      available: availableWallets.includes('plug'),
      installUrl: 'https://plugwallet.ooo/'
    },
    {
      id: 'stoic',
      name: 'Stoic Wallet',
      description: 'Mobile-friendly wallet for IC ecosystem',
      icon: '🏛️',
      isMobile: true,
      available: availableWallets.includes('stoic'),
      installUrl: 'https://www.stoicwallet.com/'
    }
  ];

  const handleWalletSelect = async (walletId) => {
    if (!availableWallets.includes(walletId)) return;
    
    setSelectedWallet(walletId);
    setIsConnecting(true);
    
    try {
      await onConnect(walletId);
      onClose();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Connect Your Wallet</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isConnecting}
            >
              ×
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            Choose your preferred wallet to access the Karbyn ecosystem
          </p>

          <div className="space-y-3">
            {walletOptions.map((wallet) => (
              <div
                key={wallet.id}
                className={`
                  relative border rounded-lg p-4 transition-all
                  ${wallet.available 
                    ? `cursor-pointer ${selectedWallet === wallet.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`
                    : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-75'
                  }
                  ${connecting && selectedWallet !== wallet.id ? 'opacity-50' : ''}
                `}
                onClick={() => {
                  if (!connecting) {
                    if (wallet.available) {
                      handleWalletSelect(wallet.id);
                    } else if (wallet.installUrl) {
                      window.open(wallet.installUrl, '_blank');
                    }
                  }
                }}
              >
                {wallet.isRecommended && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                )}
                
                {wallet.isPopular && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}

                {wallet.isMobile && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      Mobile Friendly
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="text-3xl mr-4">{wallet.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{wallet.name}</h3>
                    <p className="text-sm text-gray-600">{wallet.description}</p>
                  </div>
                  
                  {selectedWallet === wallet.id && connecting && (
                    <div className="ml-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  
                  {!wallet.available && (
                    <div className="ml-4">
                      <span className="text-blue-600 text-sm">Install</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 mr-2">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">New to Web3?</p>
                <p>
                  We recommend Internet Identity for the most secure and private experience. 
                  It doesn't require any downloads and protects your privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
