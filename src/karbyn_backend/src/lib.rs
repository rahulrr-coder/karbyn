use candid::Principal;
use ic_cdk::{export_candid, query, update};

// Import our modular components
mod models;
mod user;
mod activity_models;
mod activity;
mod token_models;
mod token;
mod nft;

// Re-export types for external use
pub use models::{
    User, UserRole, UserError, RegisterUserInput, UpdateProfileInput,
    UserStats, PublicUserProfile, VerificationLevel
};

pub use activity_models::{
    Activity, ActivityType, ActivityError, ActivityVerificationStatus,
    SubmitActivityInput, UserActivityStats, ActivityHistoryItem
};

pub use token_models::{
    TokenBalance, CarbonNFT, MarketplaceListing, NFTTransaction, TokenError,
    ActivitySummary, UserPortfolio, LeaderboardEntry, ListNFTInput, BuyNFTInput,
    MarketplaceFilter, MarketplaceStats
};

// === EXPORTED CANISTER FUNCTIONS ===

/// Register a new user (Farmer, NGO, or Individual)
#[update]
pub fn register_user(input: RegisterUserInput) -> Result<User, UserError> {
    user::register_user(input)
}

/// Get current user's profile
#[query]
pub fn get_current_user() -> Option<User> {
    user::get_current_user()
}

/// Get user by principal ID
#[query]
pub fn get_user(principal: Principal) -> Option<User> {
    user::get_user(principal)
}

/// Get public user profile (limited information)
#[query]
pub fn get_public_user_profile(principal: Principal) -> Option<PublicUserProfile> {
    user::get_public_user_profile(principal)
}

/// Update user profile (only owner can update)
#[update]
pub fn update_profile(input: UpdateProfileInput) -> Result<(), UserError> {
    user::update_profile(input)
}

/// Authenticate user by device ID
#[query]
pub fn authenticate_user(device_id: String) -> Option<User> {
    user::authenticate_user(device_id)
}

/// List users by role (Individual, Farmer, NGO)
#[query]
pub fn list_users_by_role(role: String) -> Vec<PublicUserProfile> {
    user::list_users_by_role(role)
}

/// Get all users (returns public profiles only)
#[query]
pub fn get_all_users() -> Vec<PublicUserProfile> {
    user::get_all_users()
}

/// Get comprehensive user statistics
#[query]
pub fn get_user_stats() -> UserStats {
    user::get_user_stats()
}

/// Update user activity stats (internal function for other modules)
#[update]
pub fn update_user_stats(
    principal: Principal, 
    carbon_offset_delta: f64, 
    activity_count_delta: u32, 
    nft_count_delta: u32
) -> Result<(), UserError> {
    user::update_user_stats(principal, carbon_offset_delta, activity_count_delta, nft_count_delta)
}

/// Enable biometric authentication
#[update]
pub fn enable_biometric_auth(device_id: String) -> Result<(), UserError> {
    user::enable_biometric_auth(device_id)
}

/// Disable biometric authentication
#[update]
pub fn disable_biometric_auth() -> Result<(), UserError> {
    user::disable_biometric_auth()
}

/// Check if user exists
#[query]
pub fn user_exists(principal: Principal) -> bool {
    user::user_exists(principal)
}

/// Get count of active users
#[query]
pub fn get_active_users_count() -> u32 {
    user::get_active_users_count()
}

// === ACTIVITY MANAGEMENT FUNCTIONS ===

/// Submit a new environmental activity
#[update]
pub fn submit_activity(input: SubmitActivityInput) -> Result<Activity, ActivityError> {
    activity::submit_activity(input)
}

/// Get all activities for the current user
#[query]
pub fn get_user_activities() -> Vec<ActivityHistoryItem> {
    activity::get_user_activities()
}

/// Get activity by ID (only if user owns it)
#[query]
pub fn get_activity(activity_id: u64) -> Option<Activity> {
    activity::get_activity(activity_id)
}

/// Get comprehensive activity statistics for the current user
#[query]
pub fn get_user_activity_stats() -> UserActivityStats {
    activity::get_user_activity_stats()
}

/// Verify an activity (admin function for testing)
#[update]
pub fn verify_activity(activity_id: u64, verification_score: u8) -> Result<(), ActivityError> {
    activity::verify_activity(activity_id, verification_score)
}

/// Get all activities for admin/verification purposes
#[query]
pub fn get_all_activities_for_verification() -> Vec<ActivityHistoryItem> {
    activity::get_all_activities_for_verification()
}

/// Get global activity statistics
#[query]
pub fn get_global_activity_stats() -> (u32, f64, u32, u32) {
    activity::get_global_activity_stats()
}

/// Get recent global activities (for community feed)
#[query]
pub fn get_recent_global_activities(limit: u32) -> Vec<ActivityHistoryItem> {
    activity::get_recent_global_activities(limit)
}

