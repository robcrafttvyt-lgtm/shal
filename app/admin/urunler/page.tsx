'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Eye,
  Package,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react'
import { Product } from '@/lib/supabase'
import toast from 'react-hot-toast'

// Demo ürün verileri - genişletilmiş
const demoProducts: Product[] = [
  {
    id: '1',
    title: 'Klasik Pamuk Şal',
    description: 'Yumuşak pamuk kumaştan üretilmiş, günlük kullanım için ideal şal.',
    price: 299.99,
    image_url: '/images/sal1.jpg',
    sizes: ['Tek Beden'],
    stock: 25,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Lüks İpek Şal',
    description: '%100 ipek kumaştan üretilmiş premium şal.',
    price: 899.99,
    image_url: '/images/sal2.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 15,
    created_at: '2024-01-08T11:15:00Z',
    updated_at: '2024-01-14T16:45:00Z',
  },
  {
    id: '3',
    title: 'Desenli Yün Şal',
    description: 'Geleneksel desenlerle süslenmiş yün şal.',
    price: 449.99,
    image_url: '/images/sal3.jpg',
    sizes: ['Tek Beden'],
    stock: 30,
    created_at: '2024-01-12T09:30:00Z',
    updated_at: '2024-01-15T10:20:00Z',
  },
  {
    id: '4',
    title: 'Modern Polyester Şal',
    description: 'Hafif ve dayanıklı polyester kumaş.',
    price: 199.99,
    image_url: '/images/sal4.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
    created_at: '2024-01-05T13:45:00Z',
    updated_at: '2024-01-13T12:15:00Z',
  },
  {
    id: '5',
    title: 'Vintage Stil Şal',
    description: 'Retro desenlerle dönemin havasını taşıyan vintage şal.',
    price: 349.99,
    image_url: '/images/sal5.jpg',
    sizes: ['Tek Beden'],
    stock: 5,
    created_at: '2024-01-07T15:20:00Z',
    updated_at: '2024-01-14T09:10:00Z',
  },
  {
    id: '6',
    title: 'Çiçek Desenli Şal',
    description: 'Renkli çiçek desenleriyle baharın neşesini yansıtan şık şal.',
    price: 279.99,
    image_url: '/images/sal6.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 35,
    created_at: '2024-01-09T08:00:00Z',
    updated_at: '2024-01-15T11:30:00Z',
  },
  {
    id: '7',
    title: 'Lüks Kaşmir Şal',
    description: 'En kaliteli kaşmir kumaştan üretilmiş şal.',
    price: 1299.99,
    image_url: '/images/sal7.jpg',
    sizes: ['S', 'M', 'L'],
    stock: 2,
    created_at: '2024-01-06T12:30:00Z',
    updated_at: '2024-01-15T08:45:00Z',
  },
  {
    id: '8',
    title: 'Bohem Tarz Şal',
    description: 'Özgür ruhlu bohem tarzını yansıtan renkli şal.',
    price: 359.99,
    image_url: '/images/sal8.jpg',
    sizes: ['Tek Beden'],
    stock: 22,
    created_at: '2024-01-11T16:10:00Z',
    updated_at: '2024-01-14T13:20:00Z',
  }
]

export default function AdminUrunlerPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(demoProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLowStock, setShowLowStock] = useState(false)

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
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStock = showLowStock ? product.stock <= 10 : true
      
      return matchesSearch && matchesStock
    })

    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.title.localeCompare(b.title)
        case 'stock-low':
          return a.stock - b.stock
        case 'stock-high':
          return b.stock - a.stock
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, sortBy, showLowStock])

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      setProducts(prev => prev.filter(p => p.id !== productId))
      toast.success('Ürün başarıyla silindi!')
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock <= 5) {
      return { color: 'text-red-600', bg: 'bg-red-100', text: 'Kritik' }
    } else if (stock <= 10) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Düşük' }
    } else {
      return { color: 'text-green-600', bg: 'bg-green-100', text: 'Normal' }
    }
  }

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
              <h1 className="text-xl font-bold text-gray-900">Ürün Yönetimi</h1>
            </div>
            <Link
              href="/admin/urun-ekle"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni Ürün</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.stock <= 10).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ortalama Fiyat</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Toplam Stok</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showLowStock}
                  onChange={(e) => setShowLowStock(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Sadece düşük stok</span>
              </label>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">En Yeni</option>
                <option value="name">İsme Göre</option>
                <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                <option value="stock-low">Stok (Düşük-Yüksek)</option>
                <option value="stock-high">Stok (Yüksek-Düşük)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedenler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Güncelleme
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 font-bold">
                              {product.title.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₺{product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                          {product.stock} adet
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.sizes.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.updated_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => router.push(`/urun/${product.id}`)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Görüntüle"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/urun-duzenle/${product.id}`)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Düzenle"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}
