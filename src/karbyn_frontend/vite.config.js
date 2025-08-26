import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
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
      "@segment/analytics-browser": resolve(__dirname, "src/mocks/analytics.js"),
      // Mock problematic dependencies that cause build issues
      "@metamask/sdk": resolve(__dirname, "src/mocks/metamask.js"),
      "@walletconnect/utils": resolve(__dirname, "src/mocks/walletconnect-utils.js")
    },
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Mark problematic dependencies as external to prevent bundling issues
        if (id.includes('@metamask/sdk') || 
            id.includes('@walletconnect/utils') ||
            id.includes('@walletconnect/core') ||
            id.includes('@walletconnect/sign-client')) {
          return true;
        }
        return false;
      },
      output: {
        manualChunks: {
          // Group related dependencies
          vendor: ['react', 'react-dom'],
          web3auth: ['@web3auth/modal'],
          dfinity: ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/candid', '@dfinity/identity', '@dfinity/principal']
        },
        globals: {
          '@metamask/sdk': 'MetaMaskSDK',
          '@walletconnect/utils': 'WalletConnectUtils',
          '@walletconnect/core': 'WalletConnectCore',
          '@walletconnect/sign-client': 'WalletConnectSignClient'
        }
      },
    },
    // Try to handle problematic dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});
