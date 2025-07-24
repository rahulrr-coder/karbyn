/**
 * Complete Karbyn Backend Service - Phase 3 Integration
 * 
 * This service provides type-safe integration with the Karbyn IC backend
 * including User Management, Activity Tracking, Token System, NFT Minting, and Marketplace
 */

import { useState, useCallback, useEffect } from 'react';
import { Principal } from '@dfinity/principal';

// ==================== TYPE DEFINITIONS ====================

// === USER TYPES ===
export type UserRole = 'Individual' | 'Farmer' | 'NGO';

export interface User {
  id: Principal;
  name: string;
  role: UserRole;
  bio?: string;
  device_id?: string;
  location?: string;
  registered_at: bigint;
  last_activity?: bigint;
  biometric_enabled: boolean;
  total_carbon_offset: number;
  total_activities: number;
  nfts_earned: number;
  verification_status: string;
}

export interface PublicUserProfile {
  id: Principal;
  name: string;
  role: UserRole;
  location?: string;
  total_carbon_offset: number;
  total_activities: number;
  nfts_earned: number;
  verification_status: string;
  is_active: boolean;
}

export interface RegisterUserInput {
  name: string;
  role: string;
  bio?: string;
  device_id?: string;
  location?: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  device_id?: string;
  location?: string;
  biometric_enabled?: boolean;
}

export interface UserStats {
  total_users: number;
  individuals: number;
  farmers: number;
  ngos: number;
  active_users: number;
  verified_users: number;
  biometric_enabled_users: number;
}

// === ACTIVITY TYPES ===
export type ActivityType = 'PlantTree' | 'RecycleWaste' | 'UsePublicTransport' | 'UseRenewableEnergy' | 'ReduceConsumption';
export type ActivityVerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'UnderReview';

export interface Activity {
  id: bigint;
  user_principal: Principal;
  activity_type: ActivityType;
  description: string;
  location?: string;
  quantity: number;
  calculated_carbon_offset: number;
  proof_url?: string;
  additional_notes?: string;
  submitted_at: bigint;
  verified_at?: bigint;
  verification_status: ActivityVerificationStatus;
  nft_generated: boolean;
  verification_score: number;
}

export interface SubmitActivityInput {
  activity_type: string;
  description: string;
  location?: string;
  quantity: number;
  proof_url?: string;
  additional_notes?: string;
}

export interface ActivityHistoryItem {
  id: bigint;
  activity_type: ActivityType;
  description: string;
  location?: string;
  quantity: number;
  calculated_carbon_offset: number;
  submitted_at: bigint;
  verification_status: ActivityVerificationStatus;
  verification_score: number;
  nft_generated: boolean;
}

export interface UserActivityStats {
  total_activities: number;
  verified_activities: number;
  pending_activities: number;
  total_carbon_offset: number;
  activities_by_type: Array<[ActivityType, number]>;
  nfts_generated: number;
  average_verification_score: number;
  activity_streak_days: number;
}

// === TOKEN TYPES ===
export interface TokenBalance {
  principal: Principal;
  balance: bigint;
  total_earned: bigint;
  last_updated: bigint;
}

export interface UserPortfolio {
  principal: Principal;
  token_balance: bigint;
  total_tokens_earned: bigint;
  nfts_owned: bigint[];
  nfts_minted: number;
  marketplace_sales: number;
  marketplace_purchases: number;
  total_carbon_offset: number;
}

export interface LeaderboardEntry {
  principal: Principal;
  username: string;
  total_carbon_offset: number;
  total_tokens_earned: bigint;
  nfts_minted: number;
  rank: number;
}

// === NFT TYPES ===
export interface ActivitySummary {
  total_activities: number;
  activity_breakdown: Array<[ActivityType, number, number]>;
  total_carbon_offset: number;
  verification_period: string;
  top_activities: string[];
}

