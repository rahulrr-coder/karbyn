use candid::Principal;
use ic_cdk::{api::time, caller};
use ic_stable_structures::{memory_manager::{MemoryId, MemoryManager, VirtualMemory}, BTreeMap, DefaultMemoryImpl};
use std::cell::RefCell;

use crate::token_models::{
    CarbonNFT, MarketplaceListing, NFTTransaction, TokenError, ActivitySummary, 
    ActivityTypeCount, ListNFTInput, BuyNFTInput, MarketplaceFilter, 
    MarketplaceStats, TransactionType
};
use crate::activity;
use crate::token;

// Type aliases for NFT storage
type Memory = VirtualMemory<DefaultMemoryImpl>;
type NFTStore = BTreeMap<u64, CarbonNFT, Memory>;
type ListingStore = BTreeMap<u64, MarketplaceListing, Memory>;
type TransactionStore = BTreeMap<u64, NFTTransaction, Memory>;

// Memory manager for NFT storage (using memory IDs 3, 4, 5)
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = 
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static NFT_STORE: RefCell<NFTStore> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3)))
        )
    );
    
    static LISTING_STORE: RefCell<ListingStore> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4)))
        )
    );
    
    static TRANSACTION_STORE: RefCell<TransactionStore> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(5)))
        )
    );
    
    static NFT_COUNTER: RefCell<u64> = const { RefCell::new(1) };
    static LISTING_COUNTER: RefCell<u64> = const { RefCell::new(1) };
    static TRANSACTION_COUNTER: RefCell<u64> = const { RefCell::new(1) };
}

/// Mint a new Carbon Credit NFT (requires 1000 KCT)
pub fn mint_nft() -> Result<CarbonNFT, TokenError> {
    let caller_principal = caller();
    
    // Check if user has enough tokens
    if !token::can_mint_nft() {
        return Err(TokenError::InsufficientTokensForMinting);
    }
    
    // Get user's verified activities for NFT metadata
    let user_stats = activity::get_user_activity_stats();
    if user_stats.verified_activities == 0 {
        return Err(TokenError::NoActivitiesForNFT);
    }
    
    // Create activity summary for NFT
    let activity_summary = create_activity_summary(&user_stats);
    
    // Generate NFT ID
    let nft_id = NFT_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    
    // Create NFT
    let nft = CarbonNFT::new(nft_id, caller_principal, activity_summary);
    
    // Burn 1000 KCT tokens
    token::burn_tokens_for_nft(caller_principal)?;
    
    // Store NFT
    NFT_STORE.with(|store| {
        store.borrow_mut().insert(nft_id, nft.clone())
    });
    
    // Record minting transaction
    let transaction_id = TRANSACTION_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    
    let transaction = NFTTransaction::new_mint(transaction_id, nft_id, caller_principal);
    TRANSACTION_STORE.with(|store| {
        store.borrow_mut().insert(transaction_id, transaction)
    });
    
    Ok(nft)
}

/// Get user's owned NFTs
pub fn get_user_nfts(user_principal: Principal) -> Vec<CarbonNFT> {
    NFT_STORE.with(|store| {
        let store_ref = store.borrow();
        store_ref
            .iter()
            .filter_map(|(_, nft)| {
                if nft.owner == user_principal {
                    Some(nft)
                } else {
                    None
                }
            })
            .collect()
    })
}

/// Get current user's NFTs
pub fn get_my_nfts() -> Vec<CarbonNFT> {
    let caller_principal = caller();
    get_user_nfts(caller_principal)
}

/// Get NFT by ID
pub fn get_nft(nft_id: u64) -> Option<CarbonNFT> {
    NFT_STORE.with(|store| store.borrow().get(&nft_id))
}

/// List NFT for sale on marketplace
pub fn list_nft(input: ListNFTInput) -> Result<MarketplaceListing, TokenError> {
    let caller_principal = caller();
    
    // Validate price
    if input.price == 0 {
        return Err(TokenError::InvalidPrice);
    }
    
    // Check if NFT exists and is owned by caller
    let mut nft = NFT_STORE.with(|store| {
        store.borrow().get(&input.nft_id)
    }).ok_or(TokenError::NFTNotFound)?;
    
    if nft.owner != caller_principal {
        return Err(TokenError::NFTNotOwned);
    }
    
    if nft.is_listed {
        return Err(TokenError::NFTAlreadyListed);
    }
    
    // Generate listing ID
    let listing_id = LISTING_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    
    // Create listing
    let listing = MarketplaceListing::new(
        listing_id,
        input.nft_id,
        caller_principal,
        input.price,
        input.description,
    );
    
    // Mark NFT as listed
    nft.set_listed(true);
    NFT_STORE.with(|store| {
        store.borrow_mut().insert(input.nft_id, nft)
    });
    
    // Store listing
    LISTING_STORE.with(|store| {
        store.borrow_mut().insert(listing_id, listing.clone())
    });
    
    Ok(listing)
}

