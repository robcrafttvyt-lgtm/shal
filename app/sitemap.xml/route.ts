import { NextResponse } from 'next/server'
import { generateSitemap } from '@/lib/sitemap'

export async function GET() {
  const sitemap = generateSitemap()

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400' // Cache for 24 hours
    }
  })
}
