use candid::{CandidType, Principal};
use ic_stable_structures::Storable;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use ic_cdk::api::time;

// Activity Types with Carbon Calculation Data
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ActivityType {
    PlantTree,
    RecycleWaste,
    UsePublicTransport,
    UseRenewableEnergy,
    ReduceConsumption,
}

impl ActivityType {
    /// Get the default carbon offset value per unit for this activity type
    pub fn default_carbon_per_unit(&self) -> f64 {
        match self {
            ActivityType::PlantTree => 20.0,         // kg CO2 per tree
            ActivityType::RecycleWaste => 0.5,       // kg CO2 per kg recycled
            ActivityType::UsePublicTransport => 0.1, // kg CO2 saved per km
            ActivityType::UseRenewableEnergy => 0.4, // kg CO2 saved per kWh
            ActivityType::ReduceConsumption => 2.0,  // kg CO2 saved per action
        }
    }

    /// Get the string representation of the activity type
    pub fn as_str(&self) -> &'static str {
        match self {
            ActivityType::PlantTree => "PlantTree",
            ActivityType::RecycleWaste => "RecycleWaste",
            ActivityType::UsePublicTransport => "UsePublicTransport",
            ActivityType::UseRenewableEnergy => "UseRenewableEnergy",
            ActivityType::ReduceConsumption => "ReduceConsumption",
        }
    }

    /// Parse activity type from string
    pub fn from_str(s: &str) -> Result<Self, ActivityError> {
        match s {
            "PlantTree" => Ok(ActivityType::PlantTree),
            "RecycleWaste" => Ok(ActivityType::RecycleWaste),
            "UsePublicTransport" => Ok(ActivityType::UsePublicTransport),
            "UseRenewableEnergy" => Ok(ActivityType::UseRenewableEnergy),
            "ReduceConsumption" => Ok(ActivityType::ReduceConsumption),
            _ => Err(ActivityError::InvalidActivityType(s.to_string())),
        }
    }

    /// Get validation rules for this activity type
    pub fn validation_rules(&self) -> ActivityValidationRules {
        match self {
            ActivityType::PlantTree => ActivityValidationRules {
                requires_location: true,
                requires_quantity: true,
                requires_proof: true,
                min_quantity: 1.0,
                max_quantity: 1000.0,
                unit_name: "trees".to_string(),
            },
            ActivityType::RecycleWaste => ActivityValidationRules {
                requires_location: false,
                requires_quantity: true,
                requires_proof: true,
                min_quantity: 0.1,
                max_quantity: 1000.0,
                unit_name: "kg".to_string(),
            },
            ActivityType::UsePublicTransport => ActivityValidationRules {
                requires_location: true,
                requires_quantity: true,
                requires_proof: false,
                min_quantity: 0.5,
                max_quantity: 500.0,
                unit_name: "km".to_string(),
            },
            ActivityType::UseRenewableEnergy => ActivityValidationRules {
                requires_location: false,
                requires_quantity: true,
                requires_proof: true,
                min_quantity: 1.0,
                max_quantity: 10000.0,
                unit_name: "kWh".to_string(),
            },
            ActivityType::ReduceConsumption => ActivityValidationRules {
                requires_location: false,
                requires_quantity: false,
                requires_proof: true,
                min_quantity: 1.0,
                max_quantity: 100.0,
                unit_name: "actions".to_string(),
            },
        }
    }
}

// Activity validation rules
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ActivityValidationRules {
    pub requires_location: bool,
    pub requires_quantity: bool,
    pub requires_proof: bool,
    pub min_quantity: f64,
    pub max_quantity: f64,
    pub unit_name: String,
}

// Activity submission input
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SubmitActivityInput {
    pub activity_type: String,
    pub description: String,
    pub location: Option<String>,
    pub quantity: f64,
    pub proof_url: Option<String>,
    pub additional_notes: Option<String>,
}

// Activity record stored in the system
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Activity {
    pub id: u64,
    pub user_principal: Principal,
    pub activity_type: ActivityType,
    pub description: String,
    pub location: Option<String>,
    pub quantity: f64,
    pub calculated_carbon_offset: f64,
    pub proof_url: Option<String>,
    pub additional_notes: Option<String>,
    pub submitted_at: u64,
    pub verified_at: Option<u64>,
    pub verification_status: ActivityVerificationStatus,
    pub nft_generated: bool,
    pub verification_score: u8, // 0-100
}

// Activity verification status
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ActivityVerificationStatus {
    Pending,
    Verified,
    Rejected,
    UnderReview,
}

impl ActivityVerificationStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            ActivityVerificationStatus::Pending => "Pending",
            ActivityVerificationStatus::Verified => "Verified",
            ActivityVerificationStatus::Rejected => "Rejected",
            ActivityVerificationStatus::UnderReview => "UnderReview",
        }
    }
}

// User activity statistics
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UserActivityStats {
    pub total_activities: u32,
    pub verified_activities: u32,
    pub pending_activities: u32,
    pub total_carbon_offset: f64,
    pub activities_by_type: Vec<(ActivityType, u32)>,
    pub nfts_generated: u32,
    pub average_verification_score: f64,
    pub last_activity_date: Option<u64>,
    pub activity_streak_days: u32,
}

