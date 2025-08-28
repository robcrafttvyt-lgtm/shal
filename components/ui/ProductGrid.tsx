'use client'

import { useState, useEffect } from 'react'
import { Filter, Grid, List, Search } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from '@/lib/supabase'

interface ProductGridProps {
  title?: string
  maxProducts?: number
  showFilter?: boolean
  products?: Product[]
  className?: string
}

// Demo products for Builder.io preview
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Çiçek Desenli Pamuk Şal',
    description: 'Yumuşak pamuk kumaştan üretilmiş, günlük kullanım için ideal şal.',
    price: 299.99,
    image_url: '/images/sal1.jpg',
    sizes: ['Tek Beden'],
    stock: 25,
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Lüks İpek Kare Şal',
    description: '%100 ipek kumaştan üretilmiş premium şal.',
    price: 899.99,
    image_url: '/images/sal2.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 15,
    created_at: '2024-01-14T15:30:00.000Z',
    updated_at: '2024-01-14T15:30:00.000Z',
  },
  {
    id: '3',
    title: 'Desenli Yün Şal Koleksiyonu',
    description: 'Geleneksel desenlerle süslenmiş yün şal.',
    price: 449.99,
    image_url: '/images/sal3.jpg',
    sizes: ['Tek Beden'],
    stock: 30,
    created_at: '2024-01-13T09:15:00.000Z',
    updated_at: '2024-01-13T09:15:00.000Z',
  }
]

export default function ProductGrid({
  title = 'Öne Çıkan Ürünler',
  maxProducts = 6,
  showFilter = true,
  products = demoProducts,
  className = ''
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [sortBy, setSortBy] = useState('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    let filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.title.localeCompare(b.title, 'tr')
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    // Limit products if maxProducts is set
    if (maxProducts > 0) {
      filtered = filtered.slice(0, maxProducts)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy, maxProducts])

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Filters */}
        {showFilter && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">En Yeni</option>
                    <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                    <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                    <option value="name">İsim (A-Z)</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Ürün bulunamadı
            </h3>
            <p className="text-gray-500">
              Arama kriterlerinizi değiştirerek tekrar deneyin.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {maxProducts > 0 && products.length > maxProducts && (
          <div className="text-center mt-12">
            <button className="bg-white hover:bg-gray-50 text-primary-700 border border-primary-200 hover:border-primary-300 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md">
              Daha Fazla Ür��n Göster
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
