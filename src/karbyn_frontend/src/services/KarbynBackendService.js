/**
 * Karbyn Backend Service - Real Canister Integration
 * 
 * This service connects to the actual deployed backend canister
 * and provides all the functionality for the Karbyn dApp
 */

import { Principal } from '@dfinity/principal';
import { createActor, karbyn_backend } from '../../../declarations/karbyn_backend';

/**
 * Real Karbyn Backend Service
 * Connects to the deployed canister instead of using mock data
 */
export class KarbynBackendService {
  static backend = null;

  /**
   * Initialize the backend connection with authentication
   */
  static async initialize(identity = null) {
    try {
      if (identity) {
        // Create authenticated actor with the provided identity
        this.backend = createActor(process.env.CANISTER_ID_KARBYN_BACKEND || 'uxrrr-q7777-77774-qaaaq-cai', {
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
   * Set the backend actor directly (for use with SimpleAuth context)
   */
  static setActor(actor) {
    this.backend = actor;
    console.log('Backend actor set directly');
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
  static async registerUser(input) {
    const backend = this.getBackend();
    const result = await backend.register_user(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get current user information
   */
  static async getCurrentUser() {
    const backend = this.getBackend();
    const result = await backend.get_current_user();
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(input) {
    const backend = this.getBackend();
    const result = await backend.update_profile(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get user stats
   */
  static async getUserStats() {
    const backend = this.getBackend();
    return await backend.get_user_stats();
  }

  /**
   * Get all public user profiles (for leaderboard)
   */
  static async getAllUsers() {
    const backend = this.getBackend();
    return await backend.get_all_users();
  }

  /**
   * Get user by Principal ID
   */
  static async getUserById(principalId) {
    const backend = this.getBackend();
    const principal = Principal.fromText(principalId);
    return await backend.get_user_by_id(principal);
  }

  // ==================== ACTIVITY MANAGEMENT FUNCTIONS ====================

  /**
   * Submit a new activity
   */
  static async submitActivity(input) {
    const backend = this.getBackend();
    const result = await backend.submit_activity(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get user's activity history
   */
  static async getUserActivities() {
    const backend = this.getBackend();
    return await backend.get_user_activities();
  }

  /**
   * Get activity statistics for the current user
   */
  static async getUserActivityStats() {
    const backend = this.getBackend();
    return await backend.get_user_activity_stats();
  }

  /**
   * Verify an activity (admin function)
   */
  static async verifyActivity(activityId, isVerified) {
    const backend = this.getBackend();
    const result = await backend.verify_activity(activityId, isVerified);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get all activities for admin review
   */
  static async getAllActivities() {
    const backend = this.getBackend();
    return await backend.get_all_activities();
  }

  // ==================== TOKEN AND BALANCE FUNCTIONS ====================

  /**
   * Get user's token balance
   */
  static async getTokenBalance() {
    const backend = this.getBackend();
    return await backend.get_token_balance();
  }

  /**
   * Get user's portfolio summary
   */
  static async getUserPortfolio() {
    const backend = this.getBackend();
    return await backend.get_user_portfolio();
  }

  /**
   * Award tokens for verified activities (automated/admin)
   */
  static async awardTokens(amount, reason) {
    const backend = this.getBackend();
    const result = await backend.award_tokens(amount, reason);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(limit = 10) {
    const backend = this.getBackend();
    return await backend.get_leaderboard(limit);
  }

  // ==================== NFT FUNCTIONS ====================

  /**
   * Mint Carbon Credit NFT
   */
  static async mintCarbonNFT(carbonAmount, description) {
    const backend = this.getBackend();
    const result = await backend.mint_carbon_nft(carbonAmount, description);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get user's NFTs
   */
  static async getUserNFTs() {
    const backend = this.getBackend();
    return await backend.get_user_nfts();
  }

  /**
   * Get NFT details by ID
   */
  static async getNFTById(nftId) {
    const backend = this.getBackend();
    return await backend.get_nft_by_id(nftId);
  }

  /**
   * Transfer NFT to another user
   */
  static async transferNFT(nftId, toUserId) {
    const backend = this.getBackend();
    const toPrincipal = Principal.fromText(toUserId);
    const result = await backend.transfer_nft(nftId, toPrincipal);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  // ==================== MARKETPLACE FUNCTIONS ====================

  /**
   * List NFT for sale in marketplace
   */
  static async listNFTForSale(input) {
    const backend = this.getBackend();
    const result = await backend.list_nft_for_sale(input);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Buy NFT from marketplace
   */
  static async buyNFT(listingId) {
    const backend = this.getBackend();
    const result = await backend.buy_nft(listingId);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get marketplace listings
   */
  static async getMarketplaceListings(filter = null) {
    const backend = this.getBackend();
    return await backend.get_marketplace_listings(filter);
  }

  /**
   * Remove NFT from marketplace
   */
  static async removeFromMarketplace(listingId) {
    const backend = this.getBackend();
    const result = await backend.remove_from_marketplace(listingId);
    if ('Ok' in result) {
      return result.Ok;
    } else {
      throw new Error(this.formatError(result.Err));
    }
  }

  /**
   * Get marketplace statistics
   */
  static async getMarketplaceStats() {
    const backend = this.getBackend();
    return await backend.get_marketplace_stats();
  }

  /**
   * Get user's marketplace transactions
   */
  static async getUserTransactions() {
    const backend = this.getBackend();
    return await backend.get_user_transactions();
  }

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Format error messages from backend
   */
  static formatError(error) {
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
  static formatKCT(amount) {
    return `${amount.toString()} KCT`;
  }

  /**
   * Convert KCT to tons of CO₂
   */
  static kctToTons(kct) {
    return Number(kct) / 1000; // 1000 KCT = 1 ton CO₂
  }

  /**
   * Check if user can mint NFT based on balance
   */
  static canMintFromBalance(balance) {
    return balance >= 1000n; // 1000 KCT required
  }

  /**
   * Format activity type for display
   */
  static formatActivityType(activityType) {
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
  static formatCarbonOffset(offsetKg) {
    return {
      kg: Math.round(offsetKg * 100) / 100,
      tons: Math.round((offsetKg / 1000) * 1000) / 1000,
      treesEquivalent: Math.round(offsetKg / 22), // ~22kg CO₂ per tree per year
      carMilesAvoided: Math.round(offsetKg * 2.3) // ~2.3 miles per kg CO₂
    };
  }
}

export default KarbynBackendService;
