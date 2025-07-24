use candid::Principal;
use ic_cdk::{api::time, caller};
use ic_stable_structures::{memory_manager::{MemoryId, MemoryManager, VirtualMemory}, BTreeMap, DefaultMemoryImpl};
use std::cell::RefCell;

use crate::activity_models::{
    Activity, ActivityType, ActivityError, ActivityVerificationStatus,
    SubmitActivityInput, UserActivityStats, ActivityHistoryItem, CarbonCalculator
};
use crate::user;

// Type aliases for activity storage
type Memory = VirtualMemory<DefaultMemoryImpl>;
type ActivityStore = BTreeMap<u64, Activity, Memory>;

// Memory manager for activity storage (using memory ID 1, user storage uses ID 0)
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = 
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static ACTIVITY_STORE: RefCell<ActivityStore> = RefCell::new(
        BTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );
    
    static ACTIVITY_COUNTER: RefCell<u64> = const { RefCell::new(1) };
}

/// Submit a new environmental activity
pub fn submit_activity(input: SubmitActivityInput) -> Result<Activity, ActivityError> {
    let caller_principal = caller();
    
    // Verify user exists
    if !user::user_exists(caller_principal) {
        return Err(ActivityError::UserNotFound);
    }
    
    // Parse and validate activity type
    let activity_type = input.activity_type.parse::<ActivityType>()?;
    
    // Validate quantity
    if input.quantity <= 0.0 {
        return Err(ActivityError::InvalidQuantity("Quantity must be greater than 0".to_string()));
    }
    
    // Generate unique activity ID
    let activity_id = ACTIVITY_COUNTER.with(|counter| {
        let mut c = counter.borrow_mut();
        let id = *c;
        *c += 1;
        id
    });
    
    // Calculate carbon offset with location factors
    let calculated_carbon_offset = CarbonCalculator::calculate_with_location_factor(
        &activity_type,
        input.quantity,
        &input.location,
    );
    
    // Validate the calculation
    CarbonCalculator::validate_calculation(&activity_type, input.quantity, calculated_carbon_offset)?;
    
    // Create activity record
    let activity = Activity {
        id: activity_id,
        user_principal: caller_principal,
        activity_type,
        description: input.description.trim().to_string(),
        location: input.location.filter(|l| !l.trim().is_empty()),
        quantity: input.quantity,
        calculated_carbon_offset,
        proof_url: input.proof_url.filter(|p| !p.trim().is_empty()),
        additional_notes: input.additional_notes.filter(|n| !n.trim().is_empty()),
        submitted_at: time(),
        verified_at: None,
        verification_status: ActivityVerificationStatus::Pending,
        nft_generated: false,
        verification_score: 0,
    };
    
    // Validate the complete activity
    activity.validate()?;
    
    // Check for potential duplicate activities (same user, type, quantity, and location within 1 hour)
    let is_duplicate = ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let one_hour_ago = time().saturating_sub(60 * 60 * 1_000_000_000); // 1 hour in nanoseconds
        
        for (_, existing_activity) in store_ref.iter() {
            if existing_activity.user_principal == caller_principal
                && existing_activity.activity_type == activity.activity_type
                && existing_activity.quantity == activity.quantity
                && existing_activity.location == activity.location
                && existing_activity.submitted_at > one_hour_ago
            {
                return true;
            }
        }
        false
    });
    
    if is_duplicate {
        return Err(ActivityError::DuplicateActivity);
    }
    
    // Store the activity
    ACTIVITY_STORE.with(|store| {
        store.borrow_mut().insert(activity_id, activity.clone())
    });
    
    // Update user stats (don't add to carbon offset until verified)
    let _ = user::update_user_stats(caller_principal, 0.0, 1, 0);
    
    Ok(activity)
}