export interface CarbonNFT {
  nft_id: bigint;
  owner: Principal;
  offset_amount: string;
  activity_summary: ActivitySummary;
  minted_at: bigint;
  metadata_uri?: string;
  is_listed: boolean;
}

export interface MarketplaceListing {
  listing_id: bigint;
  nft_id: bigint;
  seller: Principal;
  price: bigint;
  description?: string;
  listed_at: bigint;
  expires_at?: bigint;
}

export interface NFTTransaction {
  transaction_id: bigint;
  nft_id: bigint;
  buyer: Principal;
  seller: Principal;
  price: bigint;
  transaction_at: bigint;
  transaction_type: string;
}

export interface ListNFTInput {
  nft_id: bigint;
  price: bigint;
  description?: string;
  expires_at?: bigint;
}

export interface BuyNFTInput {
  listing_id: bigint;
}

export interface MarketplaceFilter {
  min_price?: bigint;
  max_price?: bigint;
  seller?: Principal;
  activity_type?: ActivityType;
}

export interface MarketplaceStats {
  total_listings: number;
  total_sales: number;
  total_volume: bigint;
  average_price: number;
  unique_sellers: number;
  unique_buyers: number;
}

// === ERROR TYPES ===
export type UserError = 
  | { UserAlreadyExists: null }
  | { UserNotFound: null }
  | { InvalidRole: string }
  | { InvalidInput: string }
  | { Unauthorized: null }
  | { NameTooLong: null }
  | { BioTooLong: null }
  | { LocationTooLong: null };

export type ActivityError = 
  | { ActivityNotFound: null }
  | { UserNotFound: null }
  | { InvalidActivityType: string }
  | { InvalidQuantity: string }
  | { ValidationFailed: string }
  | { DuplicateActivity: null }
  | { InsufficientPermissions: null }
  | { CalculationError: string }
  | { LocationRequired: null }
  | { QuantityOutOfRange: [number, number, number] };

export type TokenError = 
  | { InsufficientBalance: [bigint, bigint] }
  | { InvalidAmount: string }
  | { TransferFailed: string }
  | { NotFound: string }
  | { Unauthorized: null }
  | { InvalidInput: string }
  | { MarketplaceError: string };

// === RESULT TYPES ===
export type Result<T, E> = { Ok: T } | { Err: E };

// ==================== BACKEND SERVICE ====================

/**
 * Complete Karbyn Backend Service
 * Provides all Phase 3 functionality including tokens, NFTs, and marketplace
 */
export class KarbynBackendService {
  private static backend: any = null;

  /**
   * Initialize the backend connection
   * Call this before using any other methods
   */
  static async initialize() {
    try {
      // TODO: Replace with actual import once dfx generate works properly
      // import { karbyn_backend } from '../declarations/karbyn_backend';
      // this.backend = karbyn_backend;
      
      // For development, create a mock backend with all necessary methods
      this.backend = this.createMockBackend();
      console.log('Backend initialized with mock service for development');
    } catch (error) {
      console.error('Failed to initialize backend:', error);
      throw error;
    }
  }

