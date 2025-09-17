use candid::Principal;
use ic_cdk::{api::time, caller};
use ic_stable_structures::{memory_manager::{MemoryId, MemoryManager, VirtualMemory}, BTreeMap, DefaultMemoryImpl};
use std::cell::RefCell;

use crate::token_models::{TokenBalance, TokenError, UserPortfolio, LeaderboardEntry};
use crate::activity;
use crate::user;

// Type aliases for token storage
type Memory = VirtualMemory<DefaultMemoryImpl>;
type TokenStore = BTreeMap<Principal, TokenBalance, Memory>;

// Memory manager for token storage (using memory ID 2)
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = 
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static TOKEN_STORE: RefCell<TokenStore> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2)))
        )
    );
}

/// Award KCT tokens to user based on carbon offset from activity
pub fn award_tokens_for_activity(user_principal: Principal, carbon_offset: f64) -> Result<u64, TokenError> {
    // Convert carbon offset (kg) to tokens (1 KCT = 1kg CO₂)
    let tokens_to_award = (carbon_offset as u64).max(1); // Minimum 1 token per activity
    
    TOKEN_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        // Get or create token balance for user
        let mut balance = store_ref.get(&user_principal)
            .unwrap_or_else(|| TokenBalance::new(user_principal));
        
        // Award tokens
        balance.add_tokens(tokens_to_award);
        
        // Store updated balance
        store_ref.insert(user_principal, balance);
        
        Ok(tokens_to_award)
    })
}

/// Get current token balance for the calling user
pub fn get_token_balance() -> TokenBalance {
    let caller_principal = caller();
    
    TOKEN_STORE.with(|store| {
        store.borrow().get(&caller_principal)
            .unwrap_or_else(|| TokenBalance::new(caller_principal))
    })
}

/// Get token balance for any user (public query)
pub fn get_user_token_balance(principal: Principal) -> TokenBalance {
    TOKEN_STORE.with(|store| {
        store.borrow().get(&principal)
            .unwrap_or_else(|| TokenBalance::new(principal))
    })
}

/// Transfer tokens between users (for marketplace transactions)
pub fn transfer_tokens(from: Principal, to: Principal, amount: u64) -> Result<(), TokenError> {
    if amount == 0 {
        return Err(TokenError::InvalidPrice);
    }
    
    TOKEN_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        // Get sender balance
        let mut from_balance = store_ref.get(&from)
            .unwrap_or_else(|| TokenBalance::new(from));
        
        // Check sufficient balance
        if from_balance.balance < amount {
            return Err(TokenError::InsufficientBalance {
                required: amount,
                available: from_balance.balance,
            });
        }
        
        // Get receiver balance
        let mut to_balance = store_ref.get(&to)
            .unwrap_or_else(|| TokenBalance::new(to));
        
        // Transfer tokens
        from_balance.deduct_tokens(amount)?;
        to_balance.add_tokens(amount);
        
        // Update both balances
        store_ref.insert(from, from_balance);
        store_ref.insert(to, to_balance);
        
        Ok(())
    })
}

/// Burn tokens for NFT minting (deduct 1000 KCT)
pub fn burn_tokens_for_nft(user_principal: Principal) -> Result<(), TokenError> {
    TOKEN_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        let mut balance = store_ref.get(&user_principal)
            .unwrap_or_else(|| TokenBalance::new(user_principal));
        
        if !balance.can_mint_nft() {
            return Err(TokenError::InsufficientTokensForMinting);
        }
        
        balance.deduct_tokens(1000)?;
        store_ref.insert(user_principal, balance);
        
        Ok(())
    })
}

/// Check if user can mint an NFT (has >= 1000 KCT)
pub fn can_mint_nft() -> bool {
    let caller_principal = caller();
    
    TOKEN_STORE.with(|store| {
        store.borrow().get(&caller_principal)
            .map(|balance| balance.can_mint_nft())
            .unwrap_or(false)
    })
}

/// Get user's complete portfolio (tokens + NFTs)
pub fn get_user_portfolio() -> UserPortfolio {
    let caller_principal = caller();
    get_user_portfolio_by_principal(caller_principal)
}