/// Get all activities for the current user
pub fn get_user_activities() -> Vec<ActivityHistoryItem> {
    let caller_principal = caller();
    
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut user_activities: Vec<ActivityHistoryItem> = store_ref
            .iter()
            .filter_map(|(_, activity)| {
                if activity.user_principal == caller_principal {
                    Some(ActivityHistoryItem {
                        id: activity.id,
                        activity_type: activity.activity_type.clone(),
                        description: activity.description.clone(),
                        location: activity.location.clone(),
                        quantity: activity.quantity,
                        calculated_carbon_offset: activity.calculated_carbon_offset,
                        submitted_at: activity.submitted_at,
                        verification_status: activity.verification_status.clone(),
                        verification_score: activity.verification_score,
                        nft_generated: activity.nft_generated,
                    })
                } else {
                    None
                }
            })
            .collect();
        
        // Sort by submission time (newest first)
        user_activities.sort_by(|a, b| b.submitted_at.cmp(&a.submitted_at));
        user_activities
    })
}

/// Get activity by ID (only if user owns it)
pub fn get_activity(activity_id: u64) -> Option<Activity> {
    let caller_principal = caller();
    
    ACTIVITY_STORE.with(|store| {
        store.borrow().get(&activity_id).and_then(|activity| {
            if activity.user_principal == caller_principal {
                Some(activity)
            } else {
                None
            }
        })
    })
}

/// Get comprehensive activity statistics for the current user
pub fn get_user_activity_stats() -> UserActivityStats {
    let caller_principal = caller();
    let mut stats = UserActivityStats::new();
    
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut total_verification_score = 0u64;
        let mut verified_count = 0u32;
        
        // Count activities by type
        let mut type_counts: std::collections::HashMap<String, u32> = std::collections::HashMap::new();
        
        for (_, activity) in store_ref.iter() {
            if activity.user_principal == caller_principal {
                stats.add_activity(&activity);
                
                // Count by type
                let type_str = activity.activity_type.as_str();
                *type_counts.entry(type_str.to_string()).or_insert(0) += 1;
                
                // Calculate average verification score
                if activity.verification_status == ActivityVerificationStatus::Verified {
                    total_verification_score += activity.verification_score as u64;
                    verified_count += 1;
                }
            }
        }
        
        // Convert type counts to the required format
        stats.activities_by_type = type_counts
            .into_iter()
            .filter_map(|(type_str, count)| {
                type_str.parse::<ActivityType>()
                    .ok()
                    .map(|activity_type| (activity_type, count))
            })
            .collect();
        
        // Calculate average verification score
        if verified_count > 0 {
            stats.average_verification_score = total_verification_score as f64 / verified_count as f64;
        }
        
        // Calculate activity streak (simplified - consecutive days with activity)
        stats.activity_streak_days = calculate_activity_streak(caller_principal);
    });
    
    stats
}

/// Verify an activity (admin function for testing, in production this would be called by AI/verification system)
pub fn verify_activity(activity_id: u64, verification_score: u8) -> Result<(), ActivityError> {
    ACTIVITY_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        if let Some(mut activity) = store_ref.get(&activity_id) {
            // Update verification status based on score
            let status = if verification_score >= 80 {
                ActivityVerificationStatus::Verified
            } else if verification_score >= 60 {
                ActivityVerificationStatus::UnderReview
            } else {
                ActivityVerificationStatus::Rejected
            };
            
            activity.update_verification(status.clone(), verification_score);
            
            // If verified, update user's carbon offset and award tokens
            if status == ActivityVerificationStatus::Verified {
                let _ = user::update_user_stats(
                    activity.user_principal,
                    activity.calculated_carbon_offset,
                    0, // No additional activity count (already counted on submission)
                    if activity.is_nft_eligible() { 1 } else { 0 },
                );
                
                // Award KCT tokens based on carbon offset
                let _ = crate::token::award_tokens_for_activity(
                    activity.user_principal,
                    activity.calculated_carbon_offset
                );
                
                // Mark NFT as generated if eligible
                if activity.is_nft_eligible() {
                    activity.nft_generated = true;
                }
            }
            
            store_ref.insert(activity_id, activity);
            Ok(())
        } else {
            Err(ActivityError::ActivityNotFound)
        }
    })
}

