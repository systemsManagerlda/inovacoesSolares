'use client'

import { ShoppingBag, Heart, Share2 } from 'lucide-react'

interface ProductActionsProps {
  stockStatus: string
  productId: number
  productName: string
  productPrice: string
}

export default function ProductActions({ 
  stockStatus, 
  productId, 
  productName, 
  productPrice 
}: ProductActionsProps) {
  
  const handleAddToCart = () => {
    // Implementar lógica do carrinho
    console.log('Adicionar ao carrinho:', { productId, productName, productPrice })
  }

  const handleFavorite = () => {
    // Implementar lógica de favoritos
    console.log('Favoritar:', { productId, productName })
  }

  const handleShare = () => {
    // Implementar lógica de compartilhamento
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Confira este produto: ${productName}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button 
        onClick={handleAddToCart}
        disabled={stockStatus === 'outofstock'}
        className="flex-1 group relative overflow-hidden bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold shadow-lg shadow-blue-500/20 px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
        <ShoppingBag size={20} className="relative z-10" />
        <span className="relative z-10">
          {stockStatus === 'outofstock' ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </span>
      </button>
      
      <button 
        onClick={handleFavorite}
        className="group border border-blue-500/30 hover:border-blue-400 text-gray-300 hover:text-blue-400 hover:bg-blue-500/10 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
      >
        <Heart size={20} className="group-hover:scale-110 transition-transform" />
        <span>Favoritar</span>
      </button>

      <button 
        onClick={handleShare}
        className="sm:w-auto border border-blue-500/30 hover:border-blue-400 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 px-4 py-3 rounded-lg flex items-center justify-center transition-all duration-300 group"
        aria-label="Compartilhar"
      >
        <Share2 size={20} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  )
}