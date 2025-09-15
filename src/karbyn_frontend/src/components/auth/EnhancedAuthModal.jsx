import React, { useState, useEffect } from 'react';
import { useSimpleNFIDAuth } from '../../contexts/SimpleNFIDAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeNavigate } from '../../utils/safeRouterHooks';

const EnhancedAuthModal = ({ isOpen, onClose, defaultMethod = null }) => {
  const {
    loginWithNFIDGoogle,
    loginWithNFIDIdentity,
    loginWithInternetIdentity,
    loginWithPlug,
    isLoading,
    error,
    getAvailableAuthMethods,
    isAuthenticated
  } = useSimpleNFIDAuth();

  const [selectedMethod, setSelectedMethod] = useState(defaultMethod);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [connectionStep, setConnectionStep] = useState('selection'); // 'selection', 'connecting', 'success'
  const navigate = useSafeNavigate();

  const availableMethods = getAvailableAuthMethods();

  useEffect(() => {
    if (isAuthenticated) {
      setConnectionStep('success');
      setTimeout(() => {
        onClose();
        navigate('/dashboard');
      }, 1500);
    }
  }, [isAuthenticated, onClose, navigate]);

  const handleAuthMethod = async (methodId) => {
    console.log('=== AUTH MODAL: handleAuthMethod called with:', methodId);
    try {
      setSelectedMethod(methodId);
      setConnectionStep('connecting');

      let success = false;

      switch (methodId) {
        case 'nfid-google':
          console.log('=== AUTH MODAL: Calling loginWithNFIDGoogle');
          success = await loginWithNFIDGoogle(rememberChoice);
          console.log('=== AUTH MODAL: loginWithNFIDGoogle result:', success);
          break;
        case 'nfid-ii':
          success = await loginWithNFIDIdentity(rememberChoice);
          break;
        case 'internet-identity':
          success = await loginWithInternetIdentity(rememberChoice);
          break;
        case 'plug':
          success = await loginWithPlug(rememberChoice);
          break;
        default:
          throw new Error('Unknown authentication method');
      }

      if (success) {
        setConnectionStep('success');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setConnectionStep('selection');
      setSelectedMethod(null);
    }
  };

  const renderAuthOption = (method) => (
    <motion.button
      key={method.id}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        console.log('=== AUTH MODAL: Button clicked for method:', method.id);
        handleAuthMethod(method.id);
      }}
      disabled={isLoading}
      className={`
        relative w-full p-4 rounded-xl border-2 transition-all duration-300 text-left
        ${method.isRecommended 
          ? 'border-green-500 bg-green-50 hover:bg-green-100' 
          : 'border-gray-200 bg-white hover:bg-gray-50'
        }
        ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}
        ${isLoading && selectedMethod === method.id ? 'opacity-75' : ''}
      `}
    >
      {method.isRecommended && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Recommended
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        <div className="text-2xl">{method.icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{method.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{method.description}</p>
        </div>
        {isLoading && selectedMethod === method.id && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        )}
      </div>
    </motion.button>
  );

  const renderConnectionStep = () => {
    switch (connectionStep) {
      case 'connecting':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecting...</h3>
            <p className="text-gray-600">
              {selectedMethod === 'nfid-google' && 'Please complete the Google authentication process'}
              {selectedMethod === 'nfid-ii' && 'Authenticating with NFID Internet Identity'}
              {selectedMethod === 'internet-identity' && 'Please complete the Internet Identity process'}
              {selectedMethod === 'plug' && 'Please approve the connection in your Plug wallet'}
            </p>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-600 mb-2">Connected Successfully!</h3>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </motion.div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Karbyn</h2>
              <p className="text-gray-600">Choose your preferred authentication method</p>
            </div>

            {availableMethods.map(renderAuthOption)}

            {/* Remember choice option */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <input
                type="checkbox"
                id="remember-choice"
                checked={rememberChoice}
                onChange={(e) => setRememberChoice(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="remember-choice" className="text-sm text-gray-600">
                Remember my choice and sign me in automatically next time
              </label>
            </div>

            {/* Error display */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            {/* Info section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">ℹ️</div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">New to Web3?</p>
                  <p>
                    We recommend signing in with Google for the easiest experience. 
                    It's secure and doesn't require any technical knowledge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Close button */}
            {connectionStep === 'selection' && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {renderConnectionStep()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnhancedAuthModal;
