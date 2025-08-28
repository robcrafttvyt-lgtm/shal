'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Menu, X, Search, Heart, MapPin, Phone } from 'lucide-react'
import { supabase, getUser } from '@/lib/supabase'
import { useCart } from '@/lib/cartContext'

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cartItems } = useCart()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      // Önce localStorage'dan kontrol et
      const localUser = localStorage.getItem('user')
      if (localUser) {
        setUser(JSON.parse(localUser))
      } else {
        const currentUser = await getUser()
        setUser(currentUser)
      }
    } catch (error) {
      console.log('Supabase henüz yapılandırılmamış, demo modda çalışıyor')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Demo modda çıkış yapılıyor')
    }
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/urunler?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const navigation = [
    { name: 'Tüm Ürünler', href: '/urunler' },
    { name: "Online'a Özel", href: '/online-ozel' },
    { name: 'Yeni Sezon', href: '/yeni-sezon' },
    { name: 'Şal', href: '/sal', current: true },
    { name: 'Monogram', href: '/monogram' },
    { name: 'Giyim', href: '/giyim' },
    { name: 'Çanta', href: '/canta' },
    { name: 'Outlet', href: '/outlet' },
  ]

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">Ş</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Şal Dünyası</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/urunler" className="text-gray-700 hover:text-primary-600 transition-colors">
              Ürünler
            </Link>
            <Link href="/hakkimizda" className="text-gray-700 hover:text-primary-600 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-700 hover:text-primary-600 transition-colors">
              İletişim
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Cart */}
            <Link href="/sepet" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profil" className="text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="h-6 w-6" />
                  </Link>
                  {user.type === 'admin' && (
                    <Link
                      href="/admin"
                      className="hidden md:block bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="hidden md:block text-gray-700 hover:text-primary-600 transition-colors text-sm"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/giris"
                    className="text-gray-700 hover:text-primary-600 transition-colors text-sm"
                  >
                    Giriş
                  </Link>
                  <Link
                    href="/kayit"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                Ana Sayfa
              </Link>
              <Link href="/urunler" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                Ürünler
              </Link>
              <Link href="/hakkimizda" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                Hakkımızda
              </Link>
              <Link href="/iletisim" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                İletişim
              </Link>
              
              {user && (
                <>
                  <Link href="/profil" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                    Profil
                  </Link>
                  {user.type === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Çıkış
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
