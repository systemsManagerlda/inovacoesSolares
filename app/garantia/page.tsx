'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Sun, 
  Shield, 
  Package, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  FileText,
  Zap,
  Sparkles,
  Award,
  Wrench,
  Truck,
  ClipboardCheck,
  Timer,
  Headphones
} from 'lucide-react'

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

// Produtos e suas garantias
const productWarranties = [
  { 
    name: 'Painéis Solares', 
    icon: Sun, 
    warranty: '5 anos', 
    description: 'Garantia contra defeitos de fabricação',
    extended: 'Garantia de desempenho de 25 anos',
    coverage: ['Defeitos de fabricação', 'Células quebradas', 'Problemas de conexão']
  },
  { 
    name: 'Inversores', 
    icon: Zap, 
    warranty: '3 anos', 
    description: 'Garantia total contra defeitos',
    extended: 'Pode ser estendida para 5 anos mediante contrato',
    coverage: ['Defeitos eletrônicos', 'Problemas de software', 'Falhas de componentes']
  },
  { 
    name: 'Baterias (LiFePO4)', 
    icon: Package, 
    warranty: '2 anos', 
    description: 'Garantia contra defeitos de fabricação',
    extended: 'Ciclo de vida garantido de 2.000 ciclos',
    coverage: ['Defeitos de células', 'Problemas de BMS', 'Vazamento']
  },
  { 
    name: 'Controladores de Carga', 
    icon: Shield, 
    warranty: '2 anos', 
    description: 'Garantia contra defeitos',
    extended: null,
    coverage: ['Falhas de carregamento', 'Problemas de display', 'Defeitos eletrônicos']
  },
  { 
    name: 'Iluminação Solar', 
    icon: Sparkles, 
    warranty: '1 ano', 
    description: 'Garantia contra defeitos',
    extended: null,
    coverage: ['LEDs queimados', 'Problemas de bateria', 'Sensor de movimento']
  },
  { 
    name: 'Acessórios', 
    icon: Wrench, 
    warranty: '6 meses', 
    description: 'Garantia contra defeitos',
    extended: null,
    coverage: ['Cabos', 'Conectores', 'Suportes']
  },
]

// Cobertura da garantia
const warrantyCoverage = [
  { title: 'Coberto pela garantia', items: [
    'Defeitos de fabricação',
    'Componentes que apresentem mau funcionamento',
    'Células solares com quebra ou falha',
    'Problemas de conexão ou solda',
    'Falhas eletrônicas internas'
  ]},
  { title: 'NÃO coberto pela garantia', items: [
    'Danos causados por instalação incorreta',
    'Danos causados por mau uso ou acidentes',
    'Danos causados por fenômenos naturais (raios, enchentes, etc.)',
    'Desgaste natural do produto',
    'Produtos com sinais de violação ou reparo não autorizado',
    'Danos causados por sobretensão ou curto-circuito externo'
  ]}
]

// Perguntas frequentes sobre garantia
const warrantyFaqs = [
  {
    question: 'Como acionar a garantia?',
    answer: 'Entre em contato com nosso suporte pelo e-mail garantia@inovacoessolares.co.mz ou telefone (+258) 84 123 4567. Tenha em mãos a nota fiscal e o número do pedido.'
  },
  {
    question: 'O que fazer se o produto apresentar defeito?',
    answer: 'Registre o problema com fotos ou vídeos e entre em contato imediatamente. Nossa equipe fará a análise e orientará sobre os próximos passos.'
  },
  {
    question: 'Como funciona o processo de troca?',
    answer: 'Após a análise e aprovação, enviaremos uma etiqueta de frete grátis para devolução. O produto será substituído por um novo ou reparado conforme o caso.'
  },
  {
    question: 'A garantia cobre mão de obra?',
    answer: 'Sim, a garantia cobre a mão de obra para reparos e a substituição do produto quando necessário.'
  },
  {
    question: 'Preciso registrar o produto?',
    answer: 'Recomendamos registrar seu produto em nosso site para agilizar futuros atendimentos. O registro é simples e gratuito.'
  }
]

