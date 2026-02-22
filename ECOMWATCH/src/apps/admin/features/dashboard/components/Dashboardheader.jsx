import { RefreshCw } from 'lucide-react';

/**
 * @component DashboardHeader
 * Titre, sous-titre et bouton de rafraîchissement.
 * Style cohérent avec les autres en-têtes de pages admin (Produits, Stock...).
 */
export const DashboardHeader = ({ onRefresh, isRefreshing }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
            <h1 style={{
                fontSize: '24px', fontWeight: 600,
                color: '#111827', letterSpacing: '-0.01em',
            }}>
                Vue d&apos;ensemble
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Performances en temps réel — H1 Watch
            </p>
        </div>

        <button
            onClick={onRefresh}
            disabled={isRefreshing}
            style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 16px',
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                color: '#374151',
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                opacity: isRefreshing ? 0.5 : 1,
                transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
                if (!isRefreshing) {
                    e.currentTarget.style.borderColor = '#111827';
                    e.currentTarget.style.color = '#111827';
                }
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.color = '#374151';
            }}
        >
            <RefreshCw
                size={13}
                style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}
            />
            Actualiser
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </button>
    </div>
);