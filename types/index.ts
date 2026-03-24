export interface CartItem {
  id: number
  name: string
  price: string
  slug: string
  image: string
  quantity: number
  stock_status?: string
}

export interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  total: number
  itemCount: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addItem: (product: any, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

export interface WooProduct {
  date_created: string | number | Date
  id: number
  name: string
  slug: string
  permalink: string
  price: string
  regular_price: string
  sale_price: string
  description: string
  short_description: string
  images: Array<{
    id: number
    src: string
    alt: string
  }>
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  average_rating: string
  review_count: number
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  on_sale: boolean
  featured: boolean
  sku: string
}

export interface WooCategory {
  id: number
  name: string
  slug: string
  description: string
  count: number
  image?: {
    src: string
  }
}

export interface WooProductAttribute {
  id?: number
  name: string
  slug?: string
  options: string[]
}

export interface WooProductReview {
  id: number
  reviewer: string
  reviewer_email?: string
  review: string
  rating: number
  date_created: string
}