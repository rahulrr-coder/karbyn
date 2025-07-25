import React, { useState } from 'react';
import { useNFT } from '../../contexts/NFTContext';
import { useAuth } from '../../contexts/MultiWalletAuthContext';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const { marketplaceNFTs, loading, purchaseNFT } = useNFT();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filterOptions = [
    { value: 'all', label: 'All NFTs' },
    { value: 'micro-carbon', label: 'Micro-Carbon' },
    { value: 'project-carbon', label: 'Project Carbon' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'carbon-high', label: 'Highest Carbon Offset' }
  ];

  const filteredAndSortedNFTs = marketplaceNFTs
    .filter(nft => filter === 'all' || nft.type === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'carbon-high':
          return parseFloat(b.carbonOffset) - parseFloat(a.carbonOffset);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const handlePurchase = async (nftId) => {
    if (!isAuthenticated) {
      alert('Please login to purchase NFTs');
      return;
    }
    
    const result = await purchaseNFT(nftId);
    if (result.success) {
      alert('NFT purchased successfully!');
    } else {
      alert('Failed to purchase NFT: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Carbon Credit Marketplace</h1>
              <p className="text-muted-foreground mt-1">
                Discover and purchase verified carbon offset NFTs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-muted-foreground hover:text-foreground organic-transition flex items-center"
              >
                ← Back to Dashboard
              </Link>
              {isAuthenticated && (
                <Link
                  to="/marketplace/my-nfts"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 organic-transition flex items-center"
                >
                  My NFTs
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Banner */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-border organic-shadow-subtle">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{marketplaceNFTs.length}</div>
              <div className="text-muted-foreground">Available NFTs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {marketplaceNFTs.reduce((sum, nft) => sum + parseFloat(nft.carbonOffset), 0).toFixed(1)}
              </div>
              <div className="text-muted-foreground">Total Carbon Offset (kg)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">
                {marketplaceNFTs.filter(nft => nft.verified).length}
              </div>
              <div className="text-muted-foreground">Verified Projects</div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-card rounded-lg organic-shadow-subtle p-6 mb-6 border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Filter by Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredAndSortedNFTs.length} of {marketplaceNFTs.length} NFTs
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedNFTs.map((nft) => (
              <div key={nft.id} className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden hover:organic-shadow-moderate organic-transition">
                <div className="aspect-w-16 aspect-h-9 bg-muted">
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
                        ? 'bg-accent/10 text-accent' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {nft.type === 'micro-carbon' ? 'Micro-Carbon' : 'Project Carbon'}
                    </span>
                    {nft.verified && (
                      <span className="text-primary text-sm">✓ Verified</span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{nft.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{nft.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Carbon Offset:</span>
                      <span className="font-medium text-primary">{nft.carbonOffset}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">{new Date(nft.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{nft.price}</div>
                      <div className="text-xs text-muted-foreground">ICP</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/marketplace/nft/${nft.id}`}
                        className="px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted organic-transition text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handlePurchase(nft.id)}
                        disabled={!isAuthenticated}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed organic-transition text-sm"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedNFTs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No NFTs Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'No NFTs are currently available in the marketplace.'
                : `No ${filter} NFTs match your current filter.`
              }
            </p>
            <Link
              to="/submit-project"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Your Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
