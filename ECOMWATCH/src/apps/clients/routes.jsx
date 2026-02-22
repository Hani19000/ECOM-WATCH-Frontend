/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';

// Layout & Guards
import { AppLayout } from './layout/AppLayout';
import GuestGuard from '../../shared/auth/guards/GuestGuard';

// --- LAZY LOADING : MODULES PARTAGÉS (Auth) ---
const Login = lazy(() => import('../../shared/auth/pages/Login'));
const Register = lazy(() => import('../../shared/auth/pages/Register'));
const ForgotPassword = lazy(() => import('../../shared/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../../shared/auth/pages/ResetPassword'));

// --- LAZY LOADING : MODULES STOREFRONT ---
const Home = lazy(() => import('../../pages/home'));
const Catalogue = lazy(() => import('./features/catalogue/pages/Catalogue'));
const ProductDetail = lazy(() => import('./features/products/pages/ProductDetail'));
const Checkout = lazy(() => import('./features/checkout/pages/Checkout'));
const PaymentSuccess = lazy(() => import('./features/checkout/pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./features/checkout/pages/PaymentCancel'));
const ProfilePage = lazy(() => import('./features/user/pages/Profile'));
const TrackOrderPage = lazy(() => import('./features/orders/pages/TrackOrder'));

const PageLoader = () => <div className="loader">Ecom-Watch...</div>;

/**
 * Définition de la branche Storefront.
 * Exporte un objet Route compatible avec react-router-dom.
 */
export const clientsRoutes = {
    path: '/',
    element: (
        <Suspense fallback={<PageLoader />}>
            <AppLayout />
        </Suspense>
    ),
    children: [
        { index: true, element: <Home /> },
        { path: 'home', element: <Home /> },
        { path: 'catalogue', element: <Catalogue /> },
        { path: 'product/:slug', element: <ProductDetail /> },
        { path: 'checkout', element: <Checkout /> },
        { path: 'checkout/success', element: <PaymentSuccess /> },
        { path: 'checkout/cancel', element: <PaymentCancel /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'track-order', element: <TrackOrderPage /> },

        // ─── Auth (accès public, bloqué si déjà connecté) ─────────────────
        {
            path: 'login',
            element: <GuestGuard><Login /></GuestGuard>,
        },
        {
            path: 'register',
            element: <GuestGuard><Register /></GuestGuard>,
        },

        // ─── Réinitialisation mot de passe (toujours public) ──────────────
        // Pas de GuestGuard : un utilisateur connecté peut aussi avoir besoin
        // de consommer un lien reçu par email sur un autre appareil.
        {
            path: 'forgot-password',
            element: <ForgotPassword />,
        },
        {
            path: 'reset-password',
            element: <ResetPassword />,
        },
    ]
};