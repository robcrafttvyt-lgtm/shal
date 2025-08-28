'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Stripe public key - production'da environment variable olacak
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key')

interface StripePaymentProps {
  amount: number
  currency?: string
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  isLoading?: boolean
}

interface CheckoutFormProps extends StripePaymentProps {}

function CheckoutForm({ amount, currency = 'try', onSuccess, onError, isLoading }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    setProcessing(true)
    setCardError(null)

    try {
      // Demo için - gerçek uygulamada backend'den payment intent alınacak
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        'demo_payment_intent_client_secret', // Bu backend'den gelecek
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Demo Customer',
            },
          }
        }
      )

      if (paymentError) {
        setCardError(paymentError.message || 'Ödeme işlemi başarısız oldu.')
        onError(paymentError.message || 'Ödeme hatası')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Ödeme başarıyla tamamlandı!')
        onSuccess(paymentIntent)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setCardError('Ödeme işlemi sırasında bir hata oluştu.')
      onError(error.message || 'Ödeme hatası')
    } finally {
      setProcessing(false)
    }
  }

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete)
    setCardError(event.error ? event.error.message : null)
  }

  return (
    <div className="space-y-6">
      {/* Güvenlik Bilgisi */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-green-700">
          <Lock className="h-5 w-5" />
          <span className="text-sm font-medium">
            Ödemeniz SSL sertifikası ile güvenli bir şekilde işlenir
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Kart Bilgileri */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Kart Bilgileri</span>
            </div>
          </label>
          
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
              onChange={handleCardChange}
            />
          </div>
          
          {cardError && (
            <p className="mt-2 text-sm text-red-600">{cardError}</p>
          )}
        </div>

        {/* Ödeme Özeti */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Ödenecek Tutar</span>
            <span className="text-lg font-bold text-gray-900">
              ₺{amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Ödeme Butonu */}
        <button
          type="submit"
          disabled={!stripe || processing || !cardComplete || isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-lg"
        >
          {processing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <Lock className="h-5 w-5" />
              <span>₺{amount.toFixed(2)} Öde</span>
            </>
          )}
        </button>

        {/* Güvenlik Logları */}
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>SSL Güvenlik</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>PCI DSS</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>256-bit Şifreleme</span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
