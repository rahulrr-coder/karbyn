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
