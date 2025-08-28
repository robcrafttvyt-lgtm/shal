'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Clock, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function RateLimitPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const retryAfter = searchParams.get('retryAfter')
    if (retryAfter) {
      setTimeLeft(parseInt(retryAfter))
    }
  }, [searchParams])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleRetry = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <Shield className="h-10 w-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Çok Fazla İstek
          </h1>

          {/* Description */}
          <div className="space-y-4 text-gray-600 mb-8">
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Güvenlik Koruması Etkin</span>
            </div>
            
            <p className="text-sm leading-relaxed">
              Güvenlik nedeniyle istek limitiniz aşıldı. Bu koruma, sistemi otomatik saldırılardan 
              ve kötüye kullanımdan korumak için vardır.
            </p>

            {timeLeft > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-700 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Bekleme Süresi</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 text-center">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-blue-600 text-center mt-1">
                  Bu süre sonunda tekrar deneyebilirsiniz
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {timeLeft === 0 ? (
              <button
                onClick={handleRetry}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Tekrar Dene</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Clock className="h-4 w-4" />
                <span>Lütfen Bekleyin</span>
              </button>
            )}

            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Neden Bu Koruma Var?
            </h3>
            <div className="text-xs text-gray-600 space-y-2 text-left">
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Sistemi otomatik saldırılardan korumak</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Tüm kullanıcılar için adil kullanım sağlamak</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Sunucu performansını optimum seviyede tutmak</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-6 text-xs text-gray-500">
            Sorun devam ederse{' '}
            <Link href="/iletisim" className="text-primary-600 hover:text-primary-700 font-medium">
              iletişime geçin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