  /**
   * Create a mock backend for development and testing
   */
  private static createMockBackend() {
    return {
      // User Management
      register_user: async (input: RegisterUserInput) => ({ Ok: this.createMockUser(input) }),
      get_current_user: async () => [this.createMockUser({ name: 'Test User', role: 'Individual' })],
      get_user: async (principal: any) => [this.createMockUser({ name: 'Test User', role: 'Individual' })],
      get_public_user_profile: async (principal: any) => [this.createMockPublicProfile()],
      update_profile: async (input: UpdateProfileInput) => ({ Ok: null }),
      list_users_by_role: async (role: UserRole) => [this.createMockPublicProfile()],
      get_user_stats: async () => this.createMockUserStats(),

      // Activity Management
      submit_activity: async (input: SubmitActivityInput) => ({ Ok: this.createMockActivity(input) }),
      get_user_activities: async () => [this.createMockActivityHistory()],
      get_activity: async (id: bigint) => [this.createMockActivity({ activity_type: 'PlantTree', description: 'Test', quantity: 1 })],
      get_user_activity_stats: async () => this.createMockActivityStats(),
      get_recent_global_activities: async (limit: number) => [this.createMockActivityHistory()],
      get_activity_types: async () => [
        ['PlantTree', 22, 'Plant trees to offset carbon'],
        ['RecycleWaste', 5, 'Recycle waste materials'],
        ['UsePublicTransport', 8, 'Use public transportation'],
        ['UseRenewableEnergy', 15, 'Use renewable energy sources'],
        ['ReduceConsumption', 10, 'Reduce energy consumption']
      ],

      // Token Management
      get_token_balance: async () => this.createMockTokenBalance(),
      get_user_token_balance: async (principal: any) => this.createMockTokenBalance(),
      can_mint_nft: async () => true,
      get_user_portfolio: async () => this.createMockPortfolio(),
      get_leaderboard: async (limit: number) => [this.createMockLeaderboardEntry()],
      get_token_stats: async () => [1000000n, 500000n, 100, 50],

      // NFT Management
      mint_nft: async () => ({ Ok: this.createMockNFT() }),
      get_my_nfts: async () => [this.createMockNFT()],
      get_user_nfts: async (principal: any) => [this.createMockNFT()],
      get_nft: async (id: bigint) => [this.createMockNFT()],
      get_global_nft_stats: async () => [10, 5, 3, 2],

      // Marketplace
      list_nft: async (input: ListNFTInput) => ({ Ok: this.createMockListing(input) }),
      buy_nft: async (input: BuyNFTInput) => ({ Ok: this.createMockTransaction() }),
      cancel_listing: async (id: bigint) => ({ Ok: null }),
      get_marketplace_listings: async (filter?: any) => [this.createMockListing({ nft_id: 1n, price: 1000n })],
      get_my_listings: async () => [this.createMockListing({ nft_id: 1n, price: 1000n })],
      get_marketplace_stats: async () => this.createMockMarketplaceStats(),
      get_recent_transactions: async (limit: number) => [this.createMockTransaction()],
      get_my_transactions: async () => [this.createMockTransaction()]
    };
  }

  // Mock data creators
  private static createMockUser(input: Partial<RegisterUserInput>): User {
    return {
      id: { toString: () => 'mock-principal' } as any,
      name: input.name || 'Test User',
      role: (input.role as UserRole) || 'Individual',
      bio: input.bio,
      device_id: input.device_id,
      location: input.location,
      registered_at: BigInt(Date.now() * 1000000),
      last_activity: BigInt(Date.now() * 1000000),
      biometric_enabled: false,
      total_carbon_offset: 150.5,
      total_activities: 15,
      nfts_earned: 2,
      verification_status: 'Verified'
    };
  }

  private static createMockPublicProfile(): PublicUserProfile {
    return {
      id: { toString: () => 'mock-principal' } as any,
      name: 'Test User',
      role: 'Individual',
      location: 'Test City',
      total_carbon_offset: 150.5,
      total_activities: 15,
      nfts_earned: 2,
      verification_status: 'Verified',
      is_active: true
    };
  }

  private static createMockUserStats(): UserStats {
    return {
      total_users: 100,
      individuals: 70,
      farmers: 20,
      ngos: 10,
      active_users: 85,
      verified_users: 60,
      biometric_enabled_users: 30
    };
  }

  private static createMockActivity(input: Partial<SubmitActivityInput>): Activity {
    return {
      id: BigInt(Date.now()),
      user_principal: { toString: () => 'mock-principal' } as any,
      activity_type: (input.activity_type as ActivityType) || 'PlantTree',
      description: input.description || 'Mock activity',
      location: input.location,
      quantity: input.quantity || 1,
      calculated_carbon_offset: 22,
      proof_url: input.proof_url,
      additional_notes: input.additional_notes,
      submitted_at: BigInt(Date.now() * 1000000),
      verified_at: BigInt(Date.now() * 1000000),
      verification_status: 'Verified',
      nft_generated: false,
      verification_score: 95
    };
  }

