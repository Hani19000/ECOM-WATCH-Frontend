import { Helmet } from 'react-helmet-async';

/**
 * @component SEOHead
 * ```
 *
 * @param {Object} props
 * @param {string}  props.title        - Titre de la page (55-60 chars max)
 * @param {string}  props.description  - Meta description (150-160 chars max)
 * @param {string}  [props.canonical]  - URL canonique absolue
 * @param {string}  [props.image]      - URL absolue de l'image OG (1200x630)
 * @param {string}  [props.imageAlt]   - Texte alternatif image OG
 * @param {'website'|'article'|'product'} [props.type] - OG type
 * @param {Object}  [props.structuredData] - JSON-LD Schema.org (objet JS)
 * @param {boolean} [props.noIndex]    - true pour pages privées (checkout, profile...)
 * @param {string}  [props.locale]     - Locale OG (default: fr_FR)
 */
const SEOHead = ({
    title,
    description,
    canonical,
    image,
    imageAlt,
    type = 'website',
    structuredData,
    noIndex = false,
    locale = 'fr_FR',
}) => {
    const SITE_NAME = 'ECOM-WATCH';
    const DEFAULT_IMAGE = 'https://ecomwatch.vercel.app/images/og-cover.jpg';
    const BASE_URL = 'https://ecomwatch.vercel.app.vercel.app';

    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedImageAlt = imageAlt || `${title} – ${SITE_NAME}`;

    return (
        <Helmet>
            {/* ─── Titre ──────────────────────────────────────── */}
            {title && <title>{title}</title>}

            {/* ─── Meta SEO de base ───────────────────────────── */}
            {description && <meta name="description" content={description} />}
            <meta
                name="robots"
                content={
                    noIndex
                        ? 'noindex, nofollow'
                        : 'index, follow, max-image-preview:large, max-snippet:-1'
                }
            />

            {/* ─── Canonical ──────────────────────────────────── */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* ─── Open Graph ─────────────────────────────────── */}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content={locale} />
            <meta property="og:type" content={type} />
            {canonical && <meta property="og:url" content={canonical} />}
            {title && <meta property="og:title" content={title} />}
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={resolvedImage} />
            <meta property="og:image:secure_url" content={resolvedImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={resolvedImageAlt} />

            {/* ─── Twitter Card ───────────────────────────────── */}
            <meta name="twitter:card" content="summary_large_image" />
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={resolvedImage} />
            <meta name="twitter:image:alt" content={resolvedImageAlt} />

            {/* ─── JSON-LD Structured Data ────────────────────── */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;