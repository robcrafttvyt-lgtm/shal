'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

// Google Analytics Tracking ID - in production use environment variable
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-XXXXXXXXXX'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Google Analytics Events
export const GA_EVENTS = {
  // E-commerce events
  PURCHASE: 'purchase',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  
  // User engagement
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  SEARCH: 'search',
  SHARE: 'share',
  
  // Custom events
  NEWSLETTER_SIGNUP: 'newsletter_signup',
  CONTACT_FORM: 'contact_form_submit',
  FILTER_PRODUCTS: 'filter_products',
  SORT_PRODUCTS: 'sort_products',
  VIEW_PROMOTION: 'view_promotion',
  SELECT_PROMOTION: 'select_promotion'
}

// Page view tracking
export const pageview = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
      page_title: title,
    })
  }
}

// Event tracking
export const event = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters)
  }
}

// E-commerce event helpers
export const trackPurchase = (transactionId: string, items: any[], value: number, currency = 'TRY') => {
  event(GA_EVENTS.PURCHASE, {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      category: item.category || 'Şal',
      quantity: item.quantity,
      price: item.price
    }))
  })
}

export const trackAddToCart = (item: any) => {
  event(GA_EVENTS.ADD_TO_CART, {
    currency: 'TRY',
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.title,
      category: item.category || 'Şal',
      quantity: item.quantity,
      price: item.price
    }]
  })
}

export const trackRemoveFromCart = (item: any) => {
  event(GA_EVENTS.REMOVE_FROM_CART, {
    currency: 'TRY',
    value: item.price * item.quantity,
    items: [{
      item_id: item.id,
      item_name: item.title,
      category: item.category || 'Şal',
      quantity: item.quantity,
      price: item.price
    }]
  })
}

export const trackViewItem = (item: any) => {
  event(GA_EVENTS.VIEW_ITEM, {
    currency: 'TRY',
    value: item.price,
    items: [{
      item_id: item.id,
      item_name: item.title,
      category: item.category || 'Şal',
      price: item.price
    }]
  })
}

export const trackBeginCheckout = (items: any[], value: number) => {
  event(GA_EVENTS.BEGIN_CHECKOUT, {
    currency: 'TRY',
    value: value,
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.title,
      category: item.category || 'Şal',
      quantity: item.quantity,
      price: item.price
    }))
  })
}

export const trackSearch = (searchTerm: string, results?: number) => {
  event(GA_EVENTS.SEARCH, {
    search_term: searchTerm,
    ...(results !== undefined && { search_results: results })
  })
}

export const trackLogin = (method?: string) => {
  event(GA_EVENTS.LOGIN, {
    method: method || 'email'
  })
}

export const trackSignUp = (method?: string) => {
  event(GA_EVENTS.SIGN_UP, {
    method: method || 'email'
  })
}

export const trackNewsletterSignup = () => {
  event(GA_EVENTS.NEWSLETTER_SIGNUP, {
    method: 'email'
  })
}

export const trackContactForm = () => {
  event(GA_EVENTS.CONTACT_FORM, {
    form_name: 'contact'
  })
}

// Custom hook for tracking page views
export function usePageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      pageview(url)
    }
  }, [pathname, searchParams])
}

// Main Google Analytics component
export default function GoogleAnalytics() {
  usePageView()

  if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    return null // Don't load in development
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              // Enhanced e-commerce
              send_page_view: true,
              // Privacy settings
              anonymize_ip: true,
              // Custom dimensions
              custom_map: {
                'dimension1': 'user_type',
                'dimension2': 'device_type'
              }
            });

            // Enhanced E-commerce setup
            gtag('config', '${GA_TRACKING_ID}', {
              linker: {
                domains: ['saldunyasi.com']
              },
              // Cookie settings
              cookie_expires: 63072000, // 2 years
              cookie_update: true,
              cookie_domain: 'auto'
            });
          `,
        }}
      />
    </>
  )
}

// Performance tracking
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Core Web Vitals tracking
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          window.gtag('event', 'LCP', {
            event_category: 'Web Vitals',
            value: Math.round(entry.startTime),
            non_interaction: true,
          })
        }
        if (entry.entryType === 'first-input') {
          window.gtag('event', 'FID', {
            event_category: 'Web Vitals',
            value: Math.round(entry.processingStart - entry.startTime),
            non_interaction: true,
          })
        }
        if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            window.gtag('event', 'CLS', {
              event_category: 'Web Vitals',
              value: Math.round((entry as any).value * 1000),
              non_interaction: true,
            })
          }
        }
      })
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  }
}

// User engagement tracking
export const trackUserEngagement = () => {
  if (typeof window !== 'undefined') {
    // Scroll depth tracking
    let maxScroll = 0
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        event('scroll', {
          event_category: 'User Engagement',
          event_label: `${scrollPercent}%`,
          value: scrollPercent,
          non_interaction: true
        })
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })

    // Time on page tracking
    const startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      event('time_on_page', {
        event_category: 'User Engagement',
        value: timeOnPage,
        non_interaction: true
      })
    }

    window.addEventListener('beforeunload', trackTimeOnPage)

    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', trackScroll)
      window.removeEventListener('beforeunload', trackTimeOnPage)
    }
  }
}
