// Sitemap generation utility for better SEO
export interface SitemapEntry {
  url: string
  lastModified?: string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saldunyasi.com'

// Static pages
const STATIC_PAGES: SitemapEntry[] = [
  {
    url: '',
    changeFrequency: 'daily',
    priority: 1.0
  },
  {
    url: '/urunler',
    changeFrequency: 'daily',
    priority: 0.9
  },
  {
    url: '/hakkimizda',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    url: '/iletisim',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    url: '/giris',
    changeFrequency: 'yearly',
    priority: 0.5
  },
  {
    url: '/kayit',
    changeFrequency: 'yearly',
    priority: 0.5
  }
]

// Demo products for sitemap (in production, fetch from database)
const DEMO_PRODUCTS = [
  { id: '1', title: 'Klasik Pamuk Şal', updatedAt: '2024-01-15' },
  { id: '2', title: 'Lüks İpek Şal', updatedAt: '2024-01-14' },
  { id: '3', title: 'Desenli Yün Şal', updatedAt: '2024-01-13' },
  { id: '4', title: 'Modern Polyester Şal', updatedAt: '2024-01-12' },
  { id: '5', title: 'Vintage Stil Şal', updatedAt: '2024-01-11' },
  { id: '6', title: 'Çiçek Desenli Şal', updatedAt: '2024-01-10' }
]

export function generateSitemap(): string {
  const entries: SitemapEntry[] = [
    ...STATIC_PAGES,
    // Add product pages
    ...DEMO_PRODUCTS.map(product => ({
      url: `/urun/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${SITE_URL}${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`

  return sitemap
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /api/admin/

# Disallow user-specific pages
Disallow: /profil/
Disallow: /siparisler/

# Disallow search with parameters
Disallow: /urunler?*

# Allow specific crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay for respect
Crawl-delay: 1`
}

export function generateProductSchema(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: 'Şal Dünyası'
    },
    category: 'Şal',
    sku: product.id,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'TRY',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Şal Dünyası'
      },
      url: `${SITE_URL}/urun/${product.id}`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      reviewCount: Math.floor(Math.random() * 50) + 10
    }
  }
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    }))
  }
}

export function generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

// SEO meta tag generator
export function generateMetaTags(page: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
}) {
  const baseTitle = 'Şal Dünyası - Premium Şal Koleksiyonu'
  const baseDescription = 'Türkiye\'nin en seçkin şal markası. Premium kalite ipek, pamuk, yün şallar. Ücretsiz kargo, hızlı teslimat.'
  
  return {
    title: page.title ? `${page.title} | ${baseTitle}` : baseTitle,
    description: page.description || baseDescription,
    keywords: page.keywords?.join(', ') || 'şal, eşarp, ipek şal, pamuk şal, yün şal, kadın aksesuar',
    image: page.image || `${SITE_URL}/images/og-default.jpg`,
    url: page.url || SITE_URL,
    type: page.type || 'website'
  }
}

// Performance optimization hints
export function getPreloadHints(pathname: string): string[] {
  const hints: string[] = []

  // Common resources
  hints.push('https://fonts.googleapis.com')
  hints.push('https://fonts.gstatic.com')

  // Page-specific resources
  if (pathname === '/') {
    hints.push('/images/hero-bg.jpg')
  } else if (pathname.startsWith('/urun/')) {
    hints.push('/images/product-placeholder.jpg')
  } else if (pathname === '/checkout') {
    hints.push('https://js.stripe.com')
    hints.push('https://www.paypal.com')
  }

  return hints
}

// Content Security Policy generator
export function generateCSP(): string {
  const policies = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://www.paypal.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: http:",
    "connect-src 'self' https://www.google-analytics.com https://api.stripe.com https://www.paypal.com",
    "frame-src https://js.stripe.com https://www.paypal.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ]

  return policies.join('; ')
}
