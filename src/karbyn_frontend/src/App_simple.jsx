/**
 * Karbyn App - Simplified for Deployment
 * 
 * This is a simplified version that focuses on getting the app deployed
 * and connected to the backend without complex authentication
 */

import React, { useState, useEffect } from 'react';
import './styles/index.css';

// ==================== SIMPLE BACKEND SERVICE ====================

class SimpleKarbynService {
  static backend = null;

  static async initialize() {
    try {
      // Use the generated declarations
      const { karbyn_backend } = await import('../declarations/karbyn_backend');
      this.backend = karbyn_backend;
      console.log('Backend initialized successfully');
      return true;
    } catch (error) {
      console.error('Backend initialization failed:', error);
      return false;
    }
  }

  static async getCurrentUser() {
    try {
      if (!this.backend) await this.initialize();
      return await this.backend.get_current_user();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return [];
    }
  }

  static async registerUser(userData) {
    try {
      if (!this.backend) await this.initialize();
      return await this.backend.register_user(userData);
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  static async submitActivity(activityData) {
    try {
      if (!this.backend) await this.initialize();
      return await this.backend.submit_activity(activityData);
    } catch (error) {
      console.error('Failed to submit activity:', error);
      throw error;
    }
  }

  static async getTokenBalance() {
    try {
      if (!this.backend) await this.initialize();
      return await this.backend.get_token_balance();
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return { balance: 0n, total_earned: 0n };
    }
  }

  static async mintNFT() {
    try {
      if (!this.backend) await this.initialize();
      return await this.backend.mint_nft();
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  static async getMyNFTs() {
    try {
      if (!this.backend) await this.initialize();
      return await this.backend.get_my_nfts();
    } catch (error) {
      console.error('Failed to get NFTs:', error);
      return [];
    }
  }
}

// ==================== MAIN APP COMPONENT ====================

const App = () => {
  const [backendConnected, setBackendConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [activities, setActivities] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize backend connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        const connected = await SimpleKarbynService.initialize();
        setBackendConnected(connected);
        
        if (connected) {
          // Load initial data
          const [user, balance, userNFTs] = await Promise.all([
            SimpleKarbynService.getCurrentUser(),
            SimpleKarbynService.getTokenBalance(),
            SimpleKarbynService.getMyNFTs()
          ]);
          
          setCurrentUser(user.length > 0 ? user[0] : null);
          setTokenBalance(balance);
          setNfts(userNFTs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleRegisterUser = async (userData) => {
    try {
      setLoading(true);
      const result = await SimpleKarbynService.registerUser(userData);
      if (result.Ok) {
        setCurrentUser(result.Ok);
        setError(null);
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitActivity = async (activityData) => {
    try {
      setLoading(true);
      const result = await SimpleKarbynService.submitActivity(activityData);
      if (result.Ok) {
        setActivities(prev => [result.Ok, ...prev]);
        // Refresh token balance
        const balance = await SimpleKarbynService.getTokenBalance();
        setTokenBalance(balance);
        setError(null);
      } else {
        setError('Activity submission failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async () => {
    try {
      setLoading(true);
      const result = await SimpleKarbynService.mintNFT();
      if (result.Ok) {
        setNfts(prev => [result.Ok, ...prev]);
        // Refresh token balance
        const balance = await SimpleKarbynService.getTokenBalance();
        setTokenBalance(balance);
        setError(null);
      } else {
        setError('NFT minting failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Karbyn Backend...</p>
        </div>
      </div>
    );
  }

  if (!backendConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Backend Connection Failed</h1>
          <p className="text-gray-600 mb-4">
            Could not connect to the Karbyn backend canister.
          </p>
          <p className="text-sm text-gray-500">
            Make sure the canister is deployed and running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-white text-2xl font-bold">Karbyn Carbon Credit dApp</h1>
            {currentUser && (
              <div className="text-white">
                Welcome, {currentUser.name}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {!currentUser ? (
          <UserRegistrationForm onRegister={handleRegisterUser} />
        ) : (
          <div className="space-y-8">
            <UserDashboard 
              user={currentUser}
              tokenBalance={tokenBalance}
              nfts={nfts}
              onMintNFT={handleMintNFT}
            />
            <ActivityForm onSubmit={handleSubmitActivity} />
          </div>
        )}
      </main>
    </div>
  );
};

// ==================== USER REGISTRATION FORM ====================

const UserRegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Individual',
    bio: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Register for Karbyn</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role *
          </label>
          <select
            name="role"
            id="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="Individual">Individual</option>
            <option value="Farmer">Farmer</option>
            <option value="NGO">NGO</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="City, State or Country"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio (Optional)
          </label>
          <textarea
            name="bio"
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

// ==================== USER DASHBOARD ====================

const UserDashboard = ({ user, tokenBalance, nfts, onMintNFT }) => {
  const canMintNFT = tokenBalance && Number(tokenBalance.balance) >= 1000;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-500">Name:</span>
            <div className="text-sm text-gray-900">{user.name}</div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Role:</span>
            <div className="text-sm text-gray-900">{user.role}</div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Carbon Offset:</span>
            <div className="text-sm text-gray-900">{user.total_carbon_offset} kg CO₂</div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Activities:</span>
            <div className="text-sm text-gray-900">{user.total_activities}</div>
          </div>
        </div>
      </div>

      {/* Token Balance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">KCT Tokens</h3>
        {tokenBalance ? (
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-600">
              {Number(tokenBalance.balance)} KCT
            </div>
            <div className="text-sm text-gray-500">
              Total Earned: {Number(tokenBalance.total_earned)} KCT
            </div>
            {canMintNFT && (
              <button
                onClick={onMintNFT}
                className="mt-4 w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Mint NFT (1000 KCT)
              </button>
            )}
          </div>
        ) : (
          <div className="text-gray-500">Loading...</div>
        )}
      </div>

      {/* NFTs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My NFTs</h3>
        <div className="text-2xl font-bold text-purple-600">
          {nfts.length}
        </div>
        <div className="text-sm text-gray-500">Carbon Credit NFTs</div>
        {nfts.length > 0 && (
          <div className="mt-4 space-y-2">
            {nfts.slice(0, 3).map((nft, index) => (
              <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                NFT #{Number(nft.nft_id)} - {nft.offset_amount}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== ACTIVITY FORM ====================

const ActivityForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    activity_type: 'PlantTree',
    description: '',
    quantity: 1,
    location: '',
    proof_url: '',
    additional_notes: ''
  });

  const activityTypes = [
    { value: 'PlantTree', label: 'Plant Tree', reward: 22 },
    { value: 'RecycleWaste', label: 'Recycle Waste', reward: 5 },
    { value: 'UsePublicTransport', label: 'Use Public Transport', reward: 8 },
    { value: 'UseRenewableEnergy', label: 'Use Renewable Energy', reward: 15 },
    { value: 'ReduceConsumption', label: 'Reduce Consumption', reward: 10 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      activity_type: 'PlantTree',
      description: '',
      quantity: 1,
      location: '',
      proof_url: '',
      additional_notes: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  const selectedActivity = activityTypes.find(type => type.value === formData.activity_type);
  const estimatedReward = selectedActivity ? Math.round(formData.quantity * selectedActivity.reward) : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Submit Environmental Activity</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700">
            Activity Type
          </label>
          <select
            name="activity_type"
            id="activity_type"
            value={formData.activity_type}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.reward} KCT per unit)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Describe your environmental activity..."
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0.1"
            step="0.1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          {estimatedReward > 0 && (
            <p className="mt-1 text-sm text-green-600">
              Estimated reward: {estimatedReward} KCT
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="City, State or GPS coordinates"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit Activity
        </button>
      </form>
    </div>
  );
};

export default App;
