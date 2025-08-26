// Simple browser polyfills
(function() {
  // Setup Buffer
  if (typeof window !== 'undefined' && !window.Buffer) {
    try {
      const { Buffer } = require('buffer');
      window.Buffer = Buffer;
      window.global = window.globalThis || window;
    } catch (e) {
      console.warn('Buffer polyfill failed:', e);
    }
  }
})();
