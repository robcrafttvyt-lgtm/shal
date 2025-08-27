'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function GirisPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Demo giriş için - gerçek uygulamada Supabase auth kullanılacak
      if (formData.email === 'admin@saldunyasi.com' && formData.password === 'admin123') {
        toast.success('Admin olarak giriş yapıldı!')
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: 'Admin',
          type: 'admin'
        }))
        router.push('/admin')
      } else if (formData.email && formData.password) {
        toast.success('Giriş başarılı!')
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: 'Müşteri',
          type: 'customer'
        }))
        router.push('/')
      } else {
        toast.error('E-posta ve şifre gerekli!')
      }
    } catch (error) {
      console.error('Giriş hatası:', error)
      toast.error('Giriş yapılırken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">Ş</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Şal Dünyası</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Giriş Yap
          </h2>
          <p className="text-gray-600">
            Hesabınıza giriş yapın veya{' '}
            <Link href="/kayit" className="text-primary-600 hover:text-primary-700 font-medium">
              yeni hesap oluşturun
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ornek@email.com"
                />
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Şifremi unuttum
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Hesapları:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Admin:</strong> admin@saldunyasi.com / admin123</p>
              <p><strong>Müşteri:</strong> herhangi bir e-posta / herhangi bir şifre</p>
            </div>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Veya</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <span>Google</span>
            </button>
            <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-primary-600 hover:text-primary-700 font-medium">
              Kayıt olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
