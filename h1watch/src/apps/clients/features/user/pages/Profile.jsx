import { useState } from 'react';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { useGuestOrders } from '../../orders/hooks/useGuestOrders';

import ProfileForm from '../components/ProfileDetail';
import ChangePasswordForm from '../components/ChangePasswordForm';
import OrderHistory from '../../orders/components/OrderHistory';
import TrackOrderPage from '../../orders/pages/TrackOrder';
import GuestConversionCTA from '../components/GuestConversionCTA';
import GuestOrdersList from '../../orders/components/GuestOrdersList';

/**
 * @typedef {{ id: string, email?: string }} SelectedOrder
 * Identifiant de la commande sélectionnée.
 * - `id`    : UUID (auth) ou orderNumber (guest)
 * - `email` : requis pour le suivi guest (POST /track-guest)
 */

const TABS_AUTH = [
    { id: 'orders', label: 'Mes Commandes' },
    { id: 'profile', label: 'Informations Personnelles' },
    { id: 'security', label: 'Sécurité & Accès' },
];

const TABS_GUEST = [
    { id: 'orders', label: 'Suivre mes achats' },
];

const ProfileSidebar = ({ activeTab, setActiveTab, tabs, onLogout, user }) => (
    <aside className="w-full lg:w-64 flex flex-col space-y-1">
        <div className="mb-8 px-4">
            <h2 className="text-2xl font-serif text-gray-900 uppercase tracking-widest">
                {user ? 'Mon Compte' : 'Guest'}
            </h2>
            <p className="text-xs text-[#ADA996] mt-1 font-medium tracking-tighter uppercase">
                {user?.email || 'Suivi de commande'}
            </p>
        </div>

        <nav className="space-y-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-4 py-3.5 text-sm transition-all duration-300 border-l-2 ${activeTab === tab.id
                            ? 'border-[#ADA996] bg-[#ADA996]/5 text-gray-900 font-semibold'
                            : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                >
                    <span className="uppercase tracking-widest text-[10px]">{tab.label}</span>
                </button>
            ))}
        </nav>

        {user && (
            <button
                onClick={onLogout}
                className="mt-10 w-full flex items-center space-x-4 px-4 py-3.5 text-sm text-red-800/60 hover:text-red-800 transition-colors uppercase tracking-[0.2em] text-[10px]"
            >
                Déconnexion
            </button>
        )}
    </aside>
);

const ProfilePage = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const { profile, loading } = useProfile();
    const { orders: guestOrders } = useGuestOrders();

    const [activeTab, setActiveTab] = useState('orders');

    /**
     * BUG FIX : `trackedOrderId` (string seul) perdait l'email passé par GuestOrdersList.
     * On stocke maintenant un objet { id, email? } pour conserver les deux valeurs.
     * @type {[SelectedOrder|null, Function]}
     */
    const [selectedOrder, setSelectedOrder] = useState(null);

    /** Sélectionne une commande authentifiée (UUID uniquement). */
    const handleSelectAuthOrder = (orderId) => {
        setSelectedOrder({ id: orderId });
    };

    /**
     * Sélectionne une commande guest.
     * GuestOrdersList passe (orderNumber, email) — les deux sont capturés ici.
     */
    const handleSelectGuestOrder = (orderNumber, email) => {
        setSelectedOrder({ id: orderNumber, email });
    };

    const handleCloseOrder = () => setSelectedOrder(null);

    const tabs = isAuthenticated ? TABS_AUTH : TABS_GUEST;

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    <ProfileSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tabs={tabs}
                        user={user}
                        onLogout={logout}
                    />

                    <main className="flex-1 min-h-[600px]">
                        {isAuthenticated ? (
                            <div className="animate-fadeIn">
                                {activeTab === 'profile' && (
                                    <ProfileForm profile={profile} loading={loading} />
                                )}
                                {activeTab === 'security' && <ChangePasswordForm />}
                                {activeTab === 'orders' && (
                                    <div className="space-y-8">
                                        {selectedOrder ? (
                                            <TrackOrderPage
                                                orderId={selectedOrder.id}
                                                onClose={handleCloseOrder}
                                            />
                                        ) : (
                                            <OrderHistory onSelectOrder={handleSelectAuthOrder} />
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12 animate-fadeIn">
                                <header className="max-w-2xl border-b border-gray-100 pb-8">
                                    <h1 className="text-3xl font-serif text-gray-900 mb-4 italic">
                                        Espace Invité
                                    </h1>
                                    <p className="text-gray-500 leading-relaxed font-light">
                                        Consultez l'état de vos commandes en cours. Pour une expérience
                                        personnalisée et un historique illimité, nous vous recommandons
                                        de créer un compte.
                                    </p>
                                </header>

                                <GuestConversionCTA guestOrdersCount={guestOrders.length} />

                                {selectedOrder ? (
                                    <TrackOrderPage
                                        orderId={selectedOrder.id}
                                        email={selectedOrder.email}
                                        onClose={handleCloseOrder}
                                    />
                                ) : (
                                    <GuestOrdersList
                                        orders={guestOrders}
                                        onSelectOrder={handleSelectGuestOrder}
                                    />
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;