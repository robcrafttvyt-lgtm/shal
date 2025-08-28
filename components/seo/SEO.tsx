import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  article?: boolean
  product?: ProductSEO
  breadcrumbs?: BreadcrumbItem[]
  noindex?: boolean
  canonical?: string
}

interface ProductSEO {
  name: string
  description: string
  image: string
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand: string
  category: string
  sku?: string
  reviews?: {
    ratingValue: number
    reviewCount: number
  }
}

interface BreadcrumbItem {
  name: string
  url: string
}

const DEFAULT_SEO = {
  title: 'Şal Dünyası - Premium Şal Koleksiyonu | En Kaliteli Şallar',
  description: 'Türkiye\'nin en seçkin şal markası. Premium kalite ipek, pamuk, yün şallar. Ücretsiz kargo, hızlı teslimat. En şık şal modelleri için hemen keşfedin!',
  keywords: ['şal', 'eşarp', 'ipek şal', 'pamuk şal', 'yün şal', 'kadın aksesuar', 'moda', 'şal dünyası'],
  image: '/images/og-image.jpg',
  siteUrl: 'https://saldunyasi.com'
}

export default function SEO({
  title,
  description,
  keywords = [],
  image,
  article = false,
  product,
  breadcrumbs,
  noindex = false,
  canonical
}: SEOProps) {
  const router = useRouter()
  
  const seoTitle = title 
    ? `${title} | Şal Dünyası`
    : DEFAULT_SEO.title

  const seoDescription = description || DEFAULT_SEO.description
  const seoKeywords = [...DEFAULT_SEO.keywords, ...keywords].join(', ')
  const seoImage = image || DEFAULT_SEO.image
  const seoUrl = `${DEFAULT_SEO.siteUrl}${router.asPath}`
  const canonicalUrl = canonical || seoUrl

  // Structured Data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Şal Dünyası',
    url: DEFAULT_SEO.siteUrl,
    logo: `${DEFAULT_SEO.siteUrl}/images/logo.png`,
    description: 'Türkiye\'nin en seçkin şal markası',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-212-555-0123',
      contactType: 'customer service',
      availableLanguage: 'Turkish'
    },
    sameAs: [
      'https://www.facebook.com/saldunyasi',
      'https://www.instagram.com/saldunyasi',
      'https://www.twitter.com/saldunyasi'
    ]
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Şal Dünyası',
    url: DEFAULT_SEO.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${DEFAULT_SEO.siteUrl}/urunler?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${DEFAULT_SEO.siteUrl}${item.url}`
    }))
  } : null

  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    category: product.category,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: 'Şal Dünyası'
      }
    },
    ...(product.reviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.reviews.ratingValue,
        reviewCount: product.reviews.reviewCount
      }
    })
  } : null

  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: seoDescription,
    image: seoImage,
    author: {
      '@type': 'Organization',
      name: 'Şal Dünyası'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Şal Dünyası',
      logo: {
        '@type': 'ImageObject',
        url: `${DEFAULT_SEO.siteUrl}/images/logo.png`
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString()
  } : null

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Şal Dünyası',
    description: 'Premium şal ve eşarp mağazası',
    url: DEFAULT_SEO.siteUrl,
    telephone: '+90-212-555-0123',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Atatürk Mahallesi, İstiklal Caddesi No:123',
      addressLocality: 'İstanbul',
      addressRegion: 'İstanbul',
      postalCode: '34000',
      addressCountry: 'TR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0082,
      longitude: 28.9784
    },
    openingHours: 'Mo-Su 09:00-21:00',
    priceRange: '₺₺',
    acceptsReservations: false
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Şal Dünyası" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : product ? 'product' : 'website'} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Şal Dünyası" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@saldunyasi" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#d4943e" />
      <meta name="msapplication-TileColor" content="#d4943e" />
      <meta name="apple-mobile-web-app-title" content="Şal Dünyası" />
      <meta name="application-name" content="Şal Dünyası" />

      {/* Language and Location */}
      <meta httpEquiv="content-language" content="tr" />
      <meta name="geo.region" content="TR" />
      <meta name="geo.placename" content="İstanbul" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://js.stripe.com" />
      <link rel="dns-prefetch" href="https://www.paypal.com" />
    </Head>
  )
}

export { DEFAULT_SEO }
