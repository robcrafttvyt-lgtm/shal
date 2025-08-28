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
    <>
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-6 text-gray-600">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>Alışverişe hemen başla! </span>
                {!user && (
                  <Link href="/kayit" className="text-primary-600 hover:text-primary-700 font-medium">
                    kayıt ol
                  </Link>
                )}
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>500₺ ve Üzeri Ücretsiz Kargo</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>KAYIT OL</span>
              <span>GİRİŞ YAP</span>
              <div className="flex items-center space-x-2">
                <span>🇹🇷 TR - ₺ TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <div className="text-primary-600">
                  {/* Elegant logo inspired by reference site */}
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <circle cx="20" cy="8" r="3" />
                    <circle cx="8" cy="20" r="3" />
                    <circle cx="32" cy="20" r="3" />
                    <circle cx="20" cy="32" r="3" />
                    <path d="M20 8L32 20L20 32L8 20Z" fillOpacity="0.3" />
                  </svg>
                </div>
                <div className="text-2xl font-light text-gray-800 tracking-wide">
                  <span className="text-primary-700 font-medium">ŞAL</span>DÜNYASI
                </div>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Aradığınız ürünü buraya yazın!"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-6">
              {/* User Account */}
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative group">
                  <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="text-xs font-medium hidden lg:block">Hesabım</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profilim
                      </Link>
                      <Link href="/siparisler" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Siparişlerim
                      </Link>
                      {user.type === 'admin' && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/giris" className="text-sm text-gray-600 hover:text-primary-600 font-medium">
                    GİRİŞ YAP
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/kayit" className="text-sm text-gray-600 hover:text-primary-600 font-medium">
                    KAYIT OL
                  </Link>
                </div>
              )}

              {/* Favorites */}
              <Link href="/favoriler" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors">
                <Heart className="h-5 w-5" />
                <span className="text-xs font-medium hidden lg:block">Favoriler</span>
              </Link>

              {/* Cart */}
              <Link href="/sepet" className="relative flex flex-col items-center space-y-1 text-gray-600 hover:text-primary-600 transition-colors">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium hidden lg:block">Sepet</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 pb-4 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-primary-700 border-b-2 border-primary-700 pb-1'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-4 border-t border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Aradığınız ürünü buraya yazın!"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-primary-600"
              >
                <Search className="h-5 w-5 mr-3" />
                Ürün Ara
              </button>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {!user && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <Link
                    href="/giris"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="block px-3 py-2 text-primary-600 hover:text-primary-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
