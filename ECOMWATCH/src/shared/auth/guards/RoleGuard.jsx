import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleGuard = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) return null;

    const hasRole = user?.roles?.some(role => allowedRoles.includes(role.toUpperCase()));

    if (!isAuthenticated || !hasRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleGuard;