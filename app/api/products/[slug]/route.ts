// app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Aguardar a resolução dos params
    const { slug } = await params
    
    const timestamp = Date.now()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`,
      { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      }
    )
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: response.status }
      )
    }
    
    const products = await response.json()
    const product = products[0] || null
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}