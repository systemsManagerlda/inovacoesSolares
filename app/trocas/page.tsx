'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Sun, 
  RefreshCw, 
  Calendar, 
  Package, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  Shield,
  FileText,
  Zap,
  Sparkles,
  MessageCircle,
  ArrowRight
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

// Tipos de solicitação
const requestTypes = [
  { id: 'exchange', label: 'Troca por outro produto', icon: RefreshCw },
  { id: 'return', label: 'Devolução e reembolso', icon: Package },
  { id: 'defect', label: 'Produto com defeito', icon: AlertCircle },
]

export default function TrocasPage() {
  const [activeTab, setActiveTab] = useState('exchange')
  const [formData, setFormData] = useState({
    orderNumber: '',
    productName: '',
    reason: '',
    description: '',
    name: '',
    email: '',
    phone: ''
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
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Solicitação de troca:', formData)
    setIsSubmitting(false)
    setSubmitted(true)
    
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        orderNumber: '',
        productName: '',
        reason: '',
        description: '',
        name: '',
        email: '',
        phone: ''
      })
    }, 5000)
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
              Política de Trocas e Devoluções
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
              <RefreshCw size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Trocas e Devoluções
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Conheça nossos prazos e condições para trocas e devoluções. Sua satisfação é nossa prioridade.
          </p>
        </div>

        {/* Resumo Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">30 Dias</h3>
              <p className="text-gray-400 text-sm">Prazo para solicitar troca ou devolução</p>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Produto Íntegro</h3>
              <p className="text-gray-400 text-sm">Embalagem original e sem sinais de uso</p>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Garantia</h3>
              <p className="text-gray-400 text-sm">5 anos para painéis, 3 para inversores</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Seção de Prazos */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar size={22} className="text-blue-400" />
                    Prazos e Condições
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-400 text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Prazo de 30 dias</h3>
                        <p className="text-gray-400 text-sm">Você tem até 30 dias corridos após o recebimento do produto para solicitar troca ou devolução.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-400 text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Produto em perfeito estado</h3>
                        <p className="text-gray-400 text-sm">O produto deve estar sem sinais de uso, na embalagem original, com todos os acessórios e manuais.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-400 text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Nota Fiscal</h3>
                        <p className="text-gray-400 text-sm">É obrigatória a apresentação da nota fiscal ou comprovante de compra.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-400 text-xs font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Frete para troca</h3>
                        <p className="text-gray-400 text-sm">Em caso de arrependimento, o frete de devolução é por conta do cliente. Para produtos com defeito, o frete é gratuito.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs para tipos de solicitação */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText size={22} className="text-blue-400" />
                    Como Solicitar
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {requestTypes.map((type) => {
                      const Icon = type.icon
                      const isActive = activeTab === type.id
                      return (
                        <button
                          key={type.id}
                          onClick={() => setActiveTab(type.id)}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                            isActive
                              ? 'bg-linear-to-r from-blue-500 to-blue-600 text-black shadow-lg shadow-blue-500/20'
                              : 'bg-gray-800/50 border border-blue-500/30 text-gray-400 hover:text-blue-400'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
                    {activeTab === 'exchange' && (
                      <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                        <h3 className="font-semibold text-white mb-2">Troca por outro produto</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                          <li>Entre em contato com nosso suporte dentro do prazo de 30 dias</li>
                          <li>Informe o número do pedido e o produto que deseja trocar</li>
                          <li>Escolha o produto desejado para substituição</li>
                          <li>Envie o produto original na embalagem adequada</li>
                          <li>Após recebimento e análise, enviaremos o novo produto em até 7 dias úteis</li>
                        </ol>
                      </div>
                    )}

                    {activeTab === 'return' && (
                      <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                        <h3 className="font-semibold text-white mb-2">Devolução e Reembolso</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                          <li>Solicite a devolução através do nosso suporte</li>
                          <li>Informe os dados do pedido e motivo da devolução</li>
                          <li>Embale o produto na embalagem original</li>
                          <li>Envie o produto para nosso endereço (frete por conta do cliente)</li>
                          <li>Após análise, o reembolso será processado em até 10 dias úteis</li>
                          <li>O valor será estornado no mesmo método de pagamento utilizado</li>
                        </ol>
                      </div>
                    )}

                    {activeTab === 'defect' && (
                      <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                        <h3 className="font-semibold text-white mb-2">Produto com Defeito</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-400 text-sm">
                          <li>Entre em contato imediatamente com nosso suporte</li>
                          <li>Envie fotos ou vídeos mostrando o defeito</li>
                          <li>Informe o número do pedido e dados do produto</li>
                          <li>Nossa equipe fará a análise e aprovará a troca</li>
                          <li>Enviaremos uma etiqueta de frete grátis para devolução</li>
                          <li>Após recebimento, enviaremos um novo produto ou realizaremos o reembolso</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Garantia dos Produtos */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield size={22} className="text-blue-400" />
                    Garantia dos Produtos
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-blue-500/20">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sun size={20} className="text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-white">Painéis Solares</h3>
                      <p className="text-2xl font-bold text-blue-400">5 anos</p>
                      <p className="text-xs text-gray-500 mt-1">Garantia de fábrica</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-blue-500/20">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Zap size={20} className="text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-white">Inversores</h3>
                      <p className="text-2xl font-bold text-blue-400">3 anos</p>
                      <p className="text-xs text-gray-500 mt-1">Garantia de fábrica</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-blue-500/20">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Package size={20} className="text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-white">Baterias</h3>
                      <p className="text-2xl font-bold text-blue-400">2 anos</p>
                      <p className="text-xs text-gray-500 mt-1">Garantia de fábrica</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-gray-300">
                      <span className="text-yellow-400 font-medium">Importante:</span> A garantia não cobre danos causados por instalação incorreta, mau uso, descargas elétricas ou fenômenos naturais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Produtos não aceitos */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertCircle size={22} className="text-blue-400" />
                    Produtos não aceitos para troca
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Produtos com sinais de uso ou instalação</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Produtos sem embalagem original ou com etiquetas removidas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Produtos personalizados ou sob medida</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Produtos com danos causados por mau uso ou instalação inadequada</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Formulário de Solicitação */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-400" />
                  Solicitar Troca/Devolução
                </h3>

                {submitted ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Solicitação Enviada!</p>
                    <p className="text-gray-400 text-sm mt-1">Entraremos em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
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
                        Produto *
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        placeholder="Nome do produto"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Motivo *
                      </label>
                      <select
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 text-sm"
                      >
                        <option value="">Selecione</option>
                        <option value="Arrependimento">Arrependimento / Não gostei</option>
                        <option value="Defeito">Produto com defeito</option>
                        <option value="Diferente">Produto diferente do pedido</option>
                        <option value="Tamanho">Tamanho inadequado</option>
                        <option value="Outro">Outro motivo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nome *
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
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Descrição
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Descreva o motivo da troca/devolução"
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 text-sm resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
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
                  Atendimento
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-blue-400" />
                    <span className="text-gray-300">(+258) 84 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-blue-400" />
                    <span className="text-gray-300">trocas@inovacoessolares.co.mz</span>
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
                  <ArrowRight size={14} />
                </Link>
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
                <h3 className="text-lg font-semibold text-white mb-2">Qualidade Garantida</h3>
                <p className="text-gray-400 text-sm">
                  Todos os nossos produtos passam por rigoroso controle de qualidade antes da entrega.
                </p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-xs text-blue-400">Satisfação garantida</span>
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
            <Link href="/garantia" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Garantia dos Produtos
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