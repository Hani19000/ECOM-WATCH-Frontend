import { AlertTriangle, Package, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CARD_STYLE = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
};

/**
 * @component AlertRow
 * Ligne d'alerte de stock — cohérente avec le tableau de la page Inventaire.
 */
const AlertRow = ({ alert }) => {
    const isOutOfStock = alert.stock === 0;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #f3f4f6',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                    background: isOutOfStock ? '#fee2e2' : '#fef3c7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Package size={15} color={isOutOfStock ? '#ef4444' : '#f59e0b'} strokeWidth={1.8} />
                </div>
                <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {alert.productName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <AlertTriangle size={10} color={isOutOfStock ? '#ef4444' : '#f59e0b'} />
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                            {isOutOfStock ? 'Rupture de stock' : 'Stock faible'}
                        </span>
                    </div>
                </div>
            </div>

            <span style={{
                fontSize: '11px', fontWeight: 700,
                padding: '4px 10px', borderRadius: '20px',
                color: isOutOfStock ? '#991b1b' : '#92400e',
                background: isOutOfStock ? '#fee2e2' : '#fef3c7',
            }}>
                {isOutOfStock ? 'Rupture' : `${alert.stock} restants`}
            </span>
        </div>
    );
};

/**
 * @component StockAlertsSection
 * Produits en stock critique ou en rupture.
 */
export const StockAlertsSection = ({ alerts }) => (
    <div style={CARD_STYLE}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
                <h2 style={{
                    fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111827',
                }}>
                    Alertes de Stock
                </h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    {alerts.length} produit{alerts.length > 1 ? 's' : ''} en alerte
                </p>
            </div>
            <Link
                to="/admin/inventory"
                style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '11px', fontWeight: 600, color: '#b45309',
                    textDecoration: 'none',
                    padding: '5px 10px', borderRadius: '6px',
                    border: '1px solid #fde68a',
                    background: '#fffbeb',
                    transition: 'all 0.15s',
                }}
            >
                Gérer <ArrowUpRight size={11} />
            </Link>
        </div>

        {alerts.length === 0 ? (
            <div style={{
                padding: '36px 0', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#f0fdf4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Package size={18} color="#22c55e" strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                    Tous les stocks sont suffisants.
                </p>
            </div>
        ) : (
            <div>
                {alerts.slice(0, 6).map(alert => (
                    <AlertRow key={alert.id ?? alert.productName} alert={alert} />
                ))}
            </div>
        )}
    </div>
);