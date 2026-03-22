/* eslint-disable @typescript-eslint/no-unused-vars */
// ProductsContent.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { WooProduct } from '@/types'

// (adicione aqui apenas a lógica que precisa de useSearchParams e useState, useEffect)

export default function ProductsContent() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    search: searchParams.get('busca') || '',
    category: searchParams.get('categoria') || 'all',
  })

  // restante da lógica: fetchProducts, handleFilterChange, filteredProducts etc.
}