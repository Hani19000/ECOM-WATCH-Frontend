import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GuestGuard = ({ children }) => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) return null;

    return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default GuestGuard;