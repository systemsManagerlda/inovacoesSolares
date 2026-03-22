'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Sun, 
  Zap, 
  HelpCircle,
  Truck,
  CreditCard,
  RefreshCw,
  Shield,
  Package,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Search} from 'lucide-react'

// Posições fixas para as partículas de luz
const lightParticles = [
  { top: 10, left: 15, delay: 0.5, duration: 3.5 },
  { top: 25, left: 80, delay: 1.2, duration: 4.0 },
  { top: 45, left: 30, delay: 0.8, duration: 3.0 },
  { top: 60, left: 70, delay: 1.5, duration: 4.5 },
  { top: 75, left: 20, delay: 0.3, duration: 3.2 },
  { top: 85, left: 90, delay: 1.8, duration: 3.8 },
  { top: 15, left: 45, delay: 0.9, duration: 4.2 },
  { top: 35, left: 60, delay: 1.1, duration: 3.3 },
  { top: 55, left: 10, delay: 0.6, duration: 3.9 },
  { top: 95, left: 50, delay: 1.4, duration: 4.1 },
]

// Categorias de FAQ
const categories = [
  { id: 'all', name: 'Todas', icon: HelpCircle },
  { id: 'orders', name: 'Pedidos', icon: Package },
  { id: 'shipping', name: 'Entregas', icon: Truck },
  { id: 'payments', name: 'Pagamentos', icon: CreditCard },
  { id: 'returns', name: 'Trocas e Devoluções', icon: RefreshCw },
  { id: 'products', name: 'Produtos', icon: Zap },
  { id: 'security', name: 'Segurança', icon: Shield },
]

// Dados das perguntas frequentes
const faqsData = [
  // Pedidos
  {
    id: 1,
    category: 'orders',
    question: 'Como faço para acompanhar o meu pedido?',
    answer: 'Após a confirmação do pagamento, você receberá um e-mail com o código de rastreamento. Também pode acompanhar o pedido na sua conta, na seção "Meus Pedidos". O prazo de entrega varia de acordo com a província de destino.'
  },
  {
    id: 2,
    category: 'orders',
    question: 'Posso alterar ou cancelar um pedido já realizado?',
    answer: 'Sim, você pode solicitar alteração ou cancelamento dentro de até 1 hora após a confirmação do pedido. Para solicitações após este período, entre em contato com nosso suporte. Pedidos já faturados ou em transporte não podem ser cancelados.'
  },
  {
    id: 3,
    category: 'orders',
    question: 'O que fazer se o meu pedido não foi entregue?',
    answer: 'Verifique o código de rastreamento para confirmar a situação da entrega. Se o prazo já tiver expirado, entre em contato com nossa central de atendimento pelo e-mail suporte@inovacoessolares.co.mz ou pelo telefone (84) 123-4567.'
  },
  
  // Entregas
  {
    id: 4,
    category: 'shipping',
    question: 'Quais são os prazos de entrega para Moçambique?',
    answer: 'Os prazos variam por província: Maputo Cidade e Província: 2-3 dias úteis; Gaza, Inhambane, Manica, Sofala: 3-5 dias úteis; Tete, Zambézia: 4-6 dias úteis; Nampula, Niassa, Cabo Delgado: 5-8 dias úteis.'
  },
  {
    id: 5,
    category: 'shipping',
    question: 'O frete é grátis?',
    answer: 'Sim, oferecemos frete grátis para todo o país em compras acima de 7.500 MZN. Para compras abaixo deste valor, o frete é calculado com base na província de destino e peso do produto.'
  },
  {
    id: 6,
    category: 'shipping',
    question: 'Como é feita a entrega dos produtos?',
    answer: 'As entregas são realizadas por transportadoras parceiras. Você será notificado por telefone ou SMS no dia da entrega. É importante fornecer um endereço completo com ponto de referência para facilitar a localização.'
  },
  
  // Pagamentos
  {
    id: 7,
    category: 'payments',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos os seguintes métodos de pagamento: Cartão de Crédito (Visa, Mastercard, American Express), M-Pesa, Pagamento na Entrega (dinheiro), Transferência Bancária e Boleto (apenas para clientes no Brasil).'
  },
  {
    id: 8,
    category: 'payments',
    question: 'Como funciona o pagamento via M-Pesa?',
    answer: 'Após finalizar o pedido, você receberá uma notificação com as instruções para pagamento via M-Pesa. O valor será debitado da sua conta e você receberá uma confirmação imediata. O pedido só será processado após a confirmação do pagamento.'
  },
  {
    id: 9,
    category: 'payments',
    question: 'Posso parcelar minhas compras no cartão de crédito?',
    answer: 'Sim, oferecemos parcelamento em até 6x sem juros no cartão de crédito para compras acima de 1.500 MZN. Consulte as condições no momento da finalização do pedido.'
  },
  
  // Trocas e Devoluções
  {
    id: 10,
    category: 'returns',
    question: 'Qual é a política de troca e devolução?',
    answer: 'Você tem até 30 dias corridos após o recebimento do produto para solicitar troca ou devolução. O produto deve estar em perfeitas condições, sem sinais de uso, na embalagem original e com todos os acessórios. Entre em contato com nosso suporte para iniciar o processo.'
  },
  {
    id: 11,
    category: 'returns',
    question: 'O produto veio com defeito, o que fazer?',
    answer: 'Se o produto apresentar defeito de fabricação, entre em contato conosco imediatamente. Envie fotos do produto e da nota fiscal para suporte@inovacoessolares.co.mz. Analisaremos o caso e providenciaremos a troca sem custos adicionais.'
  },
  {
    id: 12,
    category: 'returns',
    question: 'Como funciona a garantia dos produtos solares?',
    answer: 'Nossos produtos possuem garantia variável conforme o fabricante: Painéis Solares: 5 anos de garantia; Inversores: 3 anos; Baterias: 2 anos. A garantia cobre defeitos de fabricação e não cobre danos causados por uso inadequado ou instalação incorreta.'
  },
  
  // Produtos
  {
    id: 13,
    category: 'products',
    question: 'Como escolher o kit solar ideal para minha residência?',
    answer: 'O tamanho do kit depende do seu consumo de energia. Recomendamos consultar nossa calculadora solar ou entrar em contato com nossos especialistas. Eles analisarão sua conta de luz e indicarão a melhor solução para suas necessidades.'
  },
  {
    id: 14,
    category: 'products',
    question: 'Preciso de autorização para instalar energia solar em casa?',
    answer: 'Sim, é necessário solicitar autorização à EDM (Electricidade de Moçambique) para conexão à rede. Nossa equipe pode auxiliar no processo de documentação e instalação conforme as normas técnicas vigentes.'
  },
  {
    id: 15,
    category: 'products',
    question: 'Os produtos solares funcionam em dias nublados?',
    answer: 'Sim, os sistemas solares continuam gerando energia em dias nublados, embora com eficiência reduzida (cerca de 30-50% da capacidade máxima). Para garantir fornecimento contínuo, recomendamos sistemas com baterias de armazenamento.'
  },
  
  // Segurança
  {
    id: 16,
    category: 'security',
    question: 'Meus dados estão seguros na loja?',
    answer: 'Sim, utilizamos criptografia SSL (Secure Socket Layer) para proteger todas as informações transmitidas. Seus dados de pagamento são processados por gateways seguros e nunca são armazenados em nossos servidores.'
  },
  {
    id: 17,
    category: 'security',
    question: 'Como sei que o produto é original?',
    answer: 'Todos os nossos produtos são adquiridos diretamente de fabricantes autorizados. Fornecemos certificado de garantia e nota fiscal de compra. Caso tenha dúvidas, entre em contato com nosso suporte para verificar a autenticidade do produto.'
  }
]


