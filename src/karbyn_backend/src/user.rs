use candid::Principal;
use ic_cdk::{api::time, caller};
use ic_stable_structures::{memory_manager::{MemoryId, MemoryManager, VirtualMemory}, BTreeMap, DefaultMemoryImpl};
use std::cell::RefCell;

use crate::models::{
    User, UserRole, UserError, RegisterUserInput, UpdateProfileInput,
    UserStats, PublicUserProfile, VerificationLevel
};

// Type aliases for memory management
type Memory = VirtualMemory<DefaultMemoryImpl>;
type UserStore = BTreeMap<Principal, User, Memory>;

// Memory manager for stable storage
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = 
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static USER_STORE: RefCell<UserStore> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );
}

/// Parse role string to UserRole enum
fn parse_user_role(role_str: &str) -> Result<UserRole, UserError> {
    match role_str.to_lowercase().as_str() {
        "individual" => Ok(UserRole::Individual),
        "farmer" => Ok(UserRole::Farmer),
        "ngo" => Ok(UserRole::NGO),
        _ => Err(UserError::InvalidRole(role_str.to_string())),
    }
}

/// Validate registration input
fn validate_registration_input(input: &RegisterUserInput) -> Result<(), UserError> {
    if input.name.trim().is_empty() {
        return Err(UserError::InvalidInput("Name cannot be empty".to_string()));
    }
    
    if input.name.len() > 100 {
        return Err(UserError::NameTooLong);
    }
    
    if let Some(ref bio) = input.bio {
        if bio.len() > 500 {
            return Err(UserError::BioTooLong);
        }
    }
    
    if let Some(ref location) = input.location {
        if location.len() > 200 {
            return Err(UserError::LocationTooLong);
        }
    }
    
    Ok(())
}

/// Register a new user
pub fn register_user(input: RegisterUserInput) -> Result<User, UserError> {
    let caller_principal = caller();
    
    // Check if user already exists
    let existing_user = USER_STORE.with(|store| {
        store.borrow().get(&caller_principal)
    });
    
    if existing_user.is_some() {
        return Err(UserError::UserAlreadyExists);
    }
    
    // Validate input
    validate_registration_input(&input)?;
    
    // Parse role
    let role = parse_user_role(&input.role)?;
    
    // Create new user
    let user = User {
        id: caller_principal,
        name: input.name.trim().to_string(),
        role,
        location: input.location.filter(|l| !l.trim().is_empty()),
        bio: input.bio.filter(|b| !b.trim().is_empty()),
        registered_at: time(),
        device_id: input.device_id.filter(|d| !d.trim().is_empty()),
        biometric_enabled: false,
        total_carbon_offset: 0.0,
        total_activities: 0,
        nfts_earned: 0,
        verification_status: VerificationLevel::Unverified.as_str().to_string(),
        last_activity: Some(time()),
    };
    
    // Validate the complete user object
    user.validate()?;
    
    // Store user
    USER_STORE.with(|store| {
        store.borrow_mut().insert(caller_principal, user.clone())
    });
    
    Ok(user)
}

/// Get current user (caller's profile)
pub fn get_current_user() -> Option<User> {
    let caller_principal = caller();
    USER_STORE.with(|store| {
        store.borrow().get(&caller_principal)
    })
}

/// Get user by principal ID
pub fn get_user(principal: Principal) -> Option<User> {
    USER_STORE.with(|store| {
        store.borrow().get(&principal)
    })
}

/// Get public user profile (limited information for privacy)
pub fn get_public_user_profile(principal: Principal) -> Option<PublicUserProfile> {
    USER_STORE.with(|store| {
        store.borrow().get(&principal).map(|user| {
            let is_active = user.is_active();
            PublicUserProfile {
                id: user.id,
                name: user.name.clone(),
                role: user.role.clone(),
                location: user.location.clone(),
                total_carbon_offset: user.total_carbon_offset,
                total_activities: user.total_activities,
                nfts_earned: user.nfts_earned,
                verification_status: user.verification_status.clone(),
                is_active,
            }
        })
    })
}

/// Update user profile (only the owner can update)
pub fn update_profile(input: UpdateProfileInput) -> Result<(), UserError> {
    let caller_principal = caller();
    
    USER_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        if let Some(mut user) = store_ref.get(&caller_principal) {
            // Update only provided fields
            if let Some(name) = input.name {
                if name.trim().is_empty() {
                    return Err(UserError::InvalidInput("Name cannot be empty".to_string()));
                }
                if name.len() > 100 {
                    return Err(UserError::NameTooLong);
                }
                user.name = name.trim().to_string();
            }
            
            if let Some(location) = input.location {
                if location.len() > 200 {
                    return Err(UserError::LocationTooLong);
                }
                user.location = if location.trim().is_empty() { None } else { Some(location.trim().to_string()) };
            }
            
            if let Some(bio) = input.bio {
                if bio.len() > 500 {
                    return Err(UserError::BioTooLong);
                }
                user.bio = if bio.trim().is_empty() { None } else { Some(bio.trim().to_string()) };
            }
            
            if let Some(device_id) = input.device_id {
                user.device_id = if device_id.trim().is_empty() { None } else { Some(device_id.trim().to_string()) };
            }
            
            if let Some(biometric_enabled) = input.biometric_enabled {
                user.biometric_enabled = biometric_enabled;
            }
            
            // Update activity timestamp
            user.update_activity();
            
            // Validate updated user
            user.validate()?;
            
            // Save updated user
            store_ref.insert(caller_principal, user);
            Ok(())
        } else {
            Err(UserError::UserNotFound)
        }
    })
}

