/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { 
  ChevronRight, 
  Sun, 
  Zap, 
  Sparkles, 
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Grid3x3,
  List,
  ArrowUpDown,
  Package,
  Star,
  Truck,
  Shield,
  Heart,
  Scale,
  Boxes,
  Factory} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { WooProduct } from '@/types'

// Posições fixas para as partículas de luz
const lightParticles = [
  { top: 10, left: 15, delay: 0.5, duration: 3.5 },
  { top: 25, left: 80, delay: 1.2, duration: 4.0 },
  { top: 45, left: 30, delay: 0.8, duration: 3.0 },
  { top: 60, left: 70, delay: 1.5, duration: 4.5 },
  { top: 75, left: 20, delay: 0.3, duration: 3.2 },
]

// Categorias expandidas
const categories = [
  { id: 'all', name: 'Todos os Produtos', icon: Package, count: 0, subcategories: [] },
  { 
    id: 'solar-panels', 
    name: 'Painéis Solares', 
    icon: Sun, 
    count: 0,
    subcategories: ['Monocristalinos', 'Policristalinos', 'Bifaciais', 'Flexíveis']
  },
  { 
    id: 'inverters', 
    name: 'Inversores', 
    icon: Zap, 
    count: 0,
    subcategories: ['Off-grid', 'On-grid', 'Híbridos', 'Microinversores']
  },
  { 
    id: 'batteries', 
    name: 'Baterias', 
    icon: Sparkles, 
    count: 0,
    subcategories: ['LiFePO4', 'Chumbo-ácido', 'Gel', 'Estacionárias']
  },
  { 
    id: 'controllers', 
    name: 'Controladores', 
    icon: Zap, 
    count: 0,
    subcategories: ['PWM', 'MPPT']
  },
  { 
    id: 'solar-lighting', 
    name: 'Iluminação Solar', 
    icon: Sun, 
    count: 0,
    subcategories: ['Postes', 'Jardim', 'Segurança', 'Decoração']
  },
  { 
    id: 'accessories', 
    name: 'Acessórios', 
    icon: Sparkles, 
    count: 0,
    subcategories: ['Cabos', 'Conectores', 'Suportes', 'Disjuntores']
  },
  { 
    id: 'kits', 
    name: 'Kits Solares', 
    icon: Boxes, 
    count: 0,
    subcategories: ['Residenciais', 'Comerciais', 'Industriais', 'Rurais']
  },
]

// Opções de ordenação expandidas
const sortOptions = [
  { value: 'relevance', label: 'Relevância', icon: '🎯' },
  { value: 'date_desc', label: 'Mais recentes', icon: '🆕' },
  { value: 'date_asc', label: 'Mais antigos', icon: '📅' },
  { value: 'price_asc', label: 'Menor preço', icon: '💰' },
  { value: 'price_desc', label: 'Maior preço', icon: '💎' },
  { value: 'rating_desc', label: 'Melhor avaliados', icon: '⭐' },
  { value: 'popularity_desc', label: 'Mais vendidos', icon: '🔥' },
  { value: 'discount_desc', label: 'Maior desconto', icon: '🏷️' },
]

// Faixas de preço detalhadas
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

// Marcas expandidas
const brands = [
  { name: 'SolarTech', country: 'Alemanha', rating: 4.8, products: 120 },
  { name: 'EcoPower', country: 'China', rating: 4.6, products: 95 },
  { name: 'SunMaster', country: 'EUA', rating: 4.9, products: 85 },
  { name: 'GreenEnergy', country: 'Brasil', rating: 4.5, products: 70 },
  { name: 'PowerPlus', country: 'Japão', rating: 4.7, products: 60 },
  { name: 'SolarMax', country: 'Alemanha', rating: 4.8, products: 55 },
  { name: 'EcoSun', country: 'Portugal', rating: 4.4, products: 45 },
  { name: 'VoltTech', country: 'China', rating: 4.3, products: 40 },
]

// Potências
const powerRatings = [
  '100W', '200W', '300W', '400W', '500W', '600W', '800W', '1000W', '2000W', '5000W+'
]