export default function GarantiaPage() {
  const [activeProduct, setActiveProduct] = useState('Painéis Solares')
  const [formData, setFormData] = useState({
    productName: '',
    serialNumber: '',
    purchaseDate: '',
    orderNumber: '',
    name: '',
    email: '',
    phone: '',
    description: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Registro de garantia:', formData)
    setIsSubmitting(false)
    setSubmitted(true)
    
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        productName: '',
        serialNumber: '',
        purchaseDate: '',
        orderNumber: '',
        name: '',
        email: '',
        phone: '',
        description: ''
      })
    }, 5000)
  }

  const selectedProduct = productWarranties.find(p => p.name === activeProduct)

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
              Garantia
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
              <Shield size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Garantia dos Produtos
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Conheça os prazos e condições de garantia dos nossos produtos solares. Qualidade e segurança garantidas.
          </p>
        </div>

        {/* Resumo Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Até 5 anos</h3>
              <p className="text-gray-400 text-sm">Garantia contra defeitos de fabricação</p>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Timer size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">25 anos</h3>
              <p className="text-gray-400 text-sm">Garantia de desempenho dos painéis</p>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Truck size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Frete Grátis</h3>
              <p className="text-gray-400 text-sm">Para produtos com defeito de fabricação</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabela de Garantias por Produto */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield size={22} className="text-blue-400" />
                    Garantia por Produto
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Prazos e coberturas específicos para cada tipo de produto
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productWarranties.map((product, index) => {
                      const Icon = product.icon
                      const isActive = activeProduct === product.name
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveProduct(product.name)}
                          className={`p-4 rounded-xl text-left transition-all duration-300 ${
                            isActive
                              ? 'bg-linear-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/50'
                              : 'bg-gray-800/30 border border-blue-500/20 hover:border-blue-400/40'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon size={20} className={isActive ? 'text-blue-400' : 'text-gray-500'} />
                            <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                              {product.name}
                            </h3>
                          </div>
                          <p className="text-2xl font-bold text-blue-400">{product.warranty}</p>
                          <p className="text-xs text-gray-500 mt-1">{product.description}</p>
                        </button>
                      )
                    })}
                  </div>

                  {selectedProduct && (
                    <div className="mt-6 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        {(() => {
                          const Icon = selectedProduct.icon
                          return <Icon size={20} className="text-blue-400" />
                        })()}
                        <h3 className="font-semibold text-white">{selectedProduct.name}</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Cobertura:</p>
                          <ul className="space-y-1">
                            {selectedProduct.coverage.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {selectedProduct.extended && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">Garantia Estendida:</p>
                            <div className="bg-blue-500/10 rounded-lg p-3">
                              <p className="text-sm text-blue-400">{selectedProduct.extended}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cobertura da Garantia */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ClipboardCheck size={22} className="text-blue-400" />
                    Cobertura da Garantia
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {warrantyCoverage.map((section, index) => (
                      <div key={index}>
                        <h3 className={`font-semibold mb-3 ${index === 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                              {index === 0 ? (
                                <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                              )}
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Garantia */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Headphones size={22} className="text-blue-400" />
                    Perguntas Frequentes sobre Garantia
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {warrantyFaqs.map((faq, index) => (
                      <div key={index} className="border-b border-blue-500/10 last:border-0 pb-3 last:pb-0">
                        <h3 className="font-semibold text-white mb-1">{faq.question}</h3>
                        <p className="text-gray-400 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registro de Garantia */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-400" />
                  Registrar Garantia
                </h3>

                {submitted ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Registro Concluído!</p>
                    <p className="text-gray-400 text-sm mt-1">Seu produto foi registrado com sucesso.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Produto *
                      </label>
                      <select
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 text-sm"
                      >
                        <option value="">Selecione</option>
                        {productWarranties.map(p => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Número de Série *
                      </label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="Encontrado na etiqueta do produto"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Data da Compra *
                      </label>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Número do Pedido *
                      </label>
                      <input
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: SOL-123456"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="84 123 4567"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Registrando...' : 'Registrar Garantia'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Atendimento */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-blue-400" />
                  Acionar Garantia
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-blue-400" />
                    <span className="text-gray-300">(+258) 84 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-blue-400" />
                    <span className="text-gray-300">garantia@inovacoessolares.co.mz</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-gray-300">Segunda a Sexta: 8h - 17h</span>
                  </div>
                </div>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Fale Conosco</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Documentos Necessários */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-blue-400" />
                  Documentos Necessários
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    Nota Fiscal de compra
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    Número de série do produto
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    Fotos ou vídeos do defeito (se aplicável)
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    Documento de identificação do titular
                  </li>
                </ul>
              </div>
            </div>

            {/* Badge Solar */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-linear-to-r from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/30 p-6 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                  <Sun size={48} className="relative text-blue-400 mx-auto animate-spin-slow" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Qualidade Solar</h3>
                <p className="text-gray-400 text-sm">
                  Todos os nossos produtos são certificados e passam por rigoroso controle de qualidade.
                </p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-xs text-blue-400">Certificação Internacional</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links relacionados */}
        <div className="mt-12 pt-8 border-t border-blue-500/20 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Confira também nossas outras políticas
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/entrega" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Política de Entrega
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/trocas" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Trocas e Devoluções
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/faq" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              FAQ - Perguntas Frequentes
            </Link>
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}