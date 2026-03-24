/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo, Suspense, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { 
  ChevronRight, Sun, Zap, Sparkles, Search, SlidersHorizontal, X,
  ChevronDown, ChevronUp, Filter, Grid3x3, List, ArrowUpDown,
  Package, Star, Truck, Shield, Heart, Scale, Boxes, Factory,
  RefreshCw, WifiOff, Loader2
} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { WooProduct } from '@/types'

interface WooCategory {
  id: number
  name: string
  slug: string
  count: number
}

const lightParticles = [
  { top: 10, left: 15, delay: 0.5 },
  { top: 25, left: 80, delay: 1.2 },
  { top: 45, left: 30, delay: 0.8 },
  { top: 60, left: 70, delay: 1.5 },
  { top: 75, left: 20, delay: 0.3 },
]

const sortOptions = [
  { value: 'relevance', label: 'Relevância', icon: '🎯' },
  { value: 'date_desc', label: 'Mais recentes', icon: '🆕' },
  { value: 'date_asc', label: 'Mais antigos', icon: '📅' },
  { value: 'price_asc', label: 'Menor preço', icon: '💰' },
  { value: 'price_desc', label: 'Maior preço', icon: '💎' },
  { value: 'rating_desc', label: 'Melhor avaliados', icon: '⭐' },
]

const priceRanges = [
  { min: 0, max: 1000, label: 'Até 1.000 MZN' },
  { min: 1000, max: 2500, label: '1.000 - 2.500 MZN' },
  { min: 2500, max: 5000, label: '2.500 - 5.000 MZN' },
  { min: 5000, max: 10000, label: '5.000 - 10.000 MZN' },
  { min: 10000, max: 20000, label: '10.000 - 20.000 MZN' },
  { min: 20000, max: 50000, label: '20.000 - 50.000 MZN' },
  { min: 50000, max: 100000, label: '50.000 - 100.000 MZN' },
  { min: 100000, max: null, label: 'Acima de 100.000 MZN' },
]

const powerRatings = ['100W', '200W', '300W', '400W', '500W', '600W', '800W', '1000W', '2000W', '5000W+']
const efficiencies = ['15-18%', '18-20%', '20-22%', '22-25%', '25%+']
const warrantyPeriods = ['1 ano', '2 anos', '3 anos', '5 anos', '10 anos', '25 anos']
const certifications = ['CE', 'RoHS', 'TUV', 'IEC', 'ISO 9001', 'UL']
const applications = ['Residencial', 'Comercial', 'Industrial', 'Agrícola', 'Rural', 'Marítimo', 'Caravanas']

interface FilterState {
  category: string
  search: string
  minPrice: number | null
  maxPrice: number | null
  brands: string[]
  inStock: boolean
  onSale: boolean
  rating: number | null
  powerRating: string[]
  efficiency: string[]
  warranty: string[]
  certification: string[]
  application: string[]
}

interface CompareProduct {
  id: number
  name: string
  price: string
  image: string
}

