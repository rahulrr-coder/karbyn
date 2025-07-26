import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './SimpleAuthContext';
import { KarbynBackendService } from '../services/KarbynBackendService.jsx';

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const authContext = useAuth();
  const { isAuthenticated, getPrincipal, user, actor } = authContext || {};
  
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
      'walking': { name: 'Walking', carbonPerKm: 0.4, icon: '🚶' },
      'carpooling': { name: 'Carpooling', carbonPerKm: 0.02, icon: '🚗' }
    },
    recycling: {
      'plastic_bottles': { name: 'Plastic Bottles', carbonPerItem: 0.2, icon: '♻️' },
      'aluminum_cans': { name: 'Aluminum Cans', carbonPerItem: 0.08, icon: '🥤' },
      'paper': { name: 'Paper', carbonPerItem: 0.02, icon: '📄' },
      'glass': { name: 'Glass', carbonPerItem: 0.03, icon: '🍶' }
    },
    energy: {
      'led_bulbs': { name: 'LED Bulb Usage', carbonPerHour: 0.15, icon: '💡' },
      'unplugged_devices': { name: 'Unplugged Devices', carbonSaved: 0.5, icon: '🔌' },
      'renewable_energy': { name: 'Renewable Energy Use', carbonPerKwh: -0.5, icon: '🌞' }
    },
    consumption: {
      'reusable_bag': { name: 'Reusable Bag', carbonSaved: 0.1, icon: '🛍️' },
      'water_bottle': { name: 'Reusable Water Bottle', carbonSaved: 0.2, icon: '🍶' },
      'local_food': { name: 'Local Food Purchase', carbonSaved: 1.0, icon: '🥬' }
    }
  };

  // Provide demo data for local development when backend is not available
  const provideDemoData = () => {
    const demoActivities = [
      {
        id: 'demo-1',
        type: 'transport',
        subtype: 'walking',
        description: 'Walked to work instead of driving',
        location: 'Downtown',
        carbonOffset: 2.4,
        date: new Date(Date.now() - 86400000), // Yesterday
        verified: true,
        nftGenerated: false,
        proof: '',
        notes: 'Great weather for walking!',
        quantity: 6
      },
      {
        id: 'demo-2',
        type: 'energy',
        subtype: 'led_bulbs',
        description: 'Used LED lights for 8 hours',
        location: 'Home office',
        carbonOffset: 1.2,
        date: new Date(Date.now() - 172800000), // 2 days ago
        verified: true,
        nftGenerated: false,
        proof: '',
        notes: 'Energy efficient lighting',
        quantity: 8
      },
      {
        id: 'demo-3',
        type: 'recycling',
        subtype: 'plastic_bottles',
        description: 'Recycled plastic bottles',
        location: 'Local recycling center',
        carbonOffset: 0.8,
        date: new Date(Date.now() - 259200000), // 3 days ago
        verified: false,
        nftGenerated: false,
        proof: '',
        notes: '4 plastic bottles recycled',
        quantity: 4
      }
    ];

    setActivities(demoActivities);
    setStats({
      totalActivities: demoActivities.length,
      totalCarbonOffset: Math.round(demoActivities.reduce((sum, activity) => sum + activity.carbonOffset, 0) * 100) / 100,
      totalNFTsGenerated: 0,
      weeklyStreak: 3
    });

    console.log('Demo data loaded for local development');
  };

  // Load user activities
  const loadUserActivities = async () => {
    const userPrincipal = getPrincipal && getPrincipal();
    
    if (!isAuthenticated || !userPrincipal) {
      console.log('User not authenticated, loading demo data');
      provideDemoData();
      return;
    }

    try {
      setLoading(true);
      console.log('Loading activities for user:', userPrincipal);
      
      // Use actor from auth context or KarbynBackendService
      const backendActor = actor || await KarbynBackendService.getActor();
      if (!backendActor) {
        console.log('No backend actor available, using demo data');
        provideDemoData();
        return;
      }

      const result = await backendActor.get_user_activities();
      console.log('Backend activities result:', result);
      
      if (result && Array.isArray(result)) {
        const formattedActivities = result.map(activity => ({
          id: activity.id,
          type: activity.activity_type || 'transport',
          subtype: activity.subtype || 'walking',
          description: activity.description || '',
          location: activity.location || '',
          carbonOffset: parseFloat(activity.carbon_offset) || 0,
          date: new Date(Number(activity.timestamp) / 1000000), // Convert nanoseconds
          verified: activity.verified || false,
          nftGenerated: activity.nft_generated || false,
          proof: activity.proof || '',
          notes: activity.notes || '',
          quantity: activity.quantity || 1
        }));

        setActivities(formattedActivities);
        console.log('Activities loaded successfully:', formattedActivities.length);
      } else {
        console.log('No activities returned from backend');
        setActivities([]);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      
      // Check if it's a certificate verification error or other backend issue
      if (error.message && (error.message.includes('certificate') || error.message.includes('fetch'))) {
        console.log('Backend connection failed - using demo data for local development');
        provideDemoData();
      } else {
        // For other errors, still try to show user-friendly message
        console.error('Failed to load activities from backend');
        setActivities([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userPrincipal = getPrincipal && getPrincipal();
    if (isAuthenticated && userPrincipal) {
      loadUserActivities();
      calculateStats();
    } else {
      // Load demo data when not authenticated
      provideDemoData();
    }
  }, [isAuthenticated, getPrincipal]);

      // Load activities function with improved error handling
  const loadActivities = async () => {
    const userPrincipal = getPrincipal && getPrincipal();
    const backendActor = actor;
    
    if (!backendActor || !userPrincipal) {
      console.log('No backend actor or user principal available, loading demo data');
      provideDemoData();
      return;
    }

    try {
      setLoading(true);
      console.log('Loading activities for user:', userPrincipal);
      
      const result = await backendActor.get_user_activities();
      console.log('Backend activities result:', result);
      
      if (result && Array.isArray(result)) {
        const formattedActivities = result.map(activity => ({
          id: activity.id,
          type: activity.activity_type || 'transport',
          subtype: activity.subtype || 'walking',
          description: activity.description || '',
          location: activity.location || '',
          carbonOffset: parseFloat(activity.carbon_offset) || 0,
          date: new Date(Number(activity.timestamp) / 1000000), // Convert nanoseconds
          verified: activity.verified || false,
          nftGenerated: activity.nft_generated || false,
          proof: activity.proof || '',
          notes: activity.notes || '',
          quantity: activity.quantity || 1
        }));

        setActivities(formattedActivities);
        console.log('Activities loaded successfully:', formattedActivities.length);
      } else {
        console.log('No activities returned from backend');
        setActivities([]);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      
      // Check if it's a certificate verification error or other backend issue
      if (error.message && (error.message.includes('certificate') || error.message.includes('fetch'))) {
        console.log('Backend connection failed - using demo data for local development');
        provideDemoData();
      } else {
        // For other errors, still try to show user-friendly message
        console.error('Failed to load activities from backend');
        setActivities([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      // Get stats from backend
      const backendStats = await KarbynBackendService.getUserActivityStats();
      
      setStats({
        totalActivities: backendStats.total_activities || activities.length,
        totalCarbonOffset: backendStats.total_carbon_offset || activities.reduce((sum, activity) => sum + activity.carbonOffset, 0),
        totalNFTsGenerated: backendStats.nfts_generated || activities.filter(activity => activity.nftGenerated).length,
        weeklyStreak: backendStats.activity_streak_days || Math.floor(activities.length / 7)
      });
    } catch (error) {
      console.error('Error loading stats from backend:', error);
      
      // Provide user-friendly error handling
      if (error.message.includes('certificate') || error.message.includes('Signature verification')) {
        console.warn('Authentication/certificate issue when loading stats - using local calculation');
      }
      
      // Fallback to calculating from local activities
      const totalActivities = activities.length;
      const totalCarbonOffset = activities.reduce((sum, activity) => sum + (activity.carbonOffset || 0), 0);
      const totalNFTsGenerated = activities.filter(activity => activity.nftGenerated).length;
      const weeklyStreak = Math.floor(totalActivities / 7);
      
      setStats({
        totalActivities,
        totalCarbonOffset: Math.round(totalCarbonOffset * 100) / 100,
        totalNFTsGenerated,
        weeklyStreak
      });
    }
  };

  const submitActivity = async (activityData) => {
    const userPrincipal = getPrincipal && getPrincipal();
    
    if (!isAuthenticated || !userPrincipal) {
      console.error('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setLoading(true);
      console.log('Submitting activity with input:', activityData);
      console.log('User principal:', userPrincipal);
      
      // Calculate the actual quantity based on activity type
      let finalQuantity = 1; // Default quantity
      
      if (activityData.distance) {
        finalQuantity = parseFloat(activityData.distance);
      } else if (activityData.quantity) {
        finalQuantity = parseInt(activityData.quantity);
      } else if (activityData.duration) {
        finalQuantity = parseFloat(activityData.duration);
      }

      // Get actor from auth context or service
      const backendActor = actor || await KarbynBackendService.getActor();
      if (!backendActor) {
        console.error('No backend actor available');
        return { success: false, error: 'Backend not available' };
      }
      
      // Submit to backend canister
      const result = await backendActor.submit_activity({
        type: activityData.type,
        subtype: activityData.subtype,
        activity_type: activityData.type || activityData.subtype || 'general',
        description: activityData.description || '',
        location: activityData.location ? [activityData.location] : [],
        quantity: finalQuantity,
        distance: activityData.distance,
        duration: activityData.duration,
        proof_url: activityData.proof ? [activityData.proof] : [],
        additional_notes: activityData.notes ? [activityData.notes] : []
      });
      
      console.log('Activity submitted successfully:', result);
      
      // If result contains carbonOffset, add it to local activities and update stats
      if (result.success && result.carbonOffset !== undefined) {
        const newActivity = {
          id: result.id || Date.now().toString(),
          type: activityData.type,
          subtype: activityData.subtype,
          description: activityData.description,
          location: activityData.location,
          quantity: finalQuantity,
          carbonOffset: result.carbonOffset,
          timestamp: new Date().toISOString(),
          user_principal: userPrincipal,
          verified: true,
          nftGenerated: false,
          proof: activityData.proof || '',
          notes: activityData.notes || ''
        };
        
        // Add to local activities list and update stats immediately
        setActivities(prev => {
          const newActivities = [newActivity, ...prev];
          console.log('Updated activities list:', newActivities.length, 'total carbon offset:', newActivities.reduce((sum, act) => sum + (act.carbonOffset || 0), 0));
          
          // Update stats immediately with new activities list
          const totalActivities = newActivities.length;
          const totalCarbonOffset = newActivities.reduce((sum, activity) => sum + (activity.carbonOffset || 0), 0);
          const totalNFTsGenerated = newActivities.filter(activity => activity.nftGenerated).length;
          const weeklyStreak = Math.floor(totalActivities / 7);
          
          setStats({
            totalActivities,
            totalCarbonOffset: Math.round(totalCarbonOffset * 100) / 100,
            totalNFTsGenerated,
            weeklyStreak
          });
          
          console.log('Stats updated immediately:', {
            totalActivities,
            totalCarbonOffset: Math.round(totalCarbonOffset * 100) / 100,
            totalNFTsGenerated,
            weeklyStreak
          });
          
          return newActivities;
        });
        
        console.log('Activity added locally with carbon offset:', result.carbonOffset);
      }
      
      // Try to reload activities to get updated list from backend (but don't reset if it fails)
      try {
        const refreshResult = await backendActor.get_user_activities();
        if (refreshResult && Array.isArray(refreshResult) && refreshResult.length > 0) {
          console.log('Refreshed activities from backend:', refreshResult.length);
          // Only update if we got actual results from backend
          const formattedActivities = refreshResult.map(activity => ({
            id: activity.id,
            type: activity.activity_type || 'transport',
            subtype: activity.subtype || 'walking',
            description: activity.description || '',
            location: activity.location || '',
            carbonOffset: parseFloat(activity.carbon_offset) || 0,
            date: new Date(Number(activity.timestamp) / 1000000),
            verified: activity.verified || false,
            nftGenerated: activity.nft_generated || false,
            proof: activity.proof || '',
            notes: activity.notes || '',
            quantity: activity.quantity || 1
          }));
          setActivities(formattedActivities);
        }
      } catch (loadError) {
        console.log('Could not reload activities from backend, keeping local data');
      }
      
      return { success: true, activity: result, carbonOffset: result.carbonOffset };
    } catch (error) {
      console.error('Error submitting activity:', error);
      
      // Check for specific actor error
      if (error.message && error.message.includes('actor is not defined')) {
        console.error('Actor initialization issue - trying demo mode');
        return { success: false, error: 'Backend connection issue. Please try again.' };
      }
      
      return { success: false, error: error.message || 'Unknown error occurred' };
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

  // Load activities when user is authenticated
  useEffect(() => {
    const userPrincipal = getPrincipal && getPrincipal();
    if (isAuthenticated && userPrincipal) {
      loadUserActivities();
    } else {
      // Load demo data when not authenticated
      provideDemoData();
    }
  }, [isAuthenticated, getPrincipal]);

  // Calculate stats when activities change
  useEffect(() => {
    if (activities.length > 0 || isAuthenticated) {
      calculateStats();
    }
  }, [activities, isAuthenticated]);

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
