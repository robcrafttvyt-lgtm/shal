'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  Edit,
  Trash2,
  Filter
} from 'lucide-react'
import { Product, Order } from '@/lib/supabase'
import toast from 'react-hot-toast'

// Demo veriler
const demoStats = {
  totalUsers: 1247,
  totalProducts: 156,
  totalOrders: 89,
  totalRevenue: 45320.50,
  newOrdersToday: 12,
  topSellingProduct: 'Lüks İpek Şal'
}

const demoRecentOrders = [
  {
    id: 'ORD-001',
    user_id: 'user1',
    customerName: 'Ayşe Yılmaz',
    total_amount: 899.99,
    status: 'pending',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    user_id: 'user2',
    customerName: 'Zeynep Kaya',
    total_amount: 449.99,
    status: 'confirmed',
    created_at: '2024-01-15T09:15:00Z'
  },
  {
    id: 'ORD-003',
    user_id: 'user3',
    customerName: 'Fatma Demir',
    total_amount: 299.99,
    status: 'shipped',
    created_at: '2024-01-14T16:45:00Z'
  }
]

const demoLowStockProducts = [
  { id: '1', title: 'Klasik Pamuk Şal', stock: 3 },
  { id: '2', title: 'Vintage Stil Şal', stock: 5 },
  { id: '7', title: 'Lüks Kaşmir Şal', stock: 2 }
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Admin authentication kontrolü
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.type === 'admin') {
        setIsAuthenticated(true)
      } else {
        toast.error('Bu sayfaya erişim yetkiniz yok!')
        router.push('/giris')
      }
    } else {
      toast.error('Admin girişi gerekli!')
      router.push('/giris')
    }
    setIsLoading(false)
  }, [router])

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    
    const statusTexts = {
      pending: 'Bekliyor',
      confirmed: 'Onaylandı',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusTexts[status as keyof typeof statusTexts]}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Siteye Dön
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  router.push('/giris')
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">{demoStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{demoStats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{demoStats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{demoStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
                <button
                  onClick={() => router.push('/admin/siparisler')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Tümünü Gör</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {demoRecentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-600">Sipariş: {order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₺{order.total_amount}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Düşük Stok Uyarısı</h2>
                <button
                  onClick={() => router.push('/admin/urunler')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Package className="h-4 w-4" />
                  <span>Ürünleri Yönet</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {demoLowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-gray-900">{product.title}</p>
                      <p className="text-sm text-red-600">Stok: {product.stock} adet</p>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/urun-ekle')}
              className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Yeni Ürün Ekle</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/siparisler')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Siparişleri Görüntüle</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/kullanicilar')}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Kullanıcıları Yönet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
