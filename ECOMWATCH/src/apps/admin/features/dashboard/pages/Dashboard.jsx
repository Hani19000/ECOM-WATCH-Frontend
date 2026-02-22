import { useDashboardLogic } from '../hooks/useDashboardLogic';
import { KpiSection } from '../components/KpiSection';
import { RevenueChart } from '../components/RevenueChart';
import { RecentOrdersTable } from '../components/RecentOrdersTable';
import { QuickLinksSection } from '../components/QuickLinksSection';

const Dashboard = () => {
    const { stats, recentOrders, alerts, isLoading, chartData } = useDashboardLogic();

    if (isLoading) {
        return <div className="max-w-7xl mx-auto p-8 text-gray-500 dark:text-gray-400 animate-pulse font-medium">Chargement du tableau de bord...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto relative space-y-6 pb-12 transition-colors">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Tableau de Bord</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Aperçu des performances de votre boutique H1 Watch.</p>
                </div>
                <div className="bg-white dark:bg-dark-card px-4 py-2 rounded-lg border border-gray-100 dark:border-dark-border shadow-sm text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* Section KPI */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <KpiSection stats={stats} alertsCount={alerts?.length || 0} />
                </div>

                {/* Section Graphique */}
                <div className="col-span-12 lg:col-span-6 min-w-0">
                    <RevenueChart data={chartData} />
                </div>

                {/* Section Commandes Récentes */}
                <div className="col-span-12 lg:col-span-3 min-w-0">
                    <RecentOrdersTable orders={recentOrders || []} />
                </div>

                {/* Section Liens Rapides */}
                <div className="col-span-12 min-w-0">
                    <QuickLinksSection stats={stats} alerts={alerts} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;