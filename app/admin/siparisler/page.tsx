'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  Download,
  Mail,
  Phone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Order {
  id: string
  user_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  products: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: {
    address: string
    city: string
    district: string
    postal_code: string
  }
  payment_method: string
  created_at: string
  updated_at: string
  notes?: string
}

interface OrderItem {
  product_id: string
  product_title: string
  size: string
  quantity: number
  price: number
}

// Demo sipariş verileri
const demoOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    user_id: 'user1',
    customer_name: 'Ayşe Yılmaz',
    customer_email: 'ayse@email.com',
    customer_phone: '0555 123 45 67',
    products: [
      {
        product_id: '1',
        product_title: 'Klasik Pamuk Şal',
        size: 'Tek Beden',
        quantity: 2,
        price: 299.99
      },
      {
        product_id: '2',
        product_title: 'Lüks İpek Şal',
        size: 'M',
        quantity: 1,
        price: 899.99
      }
    ],
    total_amount: 1499.97,
    status: 'pending',
    shipping_address: {
      address: 'Atatürk Mahallesi, 123. Sokak, No: 45/7',
      city: 'İstanbul',
      district: 'Kadıköy',
      postal_code: '34710'
    },
    payment_method: 'Kredi Kartı',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    notes: 'Hızlı teslimat talep edildi.'
  },
  {
    id: 'ORD-2024-002',
    user_id: 'user2',
    customer_name: 'Zeynep Kaya',
    customer_email: 'zeynep@email.com',
    customer_phone: '0555 987 65 43',
    products: [
      {
        product_id: '3',
        product_title: 'Desenli Yün Şal',
        size: 'Tek Beden',
        quantity: 1,
        price: 449.99
      }
    ],
    total_amount: 449.99,
    status: 'confirmed',
    shipping_address: {
      address: 'Cumhuriyet Caddesi, 67. Sokak, No: 12/3',
      city: 'Ankara',
      district: 'Çankaya',
      postal_code: '06100'
    },
    payment_method: 'Havale/EFT',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-15T09:15:00Z'
  },
  {
    id: 'ORD-2024-003',
    user_id: 'user3',
    customer_name: 'Fatma Demir',
    customer_email: 'fatma@email.com',
    customer_phone: '0555 456 78 90',
    products: [
      {
        product_id: '5',
        product_title: 'Vintage Stil Şal',
        size: 'Tek Beden',
        quantity: 1,
        price: 349.99
      },
      {
        product_id: '6',
        product_title: 'Çiçek Desenli Şal',
        size: 'L',
        quantity: 1,
        price: 279.99
      }
    ],
    total_amount: 629.98,
    status: 'shipped',
    shipping_address: {
      address: 'Barbaros Bulvarı, 234. Sokak, No: 89/2',
      city: 'İzmir',
      district: 'Konak',
      postal_code: '35250'
    },
    payment_method: 'Kredi Kartı',
    created_at: '2024-01-13T12:20:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'ORD-2024-004',
    user_id: 'user4',
    customer_name: 'Mehmet Özkan',
    customer_email: 'mehmet@email.com',
    customer_phone: '0555 321 54 76',
    products: [
      {
        product_id: '7',
        product_title: 'Lüks Kaşmir Şal',
        size: 'L',
        quantity: 1,
        price: 1299.99
      }
    ],
    total_amount: 1299.99,
    status: 'delivered',
    shipping_address: {
      address: 'Atatürk Bulvarı, 456. Sokak, No: 23/1',
      city: 'Bursa',
      district: 'Osmangazi',
      postal_code: '16050'
    },
    payment_method: 'Kredi Kartı',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-14T16:45:00Z'
  }
]

export default function AdminSiparislerPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>(demoOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(demoOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    // Admin auth kontrolü
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.type === 'admin') {
        setIsAuthenticated(true)
      } else {
        router.push('/giris')
      }
    } else {
      router.push('/giris')
    }
  }, [router])

  useEffect(() => {
    // Filtreleme ve sıralama
    let filtered = orders.filter(order => {
      const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount-high':
          return b.total_amount - a.total_amount
        case 'amount-low':
          return a.total_amount - b.total_amount
        case 'customer':
          return a.customer_name.localeCompare(b.customer_name)
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{statusTexts[status as keyof typeof statusTexts]}</span>
      </span>
    )
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
        : order
    ))
    toast.success('Sipariş durumu güncellendi!')
  }

  const sendEmailToCustomer = (order: Order) => {
    // Demo için - gerçek uygulamada e-posta servisi kullanılacak
    toast.success(`${order.customer_name} adlı müşteriye e-posta gönderildi!`)
  }

  const exportOrders = () => {
    // Demo için - gerçek uygulamada CSV/Excel export yapılacak
    const dataStr = JSON.stringify(filteredOrders, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'siparisler.json'
    link.click()
    toast.success('Siparişler dışa aktarıldı!')
  }

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total_amount, 0)
    }
  }

  const stats = getStats()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-gray-900">Sipariş Yönetimi</h1>
            </div>
            <button
              onClick={exportOrders}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Dışa Aktar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <Package className="h-6 w-6 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Toplam</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-600">Bekliyor</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              <p className="text-xs text-gray-600">Onaylandı</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <Truck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.shipped}</p>
              <p className="text-xs text-gray-600">Kargoda</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              <p className="text-xs text-gray-600">Teslim</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              <p className="text-xs text-gray-600">İptal</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-center">
              <Package className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900">₺{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Toplam Gelir</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Sipariş No, müşteri adı veya e-posta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Bekliyor</option>
                <option value="confirmed">Onaylandı</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="amount-high">Tutar (Yüksek-Düşük)</option>
                <option value="amount-low">Tutar (Düşük-Yüksek)</option>
                <option value="customer">Müşteri Adı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sipariş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürünler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.payment_method}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{order.customer_email}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span>{order.customer_phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.products.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.quantity}x {item.product_title} ({item.size})
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₺{order.total_amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getStatusBadge(order.status)}
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="block w-full text-xs border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="pending">Bekliyor</option>
                          <option value="confirmed">Onaylandı</option>
                          <option value="shipped">Kargoda</option>
                          <option value="delivered">Teslim Edildi</option>
                          <option value="cancelled">İptal Edildi</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </div>
                      <div>
                        {new Date(order.created_at).toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sendEmailToCustomer(order)}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="E-posta Gönder"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aradığınız kriterlere uygun sipariş bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Sipariş Detayları - {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              {/* Order details content would go here */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Müşteri Bilgileri</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Ad:</strong> {selectedOrder.customer_name}</p>
                    <p><strong>E-posta:</strong> {selectedOrder.customer_email}</p>
                    <p><strong>Telefon:</strong> {selectedOrder.customer_phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Teslimat Adresi</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{selectedOrder.shipping_address.address}</p>
                    <p>{selectedOrder.shipping_address.district}, {selectedOrder.shipping_address.city}</p>
                    <p>Posta Kodu: {selectedOrder.shipping_address.postal_code}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sipariş Ürünleri</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {selectedOrder.products.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.product_title} ({item.size})</span>
                        <span>₺{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-semibold flex justify-between">
                      <span>Toplam:</span>
                      <span>₺{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Notlar</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