// Activity history item for public display
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ActivityHistoryItem {
    pub id: u64,
    pub activity_type: ActivityType,
    pub description: String,
    pub location: Option<String>,
    pub quantity: f64,
    pub calculated_carbon_offset: f64,
    pub submitted_at: u64,
    pub verification_status: ActivityVerificationStatus,
    pub verification_score: u8,
    pub nft_generated: bool,
}

// Activity error types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ActivityError {
    InvalidActivityType(String),
    InvalidQuantity(String),
    MissingRequiredField(String),
    LocationRequired,
    ProofRequired,
    QuantityOutOfRange(f64, f64, f64), // provided, min, max
    ActivityNotFound,
    UserNotFound,
    InsufficientPermissions,
    DuplicateActivity,
    ValidationFailed(String),
    CalculationError(String),
}

// Implement Storable for Activity
impl Storable for Activity {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

impl Activity {
    /// Validate the activity data
    pub fn validate(&self) -> Result<(), ActivityError> {
        let rules = self.activity_type.validation_rules();

        // Validate description
        if self.description.trim().is_empty() {
            return Err(ActivityError::MissingRequiredField("description".to_string()));
        }
        
        if self.description.len() > 500 {
            return Err(ActivityError::ValidationFailed("Description too long".to_string()));
        }

        // Validate location requirement
        if rules.requires_location && self.location.is_none() {
            return Err(ActivityError::LocationRequired);
        }

        // Validate quantity
        if rules.requires_quantity {
            if self.quantity < rules.min_quantity || self.quantity > rules.max_quantity {
                return Err(ActivityError::QuantityOutOfRange(
                    self.quantity,
                    rules.min_quantity,
                    rules.max_quantity,
                ));
            }
        }

        // Validate proof requirement
        if rules.requires_proof && self.proof_url.is_none() {
            return Err(ActivityError::ProofRequired);
        }

        Ok(())
    }

    /// Calculate carbon offset based on activity type and quantity
    pub fn calculate_carbon_offset(&self) -> f64 {
        let base_carbon_per_unit = self.activity_type.default_carbon_per_unit();
        base_carbon_per_unit * self.quantity
    }

    /// Check if this activity is ready for NFT generation
    pub fn is_nft_eligible(&self) -> bool {
        self.verification_status == ActivityVerificationStatus::Verified
            && self.verification_score >= 80
            && !self.nft_generated
    }

    /// Get user-friendly activity summary
    pub fn get_summary(&self) -> String {
        let unit = self.activity_type.validation_rules().unit_name;
        format!(
            "{}: {} {} ({}kg CO₂)",
            self.activity_type.as_str(),
            self.quantity,
            unit,
            self.calculated_carbon_offset
        )
    }

    /// Update activity timestamp to current time
    pub fn update_verification(&mut self, status: ActivityVerificationStatus, score: u8) {
        self.verification_status = status.clone();
        self.verification_score = score;
        if status == ActivityVerificationStatus::Verified {
            self.verified_at = Some(time());
        }
    }
}

impl UserActivityStats {
    /// Create new empty stats
    pub fn new() -> Self {
        Self {
            total_activities: 0,
            verified_activities: 0,
            pending_activities: 0,
            total_carbon_offset: 0.0,
            activities_by_type: vec![],
            nfts_generated: 0,
            average_verification_score: 0.0,
            last_activity_date: None,
            activity_streak_days: 0,
        }
    }

    /// Update stats with a new activity
    pub fn add_activity(&mut self, activity: &Activity) {
        self.total_activities += 1;
        
        match activity.verification_status {
            ActivityVerificationStatus::Verified => self.verified_activities += 1,
            ActivityVerificationStatus::Pending => self.pending_activities += 1,
            _ => {}
        }

        if activity.verification_status == ActivityVerificationStatus::Verified {
            self.total_carbon_offset += activity.calculated_carbon_offset;
        }

        if activity.nft_generated {
            self.nfts_generated += 1;
        }

        self.last_activity_date = Some(activity.submitted_at);
    }
}

// Carbon calculation utilities
pub struct CarbonCalculator;

impl CarbonCalculator {
    /// Calculate carbon offset with location-based adjustments
    pub fn calculate_with_location_factor(
        activity_type: &ActivityType,
        quantity: f64,
        location: &Option<String>,
    ) -> f64 {
        let base_offset = activity_type.default_carbon_per_unit() * quantity;
        
        // Apply location-based multipliers (simplified)
        let location_multiplier = match location {
            Some(loc) if loc.to_lowercase().contains("urban") => 1.2,
            Some(loc) if loc.to_lowercase().contains("rural") => 0.9,
            Some(loc) if loc.to_lowercase().contains("forest") => 1.5,
            _ => 1.0,
        };

        base_offset * location_multiplier
    }

    /// Validate carbon offset calculation
    pub fn validate_calculation(
        activity_type: &ActivityType,
        quantity: f64,
        calculated_offset: f64,
    ) -> Result<(), ActivityError> {
        let expected_min = activity_type.default_carbon_per_unit() * quantity * 0.8;
        let expected_max = activity_type.default_carbon_per_unit() * quantity * 2.0;

        if calculated_offset < expected_min || calculated_offset > expected_max {
            return Err(ActivityError::CalculationError(format!(
                "Carbon offset calculation out of expected range: {} (expected: {}-{})",
                calculated_offset, expected_min, expected_max
            )));
        }

        Ok(())
    }
}
