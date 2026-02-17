import { Helmet } from 'react-helmet-async';

/**
 * SEOHead — Dynamic meta tags and structured data
 */
export default function SEOHead({
    title,
    description,
    canonical,
    ogImage = '/og-default.png',
    faqSchema = null,
    type = 'website',
}) {
    const siteName = 'FinanceCalc';
    const baseUrl = 'https://financecalc1.pythonanywhere.com';

    // Ensure title is clean and doesn't duplicate siteName
    const cleanTitle = title.includes(siteName)
        ? title.split(siteName)[0].replace(/[|\-—–]\s*$/, '').trim()
        : title;
    const fullTitle = `${cleanTitle} | ${siteName}`;

    // Unified Structured Data (@graph)
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${baseUrl}/#organization`,
                'name': siteName,
                'url': baseUrl,
                'logo': {
                    '@type': 'ImageObject',
                    'url': `${baseUrl}/favicon.svg`
                }
            },
            {
                '@type': 'WebSite',
                '@id': `${baseUrl}/#website`,
                'url': baseUrl,
                'name': siteName,
                'publisher': { '@id': `${baseUrl}/#organization` },
                'potentialAction': {
                    '@type': 'SearchAction',
                    'target': `${baseUrl}/?q={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                }
            },
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}${canonical}#webpage`,
                'url': `${baseUrl}${canonical}`,
                'name': fullTitle,
                'description': description,
                'isPartOf': { '@id': `${baseUrl}/#website` },
                'inLanguage': 'en-US',
            }
        ]
    };

    // Add FAQ Schema if present
    if (faqSchema && faqSchema.length > 0) {
        structuredData['@graph'].push({
            '@type': 'FAQPage',
            '@id': `${baseUrl}${canonical}#faq`,
            'mainEntity': faqSchema.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer,
                },
            })),
        });
    }

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={`${baseUrl}${canonical}`} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={`${baseUrl}${canonical}`} />
            <meta property="og:image" content={`${baseUrl}${ogImage}`} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />

            {/* Combined Structured Data Script */}
            <script type="application/ld+json" key="structured-data">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
