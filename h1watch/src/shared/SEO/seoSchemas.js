/**
 * @module SEO/schemas
 *
 * Générateurs de schémas JSON-LD Schema.org pour chaque type de page.
 * Centralisés ici pour maintenir la cohérence et simplifier les composants pages.
 *
 * RÉFÉRENCE : https://schema.org
 * VALIDATEUR : https://validator.schema.org
 * TEST RICH RESULTS : https://search.google.com/test/rich-results
 */

const BASE_URL = 'https://ecom-watch.fr';

// ─────────────────────────────────────────────────────────────────────────────
// PAGE D'ACCUEIL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schéma pour la page d'accueil.
 * Inclut la liste des produits mis en avant.
 *
 * @param {Array} featuredProducts - Produits featured récupérés par l'API
 * @returns {Object} JSON-LD ItemList
 */
export const buildHomeSchema = (featuredProducts = []) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sélection ECOM-WATCH',
    description: 'Notre sélection de montres de prestige',
    url: `${BASE_URL}/`,
    numberOfItems: featuredProducts.length,
    itemListElement: featuredProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/product/${product.slug}`,
        name: product.name,
        image: product.mainImage || undefined,
    })),
});

// ─────────────────────────────────────────────────────────────────────────────
// PAGE CATALOGUE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schéma pour la page catalogue.
 *
 * @param {Array}  products     - Liste filtrée des produits affichés
 * @param {string} categoryName - Nom de la catégorie active
 * @param {string} searchQuery  - Terme de recherche (peut être vide)
 * @returns {Object} JSON-LD CollectionPage
 */
export const buildCatalogueSchema = (products = [], categoryName = 'Collection Complète', searchQuery = '') => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: searchQuery
        ? `Résultats pour "${searchQuery}" – ECOM-WATCH`
        : `${categoryName} – ECOM-WATCH`,
    description: `Explorez notre ${categoryName.toLowerCase()} de montres de prestige`,
    url: `${BASE_URL}/catalogue`,
    breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE_URL}/catalogue` },
        ],
    },
    mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${BASE_URL}/product/${product.slug}`,
            name: product.name,
        })),
    },
});

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRODUIT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schéma complet pour une page produit individuelle.
 * Inclut Product, Offer, AggregateOffer si plusieurs variantes.
 *
 * @param {Object} product       - Objet produit transformé (via ProductService)
 * @param {Object} activeVariant - Variante sélectionnée
 * @returns {Object} JSON-LD Product
 */
export const buildProductSchema = (product, activeVariant = null) => {
    if (!product) return null;

    const variants = product.variantsPreview || [];
    const prices = variants
        .map(v => v.promotion?.discountedPrice ?? v.price)
        .filter(p => p > 0);

    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const activePrice = activeVariant?.promotion?.discountedPrice ?? activeVariant?.price ?? minPrice;
    const activeStock = activeVariant?.inventory?.availableStock ?? 0;

    const offers =
        variants.length > 1
            ? {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: minPrice,
                highPrice: maxPrice,
                offerCount: variants.length,
                availability:
                    variants.some(v => (v.inventory?.availableStock ?? 0) > 0)
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                seller: {
                    '@type': 'Organization',
                    name: 'ECOM-WATCH',
                    url: BASE_URL,
                },
            }
            : {
                '@type': 'Offer',
                priceCurrency: 'EUR',
                price: activePrice,
                availability:
                    activeStock > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: {
                    '@type': 'Organization',
                    name: 'ECOM-WATCH',
                    url: BASE_URL,
                },
                priceValidUntil: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                )
                    .toISOString()
                    .split('T')[0],
                // Livraison incluse / frais selon panier
                shippingDetails: {
                    '@type': 'OfferShippingDetails',
                    shippingRate: {
                        '@type': 'MonetaryAmount',
                        value: '5.90',
                        currency: 'EUR',
                    },
                    shippingDestination: {
                        '@type': 'DefinedRegion',
                        addressCountry: 'FR',
                    },
                },
                hasMerchantReturnPolicy: {
                    '@type': 'MerchantReturnPolicy',
                    applicableCountry: 'FR',
                    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                    merchantReturnDays: 14,
                    returnMethod: 'https://schema.org/ReturnByMail',
                },
            };

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `Découvrez ${product.name} – collection ECOM-WATCH`,
        image: [
            activeVariant?.attributes?.image,
            product.mainImage,
        ].filter(Boolean),
        url: `${BASE_URL}/product/${product.slug}`,
        brand: {
            '@type': 'Brand',
            name: 'ECOM-WATCH',
        },
        category: 'Montres de luxe',
        offers,
        // Garantie produit
        hasMeasurement: undefined, // à enrichir si données dispo
        warranty: {
            '@type': 'WarrantyPromise',
            durationOfWarranty: {
                '@type': 'QuantitativeValue',
                value: 2,
                unitCode: 'ANN',
                unitText: 'ans',
            },
        },
        // Breadcrumb intégré au produit
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
                { '@type': 'ListItem', position: 2, name: 'Collection', item: `${BASE_URL}/catalogue` },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: product.name,
                    item: `${BASE_URL}/product/${product.slug}`,
                },
            ],
        },
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE SUCCÈS PAIEMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schéma pour la page de confirmation de commande.
 * Permet le suivi des conversions dans Google Search Console.
 *
 * @param {Object} orderInfo - Informations de commande
 * @returns {Object} JSON-LD Order
 */
export const buildOrderConfirmationSchema = (orderInfo) => {
    if (!orderInfo?.orderNumber) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'Order',
        orderNumber: orderInfo.orderNumber,
        orderStatus: 'https://schema.org/OrderPaymentDue',
        priceCurrency: 'EUR',
        price: orderInfo.totalAmount,
        merchant: {
            '@type': 'Organization',
            name: 'ECOM-WATCH',
            url: BASE_URL,
        },
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// FAQ (si page dédiée dans le futur)
// ─────────────────────────────────────────────────────────────────────────────

export const buildFAQSchema = (faqs = []) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
        },
    })),
});