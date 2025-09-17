// Simple browser polyfills
(function() {
  // Setup global
  if (typeof window !== 'undefined') {
    window.global = window.globalThis || window;
  }

  // Setup process
  if (typeof window !== 'undefined' && !window.process) {
    window.process = {
      env: {},
      nextTick: (fn) => setTimeout(fn, 0),
      version: '',
      platform: 'browser'
    };
  }

  // Setup Buffer
  if (typeof window !== 'undefined' && !window.Buffer) {
    try {
      const { Buffer } = require('buffer');
      window.Buffer = Buffer;
    } catch (e) {
      console.warn('Buffer polyfill failed:', e);
    }
  }
})();
