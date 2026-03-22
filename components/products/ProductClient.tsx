'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { WooProduct } from '@/types'
import ProductGallery from '@/components/products/ProductGallery'
import ProductCard from '@/components/products/ProductCard'
import ProductActions from '@/components/products/ProductActions'
import { 
  Star, 
  Truck, 
  Shield, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Package,
  Sun,
  Zap,
  Sparkles
} from 'lucide-react'

// Posições fixas para as partículas de luz
const lightParticles = [
  { top: 10, left: 15, delay: 0.5, duration: 3.5 },
  { top: 25, left: 80, delay: 1.2, duration: 4.0 },
  { top: 45, left: 30, delay: 0.8, duration: 3.0 },
  { top: 60, left: 70, delay: 1.5, duration: 4.5 },
  { top: 75, left: 20, delay: 0.3, duration: 3.2 },
  { top: 85, left: 90, delay: 1.8, duration: 3.8 },
  { top: 15, left: 45, delay: 0.9, duration: 4.2 },
  { top: 35, left: 60, delay: 1.1, duration: 3.3 },
  { top: 55, left: 10, delay: 0.6, duration: 3.9 },
  { top: 95, left: 50, delay: 1.4, duration: 4.1 },
  { top: 20, left: 35, delay: 0.7, duration: 3.7 },
  { top: 40, left: 85, delay: 1.3, duration: 4.3 },
  { top: 50, left: 25, delay: 0.4, duration: 3.4 },
  { top: 70, left: 55, delay: 1.6, duration: 4.6 },
  { top: 80, left: 75, delay: 0.2, duration: 3.1 },
  { top: 30, left: 95, delay: 1.9, duration: 4.4 },
  { top: 65, left: 40, delay: 0.8, duration: 3.8 },
  { top: 90, left: 65, delay: 1.0, duration: 4.2 },
  { top: 45, left: 10, delay: 0.5, duration: 3.6 },
  { top: 55, left: 85, delay: 1.7, duration: 4.7 },
]

