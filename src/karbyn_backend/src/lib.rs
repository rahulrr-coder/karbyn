use candid::Principal;
use ic_cdk::{export_candid, query, update};

// Import our modular components
mod models;
mod user;
mod activity_models;
mod activity;

// Re-export types for external use
pub use models::{
    User, UserRole, UserError, RegisterUserInput, UpdateProfileInput,
    UserStats, PublicUserProfile, VerificationLevel
};

pub use activity_models::{
    Activity, ActivityType, ActivityError, ActivityVerificationStatus,
    SubmitActivityInput, UserActivityStats, ActivityHistoryItem
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

// === CANISTER LIFECYCLE ===

// Generate Candid interface
export_candid!();
