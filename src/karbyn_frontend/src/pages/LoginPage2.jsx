import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/CleanAuthContext';
import LoginButton from '../components/LoginButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Karbyn</h1>
            <p className="text-gray-600">Connect your wallet to get started</p>
          </div>
          
          <div className="space-y-4">
            <LoginButton className="w-full justify-center">
              Connect Wallet
            </LoginButton>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                By connecting, you agree to our{' '}
                <a href="#" className="text-green-600 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
