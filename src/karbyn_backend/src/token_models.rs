use candid::{CandidType, Principal};
use ic_stable_structures::Storable;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use ic_cdk::api::time;

// Karbyn Carbon Token (KCT) Balance for each user
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct TokenBalance {
    pub principal: Principal,
    pub balance: u64, // KCT balance (1 KCT = 1kg CO₂ offset)
    pub total_earned: u64, // Total KCT ever earned
    pub last_updated: u64, // Timestamp of last update
}

impl TokenBalance {
    pub fn new(principal: Principal) -> Self {
        Self {
            principal,
            balance: 0,
            total_earned: 0,
            last_updated: time(),
        }
    }

    pub fn add_tokens(&mut self, amount: u64) {
        self.balance += amount;
        self.total_earned += amount;
        self.last_updated = time();
    }

    pub fn deduct_tokens(&mut self, amount: u64) -> Result<(), TokenError> {
        if self.balance < amount {
            return Err(TokenError::InsufficientBalance {
                required: amount,
                available: self.balance,
            });
        }
        self.balance -= amount;
        self.last_updated = time();
        Ok(())
    }

    pub fn can_mint_nft(&self) -> bool {
        self.balance >= 1000 // 1000 KCT = 1 ton CO₂
    }
}

impl Storable for TokenBalance {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 200,
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

// Carbon Credit NFT representing 1 ton of CO₂ offset
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct CarbonNFT {
    pub nft_id: u64,
    pub owner: Principal,
    pub offset_amount: String, // "1 ton CO₂"
    pub activity_summary: ActivitySummary,
    pub minted_at: u64,
    pub metadata_uri: Option<String>, // Future: IPFS link to detailed metadata
    pub is_listed: bool, // Whether currently listed for sale
}

impl CarbonNFT {
    pub fn new(nft_id: u64, owner: Principal, activity_summary: ActivitySummary) -> Self {
        Self {
            nft_id,
            owner,
            offset_amount: "1 ton CO₂".to_string(),
            activity_summary,
            minted_at: time(),
            metadata_uri: None,
            is_listed: false,
        }
    }

    pub fn transfer_ownership(&mut self, new_owner: Principal) {
        self.owner = new_owner;
        self.is_listed = false; // Remove from marketplace when transferred
    }

    pub fn set_listed(&mut self, listed: bool) {
        self.is_listed = listed;
    }
}

impl Storable for CarbonNFT {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 1000,
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

// Summary of activities that contributed to the NFT
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ActivitySummary {
    pub total_activities: u32,
    pub activity_breakdown: Vec<ActivityTypeCount>,
    pub total_carbon_offset: f64, // Should be >= 1000kg for NFT
    pub verification_period: String, // e.g., "Jan 2025 - Mar 2025"
    pub top_activities: Vec<String>, // Description of top 3 activities
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ActivityTypeCount {
    pub activity_type: String,
    pub count: u32,
    pub total_offset: f64,
}

// Marketplace listing for NFTs
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct MarketplaceListing {
    pub listing_id: u64,
    pub nft_id: u64,
    pub seller: Principal,
    pub price: u64, // Price in KCT tokens
    pub listed_at: u64,
    pub status: ListingStatus,
    pub description: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ListingStatus {
    Active,
    Sold,
    Cancelled,
}

impl ListingStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            ListingStatus::Active => "Active",
            ListingStatus::Sold => "Sold",
            ListingStatus::Cancelled => "Cancelled",
        }
    }
}

impl MarketplaceListing {
    pub fn new(
        listing_id: u64,
        nft_id: u64,
        seller: Principal,
        price: u64,
        description: Option<String>,
    ) -> Self {
        Self {
            listing_id,
            nft_id,
            seller,
            price,
            listed_at: time(),
            status: ListingStatus::Active,
            description,
        }
    }

    pub fn mark_sold(&mut self) {
        self.status = ListingStatus::Sold;
    }

    pub fn cancel(&mut self) {
        self.status = ListingStatus::Cancelled;
    }

