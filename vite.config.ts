// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       external: ["jsdom"], // Exclude jsdom
//     },
//   },
  
//   server: {
//     headers: {
//       'Cross-Origin-Embedder-Policy': 'require-corp',
//       'Cross-Origin-Opener-Policy': 'same-origin',
//       // 'Content-Type': 'application/wasm'
//     },
//     proxy: {
//       "/api" : {
//         target: "http://localhost:5000",
//       }
//     },
    
//   },

//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   // base: '/pdfReaderFrontend/',
//   build: {
//     rollupOptions: {
//       external: ["jsdom"], // Exclude jsdom
//     },
//   },

//   server: {
//     headers: {
//       'Cross-Origin-Embedder-Policy': 'require-corp',
//       'Cross-Origin-Opener-Policy': 'same-origin',
//     },
//     proxy: process.env.NODE_ENV === 'development'
//       ? {
//           "/api": {
//             target: "http://localhost:5000",
//             changeOrigin: true,
//             secure: false,
//           }
//         }
//       : {
//         "/api": {
//           target: process.env.API_URL,
//           changeOrigin: true,
//           secure: false,
//         }
//       },
//   },

//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   // base: '/pdfReaderFrontend/',
//   build: {
//     rollupOptions: {
//       external: ["jsdom"],
//     },
//   },
  
//   server: {
//     headers: {
//       'Cross-Origin-Embedder-Policy': 'require-corp',
//       'Cross-Origin-Opener-Policy': 'same-origin',
//     },
//     proxy: {
//       "/api": {
//         target: import.meta.env.VITE_API_URL || "https://pdfreaderbackend.onrender.com",
//         changeOrigin: true,
//         secure: false,
//       }
//     },
//   },

//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });

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