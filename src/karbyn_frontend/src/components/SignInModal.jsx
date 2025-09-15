import React, { useState } from 'react';
import { useMultiWalletAuth } from '../contexts/MultiWalletAuthContext';
import { useSimpleNFIDAuth } from '../contexts/SimpleNFIDAuthContext';

const SignInModal = ({ onClose }) => {
  const { login } = useMultiWalletAuth();
  const { loginWithNFIDGoogle } = useSimpleNFIDAuth();
  const [error, setError] = useState(null);

  const handleLogin = async (method) => {
    try {
      setError(null);
      if (method === 'nfid') {
        await loginWithNFIDGoogle();
      } else {
        await login(method, process.env.REACT_APP_CANISTER_ID);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}
        <button onClick={() => handleLogin('plug')}>Sign in with Plug Wallet</button>
        <button onClick={() => handleLogin('metamask')}>Sign in with MetaMask</button>
        <button onClick={() => handleLogin('nfid')}>Sign in with Google (via NFID)</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SignInModal;