function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value)
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [compareList, setCompareList] = useState<CompareProduct[]>([])
  const [showFilters, setShowFilters] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  
  const [products, setProducts] = useState<WooProduct[]>([])
  const [categories, setCategories] = useState<WooCategory[]>([])
  const [brands, setBrands] = useState<{ name: string; count: number }[]>([])
  const [filteredProducts, setFilteredProducts] = useState<WooProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMounted = useRef(true)
  
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('categoria') || 'all',
    search: searchParams.get('busca') || '',
    minPrice: null,
    maxPrice: null,
    brands: [],
    inStock: false,
    onSale: false,
    rating: null,
    powerRating: [],
    efficiency: [],
    warranty: [],
    certification: [],
    application: [],
  })

  const itemsPerPage = 12

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('painel') || name.includes('placa')) return Sun
    if (name.includes('inversor')) return Zap
    if (name.includes('bateria')) return Sparkles
    if (name.includes('controlador')) return Zap
    if (name.includes('ilumina') || name.includes('lamp')) return Sun
    if (name.includes('acessorio') || name.includes('acessórios')) return Sparkles
    if (name.includes('kit') || name.includes('box')) return Boxes
    return Package
  }

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/woocommerce?endpoint=products/categories&per_page=100&hide_empty=false&_=${Date.now()}`, {
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        if (isMounted.current) setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }, [])

  const extractBrandsFromProducts = useCallback((productsList: WooProduct[]) => {
    const brandMap = new Map<string, number>()
    productsList.forEach(product => {
      if (product.brand) {
        brandMap.set(product.brand, (brandMap.get(product.brand) || 0) + 1)
      }
    })
    if (isMounted.current) {
      setBrands(Array.from(brandMap.entries()).map(([name, count]) => ({ name, count })))
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      // CORREÇÃO IMPORTANTE: Converter category para número
      if (filters.category !== 'all') {
        const categoryId = parseInt(filters.category, 10)
        if (!isNaN(categoryId)) {
          params.append('category', categoryId.toString())
          console.log(`🔍 FILTRO ATIVO: Categoria ID = ${categoryId}`)
        } else {
          console.log(`⚠️ ERRO: Não foi possível converter "${filters.category}" para número`)
        }
      } else {
        console.log(`📋 FILTRO: Todas as categorias`)
      }
      
      if (filters.search) params.append('search', filters.search)
      if (filters.minPrice) params.append('min_price', filters.minPrice.toString())
      if (filters.maxPrice) params.append('max_price', filters.maxPrice.toString())
      if (filters.inStock) params.append('stock_status', 'instock')
      if (filters.onSale) params.append('on_sale', 'true')
      
      switch (sortBy) {
        case 'date_desc': params.append('orderby', 'date'); params.append('order', 'desc'); break
        case 'date_asc': params.append('orderby', 'date'); params.append('order', 'asc'); break
        case 'price_asc': params.append('orderby', 'price'); params.append('order', 'asc'); break
        case 'price_desc': params.append('orderby', 'price'); params.append('order', 'desc'); break
        case 'rating_desc': params.append('orderby', 'rating'); params.append('order', 'desc'); break
        default: params.append('orderby', 'date'); params.append('order', 'desc')
      }
      
      params.append('per_page', '100')
      params.append('_t', Date.now().toString())
      
      console.log(`📡 URL da requisição: /api/woocommerce?endpoint=products&${params.toString()}`)
      
      const response = await fetch(`/api/woocommerce?endpoint=products&${params}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      
      if (!response.ok) throw new Error(`Erro ${response.status}`)
      
      const data = await response.json()
      
      console.log(`📦 Produtos retornados da API: ${data.length}`)
      if (data.length > 0) {
        console.log('📦 Primeiros produtos:', data.slice(0, 3).map((p: any) => p.name))
        console.log('📦 Categorias dos primeiros produtos:', data.slice(0, 3).map((p: any) => p.categories.map((c: any) => c.name)))
      }
      
      let filtered = [...data]
      
      if (filters.brands.length > 0) {
        filtered = filtered.filter(p => filters.brands.includes(p.brand || ''))
      }
      
      if (filters.rating) {
        filtered = filtered.filter(p => parseFloat(p.average_rating) >= filters.rating!)
      }
      
      console.log(`📊 Após filtros locais: ${filtered.length} produtos`)
      
      if (isMounted.current) {
        setProducts(filtered)
        setTotalPages(Math.ceil(filtered.length / itemsPerPage))
        setFilteredProducts(filtered)
        setLastUpdate(new Date())
        extractBrandsFromProducts(filtered)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      if (isMounted.current) setError(error instanceof Error ? error.message : 'Erro ao carregar produtos')
    } finally {
      if (isMounted.current) setLoading(false)
    }
  }, [filters, sortBy, itemsPerPage, extractBrandsFromProducts])

  useEffect(() => {
    isMounted.current = true
    fetchCategories()
    fetchProducts()
    return () => { isMounted.current = false }
  }, [])

  // Monitorar mudanças na categoria
  useEffect(() => {
    console.log('🔄 CATEGORIA MUDOU PARA:', filters.category)
    if (!loading) {
      fetchProducts()
    }
  }, [filters.category, fetchProducts, loading])

  // Monitorar outros filtros
  useEffect(() => {
    if (!loading) {
      fetchProducts()
    }
  }, [filters.search, filters.minPrice, filters.maxPrice, filters.inStock, filters.onSale, filters.rating, filters.brands, fetchProducts, loading])

  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(fetchProducts, 10000)
      return () => {
        if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefresh, fetchProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    console.log(`🎯 Mudando filtro ${key}:`, value)
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: null,
      maxPrice: null,
      brands: [],
      inStock: false,
      onSale: false,
      rating: null,
      powerRating: [],
      efficiency: [],
      warranty: [],
      certification: [],
      application: [],
    })
  }

  const handleManualRefresh = () => {
    fetchProducts()
    fetchCategories()
  }

  const toggleAutoRefresh = () => setAutoRefresh(prev => !prev)

  const addToCompare = (product: WooProduct) => {
    if (compareList.length >= 4) {
      alert('Você pode comparar no máximo 4 produtos')
      return
    }
    if (!compareList.find(p => p.id === product.id)) {
      setCompareList([...compareList, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.src || '/placeholder.jpg',
      }])
      setIsCompareOpen(true)
    }
  }

  const removeFromCompare = (id: number) => {
    setCompareList(compareList.filter(p => p.id !== id))
  }

  const activeFiltersCount = () => {
    let count = 0
    if (filters.category !== 'all') count++
    if (filters.search) count++
    if (filters.minPrice || filters.maxPrice) count++
    if (filters.brands.length) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.rating) count++
    if (filters.powerRating.length) count++
    if (filters.efficiency.length) count++
    if (filters.warranty.length) count++
    if (filters.certification.length) count++
    if (filters.application.length) count++
    return count
  }

  const displayCategories = useMemo(() => {
    const allCategory = { id: 'all', name: 'Todos os Produtos', count: products.length, icon: Package }
    const dynamicCategories = categories.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      count: cat.count,
      icon: getCategoryIcon(cat.name),
    }))
    return [allCategory, ...dynamicCategories]
  }, [categories, products.length])

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <Loader2 size={48} className="text-blue-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 mt-20">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        {lightParticles.map((p, i) => (
          <div key={i} className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-sm animate-ping"
            style={{ top: `${p.top}%`, left: `${p.left}%`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>

      {/* Breadcrumb */}
      <nav className="border-b border-blue-500/20 bg-black/80 backdrop-blur-sm sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-400 hover:text-blue-400 flex items-center gap-1"><Sun size={14} /> Home</Link></li>
            <ChevronRight size={16} className="text-blue-600/50" />
            <li className="text-blue-400/90 font-medium">Produtos</li>
          </ol>
        </div>
      </nav>

      {/* Stats Bar */}
      <div className="bg-blue-500/5 border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2"><Package size={14} className="text-blue-400" /><span>{filteredProducts.length} Produtos</span></div>
              <div className="flex items-center gap-2"><Factory size={14} className="text-blue-400" /><span>{brands.length} Marcas</span></div>
              <div className="flex items-center gap-2"><Truck size={14} className="text-blue-400" /><span>Frete Grátis acima de 7.500 MZN</span></div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleAutoRefresh} className={`px-2 py-1 text-xs rounded-lg ${autoRefresh ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                <RefreshCw size={12} className={autoRefresh ? 'animate-pulse inline mr-1' : 'inline mr-1'} />
                Auto {autoRefresh ? 'ON' : 'OFF'}
              </button>
              <button onClick={handleManualRefresh} disabled={refreshing} className="px-3 py-1 bg-gray-800/50 border border-blue-500/30 rounded-lg text-sm disabled:opacity-50">
                <RefreshCw size={14} className={refreshing ? 'animate-spin inline mr-1' : 'inline mr-1'} />
                Atualizar
              </button>
              <span className="text-xs text-gray-500">Atualizado: {lastUpdate.toLocaleTimeString()}</span>
              <div className="flex items-center gap-2"><Shield size={14} className="text-green-400" /><span className="text-xs">Compra 100% segura</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">Catálogo de Produtos</h1>
            <p className="text-gray-400 mt-1">Encontre as melhores soluções em energia solar</p>
          </div>
          {compareList.length > 0 && (
            <button onClick={() => setIsCompareOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <Scale size={18} /> Comparar ({compareList.length})
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="text" placeholder="Buscar produto..." value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-xl flex items-center gap-2">
                <Filter size={18} /> Filtros
                {activeFiltersCount() > 0 && <span className="bg-blue-500 text-black text-xs px-1.5 py-0.5 rounded-full">{activeFiltersCount()}</span>}
              </button>
              <div className="flex bg-gray-800/50 border border-blue-500/30 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-3 ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}><Grid3x3 size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-3 ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}><List size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-800/50 border border-blue-500/30 rounded-lg px-3 py-2 text-white">
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>)}
              </select>
            </div>
            <p className="text-sm text-gray-500">{filteredProducts.length} produto(s) encontrado(s)</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex justify-between">
            <span className="text-red-400">Erro: {error}</span>
            <button onClick={handleManualRefresh} className="px-3 py-1 bg-red-500/20 rounded-lg">Tentar novamente</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><SlidersHorizontal size={18} />Filtros</h2>
                {activeFiltersCount() > 0 && <button onClick={clearFilters} className="text-sm text-blue-400">Limpar todos</button>}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Categorias</h3>
                <div className="space-y-2">
                  {displayCategories.map(cat => {
                    const Icon = cat.icon
                    return (
                      <button 
                        key={cat.id} 
                        onClick={() => {
                          console.log(`🖱️ Clicou na categoria: ${cat.name} (ID: ${cat.id})`)
                          handleFilterChange('category', cat.id)
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          filters.category === cat.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800/50'
                        }`}>
                        {Icon && <Icon size={16} />}
                        <span>{cat.name}</span>
                        {cat.count > 0 && <span className="text-xs text-gray-500 ml-auto">({cat.count})</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Faixa de Preço</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <button key={idx} onClick={() => {
                      handleFilterChange('minPrice', range.min)
                      handleFilterChange('maxPrice', range.max)
                    }} className="w-full text-left px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800/50">
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-3">Marcas</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <label key={brand.name} className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-800/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={filters.brands.includes(brand.name)}
                            onChange={(e) => {
                              const newBrands = e.target.checked ? [...filters.brands, brand.name] : filters.brands.filter(b => b !== brand.name)
                              handleFilterChange('brands', newBrands)
                            }}
                            className="w-4 h-4 rounded border-blue-500/30 text-blue-500" />
                          <span className="text-gray-400">{brand.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{brand.count} produtos</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Status</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.inStock} onChange={(e) => handleFilterChange('inStock', e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-gray-400">Em estoque</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.onSale} onChange={(e) => handleFilterChange('onSale', e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-gray-400">Em oferta</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Avaliação Mínima</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => handleFilterChange('rating', filters.rating === star ? null : star)}>
                      <Star size={24} className={filters.rating === star ? 'text-blue-400 fill-current' : 'text-gray-500'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
                <button onClick={clearFilters} className="px-6 py-2 bg-blue-500 text-black rounded-lg">Limpar filtros</button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                  {paginatedProducts.map((product, index) => (
                    <div key={product.id} className="relative group">
                      <ProductCard product={product} priority={index < 4} />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => addToCompare(product)} className="p-2 bg-black/80 rounded-lg text-gray-400 hover:text-blue-400">
                          <Scale size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg disabled:opacity-50">Anterior</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = currentPage
                      if (totalPages <= 5) pageNum = i + 1
                      else if (currentPage <= 3) pageNum = i + 1
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                      else pageNum = currentPage - 2 + i
                      return (
                        <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${currentPage === pageNum ? 'bg-blue-500 text-black' : 'bg-gray-800/50 border border-blue-500/30 text-gray-400'}`}>
                          {pageNum}
                        </button>
                      )
                    })}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg disabled:opacity-50">Próxima</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareOpen && compareList.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setIsCompareOpen(false)}>
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-blue-500/20 flex justify-between sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold flex items-center gap-2"><Scale size={20} />Comparar Produtos</h2>
              <button onClick={() => setIsCompareOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {compareList.map(product => (
                  <div key={product.id} className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4 relative">
                    <button onClick={() => removeFromCompare(product.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><X size={14} /></button>
                    <div className="relative w-full h-32 mb-3"><Image src={product.image} alt={product.name} fill className="object-contain" /></div>
                    <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-blue-400 font-bold">{formatPrice(product.price)}</p>
                    {/* <Link href={`/product/${product.slug}`} className="mt-3 block text-center text-sm text-blue-400 hover:text-blue-300">Ver detalhes →</Link> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <Loader2 size={48} className="text-blue-400 animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}