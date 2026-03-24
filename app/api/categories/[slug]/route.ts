/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { api } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    console.log('🔍 Buscando categoria por slug:', slug)
    
    // Buscar todas as categorias e filtrar por slug exato
    const response = await api.get('products/categories', {
      params: {
        per_page: 100,
        hide_empty: false
      }
    })
    
    // Filtrar no JavaScript para garantir slug exato
    const category = response.data.find((cat: any) => cat.slug === slug)
    
    if (!category) {
      console.log('❌ Categoria não encontrada para slug:', slug)
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }
    
    console.log('✅ Categoria encontrada:', category.id, category.name, category.slug)
    
    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Erro ao buscar categoria:', error)
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    )
  }
}