import Link from 'next/link'
import Image from 'next/image'
import { api } from '@/lib/woocommerce'
import { WooCategory } from '@/types'
import { Sun, Zap, Sparkles } from 'lucide-react'

async function getCategories(): Promise<WooCategory[]> {
  try {
    const response = await api.get('products/categories', {
      per_page: 6,
      hide_empty: true
    })
    return response.data
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

// Componente para estado vazio
function EmptyCategories() {
  return (
    <div className="col-span-full py-12 text-center">
      <div className="inline-block relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse" />
        <Sun size={48} className="relative text-blue-400 animate-[spin_8s_linear_infinite]" />
      </div>
      <p className="text-gray-400 mt-4">Nenhuma categoria encontrada</p>
    </div>
  )
}

export default async function Categories() {
  const categories = await getCategories()

  if (categories.length === 0) {
    return <EmptyCategories />
  }

  return (
    <div className="relative">
      {/* Elementos de luz decorativos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        
        {/* Partículas de luz */}
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-blue-300/30 rounded-full blur-sm animate-ping" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full blur-sm animate-ping delay-300" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/categorias/${category.slug}`}
            className="group relative animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Efeito de brilho solar */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative aspect-square bg-linear-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-blue-500/10 group-hover:border-blue-400/30 transition-all duration-300">
              {/* Imagem da categoria */}
              {category.image ? (
                <Image
                  src={category.image.src}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                  sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                />
              ) : (
                // Placeholder com tema solar quando não há imagem
                <div className="w-full h-full bg-linear-to-br from-blue-500/10 to-blue-500/10 flex items-center justify-center">
                  <Sun size={48} className="text-blue-500/30 group-hover:text-blue-400/50 transition-colors" />
                </div>
              )}

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Efeito de luz no hover */}
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Conteúdo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {/* Ícone decorativo */}
                <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {index % 3 === 0 ? (
                    <Sun className="text-blue-400" size={24} />
                  ) : index % 3 === 1 ? (
                    <Zap className="text-blue-400" size={24} />
                  ) : (
                    <Sparkles className="text-blue-400" size={24} />
                  )}
                </div>

                {/* Nome da categoria */}
                <h3 className="text-white font-semibold text-lg text-center px-2 group-hover:text-blue-400 transition-colors drop-shadow-lg">
                  {category.name}
                </h3>

                {/* Contador de produtos (se disponível) */}
                {category.count > 0 && (
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-blue-400/80 transition-colors">
                    {category.count} {category.count === 1 ? 'produto' : 'produtos'}
                  </span>
                )}
              </div>

              {/* Badge decorativo no canto */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-linear-to-br from-blue-500/20 to-blue-500/20 rounded-full border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Sun size={14} className="text-blue-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Adicione isso no seu tailwind.config.js */}
      <style>{`
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
      `}</style>
    </div>
  )
}