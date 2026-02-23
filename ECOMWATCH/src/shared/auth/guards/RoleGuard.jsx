import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protège les routes nécessitant un rôle spécifique (ex : /admin).
 *
 * Stratégie en deux temps :
 * 1. Avant confirmation serveur (isInitialized=false) :
 *    - Si le hint dit "connecté + bon rôle" → rendu optimiste immédiat
 *    - Sinon → skeleton pendant que checkAuth tourne
 * 2. Après confirmation (isInitialized=true) :
 *    - Accès ou redirection selon le verdict réel
 *
 * Cela évite le flash de redirection pour les admins légitimes
 * tout en bloquant les accès non autorisés dès que le check est fait.
 */
const RoleGuard = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isInitialized } = useAuth();

    const hasRole = user?.roles?.some(role => allowedRoles.includes(role.toUpperCase()));

    // Rendu optimiste : le hint confirme les droits, on affiche sans attendre
    if (isAuthenticated && hasRole) {
        return children;
    }

    // Check en cours + pas de hint valide → skeleton léger pour éviter le flash
    if (!isInitialized) {
        return <AdminCheckSkeleton />;
    }

    // Verdict du serveur reçu : accès refusé
    return <Navigate to="/" replace />;
};

// Skeleton minimal qui remplace le plein écran de chargement global.
// Visible uniquement pour les admins sans hint (première visite ou storage effacé).
function AdminCheckSkeleton() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
    );
}

export default RoleGuard;