import React from 'react';
import { IdentityKitProvider, IdentityKitTheme } from '@nfid/identitykit/react';
import { IdentityKitAuthType, NFIDW, InternetIdentity } from '@nfid/identitykit';

const IdentityKitWrapper = ({ children }) => {
  const isLocal = import.meta.env.MODE === 'development';
  
  // NFID Configuration
  const signers = [NFIDW, InternetIdentity];
  
  return (
    <IdentityKitProvider
      signers={signers}
      theme={IdentityKitTheme.SYSTEM}
      authType={IdentityKitAuthType.ACCOUNTS}
      onConnectFailure={(error) => {
        console.error('NFID Connection failed:', error);
      }}
      onConnectSuccess={() => {
        console.log('NFID Connection successful!');
      }}
    >
      {children}
    </IdentityKitProvider>
  );
};

export default IdentityKitWrapper;