/// Get any user's portfolio (public query)
pub fn get_user_portfolio_by_principal(principal: Principal) -> UserPortfolio {
    // Get token balance
    let token_balance = get_user_token_balance(principal);
    
    // Get user's NFTs (we'll implement this in nft.rs)
    let nfts_owned = crate::nft::get_user_nfts(principal);
    
    // Get user's activity stats for total carbon offset
    let user_stats = if principal == caller() {
        activity::get_user_activity_stats()
    } else {
        // For other users, calculate from public data
        // This is a simplified version - in practice, we'd need public stats
        crate::activity_models::UserActivityStats::new()
    };
    
    // Calculate total carbon offset including NFTs
    let nfts_carbon_offset = nfts_owned.len() as f64 * 1000.0; // Each NFT = 1000kg
    let total_carbon_offset = user_stats.total_carbon_offset + nfts_carbon_offset;
    
    let nft_ids: Vec<u64> = nfts_owned.into_iter().map(|nft| nft.nft_id).collect();
    let nfts_minted = nft_ids.len() as u32;
    
    UserPortfolio {
        principal,
        token_balance: token_balance.balance,
        total_tokens_earned: token_balance.total_earned,
        nfts_owned: nft_ids,
        nfts_minted,
        marketplace_sales: 0, // TODO: Calculate from transaction history
        marketplace_purchases: 0, // TODO: Calculate from transaction history
        total_carbon_offset,
    }
}

/// Get leaderboard of top users by carbon offset
pub fn get_leaderboard(limit: u32) -> Vec<LeaderboardEntry> {
    let mut entries: Vec<LeaderboardEntry> = Vec::new();
    
    TOKEN_STORE.with(|store| {
        let store_ref = store.borrow();
        
        for (principal, _token_balance) in store_ref.iter() {
            let portfolio = get_user_portfolio_by_principal(principal);
            
            // Get username from user profile
            let username = user::get_public_user_profile(principal.clone());
            
            entries.push(LeaderboardEntry {
                principal,
                username,
                total_carbon_offset: portfolio.total_carbon_offset,
                nfts_minted: portfolio.nfts_minted,
                tokens_earned: portfolio.total_tokens_earned,
                rank: 0, // Will be set after sorting
            });
        }
    });
    
    // Sort by total carbon offset (descending)
    entries.sort_by(|a, b| b.total_carbon_offset.partial_cmp(&a.total_carbon_offset).unwrap());
    
    // Set ranks and limit results
    for (index, entry) in entries.iter_mut().enumerate() {
        entry.rank = (index + 1) as u32;
    }
    
    entries.into_iter().take(limit as usize).collect()
}

/// Get global token statistics
pub fn get_token_stats() -> (u64, u64, u32, f64) {
    TOKEN_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut total_supply = 0u64;
        let mut total_earned = 0u64;
        let mut active_users = 0u32;
        let mut total_carbon_offset = 0.0f64;
        
        for (_, balance) in store_ref.iter() {
            total_supply += balance.balance;
            total_earned += balance.total_earned;
            if balance.balance > 0 {
                active_users += 1;
            }
            // Estimate carbon offset from tokens (this is simplified)
            total_carbon_offset += balance.total_earned as f64;
        }
        
        (total_supply, total_earned, active_users, total_carbon_offset)
    })
}

/// Get token distribution statistics
pub fn get_token_distribution() -> Vec<(String, u32)> {
    let mut distribution = vec![
        ("0-99 KCT".to_string(), 0),
        ("100-499 KCT".to_string(), 0),
        ("500-999 KCT".to_string(), 0),
        ("1000+ KCT".to_string(), 0),
    ];
    
    TOKEN_STORE.with(|store| {
        let store_ref = store.borrow();
        
        for (_, balance) in store_ref.iter() {
            match balance.balance {
                0..=99 => distribution[0].1 += 1,
                100..=499 => distribution[1].1 += 1,
                500..=999 => distribution[2].1 += 1,
                _ => distribution[3].1 += 1,
            }
        }
    });
    
    distribution
}

/// Get daily token earnings (simplified - returns last 7 days)
pub fn get_daily_token_earnings() -> Vec<(String, u64)> {
    // This is a simplified implementation
    // In a real system, we'd track daily earnings in separate storage
    let current_time = time();
    let one_day = 24 * 60 * 60 * 1_000_000_000; // 1 day in nanoseconds
    
    let mut daily_earnings = Vec::new();
    
    for i in 0..7 {
        let _day_timestamp = current_time - (i * one_day);
        let day_str = format!("Day -{i}");
        
        // For now, return placeholder data
        // In practice, we'd query activities by date and sum carbon offsets
        let earnings = if i == 0 { 150 } else { 100 + (i * 10) };
        daily_earnings.push((day_str, earnings));
    }
    
    daily_earnings.reverse();
    daily_earnings
}
