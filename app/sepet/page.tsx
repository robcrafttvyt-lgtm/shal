'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, Truck } from 'lucide-react'
import { useCart } from '@/lib/cartContext'
import toast from 'react-hot-toast'

export default function SepetPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [isPromoApplied, setIsPromoApplied] = useState(false)
  const [shipping, setShipping] = useState(15) // 15₺ kargo ücreti

  const handleQuantityChange = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size)
    } else {
      updateQuantity(productId, size, newQuantity)
    }
  }

  const handlePromoCode = () => {
    if (promoCode.toUpperCase() === 'HOSGELDIN' && !isPromoApplied) {
      setIsPromoApplied(true)
      setShipping(0)
      toast.success('Promosyon kodu uygulandı! Kargo ücretsiz!')
    } else if (isPromoApplied) {
      toast.error('Bu promosyon kodu zaten uygulandı!')
    } else {
      toast.error('Geçersiz promosyon kodu!')
    }
  }

  const subtotal = getTotalPrice()
  const freeShippingThreshold = 200
  const actualShipping = subtotal >= freeShippingThreshold ? 0 : shipping
  const total = subtotal + actualShipping

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Sepetiniz Boş
          </h1>
          <p className="text-gray-600 mb-8">
            Henüz sepetinize ürün eklememişsiniz. Şal koleksiyonumuzu keşfetmeye başlayın!
          </p>
          <Link
            href="/urunler"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Alışverişe Devam Et</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetim</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/urunler"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Alışverişe Devam Et</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{cartItems.length} ürün</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <div key={`${item.product_id}-${item.size}`} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 text-xl font-bold">
                          {item.product_title.charAt(0)}
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.product_title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Beden: {item.size}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary-600">
                            ₺{item.price.toFixed(2)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.product_id, item.size, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 text-center min-w-[60px]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.product_id, item.size, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.product_id, item.size)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="mt-2 text-right">
                          <span className="text-sm text-gray-600">Toplam: </span>
                          <span className="font-semibold text-gray-900">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promosyon Kodu
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promosyon kodunuz"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Uygula
                  </button>
                </div>
                {isPromoApplied && (
                  <p className="text-green-600 text-sm mt-1">Promosyon kodu uygulandı!</p>
                )}
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium">₺{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium">
                    {actualShipping === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      `₺${actualShipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < freeShippingThreshold && !isPromoApplied && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    ₺{(freeShippingThreshold - subtotal).toFixed(2)} daha ekleyin, kargo ücretsiz olsun!
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-primary-600">₺{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <span>Ödeme Yap</span>
              </button>

              {/* Security & Shipping Info */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Ücretsiz iade ve değişim</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Güvenli ödeme garantisi</span>
                </div>
              </div>

              {/* Demo Note */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Demo:</strong> Bu bir demo uygulamasıdır. Gerçek ödeme işlemi yapılmayacaktır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