/// Get activities by type (for analytics)
#[query]
pub fn get_activities_by_type(activity_type: String) -> Result<Vec<ActivityHistoryItem>, ActivityError> {
    activity::get_activities_by_type(activity_type)
}

/// Delete an activity (only if not verified and belongs to user)
#[update]
pub fn delete_activity(activity_id: u64) -> Result<(), ActivityError> {
    activity::delete_activity(activity_id)
}

/// Get activity type information (for frontend)
#[query]
pub fn get_activity_types() -> Vec<(String, f64, String)> {
    activity::get_activity_types()
}

// === TOKEN MANAGEMENT FUNCTIONS ===

/// Get current user's token balance
#[query]
pub fn get_token_balance() -> TokenBalance {
    token::get_token_balance()
}

/// Get any user's token balance (public)
#[query]
pub fn get_user_token_balance(principal: Principal) -> TokenBalance {
    token::get_user_token_balance(principal)
}

/// Check if current user can mint an NFT
#[query]
pub fn can_mint_nft() -> bool {
    token::can_mint_nft()
}

/// Get current user's complete portfolio
#[query]
pub fn get_user_portfolio() -> UserPortfolio {
    token::get_user_portfolio()
}

/// Get any user's portfolio (public)
#[query]
pub fn get_user_portfolio_by_principal(principal: Principal) -> UserPortfolio {
    token::get_user_portfolio_by_principal(principal)
}

/// Get leaderboard of top users
#[query]
pub fn get_leaderboard(limit: u32) -> Vec<LeaderboardEntry> {
    token::get_leaderboard(limit)
}

/// Get global token statistics
#[query]
pub fn get_token_stats() -> (u64, u64, u32, f64) {
    token::get_token_stats()
}

/// Get token distribution statistics
#[query]
pub fn get_token_distribution() -> Vec<(String, u32)> {
    token::get_token_distribution()
}

/// Get daily token earnings
#[query]
pub fn get_daily_token_earnings() -> Vec<(String, u64)> {
    token::get_daily_token_earnings()
}

// === NFT MANAGEMENT FUNCTIONS ===

/// Mint a new Carbon Credit NFT (requires 1000 KCT)
#[update]
pub fn mint_nft() -> Result<CarbonNFT, TokenError> {
    nft::mint_nft()
}

/// Get current user's NFTs
#[query]
pub fn get_my_nfts() -> Vec<CarbonNFT> {
    nft::get_my_nfts()
}

/// Get any user's NFTs (public)
#[query]
pub fn get_user_nfts(user_principal: Principal) -> Vec<CarbonNFT> {
    nft::get_user_nfts(user_principal)
}

/// Get NFT by ID
#[query]
pub fn get_nft(nft_id: u64) -> Option<CarbonNFT> {
    nft::get_nft(nft_id)
}

/// Get NFT ownership history
#[query]
pub fn get_nft_ownership_history(nft_id: u64) -> Vec<NFTTransaction> {
    nft::get_nft_ownership_history(nft_id)
}

/// Get global NFT statistics
#[query]
pub fn get_global_nft_stats() -> (u32, u32, u32, f64) {
    nft::get_global_nft_stats()
}

// === MARKETPLACE FUNCTIONS ===

/// List NFT for sale on marketplace
#[update]
pub fn list_nft(input: ListNFTInput) -> Result<MarketplaceListing, TokenError> {
    nft::list_nft(input)
}

/// Buy NFT from marketplace
#[update]
pub fn buy_nft(input: BuyNFTInput) -> Result<NFTTransaction, TokenError> {
    nft::buy_nft(input)
}

/// Cancel NFT listing
#[update]
pub fn cancel_listing(listing_id: u64) -> Result<(), TokenError> {
    nft::cancel_listing(listing_id)
}

/// Get marketplace listings with filters
#[query]
pub fn get_marketplace_listings(filter: Option<MarketplaceFilter>) -> Vec<MarketplaceListing> {
    nft::get_marketplace_listings(filter)
}

/// Get current user's marketplace listings
#[query]
pub fn get_my_listings() -> Vec<MarketplaceListing> {
    nft::get_my_listings()
}

/// Get marketplace statistics
#[query]
pub fn get_marketplace_stats() -> MarketplaceStats {
    nft::get_marketplace_stats()
}

/// Get recent marketplace transactions
#[query]
pub fn get_recent_transactions(limit: u32) -> Vec<NFTTransaction> {
    nft::get_recent_transactions(limit)
}

/// Get current user's transaction history
#[query]
pub fn get_my_transactions() -> Vec<NFTTransaction> {
    nft::get_my_transactions()
}

/// Get any user's transaction history (public)
#[query]
pub fn get_user_transactions(user_principal: Principal) -> Vec<NFTTransaction> {
    nft::get_user_transactions(user_principal)
}

// === CANISTER LIFECYCLE ===

// Generate Candid interface
export_candid!();
