import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACCENT_MAP = {
    'bg-blue-500': '#6366f1',
    'bg-orange-500': '#f97316',
    'bg-green-500': '#22c55e',
    'bg-purple-500': '#7c3aed',
    'bg-pink-500': '#ec4899',
};

/**
 * @component QuickLink
 * Accès rapide de navigation avec indicateur coloré et compteur.
 */
export const QuickLink = ({ title, count, path, color }) => {
    const accentColor = ACCENT_MAP[color] ?? '#6366f1';

    return (
        <Link
            to={path}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: '#fafafa',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = '#fafafa';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '3px', height: '28px', borderRadius: '2px',
                    background: accentColor, flexShrink: 0,
                }} />
                <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                        {title}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {count} {count > 1 ? 'éléments' : 'élément'}
                    </p>
                </div>
            </div>
            <ArrowRight size={14} color="#d1d5db" />
        </Link>
    );
};