import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { karbyn_backend } from '../../../declarations/karbyn_backend';

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const { isAuthenticated, principal, backend } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalCarbonOffset: 0,
    totalNFTsGenerated: 0,
    weeklyStreak: 0
  });

  // Activity types configuration
  const activityTypes = {
    transport: {
      'public_transit': { name: 'Public Transit', carbonPerKm: 0.04, icon: '🚌' },
      'cycling': { name: 'Cycling', carbonPerKm: 0, icon: '🚴' },
      'walking': { name: 'Walking', carbonPerKm: 0, icon: '🚶' },
      'carpooling': { name: 'Carpooling', carbonPerKm: 0.02, icon: '🚗' }
    },
    recycling: {
      'plastic_bottles': { name: 'Plastic Bottles', carbonPerItem: 0.05, icon: '♻️' },
      'aluminum_cans': { name: 'Aluminum Cans', carbonPerItem: 0.08, icon: '🥤' },
      'paper': { name: 'Paper', carbonPerItem: 0.02, icon: '📄' },
      'glass': { name: 'Glass', carbonPerItem: 0.03, icon: '🍶' }
    },
    energy: {
      'led_bulbs': { name: 'LED Bulb Usage', carbonPerHour: 0.01, icon: '💡' },
      'unplugged_devices': { name: 'Unplugged Devices', carbonSaved: 0.5, icon: '🔌' },
      'renewable_energy': { name: 'Renewable Energy Use', carbonPerKwh: -0.5, icon: '🌞' }
    },
    consumption: {
      'reusable_bag': { name: 'Reusable Bag', carbonSaved: 0.1, icon: '🛍️' },
      'water_bottle': { name: 'Reusable Water Bottle', carbonSaved: 0.2, icon: '🍶' },
      'local_food': { name: 'Local Food Purchase', carbonSaved: 1.0, icon: '🥬' }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUserActivities();
      calculateStats();
    }
  }, [isAuthenticated]);

  const loadUserActivities = async () => {
    setLoading(true);
    try {
      if (backend && principal) {
        // Try to get activities from backend (for now, use mock data as backend may not have this function yet)
        try {
          // const userActivities = await backend.get_user_activities();
          // For now, use mock data but structure it to match what we expect from backend
          const mockActivities = [
            {
              id: '1',
              type: 'transport',
              subtype: 'public_transit',
              description: 'Bus ride from downtown to university',
              distance: 5.2,
              carbonOffset: 2.1,
              date: '2024-01-15T08:30:00Z',
              verified: true,
              nftGenerated: true,
              location: 'Downtown → University'
            },
            {
              id: '2',
              type: 'recycling',
              subtype: 'plastic_bottles',
              description: '15 plastic bottles recycled',
              quantity: 15,
              carbonOffset: 0.75,
              date: '2024-01-14T14:20:00Z',
              verified: true,
              nftGenerated: false,
              location: 'Home'
            }
          ];
          setActivities(mockActivities);
        } catch (backendError) {
          console.log('Backend activity functions not yet implemented, using mock data');
          setActivities([]);
        }
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalActivities = activities.length;
    const totalCarbonOffset = activities.reduce((sum, activity) => sum + activity.carbonOffset, 0);
    const totalNFTsGenerated = activities.filter(activity => activity.nftGenerated).length;
    
    // Calculate weekly streak (simplified)
    const weeklyStreak = Math.floor(totalActivities / 7);
    
    setStats({
      totalActivities,
      totalCarbonOffset: Math.round(totalCarbonOffset * 100) / 100,
      totalNFTsGenerated,
      weeklyStreak
    });
  };

  const submitActivity = async (activityData) => {
    try {
      setLoading(true);
      
      // Calculate carbon offset based on activity type
      const carbonOffset = calculateCarbonOffset(activityData);
      
      const newActivity = {
        id: Date.now().toString(),
        ...activityData,
        carbonOffset,
        date: new Date().toISOString(),
        verified: false,
        nftGenerated: false
      };
      
      // TODO: Replace with actual canister call
      // await activityCanister.submitActivity(newActivity);
      
      setActivities(prev => [newActivity, ...prev]);
      
      // Trigger verification process
      setTimeout(() => {
        verifyActivity(newActivity.id);
      }, 2000);
      
      return { success: true, activity: newActivity };
    } catch (error) {
      console.error('Error submitting activity:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const calculateCarbonOffset = (activityData) => {
    const { type, subtype, distance, quantity, duration } = activityData;
    const activityConfig = activityTypes[type]?.[subtype];
    
    if (!activityConfig) return 0;
    
    if (activityConfig.carbonPerKm && distance) {
      return distance * activityConfig.carbonPerKm;
    } else if (activityConfig.carbonPerItem && quantity) {
      return quantity * activityConfig.carbonPerItem;
    } else if (activityConfig.carbonPerHour && duration) {
      return duration * activityConfig.carbonPerHour;
    } else if (activityConfig.carbonSaved) {
      return activityConfig.carbonSaved;
    }
    
    return 0;
  };

  const verifyActivity = async (activityId) => {
    try {
      // TODO: Replace with actual AI verification canister call
      // const verificationResult = await aiVerifierCanister.verifyActivity(activityId);
      
      // Mock verification - always approve for demo
      const verificationResult = { verified: true, shouldGenerateNFT: true };
      
      setActivities(prev => prev.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            verified: verificationResult.verified,
            nftGenerated: verificationResult.shouldGenerateNFT
          };
        }
        return activity;
      }));
      
      if (verificationResult.shouldGenerateNFT) {
        // Trigger NFT generation
        generateMicroCarbonNFT(activityId);
      }
      
    } catch (error) {
      console.error('Error verifying activity:', error);
    }
  };

  const generateMicroCarbonNFT = async (activityId) => {
    try {
      // TODO: Replace with actual NFT canister call
      // await nftCanister.generateMicroCarbonNFT(activityId);
      // Generated Micro-Carbon NFT for activity
    } catch (error) {
      console.error('Error generating NFT:', error);
    }
  };

  const value = {
    activities,
    stats,
    loading,
    activityTypes,
    submitActivity,
    loadUserActivities,
    calculateStats
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
