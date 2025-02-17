import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './login/AuthContext';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
      <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
      </AuthProvider>
  
);
