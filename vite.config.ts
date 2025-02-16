import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["jsdom"], // Exclude jsdom
    },
  },
  
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      // 'Content-Type': 'application/wasm'
    },
    proxy: {
      "/api" : {
        target: "http://localhost:5000",
      }
    },
    
  },

  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