  private static createMockActivityHistory(): ActivityHistoryItem {
    return {
      id: BigInt(Date.now()),
      activity_type: 'PlantTree',
      description: 'Planted 10 oak trees in local park',
      location: 'Central Park',
      quantity: 10,
      calculated_carbon_offset: 220,
      submitted_at: BigInt(Date.now() * 1000000),
      verification_status: 'Verified',
      verification_score: 95,
      nft_generated: false
    };
  }

  private static createMockActivityStats(): UserActivityStats {
    return {
      total_activities: 15,
      verified_activities: 12,
      pending_activities: 3,
      total_carbon_offset: 330,
      activities_by_type: [
        ['PlantTree', 8],
        ['RecycleWaste', 4],
        ['UsePublicTransport', 3]
      ],
      nfts_generated: 2,
      average_verification_score: 92,
      activity_streak_days: 7
    };
  }

  private static createMockTokenBalance(): TokenBalance {
    return {
      principal: { toString: () => 'mock-principal' } as any,
      balance: 1250n,
      total_earned: 2500n,
      last_updated: BigInt(Date.now() * 1000000)
    };
  }

  private static createMockPortfolio(): UserPortfolio {
    return {
      principal: { toString: () => 'mock-principal' } as any,
      token_balance: 1250n,
      total_tokens_earned: 2500n,
      nfts_owned: [1n, 2n],
      nfts_minted: 2,
      marketplace_sales: 1,
      marketplace_purchases: 0,
      total_carbon_offset: 1.25
    };
  }

  private static createMockLeaderboardEntry(): LeaderboardEntry {
    return {
      principal: { toString: () => 'mock-principal' } as any,
      username: 'Test User',
      total_carbon_offset: 150.5,
      total_tokens_earned: 2500n,
      nfts_minted: 2,
      rank: 1
    };
  }

  private static createMockNFT(): CarbonNFT {
    return {
      nft_id: BigInt(Date.now()),
      owner: { toString: () => 'mock-principal' } as any,
      offset_amount: '1.25 tons CO₂',
      activity_summary: {
        total_activities: 15,
        activity_breakdown: [
          ['PlantTree', 8, 176],
          ['RecycleWaste', 4, 20],
          ['UsePublicTransport', 3, 24]
        ],
        total_carbon_offset: 1250,
        verification_period: '2024-01-01 to 2024-03-31',
        top_activities: ['Planted 10 oak trees', 'Recycled 50kg plastic', 'Used metro daily']
      },
      minted_at: BigInt(Date.now() * 1000000),
      metadata_uri: '',
      is_listed: false
    };
  }

  private static createMockListing(input: Partial<ListNFTInput>): MarketplaceListing {
    return {
      listing_id: BigInt(Date.now()),
      nft_id: input.nft_id || 1n,
      seller: { toString: () => 'mock-principal' } as any,
      price: input.price || 1000n,
      description: input.description,
      listed_at: BigInt(Date.now() * 1000000),
      expires_at: input.expires_at
    };
  }

  private static createMockTransaction(): NFTTransaction {
    return {
      transaction_id: BigInt(Date.now()),
      nft_id: 1n,
      buyer: { toString: () => 'mock-buyer' } as any,
      seller: { toString: () => 'mock-seller' } as any,
      price: 1000n,
      transaction_at: BigInt(Date.now() * 1000000),
      transaction_type: 'Purchase'
    };
  }

  private static createMockMarketplaceStats(): MarketplaceStats {
    return {
      total_listings: 25,
      total_sales: 15,
      total_volume: 15000n,
      average_price: 1000,
      unique_sellers: 18,
      unique_buyers: 12
    };
  }

  // ==================== USER MANAGEMENT FUNCTIONS ====================

