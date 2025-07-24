import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const { login, demoLogin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    await login();
  };

  const handleDemoLogin = async () => {
    await demoLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-2xl">🌱</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome to Karbyn
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn your eco-actions into valuable carbon credits
          </p>
        </div>

        <div className="bg-card py-8 px-6 organic-shadow-prominent rounded-lg border border-border">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-card-foreground mb-4">
                Sign in with Internet Identity
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Secure, decentralized authentication powered by the Internet Computer
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🔐</span>
                    Sign In with Internet Identity
                  </>
                )}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">For Development</span>
                </div>
              </div>
              
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-accent rounded-md shadow-sm text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
              >
                <span className="mr-2">🧪</span>
                Demo Login (Development)
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => alert('Plug Wallet integration coming soon!')}
                  className="flex items-center justify-center px-4 py-2 border border-border rounded-md text-sm font-medium text-card-foreground bg-card hover:bg-muted organic-transition"
                >
                  <span className="mr-2">🔌</span>
                  Plug Wallet
                </button>
                <button
                  onClick={() => alert('Stoic Wallet integration coming soon!')}
                  className="flex items-center justify-center px-4 py-2 border border-border rounded-md text-sm font-medium text-card-foreground bg-card hover:bg-muted organic-transition"
                >
                  <span className="mr-2">⚡</span>
                  Stoic Wallet
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                New to Internet Identity?{' '}
                <a
                  href="https://identity.ic0.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 organic-transition"
                >
                  Create your identity
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span>🚌</span>
              </div>
              <span>Track Activities</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span>🏆</span>
              </div>
              <span>Earn NFTs</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span>💰</span>
              </div>
              <span>Trade & Retire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
