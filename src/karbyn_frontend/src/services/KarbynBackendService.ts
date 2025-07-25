/**
 * Karbyn Backend Service - Real Canister Integration
 * 
 * This service connects to the actual deployed backend canister
 * and provides all the functionality for the Karbyn dApp
 */

import { Principal } from '@dfinity/principal';
import { createActor, karbyn_backend } from '../../../declarations/karbyn_backend';

// Import types from the generated declarations
import type {
  User,
  UserRole, 
  RegisterUserInput,
  UpdateProfileInput,
  UserStats,
  PublicUserProfile,
  Activity,
  ActivityType,
  SubmitActivityInput,
  ActivityHistoryItem,
  UserActivityStats,
  ActivityVerificationStatus,
  TokenBalance,
  UserPortfolio,
  LeaderboardEntry,
  CarbonNFT,
  ActivitySummary,
  MarketplaceListing,
  NFTTransaction,
  ListNFTInput,
  BuyNFTInput,
  MarketplaceFilter,
  MarketplaceStats,
  Result_7,  // Result<User, UserError>
  Result_3,  // Result<null, UserError>  
  Result_8,  // Result<Activity, ActivityError>
  Result_6,  // Result<CarbonNFT, TokenError>
  Result_5,  // Result<MarketplaceListing, TokenError>
  Result,    // Result<NFTTransaction, TokenError>
  Result_1,  // Result<null, TokenError>
  UserError,
  ActivityError,
  TokenError
} from '../../../declarations/karbyn_backend/karbyn_backend.did.d.ts';

/**
 * Real Karbyn Backend Service
 * Connects to the deployed canister instead of using mock data
 */
export class KarbynBackendService {
  private static backend: any = null;

  /**
   * Initialize the backend connection with authentication
   */
  static async initialize(identity?: any) {
    try {
      if (identity) {
        // Create authenticated actor with the provided identity
        this.backend = createActor(process.env.CANISTER_ID_KARBYN_BACKEND!, {
          agentOptions: {
            identity,
            host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943',
          },
        });
      } else {
        // Use default actor (anonymous)
        this.backend = karbyn_backend;
      }
      
      console.log('Backend service initialized with real canister');
      return this.backend;
    } catch (error) {
      console.error('Failed to initialize backend service:', error);
      throw error;
    }
  }

  /**
   * Get the current backend instance
   */
  static getBackend() {
    if (!this.backend) {
      throw new Error('Backend service not initialized. Call initialize() first.');
    }
    return this.backend;
  }

  // ==================== USER MANAGEMENT FUNCTIONS ====================

