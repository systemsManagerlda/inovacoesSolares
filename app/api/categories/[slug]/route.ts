import { NextResponse } from 'next/server'
import { api } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const response = await api.get('products/categories', {
      params: {
        slug,
        per_page: 1
      }
    })
    
    const category = response.data[0] || null
    
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(category)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao buscar categoria:', error)
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    )
  }
}