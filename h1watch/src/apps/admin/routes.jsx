/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { AdminLayout } from './layout/AdminLayout';
import RoleGuard from '../../shared/auth/guards/RoleGuard';

// Lazy loading des pages admin
const Dashboard = lazy(() => import('./features/dashboard/pages/Dashboard'));
const ProductsAdmin = lazy(() => import('./features/products/pages/productsAdmin'));
// NOUVEAU : Import du module Catégories
const CategoriesAdmin = lazy(() => import('./features/categories/pages/CategoriesAdmin'));
const UsersAdmin = lazy(() => import('./features/users/pages/UsersAdmin'));
const OrdersAdmin = lazy(() => import('./features/orders/pages/OrdersAdmin'));
const InventoryAdmin = lazy(() => import('./features/inventory/pages/InventoryAdmin'));
const PromotionsAdmin = lazy(() => import('./features/promotions/pages/PromotionsAdmin'));

const AdminLoader = () => (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
);

export const adminRoutes = {
    path: '/admin',
    element: (
        // Le RoleGuard protège TOUTE la section admin
        <RoleGuard allowedRoles={['ADMIN']}>
            <AdminLayout />
        </RoleGuard>
    ),
    children: [
        { index: true, element: <Suspense fallback={<AdminLoader />}><Dashboard /></Suspense> },
        { path: 'products', element: <Suspense fallback={<AdminLoader />}><ProductsAdmin /></Suspense> },
        { path: 'categories', element: <Suspense fallback={<AdminLoader />}><CategoriesAdmin /></Suspense> },
        { path: 'users', element: <Suspense fallback={<AdminLoader />}><UsersAdmin /></Suspense> },
        { path: 'orders', element: <Suspense fallback={<AdminLoader />}><OrdersAdmin /></Suspense> },
        { path: 'inventory', element: <Suspense fallback={<AdminLoader />}><InventoryAdmin /></Suspense> },
        { path: 'promotions', element: <Suspense fallback={<AdminLoader />}><PromotionsAdmin /></Suspense> },
    ]
};