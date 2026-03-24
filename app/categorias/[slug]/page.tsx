/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Sun, 
  Zap, 
  Sparkles, 
  ChevronRight, 
  Package, 
  ArrowLeft,
  Grid3x3,
  List,
  ArrowUpDown,
  Loader2
} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { WooProduct } from '@/types'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image?: { src: string }
  count: number
}

// Função para buscar categoria por slug
async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const timestamp = Date.now()
    const response = await fetch(`/api/categories/${slug}?_=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
    
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return null
  }
}

// Função para buscar produtos da categoria
async function fetchProductsByCategorySlug(slug: string): Promise<WooProduct[]> {
  try {
    const timestamp = Date.now()
    const response = await fetch(`/api/categories/${slug}/products?_=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
    
    if (!response.ok) {
      console.error('Erro ao buscar produtos:', response.status)
      return []
    }
    
    const products = await response.json()
    console.log(`📦 Produtos recebidos: ${products.length}`)
    return products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

// Função para formatar preço
function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value)
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<WooProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [filteredProducts, setFilteredProducts] = useState<WooProduct[]>([])

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      if (!slug) return
      
      setLoading(true)
      setError(null)
      
      try {
        console.log(`🔍 Carregando categoria: ${slug}`)
        
        // Buscar categoria
        const categoryData = await fetchCategoryBySlug(slug)
        
        if (!categoryData) {
          console.log('❌ Categoria não encontrada')
          notFound()
          return
        }
        
        setCategory(categoryData)
        console.log(`✅ Categoria encontrada: ${categoryData.name} (ID: ${categoryData.id})`)
        
        // Buscar produtos da categoria
        const productsData = await fetchProductsByCategorySlug(slug)
        
        console.log(`📦 Produtos encontrados: ${productsData.length}`)
        
        setProducts(productsData)
        setFilteredProducts(productsData)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [slug])

  // Ordenar produtos quando mudar ordenação
  useEffect(() => {
    let sorted = [...products]
    
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price_desc':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'date_desc':
        sorted.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        break
      case 'date_asc':
        sorted.sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime())
        break
      case 'rating_desc':
        sorted.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating))
        break
      default:
        sorted = [...products]
    }
    
    setFilteredProducts(sorted)
  }, [sortBy, products])

  // Mapear ícone da categoria
  const getCategoryIcon = () => {
    if (!category) return Sun
    const name = category.name.toLowerCase()
    if (name.includes('painel') || name.includes('placa')) return Sun
    if (name.includes('inversor')) return Zap
    if (name.includes('bateria')) return Sparkles
    if (name.includes('controlador')) return Zap
    if (name.includes('ilumina') || name.includes('lamp')) return Sun
    if (name.includes('acessorio') || name.includes('acessórios')) return Sparkles
    if (name.includes('kit') || name.includes('box')) return Zap
    if (name.includes('bomba')) return Zap
    return Sun
  }

  const CategoryIcon = getCategoryIcon()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <div className="relative text-center">
          <Loader2 size={48} className="text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando categoria...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-red-500/50 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Erro ao carregar</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  // Category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Categoria não encontrada</h2>
          <p className="text-gray-400 mb-4">A categoria que você procura não existe.</p>
          <Link href="/produtos" className="px-6 py-2 bg-blue-500 text-black rounded-lg inline-block hover:bg-blue-400 transition-colors">
            Ver todos os produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 mt-20">
      {/* Header da Categoria */}
      <div className="relative bg-linear-to-b from-blue-500/10 to-transparent border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm flex-wrap">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                  <Sun size={14} /> Home
                </Link>
              </li>
              <ChevronRight size={16} className="text-blue-600/50" />
              <li>
                <Link href="/produtos" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Produtos
                </Link>
              </li>
              <ChevronRight size={16} className="text-blue-600/50" />
              <li className="text-blue-400/90 font-medium truncate max-w-[200px]">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30">
              <CategoryIcon size={48} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-400 mt-2 max-w-2xl">
                  {category.description.replace(/<[^>]*>/g, '')}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'} encontrado(s)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barra de ferramentas */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/produtos"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Todos os produtos</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="relevance">Relevância</option>
                <option value="date_desc">Mais recentes</option>
                <option value="date_asc">Mais antigos</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="rating_desc">Melhor avaliados</option>
              </select>
            </div>

            {/* Visualização */}
            <div className="flex bg-gray-800/50 border border-blue-500/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                aria-label="Visualização em grade"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                aria-label="Visualização em lista"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-400 mb-4">
              Não há produtos disponíveis nesta categoria no momento.
            </p>
            <Link
              href="/produtos"
              className="px-6 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-black font-medium rounded-lg inline-block hover:from-blue-400 hover:to-blue-500 transition-all"
            >
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductCard product={product} priority={index < 4} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}