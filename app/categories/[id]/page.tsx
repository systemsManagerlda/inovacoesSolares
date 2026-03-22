import { notFound } from 'next/navigation'
import { api } from '@/lib/woocommerce'
import ProductGrid from '@/components/products/ProductGrid'
import { WooCategory, WooProduct } from '@/types'

async function getCategory(id: string): Promise<WooCategory | null> {
  try {
    const response = await api.get(`products/categories/${id}`)
    return response.data
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return null
  }
}

async function getCategoryProducts(id: string): Promise<WooProduct[]> {
  try {
    const response = await api.get('products', {
      category: id,
      per_page: 20
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar produtos da categoria:', error)
    return []
  }
}

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, products] = await Promise.all([
    getCategory(params.id),
    getCategoryProducts(params.id)
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">
        {category.name}
      </h1>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}
      
      <p className="text-gray-500 mb-6">
        {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>
      
      <ProductGrid products={products} />
    </div>
  )
}