'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { Product } from '@/lib/supabase'
import { useCart } from '@/lib/cartContext'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addToCart({
      product_id: product.id,
      product_title: product.title,
      size: selectedSize,
      quantity: 1,
      price: product.price,
      image_url: product.image_url
    })
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi')
  }

  return (
    <div 
      className={`group relative bg-white overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/urun/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Product Image */}
          <div className="w-full h-full bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
            {product.image_url && product.image_url !== '/placeholder.jpg' ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <span className="text-primary-600 text-6xl font-light">
                {product.title.charAt(0)}
              </span>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-3 left-3 bg-accent-500 text-white px-2 py-1 rounded text-xs font-medium">
              Yeniden Stokta
            </div>
          )}

          {/* Early Sales Badge (like in reference) */}
          {product.stock > 20 && (
            <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
              En Çok Satan
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
              }`} 
            />
          </button>

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isHovered ? 'bg-opacity-10' : 'bg-opacity-0'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`transition-all duration-300 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}>
                <button
                  onClick={handleAddToCart}
                  className="bg-white text-primary-700 px-6 py-2 rounded-full font-medium hover:bg-primary-50 transition-colors flex items-center space-x-2 shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Sepete Ekle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-gray-800 font-medium text-sm mb-2 line-clamp-2 leading-relaxed">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-primary-700">
              ₺{product.price.toFixed(2)}
            </div>
            
            {/* Size options for multi-size products */}
            {product.sizes.length > 1 && (
              <div className="flex space-x-1">
                {product.sizes.slice(0, 3).map((size) => (
                  <span
                    key={size}
                    className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span className="text-xs text-gray-400">+{product.sizes.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Colors/Pattern indicator (like reference site) */}
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-600"></div>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-400 to-accent-600"></div>
            <span className="text-xs text-gray-400 ml-2">+3 renk</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
