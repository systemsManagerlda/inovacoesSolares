/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mapeamento de palavras-chave para IDs das categorias
const keywordToCategoryId: Record<string, number> = {
  'bomba': 19,
  'bateria': 17,
  'painel': 16,
  'placa': 16,
  'inversor': 20,
  'cabo': 18,
  'box': 22,
  'kit': 22,
  'proteção': 21,
  'protecao': 21,
  'dps': 21,
  'disjuntor': 21,
}

export async function POST() {
  try {
    // 1. Buscar todas as categorias para ter os nomes
    const categoriesUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?per_page=100&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${Date.now()}`
    
    const categoriesResponse = await fetch(categoriesUrl)
    const categories = await categoriesResponse.json()
    
    const categoryMap: Record<number, string> = {}
    const categoryNameToId: Record<string, number> = {}
    
    categories.forEach((cat: any) => {
      categoryMap[cat.id] = cat.name
      categoryNameToId[cat.name] = cat.id
    })
    
    console.log('📂 Categorias disponíveis:', Object.keys(categoryNameToId))
    
    // 2. Buscar todos os produtos
    const productsUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?per_page=100&status=publish&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${Date.now()}`
    
    console.log('🔍 Buscando todos os produtos...')
    const productsResponse = await fetch(productsUrl)
    const allProducts = await productsResponse.json()
    
    console.log(`✅ Total de produtos: ${allProducts.length}`)
    
    const results = {
      total: allProducts.length,
      updated: 0,
      skipped: 0,
      failed: 0,
      details: [] as any[]
    }
    
    // 3. Processar cada produto
    for (const product of allProducts) {
      // Se já tem categoria
      if (product.categories && product.categories.length > 0) {
        results.skipped++
        results.details.push({
          id: product.id,
          name: product.name,
          status: 'skipped',
          categories: product.categories.map((c: any) => c.name)
        })
        continue
      }
      
      // Tentar identificar categoria pelo nome
      let targetCategoryId = null
      let targetCategoryName = null
      const productName = product.name.toLowerCase()
      
      for (const [keyword, categoryId] of Object.entries(keywordToCategoryId)) {
        if (productName.includes(keyword)) {
          targetCategoryId = categoryId
          targetCategoryName = categoryMap[categoryId]
          break
        }
      }
      
      if (targetCategoryId && targetCategoryName) {
        console.log(`📦 Atualizando: "${product.name}" -> ${targetCategoryName}`)
        
        try {
          // Atualizar o produto via API
          const updateUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products/${product.id}?consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
          
          const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              categories: [{ id: targetCategoryId }]
            })
          })
          
          if (updateResponse.ok) {
            results.updated++
            results.details.push({
              id: product.id,
              name: product.name,
              status: 'updated',
              category: targetCategoryName
            })
          } else {
            throw new Error(`HTTP ${updateResponse.status}`)
          }
        } catch (err) {
          console.error(`❌ Erro ao atualizar ${product.name}:`, err)
          results.failed++
          results.details.push({
            id: product.id,
            name: product.name,
            status: 'error',
            error: String(err)
          })
        }
      } else {
        console.log(`⚠️ Categoria não identificada: "${product.name}"`)
        results.failed++
        results.details.push({
          id: product.id,
          name: product.name,
          status: 'failed',
          reason: 'Categoria não identificada pelo nome'
        })
      }
    }
    
    return NextResponse.json({
      message: 'Categorização concluída',
      ...results,
      categoriesAvailable: Object.keys(categoryNameToId)
    })
  } catch (error: any) {
    console.error('❌ Erro:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}