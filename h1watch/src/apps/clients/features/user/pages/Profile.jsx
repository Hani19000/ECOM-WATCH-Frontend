import { useState } from 'react';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import { useProfile } from '../hooks/useProfile';
import { useGuestOrders } from '../../orders/hooks/useGuestOrders';

// UI Components
import ProfileForm from '../components/ProfileDetail';
import ChangePasswordForm from '../components/ChangePasswordForm';
import OrderHistory from '../../orders/components/OrderHistory';
import TrackOrderPage from '../../orders/pages/TrackOrder';

// Guest Components
import GuestConversionCTA from '../components/GuestConversionCTA';
import GuestOrdersList from '../../orders/components/GuestOrdersList'

/**
 * @component ProfileSidebar
 * Pourquoi : Centralise la navigation pour renforcer l'aspect "Espace Personnel" pro.
 * Le choix de la colonne à gauche est un standard e-commerce luxe (ex: Farfetch, MyTheresa).
 */
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
    const [trackedOrderId, setTrackedOrderId] = useState(null);

    const tabs = isAuthenticated ? [
        { id: 'orders', label: 'Mes Commandes' },
        { id: 'profile', label: 'Informations Personnelles' },
        { id: 'security', label: 'Sécurité & Accès' }
    ] : [
        { id: 'orders', label: 'Suivre mes achats' }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Colonne Navigation */}
                    <ProfileSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        tabs={tabs}
                        user={user}
                        onLogout={logout}
                    />

                    {/* Zone de Contenu Principale */}
                    <main className="flex-1 min-h-[600px]">
                        {/* Affichage Authentifié */}
                        {isAuthenticated ? (
                            <div className="animate-fadeIn">
                                {activeTab === 'profile' && <ProfileForm profile={profile} loading={loading} />}
                                {activeTab === 'security' && <ChangePasswordForm />}
                                {activeTab === 'orders' && (
                                    <div className="space-y-8">
                                        {trackedOrderId ? (
                                            <TrackOrderPage
                                                orderId={trackedOrderId}
                                                onClose={() => setTrackedOrderId(null)}
                                            />
                                        ) : (
                                            <OrderHistory onSelectOrder={setTrackedOrderId} />
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Affichage Guest - Refonte Luxe */
                            <div className="space-y-12 animate-fadeIn">
                                <header className="max-w-2xl border-b border-gray-100 pb-8">
                                    <h1 className="text-3xl font-serif text-gray-900 mb-4 italic">Espace Invité</h1>
                                    <p className="text-gray-500 leading-relaxed font-light">
                                        Consultez l'état de vos commandes en cours. Pour une expérience personnalisée et un historique illimité, nous vous recommandons de créer un compte.
                                    </p>
                                </header>

                                <GuestConversionCTA guestOrdersCount={guestOrders.length} />

                                {trackedOrderId ? (
                                    <TrackOrderPage
                                        orderId={trackedOrderId}
                                        onClose={() => setTrackedOrderId(null)}
                                    />
                                ) : (
                                    <GuestOrdersList
                                        orders={guestOrders}
                                        onSelectOrder={setTrackedOrderId}
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