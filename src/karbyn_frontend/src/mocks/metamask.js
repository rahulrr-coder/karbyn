// Mock MetaMask SDK module to prevent build issues
// This provides minimal functionality to avoid breaking builds
export class MetaMaskSDK {
  constructor(options = {}) {
    this.options = options;
    this.provider = null;
    this.isConnected = false;
  }

  async connect() {
    console.warn('MetaMaskSDK mock: connect() called');
    return null;
  }

  async disconnect() {
    console.warn('MetaMaskSDK mock: disconnect() called');
    return null;
  }

  getProvider() {
    console.warn('MetaMaskSDK mock: getProvider() called');
    return null;
  }

  isAuthorized() {
    console.warn('MetaMaskSDK mock: isAuthorized() called');
    return false;
  }
}

export default MetaMaskSDK;

// Mock other common exports
export const PROVIDER_STATE = {};
export const RPC_METHODS = {};
export const METAMASK_EVENTS = {};
