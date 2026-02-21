import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Tooltip personnalisé pour utiliser les classes Tailwind (Dark Mode)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-3 rounded-xl shadow-lg transition-colors">
                <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Ventes : <span className="font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat('fr-FR').format(payload[0].value)} €</span>
                </p>
            </div>
        );
    }
    return null;
};

export const RevenueChart = ({ data }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col h-full transition-colors">
        <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Évolution des Ventes</h3>
        </div>

        <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        allowDecimals={false}
                        domain={[0, 'auto']}
                        tickFormatter={(value) => value >= 1000 ? `${value / 1000}k€` : `${value}€`}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                    />
                    {/* currentColor permet d'utiliser dark:text-white depuis Tailwind */}
                    <Bar
                        dataKey="total"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                        fill="currentColor"
                        className="text-gray-900 dark:text-white transition-colors"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);