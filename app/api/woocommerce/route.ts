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
    const response = await api.get(endpoint)
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