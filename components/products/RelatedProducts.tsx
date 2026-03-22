'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/woocommerce'
import { WooProduct, WooCategory } from '@/types'
import ProductCard from '@/components/products/ProductCard'
import Button from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface RelatedProductsProps {
  productId: number
  categories: WooCategory[]
  limit?: number
}

export default function RelatedProducts({ 
  productId, 
  categories, 
  limit = 4 
}: RelatedProductsProps) {
  const [products, setProducts] = useState<WooProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get category IDs from current product
        const categoryIds = categories.map(cat => cat.id).join(',')

        const response = await api.get('products', {
          per_page: limit,
          category: categoryIds,
          exclude: [productId],
          status: 'publish',
          orderby: 'popularity',
          _fields: [
            'id',
            'name',
            'slug',
            'price',
            'regular_price',
            'sale_price',
            'on_sale',
            'images',
            'average_rating',
            'review_count',
            'stock_status',
            'categories',
            'featured'
          ].join(',')
        })

        setProducts(response.data)
      } catch (err) {
        console.error('Erro ao buscar produtos relacionados:', err)
        setError('Não foi possível carregar produtos relacionados')
      } finally {
        setIsLoading(false)
      }
    }

    if (categories.length > 0) {
      fetchRelatedProducts()
    }
  }, [productId, categories, limit])

  // Carousel scroll handlers
  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('related-products-container')
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      
      // Update scroll position after animation
      setTimeout(() => {
        setScrollPosition(container.scrollLeft)
        setMaxScroll(container.scrollWidth - container.clientWidth)
      }, 300)
    }
  }

  // Update scroll position on manual scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    setScrollPosition(target.scrollLeft)
    setMaxScroll(target.scrollWidth - target.clientWidth)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Produtos Relacionados</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl" />
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum produto relacionado encontrado
        </h3>
        <p className="text-gray-500 mb-6">
          Confira outros produtos da nossa loja
        </p>
        <Link href="/products">
          <Button>
            Ver todos os produtos
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Produtos Relacionados
          </h2>
          <span className="bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-full">
            {products.length} {products.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Navigation Arrows - Desktop */}
        {products.length > limit && (
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={scrollPosition <= 0}
              className={`p-2 rounded-full border transition-all ${
                scrollPosition <= 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
              }`}
              aria-label="Ver produtos anteriores"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={scrollPosition >= maxScroll}
              className={`p-2 rounded-full border transition-all ${
                scrollPosition >= maxScroll
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md'
              }`}
              aria-label="Ver próximos produtos"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Products Grid/Carousel */}
      <div 
        id="related-products-container"
        className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="flex-none w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start"
          >
            <ProductCard 
              product={product} 
              priority={index < 2} // Prioritize first two images
            />
          </div>
        ))}
      </div>

      {/* Scroll Indicators - Mobile */}
      {products.length > limit && (
        <div className="flex justify-center gap-1 lg:hidden">
          {Array.from({ length: Math.ceil(products.length / limit) }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const container = document.getElementById('related-products-container')
                if (container) {
                  container.scrollTo({
                    left: i * container.clientWidth,
                    behavior: 'smooth'
                  })
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                Math.floor(scrollPosition / (maxScroll / (Math.ceil(products.length / limit) - 1))) === i
                  ? 'w-6 bg-blue-600'
                  : 'w-1.5 bg-gray-300'
              }`}
              aria-label={`Ir para página ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div className="text-center lg:text-right">
        <Link 
          href={`/categories/${categories[0]?.slug}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
        >
          Ver todos da categoria
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}