// app/api/products/related/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const exclude = searchParams.get('exclude')
  
  try {
    const timestamp = Date.now()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?category=${category}&exclude=${exclude}&per_page=4&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`,
      { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      }
    )
    
    if (!response.ok) {
      return NextResponse.json([], { status: response.status })
    }
    
    const products = await response.json()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json([], { status: 500 })
  }
}