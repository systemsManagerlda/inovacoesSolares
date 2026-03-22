/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
  Share2
} from 'lucide-react'

// Função para buscar produto
async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?slug=${slug}&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) return null
    
    const products = await response.json()
    return products[0] || null
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }
}

// Função para buscar produtos relacionados
async function getRelatedProducts(categoryId: number, currentProductId: number) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products?category=${categoryId}&exclude=${currentProductId}&per_page=4&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}`,
      { next: { revalidate: 60 } }
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

// Gerar metadata dinâmica
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params // ⬅️ IMPORTANTE: usar await
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: 'Produto não encontrado',
      description: 'O produto que você procura não foi encontrado.'
    }
  }

  return {
    title: `${product.name} | Inovações Solares`,
    description: product.description?.replace(/<[^>]*>/g, '').slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.replace(/<[^>]*>/g, '').slice(0, 160),
      images: product.images?.[0]?.src || '/images/logo.png',
    }
  }
}

// Componente principal da página
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params // ⬅️ IMPORTANTE: usar await
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.categories?.[0]?.id || 0,
    product.id
  )

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Breadcrumb */}
      <nav className="border-b border-blue-500/20 bg-black/80 backdrop-blur-sm">
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
              {product.images?.[0]?.src ? (
                <Image
                  src={product.images[0].src}
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
                  <div key={index} className="relative w-20 h-20 bg-gray-900/50 rounded-lg border border-blue-500/20 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors">
                    <Image
                      src={image.src}
                      alt={`${product.name} - imagem ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.on_sale && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Em Oferta
                </span>
              )}
              {product.stock_status === 'instock' && (
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
            {product.average_rating && (
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
                  {product.average_rating} de 5 ({product.review_count} avaliações)
                </span>
              </div>
            )}

            {/* Preço */}
            <div className="space-y-2">
              {product.sale_price ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-400">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    }).format(parseFloat(product.sale_price))}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    }).format(parseFloat(product.regular_price))}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    {Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.regular_price)) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-blue-400">
                  {new Intl.NumberFormat('pt-MZ', {
                    style: 'currency',
                    currency: 'MZN'
                  }).format(parseFloat(product.price))}
                </span>
              )}
            </div>

            {/* Descrição */}
            <div className="prose prose-invert max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: product.short_description || product.description }}
                className="text-gray-300 leading-relaxed"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02]">
                Adicionar ao Carrinho
              </button>
              <button className="p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors group">
                <Heart size={24} className="text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
              <button className="p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors group">
                <Scale size={24} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
              </button>
              <button className="p-3 bg-gray-800/50 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-colors group">
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
              {relatedProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-gray-900/50 border border-blue-500/20 rounded-xl overflow-hidden hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-square bg-gray-800/50">
                    {product.images?.[0]?.src ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
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
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-blue-400 font-bold">
                      {new Intl.NumberFormat('pt-MZ', {
                        style: 'currency',
                        currency: 'MZN'
                      }).format(parseFloat(product.price))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}