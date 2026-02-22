import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Home, LogOut, User, LayoutDashboard } from "lucide-react"; // Ajout de LayoutDashboard
import toast from "react-hot-toast";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useAuth } from "../../../../shared/auth/hooks/useAuth";
import { useGuestOrders } from "../../features/orders/hooks/useGuestOrders";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { orders } = useGuestOrders();
    const navigate = useNavigate();

    const hasGuestOrders = orders && orders.length > 0;

    // Vérification si l'utilisateur est un administrateur
    const isAdmin = useMemo(() => {
        if (!user || !user.roles) return false;
        return Array.isArray(user.roles) && user.roles.includes('ADMIN');
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success("Déconnexion réussie", {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontSize: '12px'
            }
        });
    };

    return (
        <nav className="w-full flex items-center justify-between border-b border-[#ADA996]/20 pt-8 pb-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 xl:px-0 mb-4 sm:mb-6">
            <Link to="/" className="flex items-center group">
                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase text-gray-900 group-hover:text-[#ADA996] transition-colors duration-300">
                    ECOM<span className="text-[#ADA996]">-</span>WATCH
                </p>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
                    <Link
                        to="/"
                        className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all duration-300 group"
                        aria-label="Accueil"
                    >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 group-hover:text-[#ADA996] transition-colors duration-300" />
                    </Link>

                    <ShoppingCartIcon />

                    {/* SECTION PROFIL / AUTH */}
                    <div className="flex items-center gap-1.5 sm:gap-2 border-l border-gray-100 pl-2 sm:pl-3 md:pl-4 ml-1 sm:ml-2">

                        {/* ACCÈS DASHBOARD (Uniquement pour ADMIN) */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gray-900 flex items-center justify-center border border-transparent hover:bg-[#ADA996] transition-all duration-300 group shadow-lg shadow-gray-200"
                                title="Tableau de bord Admin"
                            >
                                <LayoutDashboard className="w-4 h-4 sm:w-[17px] sm:h-[17px] text-white" />
                            </Link>
                        )}

                        {/* 1. Affichage de l'icône Profil (si User connecté OU si Guest avec commandes) */}
                        {(user || hasGuestOrders) && (
                            <Link
                                to="/profile"
                                className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gray-50/80 flex items-center justify-center border border-transparent hover:border-[#ADA996] hover:bg-white transition-all duration-300 group"
                                title={user ? "Mon Compte" : "Suivre mes commandes (Invité)"}
                            >
                                <User className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-600 group-hover:text-[#ADA996]" />

                                {!user && hasGuestOrders && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ADA996] border-2 border-white rounded-full"></span>
                                )}
                            </Link>
                        )}

                        {/* 2. Bouton Action (Logout si connecté, sinon Sign In) */}
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#ADA996] transition-all duration-300"
                                title="Déconnexion"
                            >
                                <LogOut className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-5 py-2 sm:px-6 bg-black text-white text-[10px] font-medium uppercase tracking-[0.15em] rounded-full border border-gray-900 hover:bg-transparent hover:text-gray-900 transition-all duration-300 active:scale-95 shadow-sm ml-1"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;