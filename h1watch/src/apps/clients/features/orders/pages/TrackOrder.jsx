import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import OrderDetailAuth from '../components/OrderDetailAuth';
import GuestTrackingForm from '../components/GuestTrackingform';

const TrackOrderPage = ({ orderId, onClose }) => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const urlOrderId = queryParams.get('orderId');
    const activeOrderId = orderId || urlOrderId || location.state?.orderId;

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
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                {isAuthenticated && activeOrderId ? (
                    <OrderDetailAuth orderId={activeOrderId} />
                ) : activeOrderId ? (
                    <GuestTrackingForm orderId={activeOrderId} />
                ) : (
                    <div className="text-center text-gray-500 py-8">Aucune commande sélectionnée.</div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;