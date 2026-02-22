import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardService } from '../api/dashboard.service';
import { adminInventoryService } from '../../inventory/api/adminInventory.service';

export const useDashboardLogic = () => {
    // 1. Initialisation avec les clés attendues par l'UI
    const [stats, setStats] = useState({
        revenue: 0,
        ordersCount: 0,
        usersCount: 0,
        productsCount: 0,
        salesHistory: []
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 2. On lance toutes les requêtes en même temps, y compris l'historique des ventes !
            const [statsData, historyData, ordersData, inventoryAlerts] = await Promise.all([
                dashboardService.getStats().catch(e => { console.error("Erreur KPI:", e); return null; }),
                dashboardService.getSalesHistory().catch(e => { console.error("Erreur Graphique:", e); return []; }),
                dashboardService.getRecentOrders().catch(e => { console.error("Erreur Commandes:", e); return []; }),
                // J'utilise le service dashboard si tu y as mis les alertes, sinon l'ancien
                dashboardService.getStockAlerts ? dashboardService.getStockAlerts().catch(() => []) : adminInventoryService.getAlerts().catch(() => [])
            ]);

            // 3. LE MAPPING CRUCIAL : On transforme les données du Backend pour l'UI
            if (statsData) {
                setStats({
                    revenue: statsData.orders?.totalSales || 0,
                    ordersCount: statsData.orders?.orderCount || 0,
                    usersCount: statsData.users?.total || 0,
                    productsCount: statsData.products?.total || 0,
                    salesHistory: historyData || []
                });
            }

            setRecentOrders(ordersData || []);
            setAlerts(inventoryAlerts || []);

        } catch (error) {
            console.error("[DashboardHook] Erreur globale:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 4. Formatage des données pour le composant Recharts
    const formattedChartData = useMemo(() => {
        if (!stats || !Array.isArray(stats.salesHistory)) return [];

        return stats.salesHistory.map(item => ({
            name: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            // ATTENTION : La requête SQL renvoie "revenue", il faut donc lire item.revenue !
            total: Number(item.revenue || 0)
        }));
    }, [stats]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        stats,
        recentOrders,
        alerts,
        isLoading,
        chartData: formattedChartData,
        refresh: fetchDashboardData
    };
};