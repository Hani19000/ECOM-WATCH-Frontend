import { ShoppingBag, Users, AlertTriangle, TrendingUp } from 'lucide-react';

const MiniCard = (props) => {
    const { title, value, isAlert } = props;
    const CurrentIcon = props.icon;

    return (
        <div className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm flex items-center gap-4 transition-colors hover:shadow-md">
            <div className={`p-3 rounded-lg transition-colors ${isAlert && value > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                {CurrentIcon && <CurrentIcon className="w-5 h-5" />}
            </div>
            <div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">{title}</p>
                <p className={`text-xl font-bold mt-0.5 transition-colors ${isAlert && value > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {value || 0}
                </p>
            </div>
        </div>
    );
};

export const KpiSection = ({ stats, alertsCount }) => (
    <div className="space-y-4 h-full flex flex-col">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Indicateurs Clés</h2>
        <div className="flex-1 space-y-4">
            <MiniCard title="Revenus" value={`${Number(stats?.revenue || 0).toLocaleString('fr-FR')} €`} icon={TrendingUp} />
            <MiniCard title="Commandes" value={stats?.ordersCount || 0} icon={ShoppingBag} />
            <MiniCard title="Clients" value={stats?.usersCount || 0} icon={Users} />
            <MiniCard title="Alertes Stock" value={alertsCount || 0} icon={AlertTriangle} isAlert={true} />
        </div>
    </div>
);