'use client'

import { Truck, Shield, RefreshCw, Package } from 'lucide-react'

interface Benefit {
  icon: typeof Truck
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: Truck,
    title: 'Frete Grátis',
    description: 'Sudeste e Sul'
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Dados protegidos'
  },
  {
    icon: RefreshCw,
    title: '30 dias',
    description: 'para trocas'
  },
  {
    icon: Package,
    title: 'Entrega Rápida',
    description: 'em até 48h'
  }
]

interface ProductBenefitsProps {
  className?: string
}

export default function ProductBenefits({ className = '' }: ProductBenefitsProps) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {benefits.map((benefit, index) => (
        <div 
          key={index}
          className="text-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
        >
          <benefit.icon className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" size={24} />
          <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
          <p className="text-xs text-gray-500">{benefit.description}</p>
        </div>
      ))}
    </div>
  )
}