'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Button from '@/components/ui/Button'
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Carrinho Vazio</h1>
        <p className="text-gray-600 mb-8">
          Seu carrinho de compras está vazio.
        </p>
        <Link href="/">
          <Button>Continuar Comprando</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Carrinho de Compras</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm mb-4">
              <Link href={`/product/${item.slug}`} className="relative w-24 h-24 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </Link>
              
              <div className="grow">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-semibold hover:text-blue-600 mb-1">
                    {item.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-600 mb-2">
                  {formatPrice(item.price)}
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="text-right font-bold">
                {formatPrice(parseFloat(item.price) * item.quantity)}
              </div>
            </div>
          ))}
          
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mt-4">
            <ArrowLeft size={20} className="mr-2" />
            Continuar Comprando
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span className="text-green-600">Grátis</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>
            
            <Button className="w-full">
              Finalizar Compra
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Frete grátis para todo o Brasil
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}