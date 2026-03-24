/* eslint-disable react-hooks/immutability */
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Sun, Sparkles, Zap, Eye, Pause, Play, X, ZoomIn, ZoomOut } from 'lucide-react'

interface Slide {
  id: number
  image: string
  title: string
  alt?: string
}

interface ImageSliderProps {
  slides?: Slide[]
  autoPlay?: boolean
  interval?: number
  slidesPerView?: number
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: '/captacao/Sistema 2kw  1-Bateria.jpg',
    title: 'Sistema 2kw  1 Bateria',
    alt: 'Painéis Solares de Alta Eficiência'
  },
  {
    id: 2,
    image: '/captacao/Sistema 2kw Bateria 5kw.jpg',
    title: 'Sistema 2kw 1 Bateria 5kw',
    alt: 'Inversores de Última Geração'
  },
  {
    id: 3,
    image: '/captacao/Sistema 3kw  2-Bateria de lithium 5kw.jpg',
    title: 'Sistema 3kw  2 Bateria de Lithium 5kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 4,
    image: '/captacao/Sistema 3kw  2-Bateria de lithium.jpg',
    title: 'Sistema 3kw  2 Bateria de Lithium',
    alt: 'Baterias de Lítio'
  },
  {
    id: 5,
    image: '/captacao/Sistema 5kw Bateria 5kw.jpg',
    title: 'Sistema 5kw Bateria 5kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 6,
    image: '/captacao/Sistema 5kw Bateria 10kw.jpg',
    title: 'Sistema 5kw Bateria 10kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 7,
    image: '/captacao/Sistema 5kw Bateria 20kw.jpg',
    title: 'Sistema 5kw Bateria 20kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 8,
    image: '/captacao/Sistema 5kw Inversor DEYE Bateria 5kw.jpg',
    title: 'Sistema 5kw Inversor DEYE Bateria 5kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 8,
    image: '/captacao/Sistema 5kw Inversor DEYE Bateria 10kw.jpg',
    title: 'Sistema 5kw Inversor DEYE Bateria 10kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 9,
    image: '/captacao/Sistema 5kw Inversor DEYE Bateria 20kw.jpg',
    title: 'Sistema 5kw Inversor DEYE Bateria 20kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 10,
    image: '/captacao/Sistema 10kw 1 bateria.jpg',
    title: 'Sistema 10kw 1 Bateria',
    alt: 'Baterias de Lítio'
  },
  {
    id: 11,
    image: '/captacao/Sistema 10kw Bateria 10kw.jpg',
    title: 'Sistema 10kw 1 Bateria',
    alt: 'Baterias de Lítio'
  },
  {
    id: 12,
    image: '/captacao/Sistema 10kw Bateria 20kw.jpg',
    title: 'Sistema 20kw 1 Bateria',
    alt: 'Baterias de Lítio'
  },
  {
    id: 13,
    image: '/captacao/Sistema 10kw.jpg',
    title: 'Sistema 10kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 14,
    image: '/captacao/Sistema 12kw 2-Baterias 20kw.jpg',
    title: 'Sistema 12kw 2-Baterias 20kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 15,
    image: '/captacao/Sistema 12kw.jpg',
    title: 'Sistema 12kw',
    alt: 'Baterias de Lítio'
  },
  {
    id: 16,
    image: '/captacao/Sistema 20kw HV.jpg',
    title: 'Sistema 20kw HV',
    alt: 'Baterias de Lítio'
  },
  {
    id: 17,
    image: '/captacao/Sistema 20kw LV.jpg',
    title: 'Sistema 20kw LV',
    alt: 'Baterias de Lítio'
  },
  {
    id: 18,
    image: '/captacao/Sistema 30kw HV.jpg',
    title: 'Sistema 30kw HV',
    alt: 'Baterias de Lítio'
  },
  {
    id: 19,
    image: '/captacao/Sistema 50kw HV.jpg',
    title: 'Sistema 50kw HV',
    alt: 'Baterias de Lítio'
  },
  {
    id: 20,
    image: '/captacao/Sistema de captação de água solar 210w DC.jpg',
    title: 'Sistema de captação de água solar 210w DC',
    alt: 'Baterias de Lítio'
  },
  {
    id: 21,
    image: '/captacao/Sistema de captação de água solar 500w.jpg',
    title: 'Sistema de captação de água solar 500w',
    alt: 'Baterias de Lítio'
  },
  {
    id: 22,
    image: '/captacao/Sistema de captação de água solar 750w AC DC.jpg',
    title: 'Sistema de captação de água solar 750w AC DC',
    alt: 'Baterias de Lítio'
  },
  {
    id: 23,
    image: '/captacao/Sistema de captação de água solar 750w DC.jpg',
    title: 'Sistema de captação de água solar 750w DC',
    alt: 'Baterias de Lítio'
  },
  {
    id: 24,
    image: '/captacao/Sistema de captação de água solar 1500w AC DC.jpg',
    title: 'Sistema de captação de água solar 1500w AC DC',
    alt: 'Baterias de Lítio'
  },
  {
    id: 25,
    image: '/captacao/Sistema de captação de água solar 1500w DC.jpg',
    title: 'Sistema de captação de água solar 1500w DC',
    alt: 'Baterias de Lítio'
  },
  {
    id: 26,
    image: '/captacao/Sistema de captação de água solar 2200w AC DC.jpg',
    title: 'Sistema de captação de água solar 2200w AC DC',
    alt: 'Baterias de Lítio'
  },
]

