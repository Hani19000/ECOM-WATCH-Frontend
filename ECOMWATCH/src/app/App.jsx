import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';

// Configuration & Providers
import { queryClient } from '../api/queryClient.js';
import { AuthProvider } from '../shared/auth/context/AuthContext.jsx'
import { CartProvider } from '../apps/clients/features/cart/context/CartProvider.jsx';
import { router } from './router.jsx';

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>

            <Toaster
              position="top-center"
              containerStyle={{ top: 80 }} // S'adapte à la hauteur de la navbar
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#fff',
                  color: '#000',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  borderRadius: '12px',
                  border: '1px solid #f3f4f6',
                },
              }}
            />

            {/* Injection du moteur de routing */}
            <RouterProvider router={router} />

          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}