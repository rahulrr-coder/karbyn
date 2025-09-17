import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and React DOM
          'react-vendor': ['react', 'react-dom'],
          // Router chunk
          'router': ['react-router-dom'],
          // UI library chunks
          'ui-vendor': ['framer-motion', 'lucide-react', '@radix-ui/react-slot'],
          // Dfinity/IC chunks
          'ic-vendor': ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/identity', '@dfinity/principal', '@dfinity/candid'],
          // Charts and visualization
          'chart-vendor': ['d3', 'recharts'],
          // Utils
          'utils': ['axios', 'date-fns', 'clsx', 'tailwind-merge']
        },
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4943",
        changeOrigin: true,
      },
    },
  },
});