  /**
   * Register a new user in the system
   */
  static async registerUser(input: RegisterUserInput): Promise<User> {
    const result: Result<User, UserError> = await this.backend.register_user(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<User | null> {
    const result: User[] = await this.backend.get_current_user();
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get user by principal ID
   */
  static async getUser(principal: Principal): Promise<User | null> {
    const result: User[] = await this.backend.get_user(principal);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get public user profile
   */
  static async getPublicUserProfile(principal: Principal): Promise<PublicUserProfile | null> {
    const result: PublicUserProfile[] = await this.backend.get_public_user_profile(principal);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(input: UpdateProfileInput): Promise<void> {
    const result: Result<null, UserError> = await this.backend.update_profile(input);
    if ('Err' in result) {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: UserRole): Promise<PublicUserProfile[]> {
    return await this.backend.list_users_by_role(role);
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<UserStats> {
    return await this.backend.get_user_stats();
  }

  // ==================== ACTIVITY MANAGEMENT FUNCTIONS ====================

  /**
   * Submit a new environmental activity
   */
  static async submitActivity(input: SubmitActivityInput): Promise<Activity> {
    const result: Result<Activity, ActivityError> = await this.backend.submit_activity(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get user's activities
   */
  static async getUserActivities(): Promise<ActivityHistoryItem[]> {
    return await this.backend.get_user_activities();
  }

  /**
   * Get activity by ID
   */
  static async getActivity(activityId: bigint): Promise<Activity | null> {
    const result: Activity[] = await this.backend.get_activity(activityId);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get user activity statistics
   */
  static async getUserActivityStats(): Promise<UserActivityStats> {
    return await this.backend.get_user_activity_stats();
  }

  /**
   * Get recent global activities
   */
  static async getRecentGlobalActivities(limit: number): Promise<ActivityHistoryItem[]> {
    return await this.backend.get_recent_global_activities(limit);
  }

  /**
   * Get available activity types
   */
  static async getActivityTypes(): Promise<Array<[string, number, string]>> {
    return await this.backend.get_activity_types();
  }

  // ==================== TOKEN MANAGEMENT FUNCTIONS ====================

  /**
   * Get current user's token balance
   */
  static async getTokenBalance(): Promise<TokenBalance> {
    return await this.backend.get_token_balance();
  }

  /**
   * Get any user's token balance
   */
  static async getUserTokenBalance(principal: Principal): Promise<TokenBalance> {
    return await this.backend.get_user_token_balance(principal);
  }

  /**
   * Check if current user can mint an NFT
   */
  static async canMintNFT(): Promise<boolean> {
    return await this.backend.can_mint_nft();
  }

  /**
   * Get current user's complete portfolio
   */
  static async getUserPortfolio(): Promise<UserPortfolio> {
    return await this.backend.get_user_portfolio();
  }

  /**
   * Get leaderboard of top users
   */
  static async getLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
    return await this.backend.get_leaderboard(limit);
  }

  /**
   * Get global token statistics
   */
  static async getTokenStats(): Promise<[bigint, bigint, number, number]> {
    return await this.backend.get_token_stats();
  }

  // ==================== NFT MANAGEMENT FUNCTIONS ====================

  /**
   * Mint a new Carbon Credit NFT (requires 1000 KCT)
   */
  static async mintNFT(): Promise<CarbonNFT> {
    const result: Result<CarbonNFT, TokenError> = await this.backend.mint_nft();
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get current user's NFTs
   */
  static async getMyNFTs(): Promise<CarbonNFT[]> {
    return await this.backend.get_my_nfts();
  }

  /**
   * Get any user's NFTs
   */
  static async getUserNFTs(userPrincipal: Principal): Promise<CarbonNFT[]> {
    return await this.backend.get_user_nfts(userPrincipal);
  }

  /**
   * Get NFT by ID
   */
  static async getNFT(nftId: bigint): Promise<CarbonNFT | null> {
    const result: CarbonNFT[] = await this.backend.get_nft(nftId);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get global NFT statistics
   */
  static async getGlobalNFTStats(): Promise<[number, number, number, number]> {
    return await this.backend.get_global_nft_stats();
  }

  // ==================== MARKETPLACE FUNCTIONS ====================

  /**
   * List NFT for sale on marketplace
   */
  static async listNFT(input: ListNFTInput): Promise<MarketplaceListing> {
    const result: Result<MarketplaceListing, TokenError> = await this.backend.list_nft(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Buy NFT from marketplace
   */
  static async buyNFT(input: BuyNFTInput): Promise<NFTTransaction> {
    const result: Result<NFTTransaction, TokenError> = await this.backend.buy_nft(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Cancel NFT listing
   */
  static async cancelListing(listingId: bigint): Promise<void> {
    const result: Result<null, TokenError> = await this.backend.cancel_listing(listingId);
    if ('Err' in result) {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get marketplace listings with optional filters
   */
  static async getMarketplaceListings(filter?: MarketplaceFilter): Promise<MarketplaceListing[]> {
    return await this.backend.get_marketplace_listings(filter ? [filter] : []);
  }

  /**
   * Get current user's marketplace listings
   */
  static async getMyListings(): Promise<MarketplaceListing[]> {
    return await this.backend.get_my_listings();
  }

  /**
   * Get marketplace statistics
   */
  static async getMarketplaceStats(): Promise<MarketplaceStats> {
    return await this.backend.get_marketplace_stats();
  }

  /**
   * Get recent marketplace transactions
   */
  static async getRecentTransactions(limit: number): Promise<NFTTransaction[]> {
    return await this.backend.get_recent_transactions(limit);
  }

  /**
   * Get current user's transaction history
   */
  static async getMyTransactions(): Promise<NFTTransaction[]> {
    return await this.backend.get_my_transactions();
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Format error messages for display
   */
  private static formatError(error: any): string {
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && error !== null) {
      const key = Object.keys(error)[0];
      const value = error[key];
      if (value === null) return key.replace(/([A-Z])/g, ' $1').trim();
      return `${key}: ${value}`;
    }
    return 'Unknown error';
  }

  /**
   * Convert KCT tokens to display format
   */
  static formatKCT(amount: bigint): string {
    return `${amount.toString()} KCT`;
  }

  /**
   * Convert KCT to tons of CO₂
   */
  static kctToTons(kct: bigint): number {
    return Number(kct) / 1000; // 1000 KCT = 1 ton CO₂
  }

  /**
   * Check if user can mint NFT based on balance
   */
  static canMintFromBalance(balance: bigint): boolean {
    return balance >= 1000n; // 1000 KCT required
  }

  /**
   * Format activity type for display
   */
  static formatActivityType(activityType: ActivityType): string {
    switch (activityType) {
      case 'PlantTree': return 'Plant Tree';
      case 'RecycleWaste': return 'Recycle Waste';
      case 'UsePublicTransport': return 'Use Public Transport';
      case 'UseRenewableEnergy': return 'Use Renewable Energy';
      case 'ReduceConsumption': return 'Reduce Consumption';
      default: return activityType;
    }
  }

  /**
   * Get carbon offset display with different units
   */
  static formatCarbonOffset(offsetKg: number) {
    return {
      kg: Math.round(offsetKg * 100) / 100,
      tons: Math.round((offsetKg / 1000) * 1000) / 1000,
      treesEquivalent: Math.round(offsetKg / 22), // ~22kg CO₂ per tree per year
      carMilesAvoided: Math.round(offsetKg * 2.3) // ~2.3 miles per kg CO₂
    };
  }
}

// ==================== REACT HOOKS ====================

/**
 * React hook for user management
 */
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

  const registerUser = useCallback(async (userData: RegisterUserInput) => {
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

  const updateProfile = useCallback(async (updates: UpdateProfileInput) => {
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
    userRole: user?.role || null,
    canMintNFT: user ? KarbynBackendService.canMintFromBalance(BigInt(user.total_carbon_offset * 1000)) : false,
    carbonOffsetFormatted: user ? KarbynBackendService.formatCarbonOffset(user.total_carbon_offset) : null
  };
};

/**
 * React hook for token management
 */
export const useKarbynTokens = () => {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTokenData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [balance, userPortfolio] = await Promise.all([
        KarbynBackendService.getTokenBalance(),
        KarbynBackendService.getUserPortfolio()
      ]);
      setTokenBalance(balance);
      setPortfolio(userPortfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load token data');
    } finally {
      setLoading(false);
    }
  }, []);

  const mintNFT = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const nft = await KarbynBackendService.mintNFT();
      await loadTokenData(); // Refresh data
      return nft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'NFT minting failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadTokenData]);

  return {
    tokenBalance,
    portfolio,
    loading,
    error,
    loadTokenData,
    mintNFT,
    canMintNFT: tokenBalance ? KarbynBackendService.canMintFromBalance(tokenBalance.balance) : false,
    formattedBalance: tokenBalance ? KarbynBackendService.formatKCT(tokenBalance.balance) : null
  };
};

/**
 * React hook for activity management
 */
export const useKarbynActivities = () => {
  const [activities, setActivities] = useState<ActivityHistoryItem[]>([]);
  const [activityStats, setActivityStats] = useState<UserActivityStats | null>(null);
  const [activityTypes, setActivityTypes] = useState<Array<[string, number, string]>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [userActivities, stats, types] = await Promise.all([
        KarbynBackendService.getUserActivities(),
        KarbynBackendService.getUserActivityStats(),
        KarbynBackendService.getActivityTypes()
      ]);
      setActivities(userActivities);
      setActivityStats(stats);
      setActivityTypes(types);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitActivity = useCallback(async (input: SubmitActivityInput) => {
    try {
      setLoading(true);
      setError(null);
      const activity = await KarbynBackendService.submitActivity(input);
      await loadActivities(); // Refresh data
      return activity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Activity submission failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadActivities]);

  return {
    activities,
    activityStats,
    activityTypes,
    loading,
    error,
    loadActivities,
    submitActivity
  };
};

/**
 * React hook for marketplace management
 */
export const useKarbynMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [marketplaceStats, setMarketplaceStats] = useState<MarketplaceStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<NFTTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMarketplaceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allListings, userListings, stats, transactions] = await Promise.all([
        KarbynBackendService.getMarketplaceListings(),
        KarbynBackendService.getMyListings(),
        KarbynBackendService.getMarketplaceStats(),
        KarbynBackendService.getRecentTransactions(10)
      ]);
      setListings(allListings);
      setMyListings(userListings);
      setMarketplaceStats(stats);
      setRecentTransactions(transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  }, []);

  const listNFT = useCallback(async (input: ListNFTInput) => {
    try {
      setLoading(true);
      setError(null);
      const listing = await KarbynBackendService.listNFT(input);
      await loadMarketplaceData(); // Refresh data
      return listing;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'NFT listing failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadMarketplaceData]);

  const buyNFT = useCallback(async (input: BuyNFTInput) => {
    try {
      setLoading(true);
      setError(null);
      const transaction = await KarbynBackendService.buyNFT(input);
      await loadMarketplaceData(); // Refresh data
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'NFT purchase failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadMarketplaceData]);

  const cancelListing = useCallback(async (listingId: bigint) => {
    try {
      setLoading(true);
      setError(null);
      await KarbynBackendService.cancelListing(listingId);
      await loadMarketplaceData(); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Listing cancellation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadMarketplaceData]);

  return {
    listings,
    myListings,
    marketplaceStats,
    recentTransactions,
    loading,
    error,
    loadMarketplaceData,
    listNFT,
    buyNFT,
    cancelListing
  };
};

export default KarbynBackendService;
