// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'; // Only need RouterProvider
import { router } from './router'; // We will create this file next
import { AuthProvider } from './context/AuthContext'; // <-- Import AuthProvider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Wrap your app with the provider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);