/// Buy NFT from marketplace
pub fn buy_nft(input: BuyNFTInput) -> Result<NFTTransaction, TokenError> {
    let caller_principal = caller();
    
    // Get listing
    let mut listing = LISTING_STORE.with(|store| {
        store.borrow().get(&input.listing_id)
    }).ok_or(TokenError::ListingNotFound)?;
    
    if !listing.is_active() {
        return Err(TokenError::ListingNotActive);
    }
    
    if listing.seller == caller_principal {
        return Err(TokenError::CannotBuyOwnNFT);
    }
    
    // Get NFT
    let mut nft = NFT_STORE.with(|store| {
        store.borrow().get(&listing.nft_id)
    }).ok_or(TokenError::NFTNotFound)?;
    
    // Transfer tokens from buyer to seller
    token::transfer_tokens(caller_principal, listing.seller, listing.price)?;
    
    // Transfer NFT ownership
    nft.transfer_ownership(caller_principal);
    NFT_STORE.with(|store| {
        store.borrow_mut().insert(listing.nft_id, nft)
    });
    
    // Mark listing as sold
    listing.mark_sold();
    LISTING_STORE.with(|store| {
        store.borrow_mut().insert(input.listing_id, listing.clone())
    });
    
    // Create transaction record
    let transaction_id = TRANSACTION_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    
    let transaction = NFTTransaction::new_sale(
        transaction_id,
        listing.nft_id,
        listing.seller,
        caller_principal,
        listing.price,
    );
    
    TRANSACTION_STORE.with(|store| {
        store.borrow_mut().insert(transaction_id, transaction.clone())
    });
    
    Ok(transaction)
}

/// Cancel NFT listing
pub fn cancel_listing(listing_id: u64) -> Result<(), TokenError> {
    let caller_principal = caller();
    
    // Get listing
    let mut listing = LISTING_STORE.with(|store| {
        store.borrow().get(&listing_id)
    }).ok_or(TokenError::ListingNotFound)?;
    
    if listing.seller != caller_principal {
        return Err(TokenError::NFTNotOwned);
    }
    
    if !listing.is_active() {
        return Err(TokenError::ListingNotActive);
    }
    
    // Get NFT and mark as not listed
    let mut nft = NFT_STORE.with(|store| {
        store.borrow().get(&listing.nft_id)
    }).ok_or(TokenError::NFTNotFound)?;
    
    nft.set_listed(false);
    NFT_STORE.with(|store| {
        store.borrow_mut().insert(listing.nft_id, nft)
    });
    
    // Cancel listing
    listing.cancel();
    LISTING_STORE.with(|store| {
        store.borrow_mut().insert(listing_id, listing)
    });
    
    Ok(())
}

/// Get marketplace listings with optional filters
pub fn get_marketplace_listings(filter: Option<MarketplaceFilter>) -> Vec<MarketplaceListing> {
    LISTING_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut listings: Vec<MarketplaceListing> = store_ref
            .iter()
            .filter_map(|(_, listing)| {
                if !listing.is_active() {
                    return None;
                }
                
                if let Some(ref f) = filter {
                    // Apply price filters
                    if let Some(min_price) = f.min_price {
                        if listing.price < min_price {
                            return None;
                        }
                    }
                    
                    if let Some(max_price) = f.max_price {
                        if listing.price > max_price {
                            return None;
                        }
                    }
                    
                    // Apply seller filter
                    if let Some(seller) = f.seller {
                        if listing.seller != seller {
                            return None;
                        }
                    }
                }
                
                Some(listing)
            })
            .collect();
        
        // Sort by listing date (newest first)
        listings.sort_by(|a, b| b.listed_at.cmp(&a.listed_at));
        
        // Apply limit
        if let Some(ref f) = filter {
            if let Some(limit) = f.limit {
                listings.truncate(limit as usize);
            }
        }
        
        listings
    })
}

/// Get user's marketplace listings
pub fn get_my_listings() -> Vec<MarketplaceListing> {
    let caller_principal = caller();
    
    LISTING_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut listings: Vec<MarketplaceListing> = store_ref
            .iter()
            .filter_map(|(_, listing)| {
                if listing.seller == caller_principal {
                    Some(listing)
                } else {
                    None
                }
            })
            .collect();
        
        // Sort by listing date (newest first)
        listings.sort_by(|a, b| b.listed_at.cmp(&a.listed_at));
        listings
    })
}

/// Get marketplace statistics
pub fn get_marketplace_stats() -> MarketplaceStats {
    let mut stats = MarketplaceStats {
        total_nfts_minted: 0,
        total_nfts_listed: 0,
        total_sales: 0,
        total_volume: 0,
        average_price: 0.0,
        total_carbon_offset: 0.0,
    };
    
    // Count total NFTs minted
    NFT_STORE.with(|store| {
        stats.total_nfts_minted = store.borrow().len() as u32;
        stats.total_carbon_offset = stats.total_nfts_minted as f64 * 1000.0; // Each NFT = 1 ton
    });
    
    // Count active listings
    LISTING_STORE.with(|store| {
        let store_ref = store.borrow();
        for (_, listing) in store_ref.iter() {
            if listing.is_active() {
                stats.total_nfts_listed += 1;
            }
        }
    });
    
    // Calculate sales statistics
    TRANSACTION_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut total_price = 0u64;
        
        for (_, transaction) in store_ref.iter() {
            if matches!(transaction.transaction_type, TransactionType::Sale) {
                stats.total_sales += 1;
                stats.total_volume += transaction.price;
                total_price += transaction.price;
            }
        }
        
        if stats.total_sales > 0 {
            stats.average_price = total_price as f64 / stats.total_sales as f64;
        }
    });
    
    stats
}

