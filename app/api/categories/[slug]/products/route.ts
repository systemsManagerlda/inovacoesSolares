/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    console.log('🔍 Buscando categoria por slug:', slug)
    
    // 1. Buscar TODAS as categorias
    const categoriesUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${Date.now()}`
    
    const categoriesRes = await fetch(categoriesUrl, { cache: 'no-store' })
    const allCategories = await categoriesRes.json()
    
    // 2. Encontrar a categoria pelo slug EXATO
    const category = allCategories.find((cat: any) => cat.slug === slug)
    
    if (!category) {
      console.log('❌ Categoria não encontrada para slug:', slug)
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }
    
    console.log('✅ Categoria encontrada:', category.id, category.name)
    
    // 3. Buscar produtos da categoria usando o ID correto
    const productsUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?category=${category.id}&per_page=100&status=publish&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${Date.now()}`
    
    const productsRes = await fetch(productsUrl, { cache: 'no-store' })
    const products = await productsRes.json()
    
    console.log(`📦 Produtos encontrados na categoria ${category.name}:`, products.length)
    
    if (products.length > 0) {
      console.log('Produtos:', products.map((p: any) => p.name))
    }
    
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Erro:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}