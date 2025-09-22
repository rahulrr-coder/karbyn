use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::collections::HashMap;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub enum WalletType {
    InternetIdentity,
    Plug,
    NFID,
    MetaMask,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserProfile {
    pub id: String,
    pub principal: Option<Principal>,
    pub wallet_type: WalletType,
    pub ethereum_address: Option<String>,
    pub created_at: u64,
    pub last_login: u64,
    pub username: Option<String>,
    pub email: Option<String>,
    pub verified: bool,
}

impl UserProfile {
    pub fn new_ic_user(principal: Principal, wallet_type: WalletType) -> Self {
        let timestamp = ic_cdk::api::time();
        Self {
            id: principal.to_text(),
            principal: Some(principal),
            wallet_type,
            ethereum_address: None,
            created_at: timestamp,
            last_login: timestamp,
            username: None,
            email: None,
            verified: false,
        }
    }

    pub fn new_metamask_user(ethereum_address: String) -> Self {
        let timestamp = ic_cdk::api::time();
        Self {
            id: format!("metamask:{}", ethereum_address.to_lowercase()),
            principal: None,
            wallet_type: WalletType::MetaMask,
            ethereum_address: Some(ethereum_address.to_lowercase()),
            created_at: timestamp,
            last_login: timestamp,
            username: None,
            email: None,
            verified: false,
        }
    }

    pub fn update_last_login(&mut self) {
        self.last_login = ic_cdk::api::time();
    }
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct AuthResponse {
    pub success: bool,
    pub user_profile: Option<UserProfile>,
    pub message: String,
}

pub type UserStorage = HashMap<String, UserProfile>;

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct NGOProfile {
    pub id: String,
    pub name: String,
    pub contact: String,
    pub location: String,
    pub organization_type: String,
    pub created_at: u64,
    pub verified: bool,
}

impl NGOProfile {
    pub fn new(name: String, contact: String, location: String, organization_type: String) -> Self {
        let timestamp = ic_cdk::api::time();
        Self {
            id: format!("ngo:{}", name.to_lowercase()),
            name,
            contact,
            location,
            organization_type,
            created_at: timestamp,
            verified: false,
        }
    }
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Claim {
    pub id: String,
    pub user_id: String,
    pub species: String,
    pub quantity: u32,
    pub location: String,
    pub image_hash: String,
    pub co2_offset: f64,
    pub created_at: u64,
    pub status: String, // Pending, Approved, Rejected
}

impl Claim {
    pub fn new(user_id: String, species: String, quantity: u32, location: String, image_hash: String) -> Self {
        let timestamp = ic_cdk::api::time();
        let co2_offset = 0.0; // Placeholder for calculation logic
        Self {
            id: format!("claim:{}:{}", user_id, timestamp),
            user_id,
            species,
            quantity,
            location,
            image_hash,
            co2_offset,
            created_at: timestamp,
            status: "Pending".to_string(),
        }
    }
}
