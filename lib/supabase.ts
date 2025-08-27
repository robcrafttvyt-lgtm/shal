import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdvxggcmaiuzvnrhuxjh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// For development, create a mock client if credentials are missing
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: async () => ({ data: { user: null } }),
        signOut: async () => ({ error: null })
      }
    } as any

// Auth helper
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database types
export interface User {
  id: string
  email: string
  phone: string
  full_name: string
  user_type: 'customer' | 'admin'
  email_verified: boolean
  phone_verified: boolean
  created_at: string
  payment_info?: any
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  sizes: string[]
  stock: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  products: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: any
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  product_title: string
  size: string
  quantity: number
  price: number
}

export interface CartItem {
  product_id: string
  product_title: string
  size: string
  quantity: number
  price: number
  image_url: string
}
