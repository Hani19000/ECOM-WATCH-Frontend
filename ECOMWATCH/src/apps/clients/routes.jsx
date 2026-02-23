/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { AppLayout } from './layout/AppLayout';
import GuestGuard from '../../shared/auth/guards/GuestGuard';

// ─── Pages lazy-loadées ───────────────────────────────────────────────────────
// Chaque page est chargée à la demande pour réduire le bundle initial.

const Login = lazy(() => import('../../shared/auth/pages/Login'));
const Register = lazy(() => import('../../shared/auth/pages/Register'));
const ForgotPassword = lazy(() => import('../../shared/auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../../shared/auth/pages/ResetPassword'));
const Home = lazy(() => import('../../pages/home'));
const Catalogue = lazy(() => import('./features/catalogue/pages/Catalogue'));
const ProductDetail = lazy(() => import('./features/products/pages/ProductDetail'));
const Checkout = lazy(() => import('./features/checkout/pages/Checkout'));
const PaymentSuccess = lazy(() => import('./features/checkout/pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./features/checkout/pages/PaymentCancel'));
const ProfilePage = lazy(() => import('./features/user/pages/Profile'));
const TrackOrderPage = lazy(() => import('./features/orders/pages/TrackOrder'));

/**
 * Fallback affiché pendant le chargement d'une page lazy.
 *
 * Positionné à l'intérieur de AppLayout pour que la navbar et le footer
 * restent visibles pendant le chargement — l'utilisateur ne voit jamais
 * une page blanche ou un texte brut.
 */
const PageSkeleton = () => (
    <div className="flex flex-col gap-6 animate-pulse py-4">
        <div className="h-8 bg-gray-200 rounded-lg w-48" />
        <div className="h-px bg-gray-200 w-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
            ))}
        </div>
    </div>
);

// Raccourci : enveloppe une page dans son Suspense avec le skeleton standard.
// Évite de répéter le même markup sur chaque route.
const withSuspense = (element) => (
    <Suspense fallback={<PageSkeleton />}>
        {element}
    </Suspense>
);

/**
 * Branche Storefront.
 *
 * AppLayout est non-lazy : la navbar et le footer sont toujours disponibles
 * immédiatement. Seul le contenu de la page (Outlet) est lazy-loadé,
 * ce qui évite le flash de layout complet lors de la navigation.
 */
export const clientsRoutes = {
    path: '/',
    element: <AppLayout />,
    children: [
        { index: true, element: withSuspense(<Home />) },
        { path: 'home', element: withSuspense(<Home />) },
        { path: 'catalogue', element: withSuspense(<Catalogue />) },
        { path: 'product/:slug', element: withSuspense(<ProductDetail />) },
        { path: 'checkout', element: withSuspense(<Checkout />) },
        { path: 'checkout/success', element: withSuspense(<PaymentSuccess />) },
        { path: 'checkout/cancel', element: withSuspense(<PaymentCancel />) },
        { path: 'profile', element: withSuspense(<ProfilePage />) },
        { path: 'track-order', element: withSuspense(<TrackOrderPage />) },

        // Auth — accessible uniquement si non connecté
        { path: 'login', element: <GuestGuard>{withSuspense(<Login />)}</GuestGuard> },
        { path: 'register', element: <GuestGuard>{withSuspense(<Register />)}</GuestGuard> },

        // Réinitialisation mot de passe — toujours public
        // (un utilisateur connecté peut recevoir un lien sur un autre appareil)
        { path: 'forgot-password', element: withSuspense(<ForgotPassword />) },
        { path: 'reset-password', element: withSuspense(<ResetPassword />) },
    ],
};