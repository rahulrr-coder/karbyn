import React, { useState } from 'react';
import { useSimpleNFIDAuth } from '../contexts/SimpleNFIDAuthContext';
import AuthButton from '../components/auth/AuthButton';
import EnhancedAuthModal from '../components/auth/EnhancedAuthModal';
import RoleSelectionModal from '../components/auth/RoleSelectionModal';
import { motion } from 'framer-motion';

const AuthDemo = () => {
  const {
    isAuthenticated,
    user,
    authProvider,
    isLoading,
    error,
    getAvailableAuthMethods,
    loginWithNFIDGoogle,
    loginWithNFIDIdentity,
    loginWithInternetIdentity,
    loginWithPlug,
    logout,
    updateProfile,
    refreshUserData,
    USER_ROLES,
    AUTH_PROVIDERS
  } = useSimpleNFIDAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

  const availableMethods = getAvailableAuthMethods();

  const showMessage = (message) => {
    setDemoMessage(message);
    setTimeout(() => setDemoMessage(''), 3000);
  };

  const handleManualAuth = async (method) => {
    try {
      let success = false;
      switch (method) {
        case 'nfid-google':
          success = await loginWithNFIDGoogle(true);
          break;
        case 'nfid-ii':
          success = await loginWithNFIDIdentity(true);
          break;
        case 'internet-identity':
          success = await loginWithInternetIdentity(true);
          break;
        case 'plug':
          success = await loginWithPlug(true);
          break;
      }
      if (success) {
        showMessage(`✅ Successfully authenticated with ${method}!`);
      }
    } catch (error) {
      showMessage(`❌ Authentication failed: ${error.message}`);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({
        name: 'Demo User Updated',
        email: 'demo@karbyn.com'
      });
      showMessage('✅ Profile updated successfully!');
    } catch (error) {
      showMessage(`❌ Profile update failed: ${error.message}`);
    }
  };

  const handleRefreshData = async () => {
    try {
      await refreshUserData();
      showMessage('✅ User data refreshed successfully!');
    } catch (error) {
      showMessage(`❌ Data refresh failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 NFID Authentication Demo
          </h1>
          <p className="text-xl text-gray-600">
            Interactive demonstration of Karbyn's authentication system
          </p>
        </div>

        {/* Status Message */}
        {demoMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center"
          >
            <p className="text-blue-800 font-medium">{demoMessage}</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Authentication Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication Status</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  isAuthenticated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Loading:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  isLoading 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isLoading ? '⏳ Loading...' : '✓ Ready'}
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {user && (
                <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">User Info:</h3>
                  <p className="text-sm text-green-700">Name: {user.name || 'N/A'}</p>
                  <p className="text-sm text-green-700">Role: {typeof user.role === 'string' ? user.role : 'Individual'}</p>
                  <p className="text-sm text-green-700">Provider: {authProvider || 'N/A'}</p>
                  <p className="text-sm text-green-700">Credits: {user.credits || 0}</p>
                </div>
              )}
            </div>
          </div>

          {/* Authentication Methods */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication Methods</h2>
            
            <div className="space-y-4">
              {availableMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleManualAuth(method.id)}
                  disabled={isLoading || isAuthenticated}
                  className={`
                    w-full p-4 rounded-lg border text-left transition-all
                    ${method.isRecommended 
                      ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                    }
                    ${isLoading || isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{method.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  {method.isRecommended && (
                    <div className="mt-2">
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        Recommended
                      </span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {isAuthenticated && (
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={logout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Demo Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Controls</h2>
            
            <div className="space-y-4">
              {/* Auth Button Component */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-3">Auth Button Component:</h3>
                <AuthButton 
                  variant="primary" 
                  showDropdown={true}
                  fullWidth={true}
                />
              </div>

              {/* Modal Triggers */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  🔑 Show Auth Modal
                </button>

                <button
                  onClick={() => setShowRoleModal(true)}
                  disabled={!isAuthenticated}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  👤 Show Role Selection
                </button>
              </div>

              {/* User Actions */}
              {isAuthenticated && (
                <div className="pt-4 border-t space-y-3">
                  <button
                    onClick={handleProfileUpdate}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    ✏️ Update Profile
                  </button>

                  <button
                    onClick={handleRefreshData}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    🔄 Refresh Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Information</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Available User Roles:</h3>
              <div className="space-y-2">
                {Object.values(USER_ROLES).map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Auth Providers:</h3>
              <div className="space-y-2">
                {Object.values(AUTH_PROVIDERS).map((provider) => (
                  <div key={provider} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm font-mono">{provider}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Usage Examples</h2>
          <div className="space-y-4 text-sm">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-green-400 mb-2">// Basic Hook Usage:</p>
              <code className="text-gray-300">
                const {`{ isAuthenticated, user, loginWithNFIDGoogle }`} = useSimpleNFIDAuth();
              </code>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-green-400 mb-2">// Protected Route:</p>
              <code className="text-gray-300">
                {`<ProtectedRoute requiredRoles={['NGO']}><MyComponent /></ProtectedRoute>`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnhancedAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSelected={(role, info) => {
          setShowRoleModal(false);
          showMessage(`✅ Role selected: ${role}`);
        }}
      />
    </div>
  );
};

export default AuthDemo;
