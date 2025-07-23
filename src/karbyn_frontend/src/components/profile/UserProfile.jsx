import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import biometricService from '../../services/biometricService';
import BiometricRegistration from '../verification/BiometricRegistration';
import { User, Shield, Eye, Calendar, TrendingUp, Download, Upload, Settings } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [biometricProfile, setBiometricProfile] = useState(null);
  const [verificationStats, setVerificationStats] = useState(null);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.walletAddress) {
      // Load biometric profile
      const profile = biometricService.getBiometricProfile(user.walletAddress);
      setBiometricProfile(profile);
      
      // Load verification statistics
      const stats = biometricService.getVerificationStats(user.walletAddress);
      setVerificationStats(stats);
    }
  }, [user]);

  const handleBiometricRegistration = (biometricData) => {
    setBiometricProfile(biometricData);
    setShowBiometricSetup(false);
    
    // Refresh stats
    const stats = biometricService.getVerificationStats(user.walletAddress);
    setVerificationStats(stats);
  };

  const exportBiometricData = () => {
    if (!user?.walletAddress) return;
    
    const exportData = biometricService.exportBiometricData(user.walletAddress);
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `karbyn-biometric-backup-${user.walletAddress.substring(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const importBiometricData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        const success = biometricService.importBiometricData(importData);
        
        if (success) {
          // Refresh profile and stats
          const profile = biometricService.getBiometricProfile(user.walletAddress);
          setBiometricProfile(profile);
          
          const stats = biometricService.getVerificationStats(user.walletAddress);
          setVerificationStats(stats);
          
          alert('Biometric data imported successfully!');
        } else {
          alert('Failed to import biometric data. Please check the file format.');
        }
      } catch (error) {
        alert('Invalid file format. Please select a valid backup file.');
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-600">Manage your account and biometric settings</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Wallet Address</p>
            <p className="font-mono text-sm text-gray-800">
              {user.walletAddress?.substring(0, 12)}...
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'biometric', label: 'Biometric Security', icon: Shield },
              { id: 'verification', label: 'Verification History', icon: Eye },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Account Status</h3>
                  <p className="text-sm text-green-700">
                    {biometricProfile ? 'Biometric Verified' : 'Standard Account'}
                  </p>
                  <div className="mt-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      biometricProfile 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {biometricProfile ? '✓ Verified' : '⚠ Unverified'}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Verification Count</h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {verificationStats?.totalVerifications || 0}
                  </p>
                  <p className="text-sm text-blue-700">Total verifications</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Success Rate</h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {verificationStats?.successRate?.toFixed(1) || 0}%
                  </p>
                  <p className="text-sm text-purple-700">Verification success</p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Account Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Wallet Type:</span>
                    <span className="ml-2 font-medium text-gray-800">{user.walletType || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Registration Date:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {biometricProfile?.createdAt 
                        ? new Date(biometricProfile.createdAt).toLocaleDateString()
                        : 'Not registered'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Verification:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {verificationStats?.lastVerification?.createdAt
                        ? new Date(verificationStats.lastVerification.createdAt).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Average Confidence:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {verificationStats?.averageConfidence?.toFixed(1) || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Biometric Security Tab */}
          {activeTab === 'biometric' && (
            <div className="space-y-6">
              {!biometricProfile ? (
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Biometric Security Not Enabled
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Enable biometric security to verify your identity during activity submissions 
                    and increase your trust score.
                  </p>
                  <button
                    onClick={() => setShowBiometricSetup(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Set Up Biometric Security
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-800">
                        Biometric Profile Active
                      </h3>
                      <div className="flex items-center text-green-600">
                        <Shield className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Registration Date:</span>
                        <span className="ml-2 font-medium text-green-800">
                          {new Date(biometricProfile.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">Capture Quality:</span>
                        <span className="ml-2 font-medium text-green-800">
                          {(biometricProfile.captureQuality * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">Last Updated:</span>
                        <span className="ml-2 font-medium text-green-800">
                          {new Date(biometricProfile.lastUpdated || biometricProfile.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">Descriptor Length:</span>
                        <span className="ml-2 font-medium text-green-800">
                          {biometricProfile.faceDescriptor?.length || 0} features
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowBiometricSetup(true)}
                      className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Update Biometric Profile
                    </button>
                    <button
                      onClick={exportBiometricData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Backup
                    </button>
                  </div>
                </div>
              )}

              {showBiometricSetup && (
                <div className="border-t pt-6">
                  <BiometricRegistration
                    onBiometricCaptured={handleBiometricRegistration}
                    walletAddress={user.walletAddress}
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowBiometricSetup(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verification History Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              {verificationStats && verificationStats.totalVerifications > 0 ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">
                        {verificationStats.totalVerifications}
                      </p>
                      <p className="text-sm text-blue-700">Total</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-900">
                        {verificationStats.successfulVerifications}
                      </div>
                      <p className="text-sm text-green-700">Successful</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-900">
                        {verificationStats.failedVerifications}
                      </div>
                      <p className="text-sm text-red-700">Failed</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-900">
                        {verificationStats.averageSimilarity?.toFixed(1)}%
                      </div>
                      <p className="text-sm text-purple-700">Avg Match</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Recent Verifications</h3>
                    <p className="text-sm text-gray-600">
                      Detailed verification history will be displayed here. Currently showing summary statistics.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Verification History
                  </h3>
                  <p className="text-gray-600">
                    Complete some activity verifications to see your history here.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Data Management</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  Manage your biometric data and privacy settings.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Export biometric data</span>
                    <button
                      onClick={exportBiometricData}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Import biometric data</span>
                    <label className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors cursor-pointer flex items-center">
                      <Upload className="h-3 w-3 mr-1" />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={importBiometricData}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Clear all biometric data</span>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all biometric data? This action cannot be undone.')) {
                          biometricService.clearAllBiometricData();
                          setBiometricProfile(null);
                          setVerificationStats(null);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Clear Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Privacy Information</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>• Your biometric data is stored locally in your browser</p>
                  <p>• Face descriptors are mathematical representations, not actual images</p>
                  <p>• Data is encrypted and cannot be reverse-engineered to recreate your face</p>
                  <p>• You can export, import, or delete your data at any time</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
