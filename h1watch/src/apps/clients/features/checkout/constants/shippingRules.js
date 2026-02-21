/**
 * Règles de livraison locales (Fallback).
 * Utilisées pour la prévisualisation immédiate ou si l'API est injoignable.
 */
export const SHIPPING_RULES = {
    FRANCE: [
        { method: 'STANDARD', label: 'Livraison Standard', base: 5.90, perKg: 0.50, freeAbove: 50, days: '2-3' },
        { method: 'EXPRESS', label: 'Livraison Express', base: 9.90, perKg: 1.00, freeAbove: 100, days: '24h' },
        { method: 'RELAY', label: 'Point Relais', base: 3.90, perKg: 0.30, freeAbove: 40, days: '3-5' }
    ],
    EUROPE: [
        { method: 'STANDARD', label: 'Livraison Standard', base: 12.50, perKg: 1.50, freeAbove: 80, days: '5-7' },
        { method: 'EXPRESS', label: 'Livraison Express', base: 24.90, perKg: 3.00, freeAbove: 150, days: '2-3' }
    ],
    WORLD: [
        { method: 'STANDARD', label: 'Livraison Internationale', base: 19.90, perKg: 2.00, freeAbove: 200, days: '7-14' }
    ]
};

export const COUNTRY_TO_ZONE = {
    'France': 'FRANCE',
    'Belgium': 'EUROPE',
    'Germany': 'EUROPE',
    'Spain': 'EUROPE',
    'Italy': 'EUROPE'
};

export const TAX_DEFAULTS = {
    'France': 20,
    'Belgium': 21,
    'Germany': 19,
    'Spain': 21,
    'Italy': 22
};