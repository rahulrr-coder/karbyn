import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Plugin to inject globals
const injectGlobalsPlugin = () => ({
  name: 'inject-globals',
  transformIndexHtml: (html) => {
    return html.replace(
      '<head>',
      `<head>
        <script>
          window.global = window.globalThis;
          window.process = { env: {} };
          // Simple Buffer polyfill
          if (typeof Buffer === 'undefined') {
            window.Buffer = {
              isBuffer: function(obj) { return false; },
              from: function(data) { return new Uint8Array(data); },
              alloc: function(size) { return new Uint8Array(size); }
            };
          }
        </script>`
    );
  }
});

export default defineConfig({
  plugins: [react(), injectGlobalsPlugin()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
    include: ["buffer", "process"],
    exclude: ["@metamask/sdk", "@walletconnect/utils"]
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4943",
        changeOrigin: true,
      },
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process",
      // Mock segment analytics modules
      "@segment/analytics-next": resolve(__dirname, "src/mocks/analytics.js"),
      "@segment/analytics-core": resolve(__dirname, "src/mocks/analytics.js"),
      "@segment/analytics-browser": resolve(__dirname, "src/mocks/analytics.js")
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group related dependencies
          vendor: ['react', 'react-dom'],
          web3auth: ['@web3auth/modal'],
          dfinity: ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/candid', '@dfinity/identity', '@dfinity/principal']
        },
      },
    },
    // Try to handle problematic dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
