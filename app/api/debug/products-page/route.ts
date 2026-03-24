/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { api } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('per_page') || '10')
  
  try {
    const response = await api.get('products', {
      params: {
        per_page: perPage,
        page: page,
        status: 'publish'
      }
    })
    
    // Log para debug
    console.log(`Página ${page}:`, {
      totalHeader: response.headers['x-wp-total'],
      totalPagesHeader: response.headers['x-wp-total-pages'],
      productsCount: response.data.length
    })
    
    const products = response.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      categories: product.categories.map((cat: any) => cat.name),
      hasCategories: product.categories.length > 0,
      price: product.price,
      stock_status: product.stock_status
    }))
    
    const total = parseInt(response.headers['x-wp-total'] || '0')
    const totalPages = parseInt(response.headers['x-wp-total-pages'] || '0')
    
    return NextResponse.json({
      page,
      perPage,
      totalProducts: total,
      totalPages,
      products,
      debug: {
        headersTotal: response.headers['x-wp-total'],
        headersTotalPages: response.headers['x-wp-total-pages']
      }
    })
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}