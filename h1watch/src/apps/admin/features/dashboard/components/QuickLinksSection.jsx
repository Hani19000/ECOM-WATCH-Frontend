import { Package, Users, ShoppingCart, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickLinkCard = (props) => {
    const { to, title, count, label, isAlert } = props;
    const Icon = props.icon;

    return (
        <Link to={to} className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-dark-card hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-dark-border group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-colors ${isAlert ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">{title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{count} {label}</p>
                </div>
            </div>
        </Link>
    );
};

export const QuickLinksSection = ({ stats, alerts }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm transition-colors">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 transition-colors">Accès Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLinkCard to="/admin/products" icon={Box} title="Catalogue" count={stats?.productsCount || 0} label="produits" />
            <QuickLinkCard to="/admin/inventory" icon={Package} title="Inventaire" count={alerts?.length || 0} label="alertes stock" isAlert={alerts?.length > 0} />
            <QuickLinkCard to="/admin/orders" icon={ShoppingCart} title="Commandes" count={stats?.ordersCount || 0} label="total" />
            <QuickLinkCard to="/admin/users" icon={Users} title="Clients" count={stats?.usersCount || 0} label="inscrits" />
        </div>
    </div>
);