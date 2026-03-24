import { Suspense } from 'react'
import Hero from '@/components/sections/Hero'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import Categories from '@/components/sections/Categories'
import Newsletter from '@/components/sections/Newsletter'
import Skeleton from '@/components/ui/Skeleton'
import { Sun, Sparkles } from 'lucide-react'
import ImageSlider from '@/components/sections/ImageSlider'

// Posições fixas para partículas de luz
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
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Elementos de luz solar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Raios de sol principais */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Raios de sol adicionais */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-300" />
        
        {/* Partículas de luz */}
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
        
        {/* Feixes de luz */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-48 bg-linear-to-b from-blue-500/40 via-blue-500/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-0.5 h-36 bg-linear-to-b from-blue-500/30 via-blue-500/15 to-transparent rotate-12" />
        <div className="absolute top-0 left-1/4 w-0.5 h-36 bg-linear-to-b from-blue-500/30 via-blue-500/15 to-transparent -rotate-12" />
        
        {/* Reflexos nos cantos */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-blue-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-blue-500/10 to-transparent" />
      </div>

      {/* Hero Section - já deve ter seu próprio estilo, mas vamos garantir que combine */}
      <div className="relative z-10">
        <Hero />
      </div>
      
      {/* Seção de Produtos em Destaque */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          {/* Título com efeito solar */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="absolute -inset-4 bg-blue-500/20 blur-2xl animate-pulse" />
              <h2 className="relative text-3xl lg:text-4xl font-display font-bold text-white flex items-center justify-center gap-3">
                <Sparkles className="text-blue-400" size={32} />
                Produtos em Destaque
                <Sparkles className="text-blue-400" size={32} />
              </h2>
            </div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Os produtos mais brilhantes da nossa coleção, selecionados especialmente para você
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Seção de Categorias */}
      <section className="relative z-10 py-16 bg-linear-to-b from-transparent via-blue-500/5 to-transparent">
        <div className="container mx-auto px-4">
          {/* Título com efeito solar */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <div className="absolute -inset-4 bg-blue-500/20 blur-2xl animate-pulse delay-300" />
              <h2 className="relative text-3xl lg:text-4xl font-display font-bold text-white flex items-center justify-center gap-3">
                <Sun className="text-blue-400" size={32} />
                Categorias
                <Sun className="text-blue-400" size={32} />
              </h2>
            </div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Navegue por nossas categorias e encontre o produto perfeito para iluminar seu dia
            </p>
          </div>

          <Suspense fallback={<CategoriesSkeleton />}>
            <Categories />
          </Suspense>
        </div>
      </section>
 {/* Image Slider */}
      <div className="relative z-10">
        <ImageSlider />
      </div>
      {/* Newsletter */}
      <div className="relative z-10">
        <Newsletter />
      </div>
     
    </div>
  )
}

// Skeletons com tema solar
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div 
          key={i} 
          className="relative group bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20"
        >
          {/* Efeito de brilho no hover */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative">
            <Skeleton className="w-full h-48 mb-4 bg-gray-800" />
            <Skeleton className="w-3/4 h-6 mb-2 bg-gray-800" />
            <Skeleton className="w-1/2 h-4 mb-4 bg-gray-800" />
            
            {/* Botão esqueleto com tema solar */}
            <div className="w-full h-10 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="relative group">
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
          <Skeleton 
            className="relative h-32 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-blue-500/10" 
          />
        </div>
      ))}
    </div>
  )
}