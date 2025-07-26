import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './SimpleAuthContext';

const NFTContext = createContext();

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
};

export const NFTProvider = ({ children }) => {
  const { isAuthenticated, principal, backend } = useAuth();
  const [userNFTs, setUserNFTs] = useState([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // Mock data for development - replace with actual canister calls
  const mockNFTs = [
    {
      id: '1',
      type: 'micro-carbon',
      title: 'Public Transit Ride',
      description: 'Bus ride from downtown to university - 5.2 km',
      carbonOffset: '2.1 kg CO2',
      price: '0.5 ICP',
      owner: 'user123',
      verified: true,
      date: '2024-01-15',
      image: '/api/placeholder/300/200',
      status: 'available'
    },
    {
      id: '2',
      type: 'project-carbon',
      title: 'Reforestation Project - Amazon',
      description: '100 hectares of rainforest restoration in Brazil',
      carbonOffset: '500 tons CO2',
      price: '25 ICP',
      owner: 'project456',
      verified: true,
      date: '2024-01-10',
      image: '/api/placeholder/300/200',
      status: 'available'
    },
    {
      id: '3',
      type: 'micro-carbon',
      title: 'Recycling Activity',
      description: '15 plastic bottles and 8 aluminum cans recycled',
      carbonOffset: '0.8 kg CO2',
      price: '0.2 ICP',
      owner: 'user789',
      verified: true,
      date: '2024-01-12',
      image: '/api/placeholder/300/200',
      status: 'available'
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadUserNFTs();
      loadMarketplaceNFTs();
    }
  }, [isAuthenticated]);

  const loadUserNFTs = async () => {
    setLoading(true);
    try {
      if (backend && principal) {
        try {
          // Try to get NFTs from backend (for now, use mock data as backend may not have this function yet)
          // const nfts = await backend.get_my_nfts();
          // For now, use mock data but structure it to match what we expect from backend
          const mockUserNFTs = mockNFTs.filter(nft => nft.owner === 'user123').slice(0, 3);
          setUserNFTs(mockUserNFTs);
        } catch (backendError) {
          console.log('Backend NFT functions not yet implemented, using mock data');
          setUserNFTs([]);
        }
      }
    } catch (error) {
      console.error('Error loading user NFTs:', error);
      setUserNFTs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketplaceNFTs = async () => {
    setLoading(true);
    try {
      if (backend) {
        try {
          // Try to get marketplace NFTs from backend
          // const marketplaceNFTs = await backend.get_marketplace_nfts();
          // For now, use mock data
          setMarketplaceNFTs(mockNFTs);
        } catch (backendError) {
          console.log('Backend marketplace functions not yet implemented, using mock data');
          setMarketplaceNFTs(mockNFTs);
        }
      }
    } catch (error) {
      console.error('Error loading marketplace NFTs:', error);
      setMarketplaceNFTs([]);
    } finally {
      setLoading(false);
    }
  };

  const purchaseNFT = async (nftId) => {
    try {
      setLoading(true);
      // TODO: Replace with actual canister call
      // await nftCanister.purchaseNFT(nftId);
      
      // Mock transaction
      const transaction = {
        id: Date.now().toString(),
        type: 'purchase',
        nftId,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [transaction, ...prev]);
      await loadUserNFTs();
      await loadMarketplaceNFTs();
      
      return { success: true };
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const retireNFT = async (nftId) => {
    try {
      setLoading(true);
      // TODO: Replace with actual canister call
      // await nftCanister.retireNFT(nftId);
      
      // Mock transaction
      const transaction = {
        id: Date.now().toString(),
        type: 'retirement',
        nftId,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [transaction, ...prev]);
      await loadUserNFTs();
      
      return { success: true };
    } catch (error) {
      console.error('Error retiring NFT:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const listNFTForSale = async (nftId, price) => {
    try {
      setLoading(true);
      // TODO: Replace with actual canister call
      // await nftCanister.listForSale(nftId, price);
      
      const transaction = {
        id: Date.now().toString(),
        type: 'listing',
        nftId,
        price,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setTransactions(prev => [transaction, ...prev]);
      await loadUserNFTs();
      await loadMarketplaceNFTs();
      
      return { success: true };
    } catch (error) {
      console.error('Error listing NFT:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userNFTs,
    marketplaceNFTs,
    transactions,
    loading,
    purchaseNFT,
    retireNFT,
    listNFTForSale,
    loadUserNFTs,
    loadMarketplaceNFTs,
  };

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  );
};
