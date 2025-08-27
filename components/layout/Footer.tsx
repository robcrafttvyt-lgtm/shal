'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Şirket Bilgileri */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">Ş</span>
              </div>
              <span className="text-xl font-bold">Şal Dünyası</span>
            </div>
            <p className="text-gray-300 text-sm">
              Premium kalitede şallar ve eşarplar. Her tarza uygun geniş koleksiyonumuzla 
              stilinizi tamamlayın.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/urun" className="text-gray-300 hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/siparis-takip" className="text-gray-300 hover:text-white transition-colors">
                  Sipariş Takip
                </Link>
              </li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Müşteri Hizmetleri</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gizlilik" className="text-gray-300 hover:text-white transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-gray-300 hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link href="/iade-degisim" className="text-gray-300 hover:text-white transition-colors">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link href="/kargo" className="text-gray-300 hover:text-white transition-colors">
                  Kargo Bilgileri
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-gray-300 hover:text-white transition-colors">
                  Sık Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">
                  Atatürk Cad. No:123<br />
                  Şişli / İstanbul
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">+90 212 123 45 67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">info@saldunyasi.com</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Kampanyalardan Haberdar Olun</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-lg transition-colors">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Şal Dünyası. Tüm hakları saklıdır.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-gray-400 text-xs">Güvenli Ödeme</span>
            <div className="flex space-x-2">
              <div className="bg-white rounded px-2 py-1 text-xs font-bold text-gray-900">VISA</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-bold text-gray-900">MC</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-bold text-gray-900">AMEX</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