    pub fn is_active(&self) -> bool {
        matches!(self.status, ListingStatus::Active)
    }
}

impl Storable for MarketplaceListing {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 500,
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

// Transaction record for marketplace
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct NFTTransaction {
    pub transaction_id: u64,
    pub nft_id: u64,
    pub seller: Principal,
    pub buyer: Principal,
    pub price: u64,
    pub timestamp: u64,
    pub transaction_type: TransactionType,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum TransactionType {
    Mint,
    Sale,
    Transfer,
}

impl NFTTransaction {
    pub fn new_mint(transaction_id: u64, nft_id: u64, owner: Principal) -> Self {
        Self {
            transaction_id,
            nft_id,
            seller: Principal::anonymous(), // No seller for mint
            buyer: owner,
            price: 0, // No price for mint
            timestamp: time(),
            transaction_type: TransactionType::Mint,
        }
    }

    pub fn new_sale(
        transaction_id: u64,
        nft_id: u64,
        seller: Principal,
        buyer: Principal,
        price: u64,
    ) -> Self {
        Self {
            transaction_id,
            nft_id,
            seller,
            buyer,
            price,
            timestamp: time(),
            transaction_type: TransactionType::Sale,
        }
    }
}

impl Storable for NFTTransaction {
    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Bounded {
        max_size: 300,
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }
}

// User's token and NFT portfolio
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserPortfolio {
    pub principal: Principal,
    pub token_balance: u64,
    pub total_tokens_earned: u64,
    pub nfts_owned: Vec<u64>, // NFT IDs
    pub nfts_minted: u32,
    pub marketplace_sales: u32,
    pub marketplace_purchases: u32,
    pub total_carbon_offset: f64, // Total CO₂ offset including minted NFTs
}

// Leaderboard entry
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct LeaderboardEntry {
    pub principal: Principal,
    pub username: Option<String>, // From user profile
    pub total_carbon_offset: f64,
    pub nfts_minted: u32,
    pub tokens_earned: u64,
    pub rank: u32,
}

// Error types for token and NFT operations
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum TokenError {
    InsufficientBalance { required: u64, available: u64 },
    NFTNotFound,
    NFTNotOwned,
    NFTAlreadyListed,
    NFTNotListed,
    ListingNotFound,
    ListingNotActive,
    CannotBuyOwnNFT,
    InsufficientTokensForMinting,
    NoActivitiesForNFT,
    InvalidPrice,
    MarketplaceError(String),
}

impl TokenError {
    pub fn as_str(&self) -> String {
        match self {
            TokenError::InsufficientBalance { required, available } => {
                format!("Insufficient balance: need {required} KCT, have {available} KCT")
            }
            TokenError::NFTNotFound => "NFT not found".to_string(),
            TokenError::NFTNotOwned => "You don't own this NFT".to_string(),
            TokenError::NFTAlreadyListed => "NFT is already listed for sale".to_string(),
            TokenError::NFTNotListed => "NFT is not listed for sale".to_string(),
            TokenError::ListingNotFound => "Marketplace listing not found".to_string(),
            TokenError::ListingNotActive => "Listing is no longer active".to_string(),
            TokenError::CannotBuyOwnNFT => "Cannot buy your own NFT".to_string(),
            TokenError::InsufficientTokensForMinting => "Need 1000 KCT to mint NFT".to_string(),
            TokenError::NoActivitiesForNFT => "No verified activities found for NFT minting".to_string(),
            TokenError::InvalidPrice => "Invalid price specified".to_string(),
            TokenError::MarketplaceError(msg) => format!("Marketplace error: {msg}"),
        }
    }
}

// Input structures for API functions
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ListNFTInput {
    pub nft_id: u64,
    pub price: u64, // Price in KCT
    pub description: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct BuyNFTInput {
    pub listing_id: u64,
}

// Marketplace query filters
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MarketplaceFilter {
    pub min_price: Option<u64>,
    pub max_price: Option<u64>,
    pub seller: Option<Principal>,
    pub limit: Option<u32>,
}

// Global marketplace statistics
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MarketplaceStats {
    pub total_nfts_minted: u32,
    pub total_nfts_listed: u32,
    pub total_sales: u32,
    pub total_volume: u64, // Total KCT traded
    pub average_price: f64,
    pub total_carbon_offset: f64, // Total CO₂ represented by all NFTs
}
