import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BiometricRegistration from '../verification/BiometricRegistration';
import biometricService from '../../services/biometricService';
import { Wallet, Shield, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const SignupWithBiometric = () => {
  const { login } = useAuth();
  const [step, setStep] = useState(1); // 1: wallet, 2: biometric, 3: complete
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [biometricData, setBiometricData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate wallet connection (replace with actual wallet integration)
  const connectWallet = async (walletType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock wallet address (replace with actual wallet connection)
      const mockAddress = `${walletType.toLowerCase()}_${Date.now().toString(36)}`;
      
      setWalletAddress(mockAddress);
      setSelectedWallet(walletType);
      setStep(2);
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle biometric registration completion
  const handleBiometricCaptured = async (biometricProfile) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save biometric profile
      const saved = biometricService.saveBiometricProfile(biometricProfile);
      
      if (!saved) {
        throw new Error('Failed to save biometric profile');
      }
      
      setBiometricData(biometricProfile);
      
      // Simulate user registration with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Login user
      const userData = {
        walletAddress,
        walletType: selectedWallet,
        hasBiometric: true,
        biometricRegisteredAt: biometricProfile.timestamp
      };
      
      login(userData);
      setStep(3);
      
    } catch (error) {
      console.error('Error completing biometric registration:', error);
      setError('Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Skip biometric registration
  const skipBiometric = async () => {
    setIsLoading(true);
    
    try {
      // Simulate user registration without biometric
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        walletAddress,
        walletType: selectedWallet,
        hasBiometric: false
      };
      
      login(userData);
      setStep(3);
      
    } catch (error) {
      setError('Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-md mx-auto">
            <span>Connect Wallet</span>
            <span>Biometric Setup</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Wallet Connection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Wallet className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Karbyn</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Connect your wallet to get started with AI-powered carbon credit verification and eco-activity tracking.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => connectWallet('Plug')}
                disabled={isLoading}
                className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Plug Wallet</h3>
                <p className="text-sm text-gray-600 mt-1">Connect with Plug</p>
              </button>

              <button
                onClick={() => connectWallet('Stoic')}
                disabled={isLoading}
                className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Stoic Wallet</h3>
                <p className="text-sm text-gray-600 mt-1">Connect with Stoic</p>
              </button>
            </div>

            {isLoading && (
              <div className="mt-6">
                <div className="inline-flex items-center text-green-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  Connecting wallet...
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Biometric Registration */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Secure Your Account</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Register your biometric profile to enable AI-powered verification for your eco-activities.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Why Biometric Registration?</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Prevents fraud and ensures authentic activity submissions</li>
                <li>• Enables instant verification without manual review</li>
                <li>• Increases your trust score and carbon credit value</li>
                <li>• Provides secure, privacy-focused identity verification</li>
              </ul>
            </div>

            <BiometricRegistration 
              onBiometricCaptured={handleBiometricCaptured}
              walletAddress={walletAddress}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={goBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              
              <button
                onClick={skipBiometric}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Registration Complete */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Karbyn!</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your account has been successfully created. You're now ready to start tracking your eco-activities and earning carbon credits.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <h3 className="font-semibold text-green-800 mb-2">Account Summary:</h3>
              <div className="text-sm text-green-700 space-y-1 text-left">
                <div className="flex justify-between">
                  <span>Wallet:</span>
                  <span className="font-medium">{selectedWallet}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="font-mono text-xs">{walletAddress.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Biometric:</span>
                  <span className="font-medium">
                    {biometricData ? 'Registered ✓' : 'Not registered'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">What's next?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1">Track Activities</h4>
                  <p className="text-gray-600">Log your daily eco-friendly activities</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1">Earn Credits</h4>
                  <p className="text-gray-600">Get verified carbon credits for your actions</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1">Trade NFTs</h4>
                  <p className="text-gray-600">Buy, sell, and retire carbon credit NFTs</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="mt-6 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupWithBiometric;
