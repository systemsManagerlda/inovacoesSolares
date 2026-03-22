import { api } from '@/lib/woocommerce'
import ProductGrid from '@/components/products/ProductGrid'
import { WooProduct } from '@/types'

async function getProducts(): Promise<WooProduct[]> {
  try {
    console.log('🔍 Buscando produtos...')
    
    // Primeiro tenta buscar produtos em destaque
    const featuredResponse = await api.get('products', { 
      featured: true,
      per_page: 8,
      status: 'publish'
    })
    
    // Se encontrar produtos em destaque, retorna eles
    if (featuredResponse.data.length > 0) {
      console.log('✅ Produtos em destaque encontrados:', featuredResponse.data.length)
      return featuredResponse.data
    }
    
    // Se não, busca produtos normais (mais recentes)
    console.log('⚠️ Nenhum produto em destaque. Buscando produtos recentes...')
    const recentResponse = await api.get('products', { 
      per_page: 8,
      status: 'publish',
      orderby: 'date',
      order: 'desc'
    })
    
    console.log('✅ Produtos recentes encontrados:', recentResponse.data.length)
    return recentResponse.data
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('❌ Erro ao buscar produtos:', {
      message: error.message,
      response: error.response?.data
    })
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