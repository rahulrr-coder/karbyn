import React, { useState, useEffect } from 'react';

// Simple test component to debug authentication
const AuthTest = () => {
  const [logs, setLogs] = useState([]);
  
  const addLog = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('AuthTest component mounted');
    
    // Test basic functionality
    addLog('Testing basic JavaScript...');
    
    // Test NFID import
    try {
      addLog('Attempting to import NFID...');
      import('@nfid/identitykit').then(nfid => {
        addLog('NFID imported successfully!');
        addLog(`IdentityKit available: ${!!nfid.IdentityKit}`);
        addLog(`IdentityKitAuthType available: ${!!nfid.IdentityKitAuthType}`);
      }).catch(error => {
        addLog(`NFID import failed: ${error.message}`);
      });
    } catch (error) {
      addLog(`NFID import error: ${error.message}`);
    }

    // Test window environment
    addLog(`Window location: ${window.location.href}`);
    addLog(`User agent: ${navigator.userAgent.substring(0, 50)}...`);
    
  }, []);

  const testGoogleAuth = async () => {
    addLog('Testing Google authentication...');
    try {
      const nfidModule = await import('@nfid/identitykit');
      addLog('NFID modules imported for auth test');
      addLog(`Available exports: ${Object.keys(nfidModule).join(', ')}`);
      
      const { IdentityKit, IdentityKitAuthType, NFIDW } = nfidModule;
      addLog(`IdentityKit: ${!!IdentityKit}`);
      addLog(`IdentityKitAuthType: ${!!IdentityKitAuthType}`);
      addLog(`NFIDW: ${!!NFIDW}`);
      addLog(`NFIDW type: ${typeof NFIDW}`);
      
      if (!NFIDW) {
        addLog('NFIDW is undefined! Checking alternative exports...');
        addLog(`All exports: ${JSON.stringify(Object.keys(nfidModule))}`);
        return;
      }
      
      const config = {
        authType: IdentityKitAuthType.DELEGATION,
        signerClientOptions: {
          targets: ['uxrrr-q7777-77774-qaaaq-cai'],
          host: 'http://127.0.0.1:4943',
          fetchRootKey: true,
        },
        signer: NFIDW,
        signerOptions: {
          appName: 'Karbyn Test',
          logoUrl: `${window.location.origin}/favicon.ico`,
        }
      };
      
      addLog(`Config created: ${JSON.stringify(config, null, 2)}`);
      
      addLog('Creating IdentityKit...');
      const identityKit = await IdentityKit.create(config);
      addLog('IdentityKit created successfully!');
      addLog(`SignerClient available: ${!!identityKit.signerClient}`);
      addLog(`SignerClient options: ${JSON.stringify(identityKit.signerClient?.options || 'undefined')}`);
      
      addLog('Attempting login...');
      const identity = await identityKit.signerClient.login();
      addLog(`Login result: ${!!identity}`);
      
      if (identity) {
        addLog(`Principal: ${identity.getPrincipal().toString()}`);
      }
      
    } catch (error) {
      addLog(`Auth test failed: ${error.message}`);
      addLog(`Error stack: ${error.stack}`);
    }
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-white border-2 border-red-500 rounded-lg p-4 z-50 max-h-96 overflow-y-auto">
      <h3 className="text-lg font-bold text-red-600 mb-2">Auth Debug Panel</h3>
      <button 
        onClick={testGoogleAuth}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Google Auth
      </button>
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="text-xs font-mono bg-gray-100 p-1 rounded">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthTest;
