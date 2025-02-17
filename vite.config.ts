
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["jsdom"],
    },
  },
 
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'access-control-allow-credentials': 'true',
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "https://pdfreaderbackend.onrender.com",
        changeOrigin: true,
        secure: false,
      }
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});