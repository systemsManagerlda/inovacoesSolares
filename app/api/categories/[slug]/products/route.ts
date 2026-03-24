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
    
    // Primeiro buscar a categoria para obter o ID
    const categoryResponse = await api.get('products/categories', {
      params: {
        slug,
        per_page: 1
      }
    })
    
    const category = categoryResponse.data[0]
    
    if (!category) {
      console.log('❌ Categoria não encontrada para slug:', slug)
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }
    
    console.log('✅ Categoria encontrada:', category.id, category.name)
    
    // Buscar produtos da categoria específica
    const productsResponse = await api.get('products', {
      params: {
        category: category.id, // Este é o parâmetro correto
        per_page: 50,
        orderby: 'date',
        order: 'desc',
        status: 'publish' // Apenas produtos publicados
      }
    })
    
    console.log(`📦 Produtos encontrados na categoria ${category.name}:`, productsResponse.data.length)
    
    return NextResponse.json(productsResponse.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao buscar produtos da categoria:', error)
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    )
  }
}