use candid::Principal;
use ic_cdk::api::caller;
use std::cell::RefCell;

use crate::models::{UserProfile, UserStorage, WalletType, AuthResponse};

thread_local! {
    static USERS: RefCell<UserStorage> = RefCell::new(UserStorage::new());
}

// Authenticate user with IC Principal (Internet Identity, Plug, NFID)
pub fn authenticate_ic_user(wallet_type: WalletType) -> AuthResponse {
    let principal = caller();
    
    // Don't allow anonymous principal
    if principal == Principal::anonymous() {
        return AuthResponse {
            success: false,
            user_profile: None,
            message: "Anonymous principal not allowed".to_string(),
        };
    }

    let user_id = principal.to_text();

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        match users.get_mut(&user_id) {
            Some(user) => {
                // Update existing user
                user.update_last_login();
                user.wallet_type = wallet_type; // Update wallet type if changed
                AuthResponse {
                    success: true,
                    user_profile: Some(user.clone()),
                    message: "User authenticated successfully".to_string(),
                }
            }
            None => {
                // Create new user
                let new_user = UserProfile::new_ic_user(principal, wallet_type);
                users.insert(user_id.clone(), new_user.clone());
                AuthResponse {
                    success: true,
                    user_profile: Some(new_user),
                    message: "New user created and authenticated".to_string(),
                }
            }
        }
    })
}

// Authenticate user with MetaMask (Ethereum address)
pub fn authenticate_metamask_user(ethereum_address: String, _signature: String) -> AuthResponse {
    // In a real implementation, you'd verify the signature here
    // For demo purposes, we'll just validate the address format
    if !is_valid_ethereum_address(&ethereum_address) {
        return AuthResponse {
            success: false,
            user_profile: None,
            message: "Invalid Ethereum address format".to_string(),
        };
    }

    let user_id = format!("metamask:{}", ethereum_address.to_lowercase());

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        match users.get_mut(&user_id) {
            Some(user) => {
                // Update existing user
                user.update_last_login();
                AuthResponse {
                    success: true,
                    user_profile: Some(user.clone()),
                    message: "MetaMask user authenticated successfully".to_string(),
                }
            }
            None => {
                // Create new user
                let new_user = UserProfile::new_metamask_user(ethereum_address.to_lowercase());
                users.insert(user_id.clone(), new_user.clone());
                AuthResponse {
                    success: true,
                    user_profile: Some(new_user),
                    message: "New MetaMask user created and authenticated".to_string(),
                }
            }
        }
    })
}

// Get user profile by principal (for IC users)
pub fn get_user_profile() -> Option<UserProfile> {
    let principal = caller();
    let user_id = principal.to_text();

    USERS.with(|users| {
        users.borrow().get(&user_id).cloned()
    })
}

// Get user profile by Ethereum address (for MetaMask users)
pub fn get_metamask_user_profile(ethereum_address: String) -> Option<UserProfile> {
    let user_id = format!("metamask:{}", ethereum_address.to_lowercase());

    USERS.with(|users| {
        users.borrow().get(&user_id).cloned()
    })
}

// Update user profile
pub fn update_user_profile(username: Option<String>, email: Option<String>) -> AuthResponse {
    let principal = caller();
    let user_id = principal.to_text();

    USERS.with(|users| {
        let mut users = users.borrow_mut();
        
        match users.get_mut(&user_id) {
            Some(user) => {
                if let Some(name) = username {
                    user.username = Some(name);
                }
                if let Some(email_addr) = email {
                    user.email = Some(email_addr);
                }
                user.update_last_login();
                
                AuthResponse {
                    success: true,
                    user_profile: Some(user.clone()),
                    message: "User profile updated successfully".to_string(),
                }
            }
            None => {
                AuthResponse {
                    success: false,
                    user_profile: None,
                    message: "User not found".to_string(),
                }
            }
        }
    })
}

// Get total user count
pub fn get_user_count() -> u64 {
    USERS.with(|users| users.borrow().len() as u64)
}

// Helper function to validate Ethereum address format
fn is_valid_ethereum_address(address: &str) -> bool {
    // Basic validation: starts with 0x and is 42 characters long
    address.len() == 42 && address.starts_with("0x") && address[2..].chars().all(|c| c.is_ascii_hexdigit())
}

// Legacy compatibility functions for existing code
pub fn user_exists(principal: Principal) -> bool {
    let user_id = principal.to_text();
    USERS.with(|users| users.borrow().contains_key(&user_id))
}

pub fn update_user_stats(_principal: Principal, _tokens: f64, _activities: u32, _nfts: u32) -> bool {
    // Legacy function for compatibility - implement as needed
    true
}

pub fn get_public_user_profile(principal: Principal) -> Option<String> {
    let user_id = principal.to_text();
    USERS.with(|users| {
        users.borrow().get(&user_id).and_then(|user| user.username.clone())
    })
}
