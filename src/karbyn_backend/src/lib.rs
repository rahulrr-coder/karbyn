mod models;
mod user;
mod activity;
mod nft;
mod token;
mod activity_models;
mod token_models;

use candid::Principal;
use models::{WalletType, AuthResponse, UserProfile};

// User authentication functions
#[ic_cdk::update]
fn authenticate_internet_identity() -> AuthResponse {
    user::authenticate_ic_user(WalletType::InternetIdentity)
}

#[ic_cdk::update]
fn authenticate_plug() -> AuthResponse {
    user::authenticate_ic_user(WalletType::Plug)
}

#[ic_cdk::update]
fn authenticate_nfid() -> AuthResponse {
    user::authenticate_ic_user(WalletType::NFID)
}

#[ic_cdk::update]
fn authenticate_metamask(ethereum_address: String, signature: String) -> AuthResponse {
    user::authenticate_metamask_user(ethereum_address, signature)
}

#[ic_cdk::query]
fn get_user_profile() -> Option<UserProfile> {
    user::get_user_profile()
}

#[ic_cdk::query]
fn get_metamask_user_profile(ethereum_address: String) -> Option<UserProfile> {
    user::get_metamask_user_profile(ethereum_address)
}

#[ic_cdk::update]
fn update_user_profile(username: Option<String>, email: Option<String>) -> AuthResponse {
    user::update_user_profile(username, email)
}

#[ic_cdk::query]
fn get_user_count() -> u64 {
    user::get_user_count()
}

// Basic canister info
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}! Welcome to Karbyn - Decentralized Climate Action Platform", name)
}

#[ic_cdk::query]
fn get_canister_info() -> String {
    format!("Karbyn Backend Canister - Version 1.0.0\nTotal Users: {}", user::get_user_count())
}
