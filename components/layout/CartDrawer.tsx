'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { X, Minus, Plus, Trash2, ShoppingBag, Sun, Zap, Sparkles } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop com efeito solar */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={toggleCart}
      />
      
      {/* Drawer com tema solar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-linear-to-b from-gray-900 to-black z-50 shadow-2xl shadow-blue-500/10 overflow-y-auto border-l border-blue-500/20">
        
        {/* Elementos de luz no drawer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-300/30 rounded-full blur-sm animate-ping" />
        </div>

        {/* Header com efeito solar */}
        <div className="relative p-4 border-b border-blue-500/20 top-0 bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-full" />
                <ShoppingBag size={24} className="relative text-blue-400" />
              </div>
              <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                Carrinho Solar
              </span>
            </h2>
            <button 
              onClick={toggleCart} 
              className="p-2 hover:bg-blue-500/10 rounded-full transition-colors group"
              aria-label="Fechar carrinho"
            >
              <X size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          {/* Badge de itens */}
          {items.length > 0 && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-sm" />
                <span className="relative bg-linear-to-r from-blue-500 to-blue-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'itens'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Cart Items */}
        <div className="p-4 relative">
          {items.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-block relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse" />
                <ShoppingBag size={64} className="relative text-blue-400/50" />
              </div>
              <p className="text-gray-400 mb-4">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-500 mb-6">
                Que tal iluminar seu dia com nossos produtos?
              </p>
              <button
                onClick={toggleCart}
                className="relative overflow-hidden group px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-black font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative z-10 flex items-center gap-2">
                  <Sun size={18} />
                  Continuar Comprando
                </span>
              </button>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="relative group/item bg-gray-800/30 border border-blue-500/10 rounded-xl p-3 hover:border-blue-400/30 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Efeito de brilho no hover */}
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    
                    <div className="relative flex gap-4">
                      {/* Imagem do produto */}
                      <div className="relative w-20 h-20 shrink-0 bg-gray-900 rounded-lg overflow-hidden border border-blue-500/20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      
                      {/* Detalhes do produto */}
                      <div className="grow">
                        <Link 
                          href={`/product/${item.slug}`} 
                          onClick={toggleCart}
                          className="group/link"
                        >
                          <h3 className="font-semibold text-white group-hover/link:text-blue-400 transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        
                        <div className="text-sm text-blue-400/80 mb-2">
                          {formatPrice(item.price)}
                        </div>
                        
                        {/* Controles de quantidade */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 bg-gray-800 hover:bg-blue-500/20 border border-blue-500/30 rounded transition-colors group/minus"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={16} className="text-gray-400 group-hover/minus:text-blue-400" />
                          </button>
                          
                          <span className="w-8 text-center text-white font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-gray-800 hover:bg-blue-500/20 border border-blue-500/30 rounded transition-colors group/plus"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={16} className="text-gray-400 group-hover/plus:text-blue-400" />
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors group/trash"
                            aria-label="Remover item"
                          >
                            <Trash2 size={16} className="group-hover/trash:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Resumo do pedido */}
              <div className="mt-6 space-y-4">
                {/* Subtotais */}
                <div className="bg-gray-800/30 border border-blue-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frete</span>
                    <span className="text-green-400">Grátis</span>
                  </div>
                  <div className="border-t border-blue-500/20 my-2 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge de economia */}
                {total > 500 && (
                  <div className="flex items-center gap-2 p-3 bg-linear-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Zap size={18} className="text-blue-400" />
                    <span className="text-sm text-gray-300">
                      Você ganhou <span className="text-blue-400 font-bold">frete grátis</span>!
                    </span>
                  </div>
                )}
                
                {/* Botão de finalizar compra */}
                <Link href="/checkout" onClick={toggleCart}>
                  <button className="relative overflow-hidden group w-full py-4 bg-linear-to-r from-blue-500 to-blue-600 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20">
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles size={18} />
                      Finalizar Compra
                    </span>
                  </button>
                </Link>

                {/* Link para continuar comprando */}
                <button
                  onClick={toggleCart}
                  className="w-full text-center text-sm text-gray-500 hover:text-blue-400 transition-colors py-2"
                >
                  Continuar comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </>
  )
}