'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Eye, Heart, Filter } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/cartContext'
import toast from 'react-hot-toast'

// Demo ürünler - genişletilmiş koleksiyon
const allProducts: Product[] = [
  {
    id: '1',
    title: 'Klasik Pamuk Şal',
    description: 'Yumuşak pamuk kumaştan üretilmiş, günlük kullanım için ideal şal. Rahat ve şık.',
    price: 299.99,
    image_url: '/images/sal1.jpg',
    sizes: ['Tek Beden'],
    stock: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Lüks İpek Şal',
    description: '%100 ipek kumaştan üretilmiş premium şal. Özel günler için mükemmel seçim.',
    price: 899.99,
    image_url: '/images/sal2.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Desenli Yün Şal',
    description: 'Geleneksel desenlerle süslenmiş yün şal. Kış ayları için sıcacık.',
    price: 449.99,
    image_url: '/images/sal3.jpg',
    sizes: ['Tek Beden'],
    stock: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Modern Polyester Şal',
    description: 'Hafif ve dayanıklı polyester kumaş. Günlük kullanım için pratik seçenek.',
    price: 199.99,
    image_url: '/images/sal4.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Vintage Stil Şal',
    description: 'Retro desenlerle dönemin havasını taşıyan vintage şal koleksiyonu.',
    price: 349.99,
    image_url: '/images/sal5.jpg',
    sizes: ['Tek Beden'],
    stock: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Çiçek Desenli Şal',
    description: 'Renkli çiçek desenleriyle baharın neşesini yansıtan şık şal.',
    price: 279.99,
    image_url: '/images/sal6.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 35,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Lüks Kaşmir Şal',
    description: 'En kaliteli kaşmir kumaştan üretilmiş, ultra yumuşak ve sıcak şal.',
    price: 1299.99,
    image_url: '/images/sal7.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Bohem Tarz Şal',
    description: 'Özgür ruhlu bohem tarzını yansıtan renkli ve desenli şal.',
    price: 359.99,
    image_url: '/images/sal8.jpg',
    sizes: ['Tek Beden'],
    stock: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addToCart({
      product_id: product.id,
      product_title: product.title,
      size: selectedSize,
      quantity: 1,
      price: product.price,
      image_url: product.image_url,
    })
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/urun/${product.id}`}>
        <div className="relative overflow-hidden">
          <div className="aspect-w-1 aspect-h-1 h-64 bg-gray-200 relative">
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-600 text-4xl font-bold">
                {product.title.charAt(0)}
              </span>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>

          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
            />
          </button>

          {product.stock < 10 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Son {product.stock} adet!
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-primary-600">
              ₺{product.price.toFixed(2)}
            </div>
            
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-gray-500 text-sm ml-1">(24)</span>
            </div>
          </div>

          {product.sizes.length > 1 && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beden:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Sepete Ekle</span>
          </button>
        </div>
      </Link>
    </div>
  )
}

export default function UrunlerPage() {
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 })
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filtreleme ve sıralama
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      const matchesSize = selectedSizes.length === 0 || 
                         product.sizes.some(size => selectedSizes.includes(size))
      
      return matchesSearch && matchesPrice && matchesSize
    })

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.title.localeCompare(b.title)
        case 'stock':
          return b.stock - a.stock
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy, priceRange, selectedSizes])

  const handleSizeFilter = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setPriceRange({ min: 0, max: 2000 })
    setSelectedSizes([])
    setSortBy('newest')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tüm Ürünler</h1>
          <p className="text-gray-600">
            Premium kalitede şal koleksiyonumuzu keşfedin. {filteredProducts.length} ürün bulundu.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Ara
                  </label>
                  <input
                    type="text"
                    placeholder="Ürün adı veya açıklama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat Aralığı
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₺{priceRange.min}</span>
                      <span>₺{priceRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beden
                  </label>
                  <div className="space-y-2">
                    {['S', 'M', 'L', 'XL', 'Tek Beden'].map((size) => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeFilter(size)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} ürün gösteriliyor
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">En Yeni</option>
                <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                <option value="name">İsme Göre</option>
                <option value="stock">Stok Durumu</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  Aradığınız kriterlere uygun ürün bulunamadı.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
