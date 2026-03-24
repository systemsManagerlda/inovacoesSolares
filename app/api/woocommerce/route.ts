import { NextResponse } from 'next/server'
import { api } from '@/lib/woocommerce'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  
  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint não especificado' },
      { status: 400 }
    )
  }

  try {
    // Coletar todos os parâmetros de consulta
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {}
    
    // Adicionar parâmetros comuns
    if (searchParams.has('slug')) params.slug = searchParams.get('slug')
    if (searchParams.has('category')) params.category = searchParams.get('category')
    if (searchParams.has('exclude')) params.exclude = searchParams.get('exclude')
    if (searchParams.has('search')) params.search = searchParams.get('search')
    if (searchParams.has('per_page')) params.per_page = searchParams.get('per_page')
    if (searchParams.has('page')) params.page = searchParams.get('page')
    if (searchParams.has('orderby')) params.orderby = searchParams.get('orderby')
    if (searchParams.has('order')) params.order = searchParams.get('order')
    if (searchParams.has('on_sale')) params.on_sale = searchParams.get('on_sale') === 'true'
    if (searchParams.has('stock_status')) params.stock_status = searchParams.get('stock_status')
    if (searchParams.has('min_price')) params.min_price = searchParams.get('min_price')
    if (searchParams.has('max_price')) params.max_price = searchParams.get('max_price')
    if (searchParams.has('hide_empty')) params.hide_empty = searchParams.get('hide_empty') === 'true'
    
    // Para categorias específicas por slug
    if (endpoint === 'products/categories' && searchParams.has('slug')) {
      // O WooCommerce não suporta busca por slug diretamente no endpoint de categorias
      // Precisamos buscar todas e filtrar
      const allCategories = await api.get('products/categories', {
        params: {
          per_page: 100,
          hide_empty: searchParams.get('hide_empty') === 'true'
        }
      })
      
      const filteredCategories = allCategories.data.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cat: any) => cat.slug === searchParams.get('slug')
      )
      
      return NextResponse.json(filteredCategories)
    }
    
    // Fazer a requisição com os parâmetros
    const response = await api.get(endpoint, { params })
    
    return NextResponse.json(response.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro na API WooCommerce:', error)
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    )
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const body = await request.json()

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint não especificado' },
      { status: 400 }
    )
  }

  try {
    const response = await api.post(endpoint, body)
    return NextResponse.json(response.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro na API WooCommerce:', error)
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    )
  }
}