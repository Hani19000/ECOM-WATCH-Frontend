import { createBrowserRouter } from 'react-router-dom';
import { clientsRoutes } from '../apps/clients/routes';
import { adminRoutes } from '../apps/admin/routes';

/**
 * Routeur global de l'application.
 * Assemble les différents monolithes (Storefront, Admin).
 */
export const router = createBrowserRouter([
    clientsRoutes,
    adminRoutes,
]);