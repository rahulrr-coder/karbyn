// Mock analytics module to prevent Web3Auth from importing Segment
export class AnalyticsBrowser {
  constructor() {}
  static load() {
    return new AnalyticsBrowser();
  }
  track() {}
  identify() {}
  reset() {}
}
