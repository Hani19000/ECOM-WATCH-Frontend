import { Helmet } from 'react-helmet-async';
import { env } from '../../core/config/env';

/**
 * @component SEOHead
 *
 * Composant SEO universel basé sur react-helmet-async.
 * Injecte dynamiquement les balises <head> appropriées selon la page.
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
    const DEFAULT_IMAGE = `${env.CLIENT_URL}/images/og-cover.jpg`;

    const resolvedImage = image || DEFAULT_IMAGE;
    const resolvedImageAlt = imageAlt || `${title} – ${SITE_NAME}`;

    return (
        <Helmet>
            {title && <title>{title}</title>}

            {description && <meta name="description" content={description} />}
            <meta
                name="robots"
                content={
                    noIndex
                        ? 'noindex, nofollow'
                        : 'index, follow, max-image-preview:large, max-snippet:-1'
                }
            />

            {canonical && <link rel="canonical" href={canonical} />}

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

            <meta name="twitter:card" content="summary_large_image" />
            {title && <meta name="twitter:title" content={title} />}
            {description && <meta name="twitter:description" content={description} />}
            <meta name="twitter:image" content={resolvedImage} />
            <meta name="twitter:image:alt" content={resolvedImageAlt} />

            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;