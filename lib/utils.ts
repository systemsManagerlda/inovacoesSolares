export function formatPrice(price?: string | number): string {
  const value = typeof price === 'string'
    ? parseFloat(price)
    : price ?? 0  // garante 0 se price for undefined
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  }).format(value)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function getStockStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    instock: { label: 'Em estoque', color: 'green' },
    outofstock: { label: 'Fora de estoque', color: 'red' },
    onbackorder: { label: 'Sob encomenda', color: 'yellow' }
  }

  return statusMap[status] || { label: 'Indisponível', color: 'gray' }
}