  /**
   * Register a new user in the system
   */
  static async registerUser(input: RegisterUserInput): Promise<User> {
    const backend = this.getBackend();
    const result: Result_7 = await backend.register_user(input);
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
    const backend = this.getBackend();
    const result: User[] = await backend.get_current_user();
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get user by principal ID
   */
  static async getUser(principal: Principal): Promise<User | null> {
    const backend = this.getBackend();
    const result: User[] = await backend.get_user(principal);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get public user profile
   */
  static async getPublicUserProfile(principal: Principal): Promise<PublicUserProfile | null> {
    const backend = this.getBackend();
    const result: PublicUserProfile[] = await backend.get_public_user_profile(principal);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(input: UpdateProfileInput): Promise<void> {
    const backend = this.getBackend();
    const result: Result_3 = await backend.update_profile(input);
    if ('Err' in result) {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: UserRole): Promise<PublicUserProfile[]> {
    const backend = this.getBackend();
    return await backend.list_users_by_role(role);
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<UserStats> {
    const backend = this.getBackend();
    return await backend.get_user_stats();
  }

  // ==================== ACTIVITY MANAGEMENT FUNCTIONS ====================

  /**
   * Submit a new environmental activity
   */
  static async submitActivity(input: SubmitActivityInput): Promise<Activity> {
    const backend = this.getBackend();
    const result: Result_8 = await backend.submit_activity(input);
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
    const backend = this.getBackend();
    return await backend.get_user_activities();
  }

  /**
   * Get activity by ID
   */
  static async getActivity(activityId: bigint): Promise<Activity | null> {
    const backend = this.getBackend();
    const result: Activity[] = await backend.get_activity(activityId);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get user activity statistics
   */
  static async getUserActivityStats(): Promise<UserActivityStats> {
    const backend = this.getBackend();
    return await backend.get_user_activity_stats();
  }

  /**
   * Get recent global activities
   */
  static async getRecentGlobalActivities(limit: number): Promise<ActivityHistoryItem[]> {
    const backend = this.getBackend();
    return await backend.get_recent_global_activities(limit);
  }

  /**
   * Get available activity types
   */
  static async getActivityTypes(): Promise<Array<[string, number, string]>> {
    const backend = this.getBackend();
    return await backend.get_activity_types();
  }

  // ==================== TOKEN MANAGEMENT FUNCTIONS ====================

  /**
   * Get current user's token balance
   */
  static async getTokenBalance(): Promise<TokenBalance> {
    const backend = this.getBackend();
    return await backend.get_token_balance();
  }

  /**
   * Get any user's token balance
   */
  static async getUserTokenBalance(principal: Principal): Promise<TokenBalance> {
    const backend = this.getBackend();
    return await backend.get_user_token_balance(principal);
  }

  /**
   * Check if current user can mint an NFT
   */
  static async canMintNFT(): Promise<boolean> {
    const backend = this.getBackend();
    return await backend.can_mint_nft();
  }

  /**
   * Get current user's complete portfolio
   */
  static async getUserPortfolio(): Promise<UserPortfolio> {
    const backend = this.getBackend();
    return await backend.get_user_portfolio();
  }

  /**
   * Get leaderboard of top users
   */
  static async getLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
    const backend = this.getBackend();
    return await backend.get_leaderboard(limit);
  }

  /**
   * Get global token statistics
   */
  static async getTokenStats(): Promise<[bigint, bigint, number, number]> {
    const backend = this.getBackend();
    return await backend.get_token_stats();
  }

  // ==================== NFT MANAGEMENT FUNCTIONS ====================

  /**
   * Mint a new Carbon Credit NFT (requires 1000 KCT)
   */
  static async mintNFT(): Promise<CarbonNFT> {
    const backend = this.getBackend();
    const result: Result_6 = await backend.mint_nft();
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
    const backend = this.getBackend();
    return await backend.get_my_nfts();
  }

  /**
   * Get any user's NFTs
   */
  static async getUserNFTs(userPrincipal: Principal): Promise<CarbonNFT[]> {
    const backend = this.getBackend();
    return await backend.get_user_nfts(userPrincipal);
  }

  /**
   * Get NFT by ID
   */
  static async getNFT(nftId: bigint): Promise<CarbonNFT | null> {
    const backend = this.getBackend();
    const result: CarbonNFT[] = await backend.get_nft(nftId);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Get global NFT statistics
   */
  static async getGlobalNFTStats(): Promise<[number, number, number, number]> {
    const backend = this.getBackend();
    return await backend.get_global_nft_stats();
  }

  // ==================== MARKETPLACE FUNCTIONS ====================

  /**
   * List NFT for sale on marketplace
   */
  static async listNFT(input: ListNFTInput): Promise<MarketplaceListing> {
    const backend = this.getBackend();
    const result: Result_5 = await backend.list_nft(input);
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
    const backend = this.getBackend();
    const result: Result = await backend.buy_nft(input);
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
    const backend = this.getBackend();
    const result: Result_1 = await backend.cancel_listing(listingId);
    if ('Err' in result) {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get marketplace listings with optional filters
   */
  static async getMarketplaceListings(filter?: MarketplaceFilter): Promise<MarketplaceListing[]> {
    const backend = this.getBackend();
    return await backend.get_marketplace_listings(filter ? [filter] : []);
  }

  /**
   * Get current user's marketplace listings
   */
  static async getMyListings(): Promise<MarketplaceListing[]> {
    const backend = this.getBackend();
    return await backend.get_my_listings();
  }

  /**
   * Get marketplace statistics
   */
  static async getMarketplaceStats(): Promise<MarketplaceStats> {
    const backend = this.getBackend();
    return await backend.get_marketplace_stats();
  }

  /**
   * Get recent marketplace transactions
   */
  static async getRecentTransactions(limit: number): Promise<NFTTransaction[]> {
    const backend = this.getBackend();
    return await backend.get_recent_transactions(limit);
  }

  /**
   * Get current user's transaction history
   */
  static async getMyTransactions(): Promise<NFTTransaction[]> {
    const backend = this.getBackend();
    return await backend.get_my_transactions();
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
    if ('PlantTree' in activityType) return 'Plant Tree';
    if ('RecycleWaste' in activityType) return 'Recycle Waste';
    if ('UsePublicTransport' in activityType) return 'Use Public Transport';
    if ('UseRenewableEnergy' in activityType) return 'Use Renewable Energy';
    if ('ReduceConsumption' in activityType) return 'Reduce Consumption';
    return 'Unknown Activity';
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

// Export types for use in other modules
export type {
  User,
  UserRole,
  RegisterUserInput,
  UpdateProfileInput,
  UserStats,
  PublicUserProfile,
  Activity,
  ActivityType,
  SubmitActivityInput,
  ActivityHistoryItem,
  UserActivityStats,
  ActivityVerificationStatus,
  TokenBalance,
  UserPortfolio,
  LeaderboardEntry,
  CarbonNFT,
  ActivitySummary,
  MarketplaceListing,
  NFTTransaction,
  ListNFTInput,
  BuyNFTInput,
  MarketplaceFilter,
  MarketplaceStats,
  UserError,
  ActivityError,
  TokenError
};

export default KarbynBackendService;
