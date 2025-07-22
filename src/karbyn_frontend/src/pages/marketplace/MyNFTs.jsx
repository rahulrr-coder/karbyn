import React, { useState } from 'react';
import { useNFT } from '../../contexts/NFTContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MyNFTs = () => {
  const { userNFTs, loading, retireNFT, listNFTForSale } = useNFT();
  const { isAuthenticated } = useAuth();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPrice, setSellPrice] = useState('');

  const handleRetire = async () => {
    if (!selectedNFT) return;
    
    const result = await retireNFT(selectedNFT.id);
    if (result.success) {
      alert('NFT retired successfully! Your carbon offset has been permanently recorded.');
      setShowRetireModal(false);
      setSelectedNFT(null);
    } else {
      alert('Failed to retire NFT: ' + result.error);
    }
  };

  const handleListForSale = async () => {
    if (!selectedNFT || !sellPrice) return;
    
    const result = await listNFTForSale(selectedNFT.id, sellPrice);
    if (result.success) {
      alert('NFT listed for sale successfully!');
      setShowSellModal(false);
      setSelectedNFT(null);
      setSellPrice('');
    } else {
      alert('Failed to list NFT: ' + result.error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your NFTs</p>
          <Link
            to="/auth/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Carbon Credit NFTs</h1>
              <p className="text-muted-foreground mt-1">
                Manage your carbon offset collection
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/marketplace"
                className="text-muted-foreground hover:text-foreground organic-transition"
              >
                ← Back to Marketplace
              </Link>
              <Link
                to="/activities/submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 organic-transition"
              >
                Log Activity
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total NFTs</p>
                <p className="text-2xl font-bold text-foreground">{userNFTs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-3 bg-accent/10 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Carbon Offset</p>
                <p className="text-2xl font-bold text-foreground">
                  {userNFTs.reduce((sum, nft) => sum + parseFloat(nft.carbonOffset), 0).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {userNFTs.reduce((sum, nft) => sum + parseFloat(nft.price), 0).toFixed(1)} ICP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : userNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      nft.type === 'micro-carbon' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {nft.type === 'micro-carbon' ? 'Micro-Carbon' : 'Project Carbon'}
                    </span>
                    {nft.verified && (
                      <span className="text-green-600 text-sm">✓ Verified</span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{nft.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{nft.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Carbon Offset:</span>
                      <span className="font-medium text-green-600">{nft.carbonOffset}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Acquired:</span>
                      <span className="text-gray-900">{new Date(nft.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedNFT(nft);
                        setShowSellModal(true);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      List for Sale
                    </button>
                    <button
                      onClick={() => {
                        setSelectedNFT(nft);
                        setShowRetireModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Retire NFT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No NFTs Yet</h3>
            <p className="text-gray-600 mb-6">
              Start logging your eco-activities or purchase NFTs from the marketplace to build your collection.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/activities/submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Log Activity
              </Link>
              <Link
                to="/marketplace"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Retire Modal */}
      {showRetireModal && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Retire Carbon Credit NFT</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to retire "{selectedNFT.title}"? This action is permanent and will 
              burn the NFT while recording your carbon offset contribution on-chain.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-800">
                <strong>Carbon Offset:</strong> {selectedNFT.carbonOffset}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowRetireModal(false);
                  setSelectedNFT(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRetire}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Retire NFT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">List NFT for Sale</h3>
            <p className="text-gray-600 mb-4">
              Set a price for "{selectedNFT.title}" to list it on the marketplace.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (ICP)
              </label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                step="0.1"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter price in ICP"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowSellModal(false);
                  setSelectedNFT(null);
                  setSellPrice('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleListForSale}
                disabled={!sellPrice}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                List for Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFTs;