export default function ImageSlider({ 
  slides = defaultSlides, 
  autoPlay = true, 
  interval = 4000,
  slidesPerView = 3
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(slides.length).fill(false))
  const [selectedImage, setSelectedImage] = useState<Slide | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const totalSlides = slides.length
  const maxIndex = Math.max(0, totalSlides - slidesPerView)

  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, maxIndex])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const openModal = (slide: Slide) => {
    setSelectedImage(slide)
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedImage(null)
    setZoomLevel(1)
    setImagePosition({ x: 0, y: 0 })
    document.body.style.overflow = 'unset'
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1))
    if (zoomLevel <= 1.5) {
      setImagePosition({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Limites de arrasto
      const maxX = (zoomLevel - 1) * 150
      const maxY = (zoomLevel - 1) * 150
      
      setImagePosition({
        x: Math.min(Math.max(newX, -maxX), maxX),
        y: Math.min(Math.max(newY, -maxY), maxY)
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Fechar modal com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  // Auto-play
  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    
    if (isPlaying && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        if (currentIndex < maxIndex) {
          nextSlide()
        } else {
          setCurrentIndex(0)
        }
      }, interval)
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isPlaying, autoPlay, interval, currentIndex, maxIndex, nextSlide])

  // Scroll suave
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0]?.clientWidth || 0
      const gap = 16
      const scrollPosition = currentIndex * (slideWidth + gap)
      
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  return (
    <>
      <div className="relative py-8">
        {/* Elementos de luz decorativos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-blue-300/30 rounded-full blur-sm animate-ping" />
          <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full blur-sm animate-ping delay-300" />
        </div>

        {/* Header do slider */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Galeria Solar
            </h2>
            <p className="text-gray-400 text-sm">Clique nas imagens para ampliar</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={toggleAutoPlay}
              className="p-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 transition-all"
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0 || isAnimating}
              className="p-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex || isAnimating}
              className="p-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider horizontal */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scroll-smooth gap-4 pb-4 px-4 hide-scrollbar cursor-pointer"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => openModal(slide)}
              className="group relative flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)] animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative aspect-[4/3] bg-linear-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-blue-500/10 group-hover:border-blue-400/30 transition-all duration-300">
                {!imageLoaded[index] && (
                  <div className="absolute inset-0 bg-gray-800/50 animate-pulse" />
                )}
                
                <Image
                  src={slide.image}
                  alt={slide.alt || slide.title}
                  fill
                  className={`object-cover transition-all duration-700 ${
                    imageLoaded[index] ? 'opacity-70 group-hover:opacity-100' : 'opacity-0'
                  } group-hover:scale-110`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  quality={85}
                  onLoad={() => handleImageLoad(index)}
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {index % 3 === 0 ? (
                      <Sun className="text-blue-400" size={28} />
                    ) : index % 3 === 1 ? (
                      <Zap className="text-blue-400" size={28} />
                    ) : (
                      <Sparkles className="text-blue-400" size={28} />
                    )}
                  </div>

                  <h3 className="text-white font-semibold text-lg text-center px-2 group-hover:text-blue-400 transition-colors drop-shadow-lg">
                    {slide.title}
                  </h3>

                  <span className="text-xs text-gray-400 mt-2 group-hover:text-blue-400/80 transition-colors flex items-center gap-1">
                    <ZoomIn size={12} />
                    Clique para ampliar
                  </span>
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 bg-linear-to-br from-blue-500/20 to-blue-500/20 rounded-full border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn size={14} className="text-blue-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores */}
        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.min(8, maxIndex + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 ${
                  Math.abs(idx - currentIndex) < 1
                    ? 'w-6 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50'
                    : 'w-2 h-2 bg-white/30 rounded-full hover:bg-blue-400/50'
                }`}
                aria-label={`Ir para página ${idx + 1}`}
              />
            ))}
            {maxIndex >= 7 && (
              <span className="text-xs text-gray-500 ml-2">+{maxIndex - 7} mais</span>
            )}
          </div>
        )}
      </div>

      {/* Modal de zoom */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botões de controle */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-blue-500/50 transition-all disabled:opacity-50"
                aria-label="Diminuir zoom"
              >
                <ZoomOut size={20} />
              </button>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-blue-500/50 transition-all disabled:opacity-50"
                aria-label="Aumentar zoom"
              >
                <ZoomIn size={20} />
              </button>
              <button
                onClick={closeModal}
                className="p-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/50 transition-all"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Informação da imagem */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <p className="text-white text-sm">{selectedImage.title}</p>
            </div>

            {/* Imagem com zoom e arrasto */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.alt || selectedImage.title}
                  fill
                  className="object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                    cursor: zoomLevel > 1 ? 'grab' : 'default'
                  }}
                  quality={100}
                  priority
                />
              </div>
            </div>

            {/* Instruções */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-xs text-gray-400 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              {zoomLevel > 1 ? (
                <span>🖱️ Arraste para mover | 🔍 Role para zoom</span>
              ) : (
                <span>🔍 Clique nos botões para dar zoom</span>
              )}
            </div>
          </div>
        </div>
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
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}