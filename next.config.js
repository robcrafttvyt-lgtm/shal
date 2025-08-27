/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'djxbpizuelexmvgdgyfv.supabase.co'],
  },
}

module.exports = nextConfig
