/**
 * Karbyn NFT Marketplace Components - Complete Phase 3 Integration
 * 
 * This file provides comprehensive NFT marketplace functionality including:
 * - NFT collection display
 * - Marketplace listings
 * - Buy/Sell functionality
 * - Transaction history
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  KarbynBackendService, 
  CarbonNFT, 
  MarketplaceListing, 
  NFTTransaction,
  MarketplaceStats,
  ListNFTInput,
  BuyNFTInput,
  MarketplaceFilter
} from '../services/KarbynBackendServiceComplete';

// ==================== NFT CARD COMPONENT ====================

interface NFTCardProps {
  nft: CarbonNFT;
  onList?: (nft: CarbonNFT) => void;
  showActions?: boolean;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onList, showActions = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* NFT Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">Carbon Credit NFT</h3>
            <p className="text-green-100">#{nft.nft_id.toString()}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{nft.offset_amount}</div>
            <div className="text-sm text-green-100">CO₂ Offset</div>
          </div>
        </div>
      </div>

      {/* NFT Content */}
      <div className="p-4">
        {/* Activity Summary */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Environmental Impact</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Total Activities:</span>
                <span className="font-medium ml-1">{nft.activity_summary.total_activities}</span>
              </div>
              <div>
                <span className="text-gray-500">CO₂ Offset:</span>
                <span className="font-medium ml-1">{nft.activity_summary.total_carbon_offset} kg</span>
              </div>
            </div>
            
            {/* Activity Breakdown */}
            {nft.activity_summary.activity_breakdown.length > 0 && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-gray-700 mb-1">Activity Breakdown:</h5>
                <div className="space-y-1">
                  {nft.activity_summary.activity_breakdown.map(([type, count, offset], index) => (
                    <div key={index} className="flex justify-between text-xs text-gray-600">
                      <span>{KarbynBackendService.formatActivityType(type)}: {count}x</span>
                      <span>{offset} kg CO₂</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Activities */}
            {nft.activity_summary.top_activities.length > 0 && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-gray-700 mb-1">Top Activities:</h5>
                <div className="flex flex-wrap gap-1">
                  {nft.activity_summary.top_activities.slice(0, 3).map((activity, index) => (
                    <span key={index} className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      {activity.length > 20 ? `${activity.substring(0, 20)}...` : activity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="text-sm text-gray-500 mb-4">
          <div>Minted: {new Date(Number(nft.minted_at) / 1000000).toLocaleDateString()}</div>
          <div>Verification Period: {nft.activity_summary.verification_period}</div>
          {nft.is_listed && (
            <div className="text-blue-600 font-medium">Listed on Marketplace</div>
          )}
        </div>

        {/* Actions */}
        {showActions && onList && (
          <div className="flex gap-2">
            <button
              onClick={() => onList(nft)}
              disabled={nft.is_listed}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {nft.is_listed ? 'Already Listed' : 'List for Sale'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== MY NFTS COMPONENT ====================

export const MyNFTs: React.FC = () => {
  const { isUserRegistered } = useAuth();
  const [nfts, setNfts] = useState<CarbonNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<CarbonNFT | null>(null);

  const loadNFTs = useCallback(async () => {
    if (!isUserRegistered()) return;

    try {
      setLoading(true);
      setError(null);
      const userNFTs = await KarbynBackendService.getMyNFTs();
      setNfts(userNFTs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  }, [isUserRegistered]);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  const handleListNFT = (nft: CarbonNFT) => {
    setSelectedNFT(nft);
    setShowListModal(true);
  };

  if (!isUserRegistered()) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center">Please register to view your NFTs.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">My Carbon Credit NFTs</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <p className="text-gray-500">No NFTs owned yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Submit environmental activities to earn 1000 KCT and mint your first Carbon Credit NFT!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.nft_id.toString()}
              nft={nft}
              onList={handleListNFT}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* List NFT Modal */}
      {showListModal && selectedNFT && (
        <ListNFTModal
          nft={selectedNFT}
          onClose={() => {
            setShowListModal(false);
            setSelectedNFT(null);
          }}
          onSuccess={() => {
            setShowListModal(false);
            setSelectedNFT(null);
            loadNFTs(); // Refresh NFTs
          }}
        />
      )}
    </div>
  );
};

// ==================== LIST NFT MODAL ====================

interface ListNFTModalProps {
  nft: CarbonNFT;
  onClose: () => void;
  onSuccess: () => void;
}

const ListNFTModal: React.FC<ListNFTModalProps> = ({ nft, onClose, onSuccess }) => {
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || parseFloat(price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const listingData: ListNFTInput = {
        nft_id: nft.nft_id,
        price: BigInt(Math.round(parseFloat(price) * 1000)), // Convert to KCT micro-units
        description: description || undefined,
        expires_at: expiresInDays ? 
          BigInt(Date.now() * 1000000 + parseInt(expiresInDays) * 24 * 60 * 60 * 1000 * 1000000) : 
          undefined
      };

      await KarbynBackendService.listNFT(listingData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            List NFT #{nft.nft_id.toString()} for Sale
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (KCT) *
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0.001"
                step="0.001"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter price in KCT"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a description for your listing..."
              />
            </div>

            <div>
              <label htmlFor="expires" className="block text-sm font-medium text-gray-700">
                Expires in (days)
              </label>
              <select
                id="expires"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Never</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Listing...' : 'List NFT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==================== MARKETPLACE LISTINGS COMPONENT ====================

export const MarketplaceListings: React.FC = () => {
  const { isUserRegistered } = useAuth();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [nfts, setNfts] = useState<{ [key: string]: CarbonNFT }>({});
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MarketplaceFilter>({});
  const [buying, setBuying] = useState<string | null>(null);

  const loadMarketplace = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [marketplaceListings, marketplaceStats] = await Promise.all([
        KarbynBackendService.getMarketplaceListings(filter),
        KarbynBackendService.getMarketplaceStats()
      ]);
      
      setListings(marketplaceListings);
      setStats(marketplaceStats);

      // Load NFT details for each listing
      const nftPromises = marketplaceListings.map(listing => 
        KarbynBackendService.getNFT(listing.nft_id)
      );
      
      const nftResults = await Promise.all(nftPromises);
      const nftMap: { [key: string]: CarbonNFT } = {};
      
      nftResults.forEach((nft, index) => {
        if (nft) {
          nftMap[marketplaceListings[index].nft_id.toString()] = nft;
        }
      });
      
      setNfts(nftMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadMarketplace();
  }, [loadMarketplace]);

  const handleBuyNFT = async (listing: MarketplaceListing) => {
    if (!isUserRegistered()) {
      setError('Please register to buy NFTs');
      return;
    }

    try {
      setBuying(listing.listing_id.toString());
      setError(null);
      
      const buyData: BuyNFTInput = {
        listing_id: listing.listing_id
      };
      
      await KarbynBackendService.buyNFT(buyData);
      
      // Refresh marketplace
      await loadMarketplace();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to buy NFT');
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Marketplace Stats */}
      {stats && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Marketplace Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_listings}</div>
              <div className="text-sm text-gray-500">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total_sales}</div>
              <div className="text-sm text-gray-500">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {KarbynBackendService.formatKCT(stats.total_volume)}
              </div>
              <div className="text-sm text-gray-500">Volume Traded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.average_price} KCT</div>
              <div className="text-sm text-gray-500">Avg Price</div>
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available NFTs</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : listings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No NFTs listed for sale.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const nft = nfts[listing.nft_id.toString()];
              if (!nft) return null;

              return (
                <div key={listing.listing_id.toString()} className="border border-gray-200 rounded-lg overflow-hidden">
                  <NFTCard nft={nft} showActions={false} />
                  
                  {/* Listing Details */}
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {KarbynBackendService.formatKCT(listing.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Listed {new Date(Number(listing.listed_at) / 1000000).toLocaleDateString()}
                        </div>
                      </div>
                      {listing.expires_at && listing.expires_at > 0n ? (
                        <div className="text-xs text-gray-500">
                          Expires: {new Date(Number(listing.expires_at) / 1000000).toLocaleDateString()}
                        </div>
                      ) : null}
                    </div>

                    {listing.description && (
                      <p className="text-sm text-gray-600 mb-4">{listing.description}</p>
                    )}

                    <button
                      onClick={() => handleBuyNFT(listing)}
                      disabled={!isUserRegistered() || buying === listing.listing_id.toString()}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {buying === listing.listing_id.toString() ? (
                        'Buying...'
                      ) : (
                        `Buy for ${KarbynBackendService.formatKCT(listing.price)}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN MARKETPLACE COMPONENT ====================

export const NFTMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-nfts' | 'transactions'>('marketplace');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NFT Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Trade Carbon Credit NFTs representing verified environmental impact
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'marketplace', label: 'Marketplace' },
            { id: 'my-nfts', label: 'My NFTs' },
            { id: 'transactions', label: 'Transactions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'marketplace' && <MarketplaceListings />}
      {activeTab === 'my-nfts' && <MyNFTs />}
      {activeTab === 'transactions' && <TransactionHistory />}
    </div>
  );
};

// ==================== TRANSACTION HISTORY COMPONENT ====================

const TransactionHistory: React.FC = () => {
  const { isUserRegistered } = useAuth();
  const [transactions, setTransactions] = useState<NFTTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    if (!isUserRegistered()) return;

    try {
      setLoading(true);
      setError(null);
      const userTransactions = await KarbynBackendService.getMyTransactions();
      setTransactions(userTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [isUserRegistered]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  if (!isUserRegistered()) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center">Please register to view your transactions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Transaction History</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.transaction_id.toString()} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    NFT #{transaction.nft_id.toString()}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Type: {transaction.transaction_type}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(Number(transaction.transaction_at) / 1000000).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {KarbynBackendService.formatKCT(transaction.price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Transaction #{transaction.transaction_id.toString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTMarketplace;
