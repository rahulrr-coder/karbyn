import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/CleanAuthContext';

const EnhancedMarketplace = () => {
  const { isAuthenticated, principal } = useAuth();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('btc');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Mock NFT data with proper CO2e pricing
  const mockNFTs = [
    {
      id: 1,
      title: "Amazon Rainforest Conservation",
      description: "Verified reforestation project in Brazil",
      carbonOffset: 25.5, // tonnes CO2e
      pricePerTonne: 35, // $35 per tonne (High-Quality Verified)
      totalPrice: 892.50, // 25.5 * 35
      btcPrice: 0.000029, // mock BTC equivalent
      projectType: "Reforestation",
      verificationStatus: "Verified",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      location: "Acre State, Brazil",
      badge: "High-Quality Verified"
    },
    {
      id: 2,
      title: "Solar Farm Initiative Kenya",
      description: "Community solar energy project in rural Kenya",
      carbonOffset: 15.2,
      pricePerTonne: 28,
      totalPrice: 425.60,
      btcPrice: 0.000014,
      projectType: "Renewable Energy", 
      verificationStatus: "Verified",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
      location: "Nairobi, Kenya",
      badge: "High-Quality Verified"
    },
    {
      id: 3,
      title: "Coastal Mangrove Restoration",
      description: "Mangrove planting and coastal protection project",
      carbonOffset: 12.8,
      pricePerTonne: 18,
      totalPrice: 230.40,
      btcPrice: 0.0000076,
      projectType: "Blue Carbon",
      verificationStatus: "Verified", 
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop",
      location: "Philippines",
      badge: "Standard Nature-Based"
    },
    {
      id: 4,
      title: "Wind Energy Cooperative",
      description: "Community-owned wind turbines in rural Texas",
      carbonOffset: 45.0,
      pricePerTonne: 22,
      totalPrice: 990.00,
      btcPrice: 0.0000325,
      projectType: "Wind Energy",
      verificationStatus: "Verified",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop", 
      location: "Texas, USA",
      badge: "Standard Nature-Based"
    }
  ];

  const paymentMethods = [
    { id: 'btc', name: 'Bitcoin', icon: '₿', description: 'Pay with Bitcoin' },
    { id: 'stripe', name: 'Credit Card', icon: '💳', description: 'Via Stripe (Mock)' },
    { id: 'icp', name: 'ICP Tokens', icon: '🌐', description: 'Internet Computer tokens' },
    { id: 'usdc', name: 'USDC', icon: '💵', description: 'USD Coin' }
  ];

  const handlePurchase = (nft) => {
    if (!isAuthenticated) {
      alert('Please connect your wallet to purchase NFTs');
      return;
    }
    setSelectedNFT(nft);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    // Mock payment processing
    setTimeout(() => {
      alert(`Successfully purchased ${selectedNFT.title} for ${selectedNFT.totalPrice} USD via ${paymentMethods.find(p => p.id === selectedPayment).name}!`);
      setShowPaymentModal(false);
      setSelectedNFT(null);
    }, 1500);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4" style={{ color: '#1E392A' }}>
          Purchase Carbon Credit NFT
        </h3>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">{selectedNFT?.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{selectedNFT?.carbonOffset} tonnes CO₂e</p>
          <p className="text-lg font-bold" style={{ color: '#1E392A' }}>
            ${selectedNFT?.totalPrice} USD
          </p>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-3">Payment Method</h4>
          <div className="space-y-2">
            {paymentMethods.map((method) => (
              <label key={method.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="mr-3"
                />
                <span className="mr-2">{method.icon}</span>
                <div>
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                  {method.id === 'btc' && selectedNFT && (
                    <div className="text-sm font-mono">₿ {selectedNFT.btcPrice}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowPaymentModal(false)}
            className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentConfirm}
            className="flex-1 py-2 px-4 rounded-lg text-white font-medium"
            style={{ backgroundColor: '#1E392A' }}
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F4' }}>
      {/* Header */}
      <header className="border-b px-6 py-6" style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#EAEAEA'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#1E392A' }}>
                Carbon Credit Marketplace
              </h1>
              <p style={{ color: '#333333' }}>
                Purchase verified carbon offset NFTs from global projects
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              style={{ borderColor: '#EAEAEA', color: '#333333' }}
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#EAEAEA' }}>
              <div className="text-2xl font-bold" style={{ color: '#1E392A' }}>{mockNFTs.length}</div>
              <div className="text-sm" style={{ color: '#333333' }}>Available NFTs</div>
            </div>
            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#EAEAEA' }}>
              <div className="text-2xl font-bold" style={{ color: '#1E392A' }}>
                {mockNFTs.reduce((sum, nft) => sum + nft.carbonOffset, 0).toFixed(1)}
              </div>
              <div className="text-sm" style={{ color: '#333333' }}>Total CO₂e (tonnes)</div>
            </div>
            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#EAEAEA' }}>
              <div className="text-2xl font-bold" style={{ color: '#1E392A' }}>$10-$50</div>
              <div className="text-sm" style={{ color: '#333333' }}>Price per tonne</div>
            </div>
            <div className="bg-white rounded-lg p-4 border" style={{ borderColor: '#EAEAEA' }}>
              <div className="text-2xl font-bold" style={{ color: '#1E392A' }}>100%</div>
              <div className="text-sm" style={{ color: '#333333' }}>Verified Projects</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNFTs.map((nft) => (
            <div key={nft.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow" style={{ borderColor: '#EAEAEA' }}>
              <img 
                src={nft.image} 
                alt={nft.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {nft.badge}
                  </span>
                  <span className="text-xs" style={{ color: '#333333' }}>
                    {nft.location}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold mb-2" style={{ color: '#1E392A' }}>
                  {nft.title}
                </h3>
                
                <p className="text-sm mb-4" style={{ color: '#333333' }}>
                  {nft.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#333333' }}>Carbon Offset:</span>
                    <span className="font-medium">{nft.carbonOffset} tonnes CO₂e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: '#333333' }}>Price per tonne:</span>
                    <span className="font-medium">${nft.pricePerTonne}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2" style={{ borderColor: '#EAEAEA' }}>
                    <span className="font-medium">Total Price:</span>
                    <span className="text-lg font-bold" style={{ color: '#1E392A' }}>
                      ${nft.totalPrice}
                    </span>
                  </div>
                  <div className="text-right text-sm" style={{ color: '#333333' }}>
                    ₿ {nft.btcPrice} BTC
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(nft)}
                  className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200"
                  style={{ 
                    backgroundColor: '#1E392A',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5a40'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1E392A'}
                >
                  Purchase NFT
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Info */}
        <div className="mt-12 bg-white rounded-lg p-6 border" style={{ borderColor: '#EAEAEA' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#1E392A' }}>
            Carbon Credit Pricing Tiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold mb-2" style={{ color: '#1E392A' }}>
                Standard Nature-Based Credits
              </h4>
              <p className="text-2xl font-bold mb-2" style={{ color: '#1E392A' }}>$10-$25</p>
              <p className="text-sm" style={{ color: '#333333' }}>
                per tonne CO₂e - Basic verified projects with standard methodologies
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2" style={{ color: '#1E392A' }}>
                High-Quality Verified Projects
              </h4>
              <p className="text-2xl font-bold mb-2" style={{ color: '#1E392A' }}>$25-$50</p>
              <p className="text-sm" style={{ color: '#333333' }}>
                per tonne CO₂e - Premium projects with additional co-benefits and monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default EnhancedMarketplace;