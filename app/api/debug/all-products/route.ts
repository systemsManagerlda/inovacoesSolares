/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const timestamp = Date.now()
    // Buscar todos os produtos de uma vez (per_page=100)
    const url = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?per_page=100&status=publish&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`
    
    console.log('🔍 Buscando todos os produtos...')
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
    
    const products = await response.json()
    const total = parseInt(response.headers.get('x-wp-total') || '0')
    const totalPages = parseInt(response.headers.get('x-wp-total-pages') || '0')
    
    console.log(`✅ Total: ${total} produtos, Retornados: ${products.length}, Páginas: ${totalPages}`)
    
    // Agrupar por categoria
    const byCategory: Record<string, string[]> = {}
    
    products.forEach((product: any) => {
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach((cat: any) => {
          if (!byCategory[cat.name]) byCategory[cat.name] = []
          byCategory[cat.name].push(product.name)
        })
      } else {
        if (!byCategory['Sem categoria']) byCategory['Sem categoria'] = []
        byCategory['Sem categoria'].push(product.name)
      }
    })
    
    return NextResponse.json({
      totalProducts: total,
      productsReturned: products.length,
      productsByCategory: Object.fromEntries(
        Object.entries(byCategory).map(([cat, prods]) => [cat, prods.length])
      ),
      allProducts: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        categories: p.categories.map((c: any) => c.name)
      }))
    })
  } catch (error: any) {
    console.error('❌ Erro:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}