export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredFaqs = faqsData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Contagem por categoria
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return faqsData.length
    return faqsData.filter(faq => faq.category === categoryId).length
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden mt-20">
      {/* Elementos de luz solar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-300" />
        
        {lightParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-[2px] animate-ping"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
        
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-48 bg-linear-to-b from-blue-500/40 via-blue-500/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-0.5 h-36 bg-linear-to-b from-blue-500/30 via-blue-500/15 to-transparent rotate-12" />
        <div className="absolute top-0 left-1/3 w-0.5 h-36 bg-linear-to-b from-blue-500/30 via-blue-500/15 to-transparent -rotate-12" />
      </div>

      {/* Breadcrumb */}
      <nav className="relative border-b border-blue-500/20 bg-black/80 backdrop-blur-sm" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <Sun size={14} className="text-blue-400/50" />
                Home
              </Link>
            </li>
            <ChevronRight size={16} className="text-blue-600/50" />
            <li className="text-blue-400/90 font-medium">
              FAQ - Perguntas Frequentes
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-4">
            <div className="absolute -inset-4 bg-blue-500/20 blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <HelpCircle size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Perguntas Frequentes
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar perguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            const count = getCategoryCount(category.id)
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-linear-to-r from-blue-500 to-blue-600 text-black shadow-lg shadow-blue-500/20'
                    : 'bg-gray-900/50 border border-blue-500/30 text-gray-400 hover:text-blue-400 hover:border-blue-400/50'
                }`}
              >
                <Icon size={16} />
                <span>{category.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-black/30 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse" />
                <HelpCircle size={64} className="relative text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg">Nenhuma pergunta encontrada.</p>
              <p className="text-gray-500 mt-2">Tente usar outros termos de busca.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openItems.includes(faq.id)
                
                return (
                  <div
                    key={faq.id}
                    className="relative group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity ${isOpen ? 'opacity-100' : ''}`} />
                    <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-blue-500/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                            <HelpCircle size={16} className="text-blue-400" />
                          </div>
                          <h3 className="text-lg font-medium text-white">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="shrink-0">
                          {isOpen ? (
                            <ChevronUp size={20} className="text-blue-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                          )}
                        </div>
                      </button>
                      
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-5 pt-0 border-t border-blue-500/20">
                          <p className="text-gray-400 leading-relaxed ml-11">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-linear-to-r from-gray-900 to-black rounded-2xl p-8 border border-blue-500/20 text-center">
              <div className="relative w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ainda tem dúvidas?
              </h3>
              <p className="text-gray-400 mb-6">
                Nossa equipe está pronta para ajudar você!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
                >
                  <Mail size={18} />
                  Fale Conosco
                </Link>
                <a
                  href="tel:+258841234567"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 hover:border-blue-400/50 transition-all"
                >
                  <Phone size={18} />
                  (84) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

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

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}