'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react'
import { Product, supabase } from '@/lib/supabase'
import { useCart } from '@/lib/cartContext'
import toast from 'react-hot-toast'
import HeroSection from '@/components/ui/HeroSection'
import ProductGrid from '@/components/ui/ProductGrid'

// Demo veriler - Gerçek uygulamada Supabase'den gelecek
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Klasik Pamuk Şal',
    description: 'Yumuşak pamuk kumaştan üretilmiş, günlük kullanım için ideal şal. Rahat ve şık.',
    price: 299.99,
    image_url: '/images/sal1.jpg',
    sizes: ['Tek Beden'],
    stock: 25,
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Lüks İpek Şal',
    description: '%100 ipek kumaştan üretilmiş premium şal. Özel günler için mükemmel seçim.',
    price: 899.99,
    image_url: '/images/sal2.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 15,
    created_at: '2024-01-14T15:30:00.000Z',
    updated_at: '2024-01-14T15:30:00.000Z',
  },
  {
    id: '3',
    title: 'Desenli Yün Şal',
    description: 'Geleneksel desenlerle süslenmiş yün şal. Kış ayları için sıcacık.',
    price: 449.99,
    image_url: '/images/sal3.jpg',
    sizes: ['Tek Beden'],
    stock: 30,
    created_at: '2024-01-13T09:15:00.000Z',
    updated_at: '2024-01-13T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'Modern Polyester Şal',
    description: 'Hafif ve dayanıklı polyester kumaş. Günlük kullanım için pratik seçenek.',
    price: 199.99,
    image_url: '/images/sal4.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
    created_at: '2024-01-12T14:20:00.000Z',
    updated_at: '2024-01-12T14:20:00.000Z',
  },
  {
    id: '5',
    title: 'Vintage Stil Şal',
    description: 'Retro desenlerle dönemin havasını taşıyan vintage şal koleksiyonu.',
    price: 349.99,
    image_url: '/images/sal5.jpg',
    sizes: ['Tek Beden'],
    stock: 20,
    created_at: '2024-01-11T11:45:00.000Z',
    updated_at: '2024-01-11T11:45:00.000Z',
  },
  {
    id: '6',
    title: 'Çiçek Desenli Şal',
    description: 'Renkli çiçek desenleriyle baharın neşesini yansıtan şık şal.',
    price: 279.99,
    image_url: '/images/sal6.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 35,
    created_at: '2024-01-10T16:00:00.000Z',
    updated_at: '2024-01-10T16:00:00.000Z',
  },
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
            {/* Placeholder görsel - gerçek uygulamada Next.js Image kullanın */}
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-600 text-4xl font-bold">
                {product.title.charAt(0)}
              </span>
            </div>
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Favoriler butonu */}
          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
            />
          </button>

          {/* Stok durumu */}
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

          {/* Fiyat */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-primary-600">
              ₺{product.price.toFixed(2)}
            </div>
            
            {/* Yıldız ratingleri - demo */}
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

          {/* Beden seçimi */}
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

          {/* Sepete ekle butonu */}
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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(demoProducts)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Builder.io Compatible */}
      <HeroSection
        title="Premium Şal Koleksiyonu"
        subtitle="En kaliteli kumaşlardan üretilmiş, her tarza uygun şallar"
        primaryButtonText="Koleksiyonu İncele"
        secondaryButtonText="İletişim"
        showStats={true}
      />

      {/* Featured Products Section - Builder.io Compatible */}
      <ProductGrid
        title="Öne Çıkan Ürünler"
        maxProducts={6}
        showFilter={false}
        products={products}
      />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
              Neden Şal Dünyası?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Kalite</h3>
              <p className="text-gray-600">En kaliteli kumaşlar ve özenli işçilik</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">500₺ ve üzeri siparişlerde ücretsiz kargo</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Güvenli Alışveriş</h3>
              <p className="text-gray-600">14 gün iade garantisi ve güvenli ödeme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-secondary-50 to-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-4">
            Yeni Koleksiyonlardan Haberdar Olun
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            E-posta listemize katılın ve yeni ürünler, özel indirimler ve kampanyalardan ilk siz haberdar olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
