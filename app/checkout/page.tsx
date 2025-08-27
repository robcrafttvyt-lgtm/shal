'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Shield, Truck, CheckCircle, User, MapPin, Phone, Mail } from 'lucide-react'
import { useCart } from '@/lib/cartContext'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    notes: ''
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  const [paymentMethod, setPaymentMethod] = useState('credit-card')

  useEffect(() => {
    checkAuthAndCart()
  }, [])

  const checkAuthAndCart = () => {
    // Kullanıcı kontrolü
    const localUser = localStorage.getItem('user')
    if (!localUser) {
      toast.error('Ödeme yapabilmek için giriş yapmanız gerekiyor!')
      router.push('/giris')
      return
    }

    // Sepet kontrolü
    if (cartItems.length === 0) {
      toast.error('Sepetiniz boş! Ürün ekleyerek tekrar deneyin.')
      router.push('/urunler')
      return
    }

    setUser(JSON.parse(localUser))
    setIsLoading(false)
  }

  const handleInputChange = (section: 'billing' | 'payment', field: string, value: string) => {
    if (section === 'billing') {
      setBillingInfo(prev => ({ ...prev, [field]: value }))
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Form validasyonu
    const requiredBillingFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
    const missingFields = requiredBillingFields.filter(field => !billingInfo[field as keyof typeof billingInfo])
    
    if (missingFields.length > 0) {
      toast.error('Lütfen tüm gerekli alanları doldurun!')
      setIsProcessing(false)
      return
    }

    if (paymentMethod === 'credit-card') {
      const requiredPaymentFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName']
      const missingPaymentFields = requiredPaymentFields.filter(field => !paymentInfo[field as keyof typeof paymentInfo])
      
      if (missingPaymentFields.length > 0) {
        toast.error('Lütfen kart bilgilerini eksiksiz doldurun!')
        setIsProcessing(false)
        return
      }
    }

    // Demo ödeme işlemi (3 saniye bekleme)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Başarılı ödeme
    toast.success('Ödemeniz başarıyla tamamlandı!')
    clearCart()
    
    // Sipariş tamamlandı sayfasına yönlendir (burada basit bir alert gösteriyoruz)
    alert(`Siparişiniz alındı!\n\nSipariş Özeti:\n- ${cartItems.length} ürün\n- Toplam: ₺${(getTotalPrice() + 15).toFixed(2)}\n\nSipariş takip bilgileri e-posta adresinize gönderilecektir.`)
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 200 ? 0 : 15
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sepet"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Sepete Dön</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Ödeme</h1>
          <p className="text-gray-600 mt-2">Siparişinizi tamamlamak için bilgilerinizi girin</p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Teslimat Bilgileri</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.firstName}
                    onChange={(e) => handleInputChange('billing', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Adınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.lastName}
                    onChange={(e) => handleInputChange('billing', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Soyadınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                  <input
                    type="email"
                    required
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange('billing', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={billingInfo.phone}
                    onChange={(e) => handleInputChange('billing', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0555 123 45 67"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                  <textarea
                    required
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Mahalle, sokak, bina no, daire no"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İl *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.city}
                    onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="İstanbul"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                  <input
                    type="text"
                    value={billingInfo.district}
                    onChange={(e) => handleInputChange('billing', 'district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Kadıköy"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş Notu</label>
                  <textarea
                    value={billingInfo.notes}
                    onChange={(e) => handleInputChange('billing', 'notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Sipariş hakkında özel notlarınız (isteğe bağlı)"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Ödeme Yöntemi</h2>
              </div>

              <div className="space-y-4 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium">Kredi Kartı</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                    <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium">Havale/EFT</span>
                  <span className="text-sm text-gray-500">(Sipariş onaylandıktan sonra ödeme)</span>
                </label>
              </div>

              {paymentMethod === 'credit-card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardName}
                      onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="JOHN DOE"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      required
                      value={paymentInfo.cvv}
                      onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sipariş Özeti</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.product_id}-${item.size}`} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 text-sm font-bold">
                        {item.product_title.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product_title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Beden: {item.size} • Adet: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium">₺{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      `₺${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-primary-600">₺{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mb-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Güvenli Ödeme Yap</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Info */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span>SSL ile güvenli ödeme</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-3 w-3 text-blue-600" />
                  <span>1-3 iş günü teslimat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>14 gün iade garantisi</span>
                </div>
              </div>

              {/* Demo Note */}
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-700">
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
