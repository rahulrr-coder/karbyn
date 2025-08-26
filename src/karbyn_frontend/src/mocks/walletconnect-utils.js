// Mock WalletConnect utils module to prevent build issues
export const formatJsonRpcRequest = (method, params) => {
  console.warn('WalletConnect utils mock: formatJsonRpcRequest() called');
  return { id: Date.now(), method, params, jsonrpc: '2.0' };
};

export const formatJsonRpcResult = (id, result) => {
  console.warn('WalletConnect utils mock: formatJsonRpcResult() called');
  return { id, result, jsonrpc: '2.0' };
};

export const formatJsonRpcError = (id, error) => {
  console.warn('WalletConnect utils mock: formatJsonRpcError() called');
  return { id, error, jsonrpc: '2.0' };
};

export const parseUri = (uri) => {
  console.warn('WalletConnect utils mock: parseUri() called');
  return { topic: '', version: '2', bridge: '', key: '', handshakeTopic: '', methods: [] };
};

export const isValidUrl = (url) => {
  console.warn('WalletConnect utils mock: isValidUrl() called');
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const createExpiringPromise = (promise, timeout, errorMessage) => {
  console.warn('WalletConnect utils mock: createExpiringPromise() called');
  return promise;
};

export default {
  formatJsonRpcRequest,
  formatJsonRpcResult,
  formatJsonRpcError,
  parseUri,
  isValidUrl,
  createExpiringPromise
};
