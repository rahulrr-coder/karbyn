// Karbyn Backend Integration Template
// Copy this file and update the imports once you have generated the Candid types

import { useState, useCallback, useEffect } from 'react';

// TODO: Uncomment and update these imports after generating Candid types:
// import { karbyn_backend } from '../declarations/karbyn_backend';
// import type { 
//   User, 
//   UserRole, 
//   RegisterUserInput, 
//   UpdateProfileInput 
// } from '../declarations/karbyn_backend/karbyn_backend.did';

// Temporary type definitions - replace with generated types from .did file
export interface User {
  id: string; // Principal
  name: string;
  role: UserRole;
  bio?: string;
  registered_at: bigint;
  device_id?: string;
  total_carbon_offset: number;
  total_activities: number;
  nfts_earned: number;
  verification_status: string;
}

export interface UserRole {
  Individual?: null;
  Farmer?: null;
  NGO?: null;
}

export interface RegisterUserInput {
  name: string;
  role: string;
  bio: string[];
  device_id: string[];
}

export interface UpdateProfileInput {
  bio: string[];
  device_id: string[];
}

export interface UserRegistrationData {
  name: string;
  role: 'Individual' | 'Farmer' | 'NGO';
  bio?: string;
  deviceId?: string;
}

export interface UserProfileUpdate {
  bio?: string;
  deviceId?: string;
}

export interface CommunityStats {
  individuals: number;
  farmers: number;
  ngos: number;
  total: number;
}

export class KarbynBackendService {
  
  /**
   * Register a new user in the system
   * TODO: Uncomment karbyn_backend calls after setting up the imports
   */
  static async registerUser(userData: UserRegistrationData): Promise<User> {
    try {
      const input: RegisterUserInput = {
        name: userData.name,
        role: userData.role,
        bio: userData.bio ? [userData.bio] : [],
        device_id: userData.deviceId ? [userData.deviceId] : []
      };

      // TODO: Uncomment this line:
      // const result = await karbyn_backend.register_user(input);
      
      // Temporary mock response for development:
      const mockUser: User = {
        id: "mock-principal-id",
        name: userData.name,
        role: userData.role === 'Individual' ? { Individual: null } : 
              userData.role === 'Farmer' ? { Farmer: null } : { NGO: null },
        bio: userData.bio,
        registered_at: BigInt(Date.now()),
        device_id: userData.deviceId,
        total_carbon_offset: 0,
        total_activities: 0,
        nfts_earned: 0,
        verification_status: "Unverified"
      };
      
      return mockUser;
      
      /* TODO: Replace mock with actual backend call:
      if ('Ok' in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
      */
    } catch (error) {
      console.error('User registration failed:', error);
      throw new Error(`Registration failed: ${error}`);
    }
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      // TODO: Uncomment this line:
      // const result = await karbyn_backend.get_current_user();
      // return result.length > 0 ? result[0] : null;
      
      // Temporary mock response:
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Authenticate user by device ID (for biometric authentication)
   */
  static async authenticateByDevice(deviceId: string): Promise<User | null> {
    try {
      if (!deviceId.trim()) {
        throw new Error('Device ID cannot be empty');
      }

      // TODO: Uncomment this line:
      // const result = await karbyn_backend.authenticate_user(deviceId);
      // return result.length > 0 ? result[0] : null;
      
      // Temporary mock response:
      return null;
    } catch (error) {
      console.error('Device authentication failed:', error);
      return null;
    }
  }

  /**
   * Update user profile information
   */
  static async updateProfile(updates: UserProfileUpdate): Promise<void> {
    try {
      const input: UpdateProfileInput = {
        bio: updates.bio ? [updates.bio] : [],
        device_id: updates.deviceId ? [updates.deviceId] : []
      };

      // TODO: Uncomment these lines:
      // const result = await karbyn_backend.update_profile(input);
      // if ('Err' in result) {
      //   throw new Error(result.Err);
      // }
      
      console.log('Profile update (mock):', input);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error(`Profile update failed: ${error}`);
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: 'Individual' | 'Farmer' | 'NGO'): Promise<User[]> {
    try {
      // TODO: Uncomment this line:
      // return await karbyn_backend.list_users_by_role(role);
      
      // Temporary mock response:
      return [];
    } catch (error) {
      console.error(`Failed to get ${role} users:`, error);
      return [];
    }
  }

  /**
   * Get community statistics
   */
  static async getCommunityStats(): Promise<CommunityStats> {
    try {
      // TODO: Uncomment these lines:
      // const stats = await karbyn_backend.get_user_stats();
      // return {
      //   individuals: Number(stats.find(([role]: [string, number]) => role === 'Individual')?.[1] || 0),
      //   farmers: Number(stats.find(([role]: [string, number]) => role === 'Farmer')?.[1] || 0),
      //   ngos: Number(stats.find(([role]: [string, number]) => role === 'NGO')?.[1] || 0),
      //   total: stats.reduce((sum: number, [, count]: [string, number]) => sum + Number(count), 0)
      // };
      
      // Temporary mock response:
      return { individuals: 0, farmers: 0, ngos: 0, total: 0 };
    } catch (error) {
      console.error('Failed to get community stats:', error);
      return { individuals: 0, farmers: 0, ngos: 0, total: 0 };
    }
  }

  /**
   * Utility function to format user role for display
   */
  static formatUserRole(role: UserRole): string {
    if ('Individual' in role) return 'Individual';
    if ('Farmer' in role) return 'Farmer';
    if ('NGO' in role) return 'NGO';
    return 'Unknown';
  }

  /**
   * Utility function to format verification status
   */
  static getVerificationLevel(user: User): 'unverified' | 'partial' | 'verified' {
    switch (user.verification_status.toLowerCase()) {
      case 'verified': return 'verified';
      case 'partially verified': return 'partial';
      default: return 'unverified';
    }
  }

  /**
   * Utility function to check if user can perform certain actions
   */
  static canUserSubmitProjects(user: User): boolean {
    const role = this.formatUserRole(user.role);
    return role === 'Farmer' || role === 'NGO';
  }

  /**
   * Utility function to get user's carbon offset in different units
   */
  static getFormattedCarbonOffset(user: User) {
    const kgCO2 = user.total_carbon_offset;
    return {
      kg: kgCO2,
      tons: kgCO2 / 1000,
      treesEquivalent: Math.round(kgCO2 / 22), // Rough estimate: 1 tree absorbs ~22kg CO2/year
      carMilesAvoided: Math.round(kgCO2 * 2.3) // Rough estimate: 1kg CO2 = 2.3 miles
    };
  }
}

// React Hook for User Management
export const useKarbynUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await KarbynBackendService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (userData: UserRegistrationData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await KarbynBackendService.registerUser(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: UserProfileUpdate) => {
    try {
      setLoading(true);
      setError(null);
      await KarbynBackendService.updateProfile(updates);
      await loadUser(); // Reload user data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    loading,
    error,
    loadUser,
    registerUser,
    updateProfile,
    isRegistered: !!user,
    userRole: user ? KarbynBackendService.formatUserRole(user.role) : null,
    verificationLevel: user ? KarbynBackendService.getVerificationLevel(user) : 'unverified',
    canSubmitProjects: user ? KarbynBackendService.canUserSubmitProjects(user) : false,
    carbonOffsetFormatted: user ? KarbynBackendService.getFormattedCarbonOffset(user) : null
  };
};

export default KarbynBackendService;
