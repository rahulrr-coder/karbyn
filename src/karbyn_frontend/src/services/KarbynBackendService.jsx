// Karbyn Backend Service - Real Canister Integration for JSX
import { createActor } from '../../../declarations/karbyn_backend';

export const KarbynBackendService = {
  
  // Set actor (called by auth context)
  setActor: (actor) => {
    KarbynBackendService._actor = actor;
  },

  // Get the current actor (this should come from auth context)
  getActor: () => {
    if (KarbynBackendService._actor) {
      return KarbynBackendService._actor;
    }
    const canisterId = import.meta.env.VITE_CANISTER_ID_KARBYN_BACKEND || 'umunu-kh777-77774-qaaca-cai';
    return createActor(canisterId);
  },

  // Activity types for form
  getActivityTypes: async () => {
    try {
      const actor = KarbynBackendService.getActor();
      console.log('Getting activity types with actor:', actor);
      const types = await actor.get_activity_types();
      console.log('Got activity types:', types);
      
      // Convert to format expected by frontend
      return types.map(([key, details]) => [key, {
        name: details.name,
        category: details.category,
        unit: details.unit,
        carbon_factor: details.carbon_factor
      }]);
    } catch (error) {
      console.error('Error getting activity types:', error);
      console.log('Falling back to mock data due to error');
      // Fallback to mock data
      return [
        ['tree_planting', { name: 'Tree Planting', category: 'Forestry', unit: 'trees' }],
        ['renewable_energy', { name: 'Renewable Energy', category: 'Energy', unit: 'kwh' }],
        ['recycling', { name: 'Recycling', category: 'Waste', unit: 'kg' }],
        ['composting', { name: 'Composting', category: 'Waste', unit: 'kg' }],
        ['bike_commute', { name: 'Bike Commuting', category: 'Transport', unit: 'km' }],
        ['public_transport', { name: 'Public Transport', category: 'Transport', unit: 'km' }]
      ];
    }
  },

  // Submit activity
  submitActivity: async (activityData) => {
    try {
      const actor = KarbynBackendService.getActor();
      const result = await actor.submit_activity({
        activity_type: activityData.activity_type,
        description: activityData.description,
        location: activityData.location,
        quantity: activityData.quantity,
        proof_url: activityData.proof_url || "",
        additional_notes: activityData.additional_notes || ""
      });

      if (result.Ok) {
        return {
          id: result.Ok.id.toString(),
          ...result.Ok,
          created_at: new Date(Number(result.Ok.created_at) / 1000000),
        };
      } else {
        throw new Error(result.Err || 'Failed to submit activity');
      }
    } catch (error) {
      console.error('Error submitting activity:', error);
      // Fallback to mock for development
      const activity = {
        id: Date.now().toString(),
        ...activityData,
        created_at: new Date(),
        verification_status: { Pending: null },
        carbon_impact: Math.random() * 10,
        tokens_earned: Math.floor(Math.random() * 100)
      };
      return activity;
    }
  },

  // Get user activities
  getUserActivities: async () => {
    try {
      const actor = KarbynBackendService.getActor();
      const activities = await actor.get_user_activities();
      
      return activities.map(activity => ({
        id: activity.id.toString(),
        activity_type: activity.activity_type,
        description: activity.description,
        quantity: Number(activity.quantity),
        carbon_impact: Number(activity.carbon_impact),
        tokens_earned: Number(activity.tokens_earned),
        verification_status: activity.verification_status,
        created_at: new Date(Number(activity.created_at) / 1000000),
        location: activity.location || '',
        proof_url: activity.proof_url || ''
      }));
    } catch (error) {
      console.error('Error getting user activities:', error);
      // Fallback to mock activities
      return [
        {
          id: '1',
          activity_type: 'tree_planting',
          description: 'Planted trees in local park',
          quantity: 5,
          carbon_impact: 8.5,
          tokens_earned: 85,
          verification_status: { Verified: null },
          created_at: new Date(Date.now() - 86400000)
        },
        {
          id: '2',
          activity_type: 'recycling',
          description: 'Recycled plastic bottles',
          quantity: 2,
          carbon_impact: 3.2,
          tokens_earned: 32,
          verification_status: { Pending: null },
          created_at: new Date(Date.now() - 172800000)
        }
      ];
    }
  },

  // Get user stats
  getUserStats: async () => {
    try {
      const actor = KarbynBackendService.getActor();
      const stats = await actor.get_user_activity_stats();
      
      return {
        total_activities: Number(stats.total_activities),
        total_carbon_impact: Number(stats.total_carbon_impact),
        total_tokens_earned: Number(stats.total_tokens_earned),
        verified_activities: Number(stats.verified_activities),
        pending_activities: Number(stats.pending_activities)
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Fallback to mock stats
      return {
        total_activities: 15,
        total_carbon_impact: 156.7,
        total_tokens_earned: 1567,
        verified_activities: 12,
        pending_activities: 3
      };
    }
  },

  // Utility functions
  formatActivityType: (activityType) => {
    const typeMap = {
      tree_planting: 'Tree Planting',
      renewable_energy: 'Renewable Energy',
      recycling: 'Recycling',
      composting: 'Composting',
      bike_commute: 'Bike Commuting',
      public_transport: 'Public Transport'
    };
    return typeMap[activityType] || activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  formatVerificationStatus: (status) => {
    if (status.Verified !== undefined) return 'Verified';
    if (status.Pending !== undefined) return 'Pending';
    if (status.Rejected !== undefined) return 'Rejected';
    return 'Unknown';
  }
};
