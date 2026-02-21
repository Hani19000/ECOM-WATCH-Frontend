import { ShoppingBag, Package, Users, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

const ICON_MAP = { ShoppingBag, Package, Users, AlertCircle };

const COLOR_CONFIG = {
    blue: { bg: '#eff6ff', icon: '#3b82f6', border: '#dbeafe' },
    green: { bg: '#f0fdf4', icon: '#22c55e', border: '#dcfce7' },
    purple: { bg: '#f5f3ff', icon: '#7c3aed', border: '#ede9fe' },
    orange: { bg: '#fff7ed', icon: '#f97316', border: '#fed7aa' },
};

/**
 * @component StatCard
 * Reçoit des données déjà formatées — aucune transformation ici.
 * Palette light cohérente avec les autres pages admin.
 */
export const StatCard = ({ title, value, trend, icon, color = 'blue' }) => {
    const IconComponent = ICON_MAP[icon];
    const palette = COLOR_CONFIG[color] ?? COLOR_CONFIG.blue;
    const hasTrend = trend !== null && trend !== undefined;
    const isPositive = trend > 0;

    return (
        <div style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            transition: 'box-shadow 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            <div>
                <p style={{
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#9ca3af', marginBottom: '10px',
                }}>
                    {title}
                </p>
                <h3 style={{
                    fontSize: '30px', fontWeight: 300,
                    color: '#111827', letterSpacing: '-0.02em', lineHeight: 1,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                }}>
                    {value}
                </h3>

                {hasTrend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
                        {isPositive
                            ? <TrendingUp size={11} color="#16a34a" />
                            : <TrendingDown size={11} color="#dc2626" />}
                        <span style={{ fontSize: '11px', fontWeight: 600, color: isPositive ? '#16a34a' : '#dc2626' }}>
                            {Math.abs(trend)}% vs mois dernier
                        </span>
                    </div>
                )}
            </div>

            {IconComponent && (
                <div style={{
                    background: palette.bg,
                    border: `1px solid ${palette.border}`,
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <IconComponent size={18} color={palette.icon} strokeWidth={1.8} />
                </div>
            )}
        </div>
    );
};