/// Authenticate user by device ID
pub fn authenticate_user(device_id: String) -> Option<User> {
    if device_id.trim().is_empty() {
        return None;
    }
    
    USER_STORE.with(|store| {
        let store_ref = store.borrow();
        for (_principal, user) in store_ref.iter() {
            if let Some(ref user_device_id) = user.device_id {
                if user_device_id == &device_id {
                    return Some(user.clone());
                }
            }
        }
        None
    })
}

/// List users by role
pub fn list_users_by_role(role: String) -> Vec<PublicUserProfile> {
    let target_role = match parse_user_role(&role) {
        Ok(r) => r,
        Err(_) => return vec![],
    };
    
    USER_STORE.with(|store| {
        let store_ref = store.borrow();
        store_ref
            .iter()
            .filter_map(|(_principal, user)| {
                if user.role == target_role {
                    let is_active = user.is_active();
                    Some(PublicUserProfile {
                        id: user.id,
                        name: user.name.clone(),
                        role: user.role.clone(),
                        location: user.location.clone(),
                        total_carbon_offset: user.total_carbon_offset,
                        total_activities: user.total_activities,
                        nfts_earned: user.nfts_earned,
                        verification_status: user.verification_status.clone(),
                        is_active,
                    })
                } else {
                    None
                }
            })
            .collect()
    })
}

/// Get all users (admin function - returns public profiles only)
pub fn get_all_users() -> Vec<PublicUserProfile> {
    USER_STORE.with(|store| {
        let store_ref = store.borrow();
        store_ref.iter().map(|(_principal, user)| {
            let is_active = user.is_active();
            PublicUserProfile {
                id: user.id,
                name: user.name.clone(),
                role: user.role.clone(),
                location: user.location.clone(),
                total_carbon_offset: user.total_carbon_offset,
                total_activities: user.total_activities,
                nfts_earned: user.nfts_earned,
                verification_status: user.verification_status.clone(),
                is_active,
            }
        }).collect()
    })
}

/// Get comprehensive user statistics
pub fn get_user_stats() -> UserStats {
    USER_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut stats = UserStats {
            total_users: 0,
            individuals: 0,
            farmers: 0,
            ngos: 0,
            active_users: 0,
            verified_users: 0,
            biometric_enabled_users: 0,
        };
        
        for (_principal, user) in store_ref.iter() {
            stats.total_users += 1;
            
            match user.role {
                UserRole::Individual => stats.individuals += 1,
                UserRole::Farmer => stats.farmers += 1,
                UserRole::NGO => stats.ngos += 1,
            }
            
            if user.is_active() {
                stats.active_users += 1;
            }
            
            if user.get_verification_level() == VerificationLevel::Verified {
                stats.verified_users += 1;
            }
            
            if user.biometric_enabled {
                stats.biometric_enabled_users += 1;
            }
        }
        
        stats
    })
}

/// Update user stats (for internal use by other modules)
pub fn update_user_stats(
    principal: Principal, 
    carbon_offset_delta: f64, 
    activity_count_delta: u32, 
    nft_count_delta: u32
) -> Result<(), UserError> {
    USER_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        if let Some(mut user) = store_ref.get(&principal) {
            user.total_carbon_offset += carbon_offset_delta;
            user.total_activities += activity_count_delta;
            user.nfts_earned += nft_count_delta;
            
            // Update verification status based on activities
            if user.total_activities >= 10 {
                user.verification_status = VerificationLevel::Verified.as_str().to_string();
            } else if user.total_activities >= 5 {
                user.verification_status = VerificationLevel::PartiallyVerified.as_str().to_string();
            }
            
            // Update activity timestamp
            user.update_activity();
            
            store_ref.insert(principal, user);
            Ok(())
        } else {
            Err(UserError::UserNotFound)
        }
    })
}

/// Enable biometric authentication for user
pub fn enable_biometric_auth(device_id: String) -> Result<(), UserError> {
    let caller_principal = caller();
    
    if device_id.trim().is_empty() {
        return Err(UserError::InvalidInput("Device ID cannot be empty".to_string()));
    }
    
    USER_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        if let Some(mut user) = store_ref.get(&caller_principal) {
            user.device_id = Some(device_id);
            user.biometric_enabled = true;
            user.update_activity();
            
            store_ref.insert(caller_principal, user);
            Ok(())
        } else {
            Err(UserError::UserNotFound)
        }
    })
}

/// Disable biometric authentication for user
pub fn disable_biometric_auth() -> Result<(), UserError> {
    let caller_principal = caller();
    
    USER_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        if let Some(mut user) = store_ref.get(&caller_principal) {
            user.biometric_enabled = false;
            user.update_activity();
            
            store_ref.insert(caller_principal, user);
            Ok(())
        } else {
            Err(UserError::UserNotFound)
        }
    })
}

/// Check if user exists
pub fn user_exists(principal: Principal) -> bool {
    USER_STORE.with(|store| {
        store.borrow().contains_key(&principal)
    })
}

/// Get active users count
pub fn get_active_users_count() -> u32 {
    USER_STORE.with(|store| {
        let store_ref = store.borrow();
        store_ref.iter().filter(|(_, user)| user.is_active()).count() as u32
    })
}
