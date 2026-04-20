'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Sun } from 'lucide-react'

interface Slide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  link: string
  badge?: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Tecnologia de Ponta',
    subtitle: 'Inovação em Energia Solar',
    description: 'Soluções completas em energia solar para residências, empresas e projetos industriais de grande porte',
    image: '/images/hero1.jpg',
    cta: 'Conferir Ofertas',
    link: '/produtos',
    badge: '✨ Novidade Solar'
  },
  {
    id: 2,
    title: 'Ofertas Imperdíveis',
    subtitle: 'Economize Agora',
    description: 'Aproveite condições especiais com até 40% de desconto em produtos selecionados',
    image: '/images/hero2.jpg',
    cta: 'Aproveitar Ofertas',
    link: '/produtos',
    badge: '⚡ Oferta Relâmpago'
  },
  {
    id: 3,
    title: 'Painéis Solares de Alta Eficiência',
    subtitle: 'Máxima Performance',
    description: 'Descubra nossa linha premium de painéis solares monocristalinos com eficiência superior e garantia estendida',
    image: '/images/hero3.jpg',
    cta: 'Ver Produtos',
    link: '/produtos',
    badge: '🌟 Linha Premium'
  },
  {
    id: 4,
    title: 'Baterias e Armazenamento',
    subtitle: 'Independência Energética',
    description: 'Sistemas de armazenamento LiFePO4 para residências e empresas, garantindo energia limpa 24/7',
    image: '/images/hero4.jpg',
    cta: 'Conhecer Soluções',
    link: '/produtos',
    badge: '🔋 Tecnologia Avançada'
  },
  {
    id: 5,
    title: 'Kits Solares Residenciais',
    subtitle: 'Solução Completa',
    description: 'Kits prontos para instalação com painéis, inversores e controladores de carga de última geração',
    image: '/images/hero5.jpg',
    cta: 'Ver Kits',
    link: '/produtos',
    badge: '🏠 Recomendado'
  },
  {
    id: 6,
    title: 'Instalação Profissional',
    subtitle: 'Serviço Especializado',
    description: 'Equipe certificada para instalação de sistemas solares com qualidade e segurança garantidas',
    image: '/images/hero6.jpg',
    cta: 'Agendar Visita',
    link: '/produtos',
    badge: '👨‍🔧 Profissional'
  },
  {
  id: 7,
  title: 'Instalação de Sistemas Elétricos',
  subtitle: 'Montagem e Configuração',
  description: 'Equipe técnica especializada realizando montagem e configuração de quadros elétricos com segurança, precisão e padrões profissionais',
  image: '/images/hero7.jpeg',
  cta: 'Solicitar Serviço',
  link: '#',
  badge: '⚡ Técnico'
},
{
  id: 8,
  title: 'Energia Solar Industrial',
  subtitle: 'Eficiência e Sustentabilidade',
  description: 'Sistema de painéis solares instalado em ambiente industrial, garantindo redução de custos energéticos e maior sustentabilidade',
  image: '/images/hero8.jpeg',
  cta: 'Solicitar Orçamento',
  link: '#',
  badge: '☀️ Sustentável'
}
]

// Posições fixas para partículas de luz
const lightParticles = [
  { top: 20, left: 30, delay: 0.5, duration: 3.5 },
  { top: 50, left: 70, delay: 1.2, duration: 4.0 },
  { top: 80, left: 40, delay: 0.8, duration: 3.0 },
  { top: 30, left: 80, delay: 1.5, duration: 4.5 },
  { top: 60, left: 20, delay: 0.3, duration: 3.2 },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(true)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, nextSlide])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <section 
      className="relative h-[85vh] min-h-150 max-h-225 w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Destaques"
      aria-roledescription="Carrossel"
    >
      {/* Elementos de luz solar fixos */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Raios de sol principais */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Partículas de luz */}
        {lightParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-300/40 rounded-full blur-[3px] animate-ping"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
        
        {/* Feixes de luz */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.75 h-64 bg-linear-to-b from-blue-500/30 via-blue-500/10 to-transparent" />
        <div className="absolute top-0 right-1/4 w-0.5 h-48 bg-linear-to-b from-blue-500/20 via-blue-500/5 to-transparent rotate-12" />
        <div className="absolute top-0 left-1/4 w-0.5 h-48 bg-linear-to-b from-blue-500/20 via-blue-500/5 to-transparent -rotate-12" />
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105 pointer-events-none'
          }`}
          aria-hidden={index !== currentSlide}
          role="group"
          aria-roledescription="Slide"
          aria-label={`${index + 1} de ${slides.length}: ${slide.title}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt=""
              fill
              className={`object-cover transition-transform duration-10000 ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              }`}
              priority={index === 0}
              quality={90}
              sizes="100vw"
              aria-hidden="true"
            />
          </div>

          {/* Overlay com gradiente solar */}
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Efeito de brilho solar no slide ativo */}
          {index === currentSlide && (
            <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none" />
          )}

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl text-white">
                {/* Badge com tema solar */}
                {slide.badge && (
                  <div className="inline-block mb-4 relative">
                    <div className="absolute inset-0 bg-blue-500/30 blur-xl animate-pulse" />
                    <span className="relative flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-linear-to-r from-blue-500/20 to-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300">
                      {slide.badge.includes('✨') || slide.badge.includes('⚡') || slide.badge.includes('🌟') 
                        ? slide.badge 
                        : <><Sun size={14} className="mr-1" />{slide.badge}</>}
                    </span>
                  </div>
                )}

                {/* Subtitle */}
                <span className="block text-sm sm:text-base font-semibold uppercase tracking-[0.2em] text-blue-400/90 mb-3 animate-fade-in-up animation-delay-200 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  {slide.subtitle}
                </span>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 animate-fade-in-up animation-delay-400">
                  <span className="text-white">{slide.title}</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-xl animate-fade-in-up animation-delay-600">
                  {slide.description}
                </p>

                {/* CTA Button com tema solar */}
                <Link 
                  href={slide.link}
                  className="inline-flex items-center group animate-fade-in-up animation-delay-800"
                  aria-label={`${slide.cta} - ${slide.title}`}
                >
                  <span className="relative inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold rounded-lg transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-blue-500/30 overflow-hidden">
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative z-10 flex items-center gap-2">
                      {slide.cta}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows com tema solar */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-blue-400 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 border border-blue-500/30"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-blue-400 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-400/50 border border-blue-500/30"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators com tema solar */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group focus:outline-none"
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          >
            <span
              className={`block h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 sm:w-12 bg-linear-to-r from-blue-400 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : 'w-2 sm:w-2.5 bg-blue-400/30 group-hover:bg-blue-400/50 group-hover:w-4'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Counter com tema solar */}
      <div className="absolute bottom-6 right-6 z-30 lg:hidden">
        <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-blue-400 border border-blue-500/30">
          {String(currentSlide + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Pause/Play Indicator com tema solar */}
      <div className="absolute top-6 right-6 z-30 hidden sm:block">
        <span className="flex items-center gap-1 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-blue-400/80 border border-blue-500/30">
          <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'}`} />
          {isAutoPlaying ? 'Auto' : 'Pausado'}
        </span>
      </div>

      {/* Ícone solar decorativo */}
      <div className="absolute top-6 left-6 z-30">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-xl animate-pulse" />
          <Sun className="relative text-blue-400 animate-spin-slow" size={32} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .duration-10000 {
          transition-duration: 10000ms;
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
    </section>
  )
}