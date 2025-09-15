import React from 'react';
import { useSafeNavigate } from './utils/safeRouterHooks';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const SimpleLogin = () => {
  const navigate = useSafeNavigate();
  
  const handleLogin = () => {
    console.log('Login clicked - implement NFID here');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Sign in to Karbyn</h2>
          <p className="mt-2 text-muted-foreground">
            Connect your wallet to start making climate impact
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full"
            variant="default"
            size="lg"
          >
            <Icon name="Shield" className="mr-2" />
            Login with NFID (Coming Soon)
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Icon name="ArrowLeft" className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
