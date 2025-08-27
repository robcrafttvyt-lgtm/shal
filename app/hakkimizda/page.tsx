'use client'

import { Star, Users, Truck, Shield, Heart } from 'lucide-react'

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            2015'ten beri kaliteli şal ve eşarp ürünleriyle sizlere hizmet veriyoruz. 
            Her kadının stilini tamamlayacak mükemmel aksesuarları sunuyoruz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Hikayemiz
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Şal Dünyası, 2015 yılında İstanbul'da kadın aksesuarları konusunda 
                  uzman bir ekip tarafından kuruldu. Amacımız, her kadının kendini 
                  özel hissedeceği, kaliteli ve şık şal koleksiyonları sunmaktı.
                </p>
                <p>
                  Bugün, binlerce mutlu müşterimizle birlikte Türkiye'nin en 
                  güvenilir şal markalarından biri haline geldik. Premium kalitede 
                  kumaşlardan ürettiğimiz ürünlerimizle, stilinizi tamamlamanıza 
                  yardımcı oluyoruz.
                </p>
                <p>
                  Sürdürülebilir moda anlayışımızla, çevreye duyarlı üretim 
                  süreçleri benimsiyor ve yerel üreticilerle çalışarak ekonomimize 
                  katkıda bulunuyoruz.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-primary-700 font-semibold text-lg">
                    Kalite ve Güven
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Değerlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalite</h3>
                <p className="text-gray-600">
                  En kaliteli kumaşları kullanarak, uzun ömürlü ürünler üretiyoruz.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Müşteri Odaklılık</h3>
                <p className="text-gray-600">
                  Müşteri memnuniyetini her şeyin üstünde tutarak hizmet veriyoruz.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
                <p className="text-gray-600">
                  Siparişlerinizi en kısa sürede güvenle adresinize ulaştırıyoruz.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Güven</h3>
                <p className="text-gray-600">
                  Güvenli ödeme ve gizlilik konularında tam güvenlik sağlıyoruz.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Rakamlarla Şal Dünyası
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
                <div className="text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
                <div className="text-gray-600">Farklı Model</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">8</div>
                <div className="text-gray-600">Yıllık Deneyim</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">99%</div>
                <div className="text-gray-600">Müşteri Memnuniyeti</div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Her kadının kendini özel ve güzel hissetmesini sağlayacak, kaliteli ve 
                şık şal koleksiyonları sunarak, moda dünyasında fark yaratmak. Müşteri 
                memnuniyetini ön planda tutarak, güvenilir ve sürdürülebilir bir marka olmak.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Türkiye'nin en büyük ve en güvenilir şal markası olmak. Uluslararası 
                pazarlarda da tanınan, kalite standartlarımızla örnek gösterilen, 
                sürdürülebilir moda anlayışını benimseyen bir marka olmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Sorularınız veya önerileriniz için her zaman buradayız.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/iletisim"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              İletişim
            </a>
            <a
              href="/urunler"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Ürünleri İncele
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
