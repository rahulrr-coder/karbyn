// Simple polyfills for browser compatibility
import { Buffer } from 'buffer';

// Create process polyfill
const processPolyfill = {
  browser: true,
  env: {},
  nextTick: (callback) => setTimeout(callback, 0),
  platform: 'browser',
  version: '',
  versions: { node: '' }
};

// Setup globals
if (typeof globalThis !== 'undefined') {
  globalThis.Buffer = Buffer;
  globalThis.global = globalThis.global || globalThis;
  globalThis.process = processPolyfill;
}