/// Get all activities for admin/verification purposes (returns limited info for privacy)
pub fn get_all_activities_for_verification() -> Vec<ActivityHistoryItem> {
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut all_activities: Vec<ActivityHistoryItem> = store_ref
            .iter()
            .filter(|(_, activity)| {
                activity.verification_status == ActivityVerificationStatus::Pending
                    || activity.verification_status == ActivityVerificationStatus::UnderReview
            })
            .map(|(_, activity)| ActivityHistoryItem {
                id: activity.id,
                activity_type: activity.activity_type.clone(),
                description: activity.description.clone(),
                location: activity.location.clone(),
                quantity: activity.quantity,
                calculated_carbon_offset: activity.calculated_carbon_offset,
                submitted_at: activity.submitted_at,
                verification_status: activity.verification_status.clone(),
                verification_score: activity.verification_score,
                nft_generated: activity.nft_generated,
            })
            .collect();
        
        // Sort by submission time (oldest first for verification queue)
        all_activities.sort_by(|a, b| a.submitted_at.cmp(&b.submitted_at));
        all_activities
    })
}

/// Get global activity statistics
pub fn get_global_activity_stats() -> (u32, f64, u32, u32) {
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut total_activities = 0u32;
        let mut total_carbon_offset = 0.0f64;
        let mut verified_activities = 0u32;
        let mut nfts_generated = 0u32;
        
        for (_, activity) in store_ref.iter() {
            total_activities += 1;
            
            if activity.verification_status == ActivityVerificationStatus::Verified {
                verified_activities += 1;
                total_carbon_offset += activity.calculated_carbon_offset;
            }
            
            if activity.nft_generated {
                nfts_generated += 1;
            }
        }
        
        (total_activities, total_carbon_offset, verified_activities, nfts_generated)
    })
}

/// Get recent global activities (for community feed)
pub fn get_recent_global_activities(limit: u32) -> Vec<ActivityHistoryItem> {
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut verified_activities: Vec<ActivityHistoryItem> = store_ref
            .iter()
            .filter_map(|(_, activity)| {
                if activity.verification_status == ActivityVerificationStatus::Verified {
                    Some(ActivityHistoryItem {
                        id: activity.id,
                        activity_type: activity.activity_type.clone(),
                        description: activity.description.clone(),
                        location: activity.location.clone(),
                        quantity: activity.quantity,
                        calculated_carbon_offset: activity.calculated_carbon_offset,
                        submitted_at: activity.submitted_at,
                        verification_status: activity.verification_status.clone(),
                        verification_score: activity.verification_score,
                        nft_generated: activity.nft_generated,
                    })
                } else {
                    None
                }
            })
            .collect();
        
        // Sort by submission time (newest first)
        verified_activities.sort_by(|a, b| b.submitted_at.cmp(&a.submitted_at));
        
        // Take only the requested number
        verified_activities.into_iter().take(limit as usize).collect()
    })
}

/// Get activities by type (for analytics)
pub fn get_activities_by_type(activity_type: String) -> Result<Vec<ActivityHistoryItem>, ActivityError> {
    let target_type = activity_type.parse::<ActivityType>()?;
    
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut type_activities: Vec<ActivityHistoryItem> = store_ref
            .iter()
            .filter_map(|(_, activity)| {
                if activity.activity_type == target_type
                    && activity.verification_status == ActivityVerificationStatus::Verified
                {
                    Some(ActivityHistoryItem {
                        id: activity.id,
                        activity_type: activity.activity_type.clone(),
                        description: activity.description.clone(),
                        location: activity.location.clone(),
                        quantity: activity.quantity,
                        calculated_carbon_offset: activity.calculated_carbon_offset,
                        submitted_at: activity.submitted_at,
                        verification_status: activity.verification_status.clone(),
                        verification_score: activity.verification_score,
                        nft_generated: activity.nft_generated,
                    })
                } else {
                    None
                }
            })
            .collect();
        
        // Sort by carbon offset (highest impact first)
        type_activities.sort_by(|a, b| b.calculated_carbon_offset.partial_cmp(&a.calculated_carbon_offset).unwrap());
        
        Ok(type_activities)
    })
}

