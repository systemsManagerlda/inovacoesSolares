/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductGrid from '@/components/products/ProductGrid'
import { WooProduct } from '@/types'

async function getProducts(): Promise<WooProduct[]> {
  try {
    console.log('🔍 Buscando produtos em destaque...')
    
    const timestamp = Date.now()
    
    // Buscar produtos em destaque via fetch direto
    const featuredUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?featured=true&per_page=8&status=publish&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`
    
    const featuredResponse = await fetch(featuredUrl, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
    
    if (featuredResponse.ok) {
      const featuredProducts = await featuredResponse.json()
      
      if (featuredProducts.length > 0) {
        console.log('✅ Produtos em destaque encontrados:', featuredProducts.length)
        console.log('Produtos:', featuredProducts.map((p: any) => p.name))
        return featuredProducts
      }
    }
    
    // Se não encontrar produtos em destaque, buscar categorias variadas
    console.log('⚠️ Nenhum produto em destaque. Buscando produtos de categorias diferentes...')
    
    // Buscar categorias
    const categoriesUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?per_page=50&hide_empty=true&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`
    
    const categoriesRes = await fetch(categoriesUrl, { cache: 'no-store' })
    const categories = await categoriesRes.json()
    
    console.log(`📂 Categorias com produtos: ${categories.length}`)
    
    if (categories.length === 0) {
      return []
    }
    
    // Buscar 1 produto de cada categoria (máximo 8)
    const products: WooProduct[] = []
    const categoriesToFetch = categories.slice(0, 8)
    
    for (const category of categoriesToFetch) {
      const productUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?category=${category.id}&per_page=1&status=publish&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`
      
      const productRes = await fetch(productUrl, { cache: 'no-store' })
      const productData = await productRes.json()
      
      if (productData.length > 0) {
        products.push(productData[0])
        console.log(`✅ Produto: ${productData[0].name} (${category.name})`)
      }
    }
    
    if (products.length > 0) {
      return products
    }
    
    // Fallback: produtos recentes
    console.log('⚠️ Buscando produtos recentes como fallback...')
    const recentUrl = `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?per_page=8&status=publish&orderby=date&order=desc&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`
    
    const recentRes = await fetch(recentUrl, { cache: 'no-store' })
    const recentProducts = await recentRes.json()
    
    return recentProducts
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar produtos:', error)
    return []
  }
}

export default async function FeaturedProducts() {
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50 rounded-lg">
        <p className="text-blue-800 font-medium">
          ⚠️ Nenhum produto encontrado
        </p>
      </div>
    )
  }

  return <ProductGrid products={products} />
}