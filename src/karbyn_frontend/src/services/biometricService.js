// Biometric Service for managing user face biometrics
class BiometricService {
  constructor() {
    this.storageKey = 'karbyn_biometric_profiles';
  }

  // Save biometric profile to localStorage (in production, this would be encrypted and stored securely)
  saveBiometricProfile(biometricData) {
    try {
      const profiles = this.getAllProfiles();
      profiles[biometricData.walletAddress] = {
        ...biometricData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(profiles));
      console.log('Biometric profile saved successfully for wallet:', biometricData.walletAddress);
      return true;
    } catch (error) {
      console.error('Error saving biometric profile:', error);
      return false;
    }
  }

  // Get biometric profile for a specific wallet address
  getBiometricProfile(walletAddress) {
    try {
      const profiles = this.getAllProfiles();
      return profiles[walletAddress] || null;
    } catch (error) {
      console.error('Error retrieving biometric profile:', error);
      return null;
    }
  }

  // Get all biometric profiles
  getAllProfiles() {
    try {
      const profiles = localStorage.getItem(this.storageKey);
      return profiles ? JSON.parse(profiles) : {};
    } catch (error) {
      console.error('Error retrieving all biometric profiles:', error);
      return {};
    }
  }

  // Update biometric profile
  updateBiometricProfile(walletAddress, updates) {
    try {
      const profiles = this.getAllProfiles();
      if (profiles[walletAddress]) {
        profiles[walletAddress] = {
          ...profiles[walletAddress],
          ...updates,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating biometric profile:', error);
      return false;
    }
  }

  // Delete biometric profile
  deleteBiometricProfile(walletAddress) {
    try {
      const profiles = this.getAllProfiles();
      delete profiles[walletAddress];
      localStorage.setItem(this.storageKey, JSON.stringify(profiles));
      return true;
    } catch (error) {
      console.error('Error deleting biometric profile:', error);
      return false;
    }
  }

  // Check if user has biometric profile
  hasBiometricProfile(walletAddress) {
    const profile = this.getBiometricProfile(walletAddress);
    return profile !== null && profile.faceDescriptor && profile.faceDescriptor.length > 0;
  }

  // Validate biometric profile integrity
  validateBiometricProfile(profile) {
    if (!profile) return false;
    
    const requiredFields = ['walletAddress', 'faceDescriptor', 'timestamp', 'captureQuality'];
    const hasAllFields = requiredFields.every(field => profile.hasOwnProperty(field));
    
    if (!hasAllFields) return false;
    
    // Validate face descriptor
    if (!Array.isArray(profile.faceDescriptor) || profile.faceDescriptor.length !== 128) {
      return false;
    }
    
    // Validate capture quality
    if (typeof profile.captureQuality !== 'number' || profile.captureQuality < 0 || profile.captureQuality > 1) {
      return false;
    }
    
    return true;
  }

  // Get verification history for a wallet
  getVerificationHistory(walletAddress) {
    try {
      const historyKey = `${this.storageKey}_history_${walletAddress}`;
      const history = localStorage.getItem(historyKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error retrieving verification history:', error);
      return [];
    }
  }

  // Save verification result to history
  saveVerificationResult(walletAddress, verificationResult) {
    try {
      const historyKey = `${this.storageKey}_history_${walletAddress}`;
      const history = this.getVerificationHistory(walletAddress);
      
      const verificationRecord = {
        id: Date.now().toString(),
        ...verificationResult,
        walletAddress,
        createdAt: new Date().toISOString()
      };
      
      history.unshift(verificationRecord); // Add to beginning of array
      
      // Keep only last 50 verification records
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error saving verification result:', error);
      return false;
    }
  }

  // Get verification statistics for a wallet
  getVerificationStats(walletAddress) {
    const history = this.getVerificationHistory(walletAddress);
    
    if (history.length === 0) {
      return {
        totalVerifications: 0,
        successfulVerifications: 0,
        failedVerifications: 0,
        successRate: 0,
        averageSimilarity: 0,
        averageConfidence: 0,
        lastVerification: null
      };
    }
    
    const successful = history.filter(v => v.isMatch);
    const failed = history.filter(v => !v.isMatch);
    
    const totalSimilarity = history.reduce((sum, v) => sum + (v.similarity || 0), 0);
    const totalConfidence = history.reduce((sum, v) => sum + (v.confidence || 0), 0);
    
    return {
      totalVerifications: history.length,
      successfulVerifications: successful.length,
      failedVerifications: failed.length,
      successRate: (successful.length / history.length) * 100,
      averageSimilarity: totalSimilarity / history.length,
      averageConfidence: totalConfidence / history.length,
      lastVerification: history[0]
    };
  }

  // Export biometric data (for backup or migration)
  exportBiometricData(walletAddress) {
    try {
      const profile = this.getBiometricProfile(walletAddress);
      const history = this.getVerificationHistory(walletAddress);
      
      if (!profile) return null;
      
      return {
        profile,
        history,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error exporting biometric data:', error);
      return null;
    }
  }

  // Import biometric data (for backup restoration or migration)
  importBiometricData(exportedData) {
    try {
      if (!exportedData || !exportedData.profile) {
        throw new Error('Invalid export data');
      }
      
      const { profile, history = [] } = exportedData;
      
      // Validate profile before importing
      if (!this.validateBiometricProfile(profile)) {
        throw new Error('Invalid biometric profile in export data');
      }
      
      // Save profile
      const profileSaved = this.saveBiometricProfile(profile);
      if (!profileSaved) {
        throw new Error('Failed to save biometric profile');
      }
      
      // Save history if available
      if (history.length > 0) {
        const historyKey = `${this.storageKey}_history_${profile.walletAddress}`;
        localStorage.setItem(historyKey, JSON.stringify(history));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing biometric data:', error);
      return false;
    }
  }

  // Clear all biometric data (for privacy/security)
  clearAllBiometricData() {
    try {
      // Get all wallet addresses first
      const profiles = this.getAllProfiles();
      const walletAddresses = Object.keys(profiles);
      
      // Clear main profiles
      localStorage.removeItem(this.storageKey);
      
      // Clear verification histories
      walletAddresses.forEach(walletAddress => {
        const historyKey = `${this.storageKey}_history_${walletAddress}`;
        localStorage.removeItem(historyKey);
      });
      
      console.log('All biometric data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing biometric data:', error);
      return false;
    }
  }
}

// Create singleton instance
const biometricService = new BiometricService();

export default biometricService;
