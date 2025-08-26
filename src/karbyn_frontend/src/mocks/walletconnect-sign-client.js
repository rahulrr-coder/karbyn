// Mock WalletConnect sign-client module to prevent build issues
export class SignClient {
  constructor(options = {}) {
    console.warn('WalletConnect sign-client mock: constructor() called');
    this.options = options;
  }

  static async init(options = {}) {
    console.warn('WalletConnect sign-client mock: init() called');
    return new SignClient(options);
  }

  async connect() {
    console.warn('WalletConnect sign-client mock: connect() called');
    return { uri: '', approval: () => Promise.resolve() };
  }

  async disconnect() {
    console.warn('WalletConnect sign-client mock: disconnect() called');
    return Promise.resolve();
  }
}

export default SignClient;
