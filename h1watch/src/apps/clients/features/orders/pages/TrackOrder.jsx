import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import OrderDetailAuth from '../components/OrderDetailAuth';
import GuestTrackingForm from '../components/GuestTrackingform';

/**
 * @component TrackOrderPage
 *
 * Orchestrateur d'affichage du détail d'une commande.
 *
 * Deux modes :
 * - Authentifié  : délègue à <OrderDetailAuth> via le Bearer token
 * - Invité       : délègue à <GuestTrackingForm> avec orderId + email
 *
 * @param {string}   orderId  - UUID (auth) ou orderNumber (guest)
 * @param {string}   [email]  - Email du client, requis en mode guest
 * @param {Function} [onClose]
 */
const TrackOrderPage = ({ orderId, email, onClose }) => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Support du deep-linking via URL (?orderId=...)
    const queryParams = new URLSearchParams(location.search);
    const activeOrderId = orderId || queryParams.get('orderId') || location.state?.orderId;
    const activeEmail = email || location.state?.email || null;

    const handleClose = () => {
        if (onClose) onClose();
        else navigate(-1);
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">
                    Détails de la commande
                </h2>
                <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Fermer"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                {isAuthenticated && activeOrderId ? (
                    <OrderDetailAuth orderId={activeOrderId} />
                ) : activeOrderId ? (
                    // BUG FIX : email forwarded explicitement — plus de perte entre Profile et GuestTrackingForm
                    <GuestTrackingForm orderId={activeOrderId} email={activeEmail} />
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        Aucune commande sélectionnée.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;