/// Get recent transactions
pub fn get_recent_transactions(limit: u32) -> Vec<NFTTransaction> {
    TRANSACTION_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut transactions: Vec<NFTTransaction> = store_ref
            .iter()
            .map(|(_, transaction)| transaction)
            .collect();
        
        // Sort by timestamp (newest first)
        transactions.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        
        // Apply limit
        transactions.into_iter().take(limit as usize).collect()
    })
}

/// Get user's transaction history
pub fn get_user_transactions(user_principal: Principal) -> Vec<NFTTransaction> {
    TRANSACTION_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut transactions: Vec<NFTTransaction> = store_ref
            .iter()
            .filter_map(|(_, transaction)| {
                if transaction.buyer == user_principal || transaction.seller == user_principal {
                    Some(transaction)
                } else {
                    None
                }
            })
            .collect();
        
        // Sort by timestamp (newest first)
        transactions.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
        transactions
    })
}

/// Get my transaction history
pub fn get_my_transactions() -> Vec<NFTTransaction> {
    let caller_principal = caller();
    get_user_transactions(caller_principal)
}

/// Create activity summary for NFT metadata
fn create_activity_summary(user_stats: &crate::activity_models::UserActivityStats) -> ActivitySummary {
    // Convert activity type counts to summary format
    let activity_breakdown: Vec<ActivityTypeCount> = user_stats
        .activities_by_type
        .iter()
        .map(|(activity_type, count)| {
            let carbon_per_unit = activity_type.default_carbon_per_unit();
            let total_offset = *count as f64 * carbon_per_unit;
            
            ActivityTypeCount {
                activity_type: activity_type.as_str().to_string(),
                count: *count,
                total_offset,
            }
        })
        .collect();
    
    // Get top activities (simplified - just take first 3 activity types)
    let top_activities: Vec<String> = activity_breakdown
        .iter()
        .take(3)
        .map(|ac| format!("{} {} activities", ac.count, ac.activity_type))
        .collect();
    
    // Create verification period string (simplified)
    let current_time = time();
    let one_month = 30 * 24 * 60 * 60 * 1_000_000_000; // 30 days in nanoseconds
    let period_start = current_time - one_month;
    
    let verification_period = format!(
        "{} - {}",
        format_timestamp(period_start),
        format_timestamp(current_time)
    );
    
    ActivitySummary {
        total_activities: user_stats.total_activities,
        activity_breakdown,
        total_carbon_offset: user_stats.total_carbon_offset,
        verification_period,
        top_activities,
    }
}

/// Format timestamp to readable date (simplified)
fn format_timestamp(timestamp: u64) -> String {
    // This is a simplified date formatter
    // In a real implementation, you'd use a proper date library
    let seconds = timestamp / 1_000_000_000;
    let days_since_epoch = seconds / (24 * 60 * 60);
    
    // Rough calculation for display (not accurate)
    let year = 1970 + (days_since_epoch / 365);
    let month = ((days_since_epoch % 365) / 30) + 1;
    
    format!("{month}/{year}")
}

/// Get NFT ownership history
pub fn get_nft_ownership_history(nft_id: u64) -> Vec<NFTTransaction> {
    TRANSACTION_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut transactions: Vec<NFTTransaction> = store_ref
            .iter()
            .filter_map(|(_, transaction)| {
                if transaction.nft_id == nft_id {
                    Some(transaction)
                } else {
                    None
                }
            })
            .collect();
        
        // Sort by timestamp (oldest first for ownership history)
        transactions.sort_by(|a, b| a.timestamp.cmp(&b.timestamp));
        transactions
    })
}

/// Get global NFT statistics
pub fn get_global_nft_stats() -> (u32, u32, u32, f64) {
    let total_minted = NFT_STORE.with(|store| store.borrow().len() as u32);
    
    let active_listings = LISTING_STORE.with(|store| {
        let store_ref = store.borrow();
        store_ref
            .iter()
            .filter(|(_, listing)| listing.is_active())
            .count() as u32
    });
    
    let total_sales = TRANSACTION_STORE.with(|store| {
        let store_ref = store.borrow();
        store_ref
            .iter()
            .filter(|(_, transaction)| matches!(transaction.transaction_type, TransactionType::Sale))
            .count() as u32
    });
    
    let total_carbon_offset = total_minted as f64 * 1000.0; // Each NFT = 1 ton = 1000kg
    
    (total_minted, active_listings, total_sales, total_carbon_offset)
}
