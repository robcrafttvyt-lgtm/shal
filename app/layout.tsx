import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/lib/cartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Şal Satışı - Premium Şallar',
  description: 'En kaliteli şalları uygun fiyatlarla satın alın. Geniş renk ve desen seçenekleri ile.',
  keywords: 'şal, eşarp, kadın, moda, aksesuar, premium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  )
}
