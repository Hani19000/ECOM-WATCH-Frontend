// Données de navigation du footer — séparées du composant pour faciliter la maintenance

export const FOOTER_NAV = [
    {
        title: 'Collection',
        links: [
            { label: 'Toutes les montres', to: '/catalogue' },
        ],
    },
    {
        title: 'Espace Client',
        links: [
            { label: 'Mon compte', to: '/profile' },
            { label: 'Suivre ma commande', to: '/profile' },
        ],
    },
    // {
    //     title: 'Informations',
    //     links: [
    //         { label: 'Livraison & retours', to: '/catalogue' },
    //         { label: 'Garantie & authenticité', to: '/catalogue' },
    //         { label: 'Contact', to: '/catalogue' },
    //     ],
    // },
];

export const FOOTER_LEGAL = [
    { label: 'Mentions légales', to: '/' },
    { label: 'Politique de confidentialité', to: '/' },
    { label: 'Cookies', to: '/' },
    { label: 'CGV', to: '/' },
];

export const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal'];