// Karbyn Backend Integration Service
// This service provides a clean interface between your React frontend and the IC backend

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Generate Candid declarations:
 *    Run `dfx generate` in your project root to generate type declarations
 * 
 * 2. Replace the temporary backend reference below with:
 *    import { karbyn_backend } from '../declarations/karbyn_backend';
 * 
 * 3. Import proper types:
 *    import type { 
 *      User, 
 *      UserRole, 
 *      RegisterUserInput, 
 *      UpdateProfileInput 
 *    } from '../declarations/karbyn_backend/karbyn_backend.did';
 * 
 * 4. Remove the temporary type definitions and backend mock below
 */

import { useState, useCallback, useEffect } from 'react';

// Backend import - Update path as needed based on your project structure
// For now using placeholder, update when declarations are generated
declare global {
  interface Window {
    karbyn_backend: any;
  }
}

// Temporary backend reference - replace with proper import
const karbyn_backend = (window as any).karbyn_backend || {
  register_user: async (input: any) => ({ Ok: {} }),
  get_current_user: async () => [],
  authenticate_user: async (deviceId: string) => [],
  update_profile: async (input: any) => ({ Ok: {} }),
  list_users_by_role: async (role: string) => [],
  get_user_stats: async () => [],
  get_all_users: async () => [],
  get_user: async (principalId: string) => [],
  update_user_stats: async (...args: any[]) => ({ Ok: {} })
};

// Temporary type definitions - replace with generated types
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

// Backend response types
export interface BackendResult<T> {
  Ok?: T;
  Err?: string;
}

// Type for user stats from backend
export type UserStatsResponse = [string, number][];

export class KarbynBackendService {
  
  /**
   * Register a new user in the system
   */
  static async registerUser(userData: UserRegistrationData): Promise<User> {
    try {
      const input: RegisterUserInput = {
        name: userData.name,
        role: userData.role,
        bio: userData.bio ? [userData.bio] : [],
        device_id: userData.deviceId ? [userData.deviceId] : []
      };

      const result: BackendResult<User> = await karbyn_backend.register_user(input);
      
      if (result.Ok) {
        return result.Ok;
      } else {
        throw new Error(result.Err || 'Registration failed');
      }
    } catch (error) {
      console.error('User registration failed:', error);
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const result: User[] = await karbyn_backend.get_current_user();
      return result.length > 0 ? result[0] : null;
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

      const result: User[] = await karbyn_backend.authenticate_user(deviceId);
      return result.length > 0 ? result[0] : null;
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

      const result: BackendResult<null> = await karbyn_backend.update_profile(input);
      
      if (result.Err) {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error(`Profile update failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: 'Individual' | 'Farmer' | 'NGO'): Promise<User[]> {
    try {
      const result: User[] = await karbyn_backend.list_users_by_role(role);
      return result;
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
      const stats: UserStatsResponse = await karbyn_backend.get_user_stats();
      
      return {
        individuals: Number(stats.find(([role]: [string, number]) => role === 'Individual')?.[1] || 0),
        farmers: Number(stats.find(([role]: [string, number]) => role === 'Farmer')?.[1] || 0),
        ngos: Number(stats.find(([role]: [string, number]) => role === 'NGO')?.[1] || 0),
        total: stats.reduce((sum: number, [, count]: [string, number]) => sum + Number(count), 0)
      };
    } catch (error) {
      console.error('Failed to get community stats:', error);
      return { individuals: 0, farmers: 0, ngos: 0, total: 0 };
    }
  }

  /**
   * Get all users (admin function)
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const result: User[] = await karbyn_backend.get_all_users();
      return result;
    } catch (error) {
      console.error('Failed to get all users:', error);
      return [];
    }
  }

  /**
   * Get user by principal ID
   */
  static async getUserById(principalId: string): Promise<User | null> {
    try {
      const result: User[] = await karbyn_backend.get_user(principalId);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      return null;
    }
  }

  /**
   * Internal function to update user stats (for other modules)
   * This will be used by activity and NFT modules
   */
  static async updateUserStats(
    principalId: string, 
    carbonOffsetDelta: number, 
    activityCountDelta: number, 
    nftCountDelta: number
  ): Promise<void> {
    try {
      const result: BackendResult<null> = await karbyn_backend.update_user_stats(
        principalId, 
        carbonOffsetDelta, 
        activityCountDelta, 
        nftCountDelta
      );
      
      if (result.Err) {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error('Failed to update user stats:', error);
      throw new Error(`Stats update failed: ${error instanceof Error ? error.message : String(error)}`);
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
