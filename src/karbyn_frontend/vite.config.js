import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor dependencies
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // UI and animation libraries
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Charts and data visualization
            if (id.includes('recharts') || id.includes('victory') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Internet Computer libraries
            if (id.includes('@dfinity/')) {
              return 'vendor-dfinity';
            }
            // Face detection
            if (id.includes('face-api.js')) {
              return 'vendor-face';
            }
            // Utility libraries
            if (id.includes('lodash') || id.includes('next')) {
              return 'vendor-utils';
            }
            // All other vendor dependencies
            return 'vendor-misc';
          }
          
          // Feature-based chunks for your app code
          if (id.includes('src/')) {
            // Authentication features
            if (id.includes('Auth') || id.includes('/auth/')) {
              return 'features-auth';
            }
            // Activity features
            if (id.includes('/activities/') || id.includes('ActivityContext')) {
              return 'features-activities';
            }
            // Marketplace features
            if (id.includes('/marketplace/') || id.includes('NFTContext')) {
              return 'features-marketplace';
            }
            // Project features
            if (id.includes('project') || id.includes('submit-project')) {
              return 'features-projects';
            }
            // Community features
            if (id.includes('/community/')) {
              return 'features-community';
            }
            // Business features
            if (id.includes('/business/')) {
              return 'features-business';
            }
          }
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
});
