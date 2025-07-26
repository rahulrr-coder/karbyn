import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const SimpleLogin = () => {
  const { 
    loginWithInternetIdentity, 
    loginWithPlug, 
    getAvailableWallets, 
    isLoading,
    isAuthenticated 
  } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [loginError, setLoginError] = useState('');

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Get the intended destination or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleLogin = async (walletType) => {
    try {
      setLoginError('');
      setSelectedWallet(walletType);
      
      if (walletType === 'internet-identity') {
        await loginWithInternetIdentity();
      } else if (walletType === 'plug') {
        await loginWithPlug();
      }
      
      // Navigation will happen automatically via useEffect when isAuthenticated becomes true
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setSelectedWallet(null);
    }
  };

  const availableWallets = getAvailableWallets();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Leaf" size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Karbyn</h1>
            <p className="text-muted-foreground">Choose your wallet to get started</p>
          </div>

          {/* Error Display */}
          {loginError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-destructive" />
                <p className="text-sm text-destructive">{loginError}</p>
              </div>
            </div>
          )}

          {/* Wallet Options */}
          <div className="space-y-3">
            {availableWallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant="outline"
                size="lg"
                onClick={() => handleLogin(wallet.id)}
                disabled={isLoading || !wallet.available}
                isLoading={selectedWallet === wallet.id}
                className="w-full justify-start"
                iconName={wallet.id === 'internet-identity' ? 'Shield' : 'Plug'}
                iconPosition="left"
              >
                {wallet.name}
                {!wallet.available && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Not Available
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              For local development, Internet Identity is recommended
            </p>
          </div>

          {/* Development Notice */}
          {window.location.hostname.includes('localhost') && (
            <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={14} className="text-accent" />
                <p className="text-xs text-accent">
                  Local development mode detected
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
