'use client'

import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <div className="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sayfa Bulunamadı
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir. 
            Lütfen URL'yi kontrol edin veya ana sayfaya dönün.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          
          <div className="flex space-x-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri Dön</span>
            </button>
            
            <Link
              href="/urunler"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Ürünler</span>
            </Link>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Yardıma mı ihtiyacınız var?
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/iletisim"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              İletişim
            </Link>
            <Link
              href="/hakkimizda"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Hakkımızda
            </Link>
            <Link
              href="/sss"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              SSS
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  )
}
