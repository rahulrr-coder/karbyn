use candid::{CandidType, Principal};
use ic_stable_structures::Storable;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

// User role enum with enhanced permissions
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum UserRole {
    Individual,
    Farmer,
    NGO,
}

impl UserRole {
    /// Check if this role can submit large-scale projects
    pub fn can_submit_projects(&self) -> bool {
        matches!(self, UserRole::Farmer | UserRole::NGO)
    }

    /// Check if this role can verify other users' activities
    pub fn can_verify_activities(&self) -> bool {
        matches!(self, UserRole::NGO)
    }

    /// Get string representation for display
    pub fn as_str(&self) -> &'static str {
        match self {
            UserRole::Individual => "Individual",
            UserRole::Farmer => "Farmer",
            UserRole::NGO => "NGO",
        }
    }
}

// Enhanced User struct with location and biometric integration
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: Principal,
    pub name: String,
    pub role: UserRole,
    pub location: Option<String>,  // New field for location
    pub bio: Option<String>,
    pub registered_at: u64,
    pub device_id: Option<String>,
    pub biometric_enabled: bool,   // New field for biometric status
    pub total_carbon_offset: f64,
    pub total_activities: u32,
    pub nfts_earned: u32,
    pub verification_status: String,
    pub last_activity: Option<u64>, // Track user engagement
}

// Implement Storable for User to work with stable structures
impl Storable for User {
    fn to_bytes(&self) -> Cow<[u8]> {
        let bytes = candid::encode_one(self).expect("Failed to encode User");
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).expect("Failed to decode User")
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Registration input with enhanced fields
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RegisterUserInput {
    pub name: String,
    pub role: String,
    pub location: Option<String>,
    pub bio: Option<String>,
    pub device_id: Option<String>,
}

// Profile update input with biometric support
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateProfileInput {
    pub name: Option<String>,
    pub location: Option<String>,
    pub bio: Option<String>,
    pub device_id: Option<String>,
    pub biometric_enabled: Option<bool>,
}

// Custom error types for better error handling
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum UserError {
    UserAlreadyExists,
    UserNotFound,
    InvalidRole(String),
    InvalidInput(String),
    Unauthorized,
    NameTooLong,
    BioTooLong,
    LocationTooLong,
}

impl std::fmt::Display for UserError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UserError::UserAlreadyExists => write!(f, "User already exists"),
            UserError::UserNotFound => write!(f, "User not found"),
            UserError::InvalidRole(role) => write!(f, "Invalid role: {role}"),
            UserError::InvalidInput(msg) => write!(f, "Invalid input: {msg}"),
            UserError::Unauthorized => write!(f, "Unauthorized access"),
            UserError::NameTooLong => write!(f, "Name too long (max 100 characters)"),
            UserError::BioTooLong => write!(f, "Bio too long (max 500 characters)"),
            UserError::LocationTooLong => write!(f, "Location too long (max 200 characters)"),
        }
    }
}

// User validation trait
impl User {
    /// Validate user data integrity
    pub fn validate(&self) -> Result<(), UserError> {
        if self.name.trim().is_empty() {
            return Err(UserError::InvalidInput("Name cannot be empty".to_string()));
        }
        
        if self.name.len() > 100 {
            return Err(UserError::NameTooLong);
        }
        
        if let Some(ref bio) = self.bio {
            if bio.len() > 500 {
                return Err(UserError::BioTooLong);
            }
        }
        
        if let Some(ref location) = self.location {
            if location.len() > 200 {
                return Err(UserError::LocationTooLong);
            }
        }
        
        Ok(())
    }

    /// Update last activity timestamp
    pub fn update_activity(&mut self) {
        self.last_activity = Some(ic_cdk::api::time());
    }

    /// Check if user is active (has activity in last 30 days)
    pub fn is_active(&self) -> bool {
        if let Some(last_activity) = self.last_activity {
            let thirty_days_ago = ic_cdk::api::time() - (30 * 24 * 60 * 60 * 1_000_000_000); // 30 days in nanoseconds
            last_activity > thirty_days_ago
        } else {
            false
        }
    }

    /// Get verification level as enum
    pub fn get_verification_level(&self) -> VerificationLevel {
        match self.verification_status.as_str() {
            "Verified" => VerificationLevel::Verified,
            "Partially Verified" => VerificationLevel::PartiallyVerified,
            _ => VerificationLevel::Unverified,
        }
    }
}

// Verification level enum
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum VerificationLevel {
    Unverified,
    PartiallyVerified,
    Verified,
}

impl VerificationLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            VerificationLevel::Unverified => "Unverified",
            VerificationLevel::PartiallyVerified => "Partially Verified",
            VerificationLevel::Verified => "Verified",
        }
    }
}

// User statistics for analytics
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserStats {
    pub total_users: u32,
    pub individuals: u32,
    pub farmers: u32,
    pub ngos: u32,
    pub active_users: u32,
    pub verified_users: u32,
    pub biometric_enabled_users: u32,
}

// Public user profile (limited info for privacy)
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PublicUserProfile {
    pub id: Principal,
    pub name: String,
    pub role: UserRole,
    pub location: Option<String>,
    pub total_carbon_offset: f64,
    pub total_activities: u32,
    pub nfts_earned: u32,
    pub verification_status: String,
    pub is_active: bool,
}