/// Delete an activity (only if not verified and belongs to user)
pub fn delete_activity(activity_id: u64) -> Result<(), ActivityError> {
    let caller_principal = caller();
    
    ACTIVITY_STORE.with(|store| {
        let mut store_ref = store.borrow_mut();
        
        if let Some(activity) = store_ref.get(&activity_id) {
            // Check ownership
            if activity.user_principal != caller_principal {
                return Err(ActivityError::InsufficientPermissions);
            }
            
            // Can't delete verified activities
            if activity.verification_status == ActivityVerificationStatus::Verified {
                return Err(ActivityError::ValidationFailed("Cannot delete verified activities".to_string()));
            }
            
            store_ref.remove(&activity_id);
            
            // Update user stats (remove the activity count)
            let _ = user::update_user_stats(caller_principal, 0.0, u32::MAX, 0); // u32::MAX will subtract 1
            
            Ok(())
        } else {
            Err(ActivityError::ActivityNotFound)
        }
    })
}

/// Calculate activity streak for a user (consecutive days with activities)
fn calculate_activity_streak(user_principal: Principal) -> u32 {
    ACTIVITY_STORE.with(|store| {
        let store_ref = store.borrow();
        let mut activity_dates: Vec<u64> = store_ref
            .iter()
            .filter_map(|(_, activity)| {
                if activity.user_principal == user_principal {
                    Some(activity.submitted_at)
                } else {
                    None
                }
            })
            .collect();
        
        if activity_dates.is_empty() {
            return 0;
        }
        
        // Sort dates (newest first)
        activity_dates.sort_by(|a, b| b.cmp(a));
        
        // Convert to days since epoch
        let mut unique_days: Vec<u64> = activity_dates
            .into_iter()
            .map(|timestamp| timestamp / (24 * 60 * 60 * 1_000_000_000)) // Convert to days
            .collect();
        
        // Remove duplicates and sort
        unique_days.dedup();
        unique_days.sort_by(|a, b| b.cmp(a));
        
        if unique_days.is_empty() {
            return 0;
        }
        
        // Calculate consecutive days from today
        let today = time() / (24 * 60 * 60 * 1_000_000_000);
        let mut streak = 0u32;
        let mut expected_day = today;
        
        for day in unique_days {
            if day == expected_day || day == expected_day - 1 {
                streak += 1;
                expected_day = day - 1;
            } else {
                break;
            }
        }
        
        streak
    })
}

/// Get activity type information (for frontend)
pub fn get_activity_types() -> Vec<(String, f64, String)> {
    vec![
        (
            ActivityType::PlantTree.as_str().to_string(),
            ActivityType::PlantTree.default_carbon_per_unit(),
            "trees".to_string(),
        ),
        (
            ActivityType::RecycleWaste.as_str().to_string(),
            ActivityType::RecycleWaste.default_carbon_per_unit(),
            "kg".to_string(),
        ),
        (
            ActivityType::UsePublicTransport.as_str().to_string(),
            ActivityType::UsePublicTransport.default_carbon_per_unit(),
            "km".to_string(),
        ),
        (
            ActivityType::UseRenewableEnergy.as_str().to_string(),
            ActivityType::UseRenewableEnergy.default_carbon_per_unit(),
            "kWh".to_string(),
        ),
        (
            ActivityType::ReduceConsumption.as_str().to_string(),
            ActivityType::ReduceConsumption.default_carbon_per_unit(),
            "actions".to_string(),
        ),
    ]
}
