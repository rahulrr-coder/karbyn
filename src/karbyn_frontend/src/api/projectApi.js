// Project API functions for Karbyn platform
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/karbyn_backend/karbyn_backend.did.js";

// Create an agent for communicating with the Internet Computer
const agent = new HttpAgent();
const canisterId = process.env.KARBYN_BACKEND_CANISTER_ID || "uxrrr-q7777-77774-qaaaq-cai";

// In development environments, we don't verify the certificate
if (process.env.NODE_ENV !== "production") {
  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
    console.error(err);
  });
}

// Create an actor for the backend canister
const karbynBackend = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});


/**
 * Submit a new project to the Karbyn platform
 * @param {Object} projectData - The project data to submit
 * @returns {Promise<Object>} - The response from the backend
 */
export const submitProject = async (projectData) => {
  try {
    console.log('Submitting project data:', projectData);
    
    // Ensure required fields are present
    if (!projectData.basics.name) {
      throw new Error('Project name is required');
    }
    
    if (!projectData.basics.description) {
      throw new Error('Project description is required');
    }
    
    // Map form data to the format expected by the backend
    const activityInput = {
      activity_type: projectData.basics.type || 'PlantTree',
      proof_url: projectData.impact.photos && projectData.impact.photos.length > 0 ? 
        [projectData.impact.photos[0].url] : [],
      description: `${projectData.basics.name}: ${projectData.basics.description}`,
      quantity: parseFloat(projectData.basics.carbonImpact) || 1,
      additional_notes: projectData.impact.standard ? [projectData.impact.standard] : [],
      location: projectData.basics.location ? [projectData.basics.location] : []
    };
    
    console.log('Mapped activity input:', activityInput);
    
    // Call the backend canister
    const result = await karbynBackend.submit_activity(activityInput);
    console.log('Backend response:', result);
    
    // Process the result
    if (result && 'Ok' in result) {
      const activity = result.Ok;
      return {
        success: true,
        projectId: `KARBYN-${activity.id || Date.now()}`,
        message: "Project submitted successfully",
      };
    } else if (result && 'Err' in result) {
      // Handle specific error types from the backend
      const error = result.Err;
      let errorMessage = "Failed to submit project";
      
      if ('MissingRequiredField' in error) {
        errorMessage = `Missing required field: ${error.MissingRequiredField}`;
      } else if ('ValidationFailed' in error) {
        errorMessage = `Validation failed: ${error.ValidationFailed}`;
      } else if ('InvalidQuantity' in error) {
        errorMessage = `Invalid carbon impact quantity: ${error.InvalidQuantity}`;
      } else if ('LocationRequired' in error) {
        errorMessage = "Location is required for this project type";
      } else if ('UserNotFound' in error) {
        errorMessage = "User not found. Please ensure you're logged in";
      } else if ('InvalidActivityType' in error) {
        errorMessage = `Invalid project type: ${error.InvalidActivityType}`;
      }
      
      throw new Error(errorMessage);
    } else {
      // Handle unexpected response format
      throw new Error('Unexpected response from backend');
    }
  } catch (error) {
    console.error("Error submitting project:", error);
    throw error;
  }
};

/**
 * Maps project types to activity types recognized by the backend
 * @param {string} projectType - The project type from the form
 * @returns {string} - The corresponding activity type for the backend
 */
const mapProjectTypeToActivityType = (projectType) => {
  const mapping = {
    'reforestation': 'PlantTree',
    'conservation': 'ReduceConsumption',
    'renewable-energy': 'UseRenewableEnergy',
    'methane-capture': 'ReduceConsumption',
    'sustainable-agriculture': 'ReduceConsumption',
    'energy-efficiency': 'ReduceConsumption',
    'waste-management': 'RecycleWaste'
  };
  
  return mapping[projectType] || 'ReduceConsumption';
};

/**
 * Get a list of project types from the backend
 * @returns {Promise<Array>} - List of project types
 */
export const getProjectTypes = async () => {
  try {
    // Get activity types from the backend
    const activityTypes = await karbynBackend.get_activity_types();
    
    // Map activity types to project types
    return activityTypes.map(([type, impact, description]) => {
      // Convert backend type format (e.g., "PlantTree") to frontend format (e.g., "reforestation")
      const id = typeToProjectId(type);
      return {
        id,
        name: typeToDisplayName(type),
        impact,
        description
      };
    });
  } catch (error) {
    console.error("Error fetching project types:", error);
    // Fallback to default project types if backend call fails
    return [
      { id: "reforestation", name: "Reforestation" },
      { id: "conservation", name: "Conservation" },
      { id: "renewable-energy", name: "Renewable Energy" },
      { id: "methane-capture", name: "Methane Capture" },
      { id: "sustainable-agriculture", name: "Sustainable Agriculture" },
      { id: "energy-efficiency", name: "Energy Efficiency" },
      { id: "waste-management", name: "Waste Management" },
    ];
  }
};

/**
 * Converts backend activity type to frontend project ID
 */
const typeToProjectId = (type) => {
  const mapping = {
    'PlantTree': 'reforestation',
    'ReduceConsumption': 'conservation',
    'UseRenewableEnergy': 'renewable-energy',
    'RecycleWaste': 'waste-management',
    'UsePublicTransport': 'energy-efficiency'
  };
  
  return mapping[type] || 'conservation';
};

/**
 * Converts backend activity type to user-friendly display name
 */
const typeToDisplayName = (type) => {
  const mapping = {
    'PlantTree': 'Reforestation',
    'ReduceConsumption': 'Conservation',
    'UseRenewableEnergy': 'Renewable Energy',
    'RecycleWaste': 'Waste Management',
    'UsePublicTransport': 'Energy Efficiency'
  };
  
  return mapping[type] || type;
};

/**
 * Get a list of carbon standards from the backend
 * @returns {Promise<Array>} - List of carbon standards
 */
export const getCarbonStandards = async () => {
  try {
    // For now, we're using a static list of carbon standards
    // In a future version, this could be fetched from the backend if available
    return [
      { id: "vcs", name: "Verified Carbon Standard (VCS)" },
      { id: "gold-standard", name: "Gold Standard" },
      { id: "cdm", name: "Clean Development Mechanism (CDM)" },
      { id: "american-carbon-registry", name: "American Carbon Registry" },
      { id: "climate-action-reserve", name: "Climate Action Reserve" },
      { id: "plan-vivo", name: "Plan Vivo" },
    ];
  } catch (error) {
    console.error("Error fetching carbon standards:", error);
    return [];
  }
};

/**
 * Get user profile from the backend
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async () => {
  try {
    const user = await karbynBackend.get_current_user();
    return user[0] || null; // Returns the user object or null if not found
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Get user activity statistics from the backend
 * @returns {Promise<Object>} - User activity statistics
 */
export const getUserActivityStats = async () => {
  try {
    return await karbynBackend.get_user_activity_stats();
  } catch (error) {
    console.error("Error fetching user activity stats:", error);
    return null;
  }
};

export default {
  submitProject,
  getProjectTypes,
  getCarbonStandards
};
