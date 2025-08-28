import { builder } from '@builder.io/react'

// Initialize Builder.io
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'your-builder-public-api-key')

// Register custom components for Builder.io
export const registerBuilderComponents = () => {
  // Product Card Component
  builder.registerComponent(require('../components/ui/ProductCard').default, {
    name: 'ProductCard',
    inputs: [
      {
        name: 'product',
        type: 'object',
        required: true,
        defaultValue: {
          id: '1',
          title: 'Sample Product',
          description: 'Product description',
          price: 299.99,
          image_url: '/placeholder.jpg',
          sizes: ['Tek Beden'],
          stock: 10
        }
      }
    ]
  })

  // Hero Section Component
  builder.registerComponent(require('../components/ui/HeroSection').default, {
    name: 'HeroSection',
    inputs: [
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Premium Şal Koleksiyonu'
      },
      {
        name: 'subtitle',
        type: 'string',
        defaultValue: 'En kaliteli kumaşlardan üretilmiş, her tarza uygun şallar'
      },
      {
        name: 'backgroundImage',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg'],
        required: false
      },
      {
        name: 'primaryButtonText',
        type: 'string',
        defaultValue: 'Koleksiyonu İncele'
      },
      {
        name: 'secondaryButtonText',
        type: 'string',
        defaultValue: 'İletişim'
      }
    ]
  })

  // Product Grid Component
  builder.registerComponent(require('../components/ui/ProductGrid').default, {
    name: 'ProductGrid',
    inputs: [
      {
        name: 'title',
        type: 'string',
        defaultValue: 'Öne Çıkan Ürünler'
      },
      {
        name: 'maxProducts',
        type: 'number',
        defaultValue: 6
      },
      {
        name: 'showFilter',
        type: 'boolean',
        defaultValue: true
      }
    ]
  })
}

// Builder.io models configuration
export const builderModels = {
  page: 'page',
  announcement: 'announcement-bar',
  header: 'header',
  footer: 'footer'
}

export { builder }
