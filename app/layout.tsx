import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../context/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Inovações Solares - Energia Solar e Soluções Sustentáveis',
  description: 'Descubra soluções inovadoras em energia solar com tecnologia sustentável, eficiência energética e os melhores sistemas fotovoltaicos para sua casa ou empresa.',
  keywords: 'energia solar, painéis solares, sistemas fotovoltaicos, energia renovável, sustentabilidade, inversores solares, energia limpa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <CartDrawer />
            <main className="grow">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}