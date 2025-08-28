'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'

interface HeroSectionProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  showStats?: boolean
}

export default function HeroSection({
  title = 'Premium Şal Koleksiyonu',
  subtitle = 'En kaliteli kumaşlardan üretilmiş, her tarza uygun şallar',
  backgroundImage,
  primaryButtonText = 'Koleksiyonu İncele',
  secondaryButtonText = 'İletişim',
  showStats = true
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50">
            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />
            </div>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-primary-600 fill-current" />
            <span className="text-sm font-medium text-gray-700">Türkiye'nin En Seçkin Şal Markası</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-800 mb-6 leading-tight">
            <span className="block">Premium</span>
            <span className="block text-primary-700 font-medium">Şal Koleksiyonu</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/urunler"
              className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>{primaryButtonText}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/iletisim"
              className="group bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-primary-700 px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-200 hover:border-primary-300 shadow-sm hover:shadow-lg"
            >
              <span>{secondaryButtonText}</span>
            </Link>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-primary-700 mb-2">10.000+</div>
                <div className="text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-primary-700 mb-2">500+</div>
                <div className="text-sm text-gray-600">Farklı Model</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-primary-700 mb-2">15+ Yıl</div>
                <div className="text-sm text-gray-600">Deneyim</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
