'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulating form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            İletişim
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            Sorularınız, önerileriniz veya yardıma ihtiyacınız mı var? 
            Bizimle iletişime geçmekten çekinmeyin!
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              İletişim Bilgileri
            </h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adres</h3>
                  <p className="text-gray-600">
                    Atatürk Caddesi No: 123<br />
                    Şişli / İstanbul<br />
                    34360 Türkiye
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                  <p className="text-gray-600">
                    +90 212 123 45 67<br />
                    +90 532 123 45 67
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">E-posta</h3>
                  <p className="text-gray-600">
                    info@saldunyasi.com<br />
                    destek@saldunyasi.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Çalışma Saatleri</h3>
                  <p className="text-gray-600">
                    Pazartesi - Cuma: 09:00 - 18:00<br />
                    Cumartesi: 10:00 - 16:00<br />
                    Pazar: Kapalı
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Harita</p>
                <p className="text-sm text-gray-400">Şişli, İstanbul</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Bize Yazın
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Konu seçiniz</option>
                    <option value="genel">Genel Bilgi</option>
                    <option value="siparis">Sipariş Durumu</option>
                    <option value="urun">Ürün Hakkında</option>
                    <option value="iade">İade/Değişim</option>
                    <option value="kargo">Kargo/Teslimat</option>
                    <option value="odeme">Ödeme Sorunları</option>
                    <option value="oneri">Öneri/Şikayet</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Mesaj Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Sık Sorulan Sorular
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <MessageCircle className="h-5 w-5 text-primary-600 mr-2" />
                Siparişim ne zaman kargoya verilir?
              </h3>
              <p className="text-gray-600">
                Siparişiniz onaylandıktan sonra 1-2 iş günü içinde kargoya verilir. 
                Kargo takip numaranız e-posta ile gönderilir.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <MessageCircle className="h-5 w-5 text-primary-600 mr-2" />
                İade ve değişim şartları nelerdir?
              </h3>
              <p className="text-gray-600">
                14 gün içinde hiçbir neden belirtmeden iade edebilirsiniz. 
                Ürün kullanılmamış ve etiketli olmalıdır.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <MessageCircle className="h-5 w-5 text-primary-600 mr-2" />
                Hangi ödeme yöntemlerini kabul ediyorsunuz?
              </h3>
              <p className="text-gray-600">
                Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme 
                seçeneklerini kullanabilirsiniz.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <MessageCircle className="h-5 w-5 text-primary-600 mr-2" />
                Kargo ücreti ne kadar?
              </h3>
              <p className="text-gray-600">
                200₺ ve üzeri alışverişlerde kargo ücretsiz. 
                Altındaki siparişlerde 15₺ kargo ücreti alınır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
