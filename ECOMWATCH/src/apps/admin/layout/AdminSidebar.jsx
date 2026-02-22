import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard, Package, Tags, Users, Boxes,
    ShoppingCart, TicketPercent, Watch, ExternalLink, X
} from 'lucide-react';

const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Catégories', href: '/admin/categories', icon: Tags },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Clients', href: '/admin/users', icon: Users },
    { name: 'Promotions', href: '/admin/promotions', icon: TicketPercent },
];

export const AdminSidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`
            fixed inset-y-0 left-0 z-40 w-64 flex flex-col flex-shrink-0
            bg-white dark:bg-dark-card 
            border-r border-gray-200 dark:border-dark-border 
            transform transition-all duration-300 ease-in-out
            md:relative md:translate-x-0
            ${isOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full'}
        `}>
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                <Link to="/" className="flex items-center" title="Retourner à la boutique">
                    <Watch className="w-5 h-5 text-gray-900 dark:text-white mr-2.5 group-hover:text-[#ADA996] dark:group-hover:text-[#ADA996] transition-colors" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-base text-[15px] font-serif font-bold text-gray-900 dark:text-white tracking-wider uppercase">
                                ECOM-WATCH
                            </span>
                            <span className="text-[7px] font-black text-[#ADA996] border border-[#ADA996]/30 px-1.5 py-0.5 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline-block">
                                Shop
                            </span>
                        </div>
                    </div>
                </Link>
                {/* Bouton fermeture mobile uniquement */}
                <button
                    onClick={onClose}
                    className="md:hidden p-1.5 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        end={item.exact}
                        onClick={onClose}
                        className={({ isActive }) => `
                            group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'
                                        }`}
                                />
                                {item.name}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
                <Link
                    to="/"
                    className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ExternalLink size={12} />
                    <span>Quitter l'admin</span>
                </Link>
            </div>
        </aside>
    );
};