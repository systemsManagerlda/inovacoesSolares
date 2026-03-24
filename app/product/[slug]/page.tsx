/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { 
  Sun, 
  Zap, 
  Shield, 
  Truck, 
  Star, 
  ChevronRight,
  Check,
  Package,
  Scale,
  Heart,
  Share2,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus
} from 'lucide-react'
import { WooProduct } from '@/types'

// Função para formatar preço
function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value)
}

// Função para buscar produto
async function fetchProduct(slug: string): Promise<WooProduct | null> {
  try {
    const timestamp = Date.now()
    const response = await fetch(`/api/products/${slug}?_=${timestamp}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }
}

// Função para buscar produtos relacionados
async function fetchRelatedProducts(categoryId: number, currentProductId: number): Promise<WooProduct[]> {
  try {
    const timestamp = Date.now()
    const response = await fetch(
      `/api/products/related?category=${categoryId}&exclude=${currentProductId}&_=${timestamp}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error)
    return []
  }
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<WooProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<WooProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  // Resolver params e carregar produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const productData = await fetchProduct(resolvedParams.slug)
        
        if (!productData) {
          notFound()
          return
        }
        
        setProduct(productData)
        setSelectedImage(productData.images?.[0]?.src || '')
        
        // Buscar produtos relacionados
        const categoryId = productData.categories?.[0]?.id || 0
        const related = await fetchRelatedProducts(categoryId, productData.id)
        setRelatedProducts(related)
      } catch (err) {
        console.error('Erro ao carregar produto:', err)
        setError('Não foi possível carregar o produto')
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [params])

  // Handler para adicionar ao carrinho
  const handleAddToCart = async () => {
    if (!product) return
    
    // Verificar estoque
    if (product.stock_status === 'outofstock') {
      setError('Produto fora de estoque')
      setTimeout(() => setError(null), 3000)
      return
    }
    
    setAddingToCart(true)
    setError(null)
    
    try {
      // Criar objeto do produto com quantidade
      const cartItem = {
        ...product,
        quantity: quantity
      }
      
      // Adicionar ao contexto do carrinho
      addItem(cartItem)
      
      // Mostrar feedback de sucesso
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err)
      setError('Erro ao adicionar ao carrinho')
      setTimeout(() => setError(null), 3000)
    } finally {
      setAddingToCart(false)
    }
  }

  // Handler para compartilhar
  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description?.replace(/<[^>]*>/g, ''),
          url: window.location.href,
        })
      } catch (err) {
        console.log('Erro ao compartilhar:', err)
      }
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Carregando produto...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !product) {
    return (
      <div className="min-h-screen bg-black text-gray-100 mt-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Erro ao carregar produto</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-black rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
    return null
  }

  const isOutOfStock = product.stock_status === 'outofstock'
  const discount = product.on_sale && product.regular_price
    ? Math.round((1 - parseFloat(product.sale_price || product.price) / parseFloat(product.regular_price)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black text-gray-100 mt-20">
      {/* Notificação de sucesso */}
      {showSuccess && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-down">
          <div className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Produto adicionado ao carrinho!</span>
          </div>
        </div>
      )}

      {/* Notificação de erro */}
      {error && (
        <div className="fixed top-24 right-4 z-50 animate-fade-in-down">
          <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="border-b border-blue-500/20 bg-black/80 backdrop-blur-sm sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
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
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Grid do Produto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-900/50 rounded-2xl border border-blue-500/20 overflow-hidden">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Sun size={80} className="text-blue-500/30" />
                </div>
              )}
            </div>
            
            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image.src)}
                    className={`relative w-20 h-20 bg-gray-900/50 rounded-lg border overflow-hidden cursor-pointer transition-all ${
                      selectedImage === image.src
                        ? 'border-blue-400 ring-2 ring-blue-400/50'
                        : 'border-blue-500/20 hover:border-blue-400'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={`${product.name} - imagem ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.on_sale && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                  <Zap size={12} /> -{discount}% OFF
                </span>
              )}
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                  Esgotado
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  Em Estoque
                </span>
              )}
              {product.featured && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  Destaque
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              {product.name}
            </h1>

            {/* Avaliação */}
            {product.average_rating && parseFloat(product.average_rating) > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < Math.floor(parseFloat(product.average_rating))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  {product.average_rating} de 5 ({product.review_count || 0} avaliações)
                </span>
              </div>
            )}

            {/* Preço */}
            <div className="space-y-2">
              {product.sale_price ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-blue-400">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    {discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-400">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Seletor de quantidade */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-gray-400">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-gray-800/50 border border-blue-500/30 text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-white font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-gray-800/50 border border-blue-500/30 text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Descrição */}
            <div className="prose prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
                className="text-gray-300 leading-relaxed"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black'
                }`}
              >
                {addingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Adicionando...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>{isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}</span>
                  </>
                )}
              </button>
              <button className="p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors group">
                <Heart size={24} className="text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
              <button className="p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors group">
                <Scale size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors group"
              >
                <Share2 size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-500/20">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Truck size={16} className="text-blue-400" />
                <span>Frete Grátis acima de 7.500 MZN</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Shield size={16} className="text-blue-400" />
                <span>Garantia de 1 ano</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Package size={16} className="text-blue-400" />
                <span>Entrega segura</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Check size={16} className="text-blue-400" />
                <span>Pagamento seguro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                Produtos Relacionados
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group bg-gray-900/50 border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-square bg-gray-800/50">
                    {relatedProduct.images?.[0]?.src ? (
                      <Image
                        src={relatedProduct.images[0].src}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Sun size={48} className="text-blue-500/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2 text-sm">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-blue-400 font-bold">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Forçar página dinâmica sem cache estático
export const dynamic = 'force-dynamic'