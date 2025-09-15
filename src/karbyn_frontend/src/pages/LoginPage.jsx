import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiWalletAuth } from '../contexts/MultiWalletAuthContext';
import { useSimpleNFIDAuth } from '../contexts/SimpleNFIDAuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: walletLogin, isAuthenticated: walletAuth } = useMultiWalletAuth();
  const { login: nfidLogin, isAuthenticated: nfidAuth } = useSimpleNFIDAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWalletLogin = async (walletType) => {
    setIsLoading(true);
    setError('');
    try {
      await walletLogin(walletType);
      if (walletAuth) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(`Failed to login with ${walletType}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNFIDLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await nfidLogin();
      if (nfidAuth) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(`Failed to login with NFID: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternetIdentityLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Implement Internet Identity login here
      console.log('Internet Identity login not yet implemented');
      setError('Internet Identity login coming soon');
    } catch (err) {
      setError(`Failed to login with Internet Identity: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Karbyn
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your preferred authentication method
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* NFID Login */}
          <button
            onClick={handleNFIDLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <img src="/assets/nfid-logo.png" alt="NFID" className="w-5 h-5 mr-2" onError={(e) => {e.target.style.display = 'none'}} />
                Sign in with NFID
              </>
            )}
          </button>

          {/* Internet Identity Login */}
          <button
            onClick={handleInternetIdentityLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <div className="w-5 h-5 mr-2 bg-white rounded-full"></div>
                Sign in with Internet Identity
              </>
            )}
          </button>

          {/* Plug Wallet Login */}
          <button
            onClick={() => handleWalletLogin('plug')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <div className="w-5 h-5 mr-2 bg-white rounded-full"></div>
                Sign in with Plug Wallet
              </>
            )}
          </button>

          {/* MetaMask Login */}
          <button
            onClick={() => handleWalletLogin('metamask')}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <div className="w-5 h-5 mr-2 bg-white rounded-full"></div>
                Sign in with MetaMask
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
