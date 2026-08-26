/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    },
    server: {
      // HMR is disabled in cloud dev / container environments to prevent failing WebSocket reconnect loops
      hmr: process.env.ENABLE_HMR === 'true' ? { overlay: false } : false,
      // Disable file watching unless explicitly enabled to prevent unnecessary CPU usage
      watch: process.env.ENABLE_HMR === 'true' ? {} : null,
    },
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('/react/')) {
                return 'vendor-react';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('qrcode.react')) {
                return 'vendor-qrcode';
              }
            }
          },
        },
      },
    },
  };
});
