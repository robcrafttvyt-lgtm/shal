'use client'

import { useState } from 'react'
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js"
import { CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface PayPalPaymentProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError: (error: string) => void
  isLoading?: boolean
}

interface PayPalButtonWrapperProps extends PayPalPaymentProps {}

function PayPalButtonWrapper({ amount, currency = 'USD', onSuccess, onError }: PayPalButtonWrapperProps) {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer()
  const [processing, setProcessing] = useState(false)

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: 'Şal Dünyası - Alışveriş',
        },
      ],
    })
  }

  const onApprove = async (data: any, actions: any) => {
    setProcessing(true)
    try {
      const details = await actions.order.capture()
      console.log('PayPal payment successful:', details)
      toast.success('PayPal ödemesi başarıyla tamamlandı!')
      onSuccess(details)
    } catch (error: any) {
      console.error('PayPal payment error:', error)
      toast.error('PayPal ödemesi başarısız oldu!')
      onError(error.message || 'PayPal ödeme hatası')
    } finally {
      setProcessing(false)
    }
  }

  const onErrorHandler = (error: any) => {
    console.error('PayPal error:', error)
    toast.error('PayPal ile bir sorun oluştu!')
    onError(error.message || 'PayPal hatası')
  }

  const onCancel = (data: any) => {
    console.log('PayPal payment cancelled:', data)
    toast.info('PayPal ödemesi iptal edildi.')
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">PayPal yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* PayPal Bilgi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-700">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">
            PayPal ile güvenli ve hızlı ödeme
          </span>
        </div>
      </div>

      {/* Ödeme Özeti */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Ödenecek Tutar</span>
          <span className="text-lg font-bold text-gray-900">
            ${amount.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          PayPal hesabınızdan veya kayıtlı kartınızdan ödeme yapabilirsiniz
        </p>
      </div>

      {/* PayPal Buttons */}
      <div className="relative">
        {processing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg z-10">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-600 font-medium">Ödeme işleniyor...</span>
            </div>
          </div>
        )}
        
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 45
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onErrorHandler}
          onCancel={onCancel}
          disabled={processing}
        />
      </div>

      {/* Güvenlik Bilgileri */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">PayPal Güvenlik Avantajları:</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Kart bilgileriniz PayPal ile korunur</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Alıcı koruması garantisi</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Hızlı ve güvenli ödeme</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>PayPal hesabı veya kredi kartı ile ödeme</span>
          </div>
        </div>
      </div>

      {/* Demo Uyarısı */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-amber-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">
            <strong>Demo:</strong> Bu demo ortamında gerçek ödeme yapılmayacaktır.
          </span>
        </div>
      </div>
    </div>
  )
}

export default function PayPalPayment(props: PayPalPaymentProps) {
  // PayPal configuration
  const paypalOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "demo-client-id",
    currency: props.currency || "USD",
    intent: "capture",
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtonWrapper {...props} />
    </PayPalScriptProvider>
  )
}
