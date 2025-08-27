'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Phone, MapPin, Calendar, Package, Settings, LogOut, Edit3, Shield, Heart, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
  email: string
  name: string
  type: 'admin' | 'customer'
  phone?: string
  address?: string
  joinDate?: string
}

export default function ProfilPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    checkAuthAndLoadUserData()
  }, [])

  const checkAuthAndLoadUserData = async () => {
    try {
      // Kullanıcı authentication kontrolü
      const localUser = localStorage.getItem('user')
      
      if (!localUser) {
        toast.error('Bu sayfaya erişim için giriş yapmanız gerekiyor!')
        router.push('/giris')
        return
      }

      // Kullanıcı verilerini yükle
      const userData = JSON.parse(localUser)
      
      // Simulated loading delay (gerçek uygulamada API çağrısı olacak)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo için ek veriler ekle
      const enhancedUserData: UserData = {
        ...userData,
        phone: userData.phone || '+90 555 123 45 67',
        address: userData.address || 'Kadıköy, İstanbul',
        joinDate: userData.joinDate || '2024-01-15'
      }

      setUser(enhancedUserData)
      setEditData({
        name: enhancedUserData.name,
        phone: enhancedUserData.phone || '',
        address: enhancedUserData.address || ''
      })
      
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken hata:', error)
      toast.error('Kullanıcı verileri yüklenirken bir hata oluştu!')
      router.push('/giris')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    toast.success('Başarıyla çıkış yapıldı!')
    router.push('/')
  }

  const handleSaveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name: editData.name,
      phone: editData.phone,
      address: editData.address
    }

    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
    toast.success('Profil bilgileri güncellendi!')
  }

  const handleCancelEdit = () => {
    if (!user) return
    
    setEditData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || ''
    })
    setIsEditing(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil Yükleniyor</h2>
          <p className="text-gray-600">Kullanıcı bilgileri getiriliyor...</p>
        </div>
      </div>
    )
  }

  // User not found (shouldn't happen due to redirect, but safety check)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Giriş yapmak için tekrar deneyin.</p>
          <Link
            href="/giris"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Giriş Yap
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
              <p className="text-gray-600 mt-1">Hesap bilgilerinizi yönetin</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {user.type === 'admin' && (
                <Link
                  href="/admin"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center">{user.name}</h3>
                <p className="text-gray-600 text-center text-sm">{user.email}</p>
                {user.type === 'admin' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2 mx-auto">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                )}
              </div>
              
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profil Bilgileri</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Siparişlerim</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center space-x-2 px-4 py-2 text-left rounded-lg transition-colors ${
                    activeTab === 'favorites' 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorilerim</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Düzenle</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                      >
                        İptal
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{user.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kayıt Tarihi
                      </label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(user.joinDate || '').toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.address}
                          onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <span className="text-gray-900">{user.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Siparişlerim</h2>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sipariş yok</h3>
                  <p className="text-gray-600 mb-6">İlk siparişinizi vermek için ürünlerimizi inceleyin.</p>
                  <Link
                    href="/urunler"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Ürünleri İncele
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Favorilerim</h2>
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Favori ürün yok</h3>
                  <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek buradan takip edebilirsiniz.</p>
                  <Link
                    href="/urunler"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Ürünleri İncele
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