interface ProductClientProps {
  product: WooProduct
  relatedProducts: WooProduct[]
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
  }, [])

  const price = formatPrice(product.price)
  const originalPrice = product.on_sale ? formatPrice(product.regular_price) : null
  const discount = product.on_sale 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.regular_price)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden mt-20">
      {/* Elementos de luz solar aprimorados */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-300" />
        
        {lightParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-[2px] animate-ping"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-48 bg-linear-to-b from-blue-500/40 via-blue-500/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-0.5 h-36 bg-linear-to-b from-blue-500/30 via-blue-500/15 to-transparent rotate-12" />
        <div className="absolute top-0 left-1/3 w-0.5 h-36 bg-linear-to-b from-blue-500/30 via-blue-500/15 to-transparent -rotate-12" />
        
        <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-blue-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-blue-500/10 to-transparent" />
      </div>

      {/* Breadcrumb */}
      <nav className="relative border-b border-blue-500/20 bg-black/80 backdrop-blur-sm" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <Sun size={14} className="text-blue-400/50" />
                Home
              </Link>
            </li>
            <ChevronRight size={16} className="text-blue-600/50" />
            <li>
              <Link href="/produtos" className="text-gray-400 hover:text-blue-400 transition-colors">
                Produtos
              </Link>
            </li>
            <ChevronRight size={16} className="text-blue-600/50" />
            <li className="text-blue-400/90 font-medium truncate max-w-50 md:max-w-xs">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 lg:py-12 relative">
        {/* Badges */}
        {product.featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl animate-pulse" />
              <div className="relative bg-linear-to-r from-blue-500 to-blue-600 text-black font-bold border-0 shadow-lg shadow-blue-500/20 px-3 py-1 rounded-full text-sm flex items-center">
                <Sparkles size={16} className="mr-1 animate-pulse" />
                DESTAQUE
              </div>
            </div>
          </div>
        )}

        {product.on_sale && (
          <div className="absolute top-4 left-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl animate-pulse" />
              <div className="relative bg-linear-to-r from-blue-500 to-blue-600 text-black font-bold border-0 px-3 py-1 rounded-full text-sm flex items-center">
                <Zap size={16} className="mr-1" />
                OFERTA
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-8 lg:self-start relative">
            <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 via-blue-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse" />
            <div className="absolute -inset-2 bg-linear-to-r from-blue-500/10 to-blue-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-2">
              <ProductGallery 
                images={product.images.map(img => ({ 
                  src: img.src, 
                  alt: img.alt || product.name 
                }))}
                name={product.name}
              />
            </div>
          </div>

          {/* Informações do produto */}
          <div className="space-y-6 relative">
            {/* Categoria e SKU */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {product.categories.length > 0 && (
                <Link 
                  href={`/categorias/${product.categories[0].slug}`}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30 hover:border-blue-400/50 backdrop-blur-sm"
                >
                  {product.categories[0].name}
                </Link>
              )}
              {product.sku && (
                <span className="text-gray-500 flex items-center gap-1">
                  <Package size={14} className="text-blue-400/50" />
                  SKU: <span className="font-mono text-blue-400/70">{product.sku}</span>
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">
              {product.name}
            </h1>

            {/* Avaliações */}
            {parseFloat(product.average_rating) > 0 ? (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const rating = parseFloat(product.average_rating)
                      const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100
                      
                      return (
                        <div key={i} className="relative w-5 h-5">
                          <Star className="absolute text-gray-700" size={20} />
                          <div className="absolute overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                            <Star className="text-blue-400 fill-current drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={20} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <span className="font-medium text-blue-400">{product.average_rating}</span>
                </div>
                <Link href="#avaliacoes" className="text-gray-400 hover:text-blue-400 transition-colors">
                  ({product.review_count} {product.review_count === 1 ? 'avaliação' : 'avaliações'})
                </Link>
              </div>
            ) : (
              <div className="text-gray-400">
                <span>Nenhuma avaliação ainda</span>
                <Link href="#avaliacoes" className="ml-2 text-blue-400 hover:text-blue-300">
                  Seja o primeiro a avaliar
                </Link>
              </div>
            )}

            {/* Preço */}
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 via-blue-500/30 to-blue-500/30 rounded-xl blur-xl animate-pulse" />
              <div className="relative bg-linear-to-r from-gray-900 to-black p-6 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <div>
                    <span className="text-sm text-blue-400/80 mb-1 block items-center gap-1">
                      <Zap size={14} className="animate-pulse" />
                      Preço especial
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl lg:text-5xl font-bold text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        {price}
                      </span>
                      {originalPrice && (
                        <span className="text-xl text-gray-600 line-through">{originalPrice}</span>
                      )}
                    </div>
                  </div>
                  {originalPrice && (
                    <div className="bg-linear-to-r from-blue-500 to-blue-600 text-black font-bold border-0 shadow-lg shadow-blue-500/20 px-3 py-1 rounded-full text-sm flex items-center">
                      <Sun size={16} className="mr-1 animate-spin" style={{ animation: 'spin 3s linear infinite' }} />
                      -{discount}% OFF
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status do estoque */}
            <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20">
              {product.stock_status === 'instock' ? (
                <>
                  <CheckCircle className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={24} />
                  <div>
                    <p className="font-medium text-blue-400">Em estoque</p>
                    <p className="text-sm text-gray-400">Pronto para envio imediato</p>
                  </div>
                </>
              ) : product.stock_status === 'onbackorder' ? (
                <>
                  <Package className="text-blue-600" size={24} />
                  <div>
                    <p className="font-medium text-blue-600">Sob encomenda</p>
                    <p className="text-sm text-gray-400">Consulte o prazo de entrega</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="text-gray-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-500">Fora de estoque</p>
                    <p className="text-sm text-gray-500">Avise-me quando chegar</p>
                  </div>
                </>
              )}
            </div>

            {/* Descrição curta */}
            {product.short_description && (
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-a:text-blue-400">
                <div dangerouslySetInnerHTML={{ __html: product.short_description }} className="text-gray-300 leading-relaxed" />
              </div>
            )}

            {/* ProductActions */}
            <ProductActions 
              stockStatus={product.stock_status}
              productId={product.id}
              productName={product.name}
              productPrice={product.price}
            />

            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all group">
                <Truck className="text-blue-400/70 mb-3 group-hover:text-blue-400 transition-colors" size={28} />
                <h3 className="font-semibold text-white">Frete Grátis</h3>
                <p className="text-sm text-gray-400 mt-1">Para todo o país</p>
                <p className="text-xs text-blue-400/60 mt-2">Acima de 7.500 MZN</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all group">
                <Shield className="text-blue-400/70 mb-3 group-hover:text-blue-400 transition-colors" size={28} />
                <h3 className="font-semibold text-white">Compra Segura</h3>
                <p className="text-sm text-gray-400 mt-1">Dados protegidos</p>
                <p className="text-xs text-blue-400/60 mt-2">Criptografia SSL</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all group">
                <RefreshCw className="text-blue-400/70 mb-3 group-hover:text-blue-400 transition-colors" size={28} />
                <h3 className="font-semibold text-white">Trocas</h3>
                <p className="text-sm text-gray-400 mt-1">30 dias</p>
                <p className="text-xs text-blue-400/60 mt-2">Garantia estendida</p>
              </div>
            </div>

            {/* Descrição completa */}
            <div className="mt-12">
              <div className="border-b border-blue-500/20">
                <nav className="flex gap-8" aria-label="Tabs">
                  <button className="py-4 px-1 border-b-2 border-blue-400 text-blue-400 font-medium">
                    Descrição
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent text-gray-400 hover:text-blue-400/80 font-medium">
                    Informações Técnicas
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent text-gray-400 hover:text-blue-400/80 font-medium">
                    Avaliações ({product.review_count})
                  </button>
                </nav>
              </div>
              
              <div className="py-6">
                {product.description && (
                  <div 
                    className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="pt-6 border-t border-blue-500/20">
                <h3 className="text-sm font-medium text-blue-400/80 mb-3">Tags relacionadas:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className="text-sm bg-gray-900/50 backdrop-blur-sm hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 px-3 py-1 rounded-full transition-colors border border-blue-500/20 hover:border-blue-400/40"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
            
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-2xl animate-pulse" />
                <h2 className="relative text-3xl lg:text-4xl font-display font-bold text-white flex items-center justify-center gap-3">
                  <Sparkles className="text-blue-400" size={32} />
                  Produtos Relacionados
                  <Sparkles className="text-blue-400" size={32} />
                </h2>
              </div>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Você também pode se interessar por estes produtos
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} priority={index === 0} />
                </div>
              ))}
            </div>

            {product.categories.length > 0 && (
              <div className="text-center mt-10">
                <Link
                  href={`/categorias/${product.categories[0].slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 hover:border-blue-400/50 transition-all group"
                >
                  <span>Ver mais produtos da categoria</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schema Markup - apenas no cliente */}
      {isClient && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "image": product.images[0]?.src,
              "description": product.short_description?.replace(/<[^>]*>/g, ''),
              "sku": product.sku,
              "brand": {
                "@type": "Brand",
                "name": "Inovações Solares"
              },
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "MZN",
                "availability": product.stock_status === 'instock' 
                  ? "https://schema.org/InStock" 
                  : "https://schema.org/OutOfStock"
              },
              "aggregateRating": parseFloat(product.average_rating) > 0 ? {
                "@type": "AggregateRating",
                "ratingValue": product.average_rating,
                "reviewCount": product.review_count
              } : undefined
            })
          }}
        />
      )}

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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}