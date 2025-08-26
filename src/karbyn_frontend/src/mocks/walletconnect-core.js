// Mock WalletConnect core module to prevent build issues
export class Core {
  constructor(options = {}) {
    console.warn('WalletConnect core mock: constructor() called');
    this.options = options;
  }

  async init() {
    console.warn('WalletConnect core mock: init() called');
    return Promise.resolve();
  }
}

export default Core;
