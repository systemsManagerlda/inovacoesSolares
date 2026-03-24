/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { api } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Buscar todas as categorias com produtos
    const categoriesResponse = await api.get('products/categories', {
      params: {
        per_page: 100,
        hide_empty: false
      }
    })
    
    // Buscar alguns produtos para verificar categorias
    const productsResponse = await api.get('products', {
      params: {
        per_page: 10,
        status: 'publish'
      }
    })
    
    const productsWithCategories = productsResponse.data.map((product: any) => ({
      id: product.id,
      name: product.name,
      categories: product.categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }))
    }))
    
    return NextResponse.json({
      categories: categoriesResponse.data,
      sampleProducts: productsWithCategories
    })
  } catch (error: any) {
    console.error('Erro no debug:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}