// Eficiências
const efficiencies = [
  '15-18%', '18-20%', '20-22%', '22-25%', '25%+'
]

// Tempo de garantia
const warrantyPeriods = [
  '1 ano', '2 anos', '3 anos', '5 anos', '10 anos', '25 anos'
]

// Certificações
const certifications = [
  'CE', 'RoHS', 'TUV', 'IEC', 'ISO 9001', 'UL'
]

// Aplicações
const applications = [
  'Residencial', 'Comercial', 'Industrial', 'Agrícola', 'Rural', 'Marítimo', 'Caravanas'
]

interface FilterState {
  category: string
  subcategory: string
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
  minPower: number | null
  maxPower: number | null
}

interface CompareProduct {
  id: number
  name: string
  price: string
  image: string
  power?: string
  efficiency?: string
  warranty?: string
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
  const [filteredProducts, setFilteredProducts] = useState<WooProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('categoria') || 'all',
    subcategory: '',
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
    minPower: null,
    maxPower: null,
  })

  const itemsPerPage = 12

  // Simular busca de produtos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.category !== 'all') params.append('category', filters.category)
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
        
        const response = await fetch(`/api/woocommerce?endpoint=products&${params}`)
        const data = await response.json()
        
        let filtered = [...data]
        
        // Aplicar filtros locais
        if (filters.brands.length > 0) {
          filtered = filtered.filter(p => {
            const productBrand = p.brand || brands[Math.floor(Math.random() * brands.length)].name
            return filters.brands.includes(productBrand)
          })
        }
        
        if (filters.rating) {
          filtered = filtered.filter(p => parseFloat(p.average_rating) >= filters.rating!)
        }
        
        if (filters.powerRating.length > 0) {
          // Simulação de filtro por potência
        }
        
        if (filters.efficiency.length > 0) {
          // Simulação de filtro por eficiência
        }
        
        if (filters.warranty.length > 0) {
          // Simulação de filtro por garantia
        }
        
        if (filters.certification.length > 0) {
          // Simulação de filtro por certificação
        }
        
        if (filters.application.length > 0) {
          // Simulação de filtro por aplicação
        }
        
        setProducts(filtered)
        setTotalPages(Math.ceil(filtered.length / itemsPerPage))
        setFilteredProducts(filtered)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [filters, sortBy])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      subcategory: '',
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
      minPower: null,
      maxPower: null,
    })
    setCurrentPage(1)
  }

  const addToCompare = (product: any) => {
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
        power: product.attributes?.find((a: any) => a.name === 'Potência')?.options?.[0],
        efficiency: product.attributes?.find((a: any) => a.name === 'Eficiência')?.options?.[0],
        warranty: product.attributes?.find((a: any) => a.name === 'Garantia')?.options?.[0],
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
    if (filters.subcategory) count++
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

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden mt-20">
      {/* Elementos de luz solar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        {lightParticles.map((particle, i) => (
          <div key={i} className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-[2px] animate-ping"
            style={{ top: `${particle.top}%`, left: `${particle.left}%`, animationDelay: `${particle.delay}s` }} />
        ))}
      </div>

      {/* Breadcrumb */}
      <nav className="relative border-b border-blue-500/20 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"><Sun size={14} /> Home</Link></li>
            <ChevronRight size={16} className="text-blue-600/50" />
            <li className="text-blue-400/90 font-medium">Produtos</li>
          </ol>
        </div>
      </nav>

      {/* Barra de Topo com estatísticas */}
      <div className="bg-blue-500/5 border-b border-blue-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2"><Package size={14} className="text-blue-400" /><span>{filteredProducts.length} Produtos</span></div>
              <div className="flex items-center gap-2"><Factory size={14} className="text-blue-400" /><span>{brands.length} Marcas</span></div>
              <div className="flex items-center gap-2"><Truck size={14} className="text-blue-400" /><span>Frete Grátis acima de 7.500 MZN</span></div>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-400" />
              <span className="text-xs text-gray-400">Compra 100% segura</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Header com estatísticas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">
              <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                Catálogo de Produtos
              </span>
            </h1>
            <p className="text-gray-400 mt-1">Encontre as melhores soluções em energia solar</p>
          </div>
          
          {/* Botão Comparar */}
          {compareList.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
            >
              <Scale size={18} />
              <span>Comparar ({compareList.length})</span>
            </button>
          )}
        </div>

        {/* Barra de Busca e Ações */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input type="text" placeholder="Buscar por produto, marca ou categoria..." value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-xl text-white focus:outline-none focus:border-blue-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-xl flex items-center gap-2 hover:text-blue-400 transition-all">
                <Filter size={18} /><span>Filtros</span>
                {activeFiltersCount() > 0 && <span className="bg-blue-500 text-black text-xs px-1.5 py-0.5 rounded-full">{activeFiltersCount()}</span>}
              </button>
              <div className="flex bg-gray-800/50 border border-blue-500/30 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-3 ${viewMode === 'grid' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}><Grid3x3 size={18} /></button>
                <button onClick={() => setViewMode('list')} className={`p-3 ${viewMode === 'list' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500'}`}><List size={18} /></button>
              </div>
            </div>
          </div>

          {/* Ordenação e Resultados */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gray-500" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-blue-500/30 rounded-lg px-3 py-2 text-white">
                {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>)}
              </select>
            </div>
            <p className="text-sm text-gray-500">{filteredProducts.length} produto(s) encontrado(s)</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Painel de Filtros Avançado */}
          <aside className={`lg:w-80 shrink-0 transition-all duration-300 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2"><SlidersHorizontal size={18} />Filtros Avançados</h2>
                {activeFiltersCount() > 0 && <button onClick={clearFilters} className="text-sm text-blue-400 hover:text-blue-300">Limpar todos</button>}
              </div>

              {/* Categorias com subcategorias */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Categorias</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id}>
                      <button onClick={() => toggleCategory(cat.id)} className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-gray-800/50">
                        <div className="flex items-center gap-2" onClick={() => handleFilterChange('category', cat.id)}>
                          {cat.icon && <cat.icon size={16} />}
                          <span className={filters.category === cat.id ? 'text-blue-400' : 'text-gray-400'}>{cat.name}</span>
                        </div>
                        {cat.subcategories.length > 0 && (
                          <span>{expandedCategories.includes(cat.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                        )}
                      </button>
                      {expandedCategories.includes(cat.id) && cat.subcategories.length > 0 && (
                        <div className="ml-8 mt-1 space-y-1">
                          {cat.subcategories.map(sub => (
                            <button key={sub} onClick={() => handleFilterChange('subcategory', sub)}
                              className={`block w-full text-left px-3 py-1 text-sm rounded-lg ${filters.subcategory === sub ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300'}`}>
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Faixa de Preço com Slider */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Faixa de Preço</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, idx) => (
                    <button key={idx} onClick={() => handleFilterChange('minPrice', range.min)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${filters.minPrice === range.min && filters.maxPrice === range.max ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800/50'}`}>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marcas com avaliação */}
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
                      <div className="flex items-center gap-1 text-xs">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-gray-500">{brand.rating}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Potência */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Potência</h3>
                <div className="flex flex-wrap gap-2">
                  {powerRatings.map(power => (
                    <button key={power} onClick={() => {
                      const newPower = filters.powerRating.includes(power) ? filters.powerRating.filter(p => p !== power) : [...filters.powerRating, power]
                      handleFilterChange('powerRating', newPower)
                    }}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${filters.powerRating.includes(power) ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-blue-500/30 text-gray-400 hover:border-blue-400'}`}>
                      {power}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eficiência */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Eficiência</h3>
                <div className="flex flex-wrap gap-2">
                  {efficiencies.map(eff => (
                    <button key={eff} onClick={() => {
                      const newEff = filters.efficiency.includes(eff) ? filters.efficiency.filter(e => e !== eff) : [...filters.efficiency, eff]
                      handleFilterChange('efficiency', newEff)
                    }}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${filters.efficiency.includes(eff) ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-blue-500/30 text-gray-400'}`}>
                      {eff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garantia */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Garantia</h3>
                <div className="flex flex-wrap gap-2">
                  {warrantyPeriods.map(warr => (
                    <button key={warr} onClick={() => {
                      const newWarr = filters.warranty.includes(warr) ? filters.warranty.filter(w => w !== warr) : [...filters.warranty, warr]
                      handleFilterChange('warranty', newWarr)
                    }}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${filters.warranty.includes(warr) ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-blue-500/30 text-gray-400'}`}>
                      {warr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificações */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Certificações</h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map(cert => (
                    <button key={cert} onClick={() => {
                      const newCert = filters.certification.includes(cert) ? filters.certification.filter(c => c !== cert) : [...filters.certification, cert]
                      handleFilterChange('certification', newCert)
                    }}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${filters.certification.includes(cert) ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-blue-500/30 text-gray-400'}`}>
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aplicações */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Aplicações</h3>
                <div className="flex flex-wrap gap-2">
                  {applications.map(app => (
                    <button key={app} onClick={() => {
                      const newApp = filters.application.includes(app) ? filters.application.filter(a => a !== app) : [...filters.application, app]
                      handleFilterChange('application', newApp)
                    }}
                      className={`px-3 py-1 text-sm rounded-full border transition-all ${filters.application.includes(app) ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-blue-500/30 text-gray-400'}`}>
                      {app}
                    </button>
                  ))}
                </div>
              </div>

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

              {/* Avaliação */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Avaliação Mínima</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => handleFilterChange('rating', filters.rating === star ? null : star)}
                      className={`p-1 transition-all ${filters.rating === star ? 'text-blue-400 scale-110' : 'text-gray-500'}`}>
                      <Star size={24} fill={filters.rating === star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20"><div className="relative"><Sun size={48} className="relative text-blue-400 animate-spin-slow" /></div></div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-400 mb-4">Tente ajustar os filtros ou usar outros termos de busca</p>
                <button onClick={clearFilters} className="px-6 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-black font-medium rounded-lg">Limpar filtros</button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                  {paginatedProducts.map((product, index) => (
                    <div key={product.id} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <ProductCard product={product} priority={index < 4} />
                      {/* Botões de ação flutuantes */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button onClick={() => addToCompare(product)} className="p-2 bg-black/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-blue-400 transition-colors" title="Comparar">
                          <Scale size={16} />
                        </button>
                        <button className="p-2 bg-black/80 backdrop-blur-sm rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Favoritar">
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg disabled:opacity-50">Anterior</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                      return (
                        <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${currentPage === pageNum ? 'bg-linear-to-r from-blue-500 to-blue-600 text-black' : 'bg-gray-800/50 border border-blue-500/30 text-gray-400'}`}>
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

      {/* Modal de Comparação */}
      {isCompareOpen && compareList.length > 0 && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsCompareOpen(false)}>
          <div className="bg-linear-to-b from-gray-900 to-black rounded-2xl border border-blue-500/20 max-w-5xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-blue-500/20 flex justify-between items-center sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Scale size={20} />Comparar Produtos</h2>
              <button onClick={() => setIsCompareOpen(false)} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {compareList.map(product => (
                  <div key={product.id} className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4 relative">
                    <button onClick={() => removeFromCompare(product.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><X size={14} /></button>
                    <div className="relative w-full h-32 mb-3"><Image src={product.image} alt={product.name} fill className="object-contain" /></div>
                    <h3 className="font-semibold text-white text-sm mb-2">{product.name}</h3>
                    <p className="text-blue-400 font-bold text-lg">{formatPrice(product.price)}</p>
                    {product.power && <p className="text-xs text-gray-400 mt-1">⚡ Potência: {product.power}</p>}
                    {product.efficiency && <p className="text-xs text-gray-400">📊 Eficiência: {product.efficiency}</p>}
                    {product.warranty && <p className="text-xs text-gray-400">🛡️ Garantia: {product.warranty}</p>}
                    <Link href={`/produto/${product.id}`} className="mt-3 block text-center text-sm text-blue-400 hover:text-blue-300">Ver detalhes →</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden mt-20 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Carregando produtos...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}