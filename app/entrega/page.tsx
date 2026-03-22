'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Sun, 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Map,
  Zap,
  DollarSign,
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

// Tabela de prazos por província
const deliveryTimes = [
  { province: 'Maputo Cidade', days: '2-3', icon: MapPin, color: 'text-blue-400' },
  { province: 'Maputo Província', days: '2-3', icon: MapPin, color: 'text-blue-400' },
  { province: 'Gaza', days: '3-4', icon: Map, color: 'text-blue-400' },
  { province: 'Inhambane', days: '3-5', icon: Map, color: 'text-blue-400' },
  { province: 'Manica', days: '4-5', icon: Map, color: 'text-blue-400' },
  { province: 'Sofala', days: '4-5', icon: Map, color: 'text-blue-400' },
  { province: 'Tete', days: '5-6', icon: Map, color: 'text-blue-400' },
  { province: 'Zambézia', days: '5-6', icon: Map, color: 'text-blue-400' },
  { province: 'Nampula', days: '6-8', icon: Map, color: 'text-blue-400' },
  { province: 'Niassa', days: '7-9', icon: Map, color: 'text-blue-400' },
  { province: 'Cabo Delgado', days: '7-9', icon: Map, color: 'text-blue-400' },
]

// Tabela de fretes
const shippingCosts = [
  { range: 'Até 2.500 MZN', cost: '250 MZN', provinces: 'Todas as províncias' },
  { range: '2.501 - 5.000 MZN', cost: '180 MZN', provinces: 'Todas as províncias' },
  { range: '5.001 - 7.499 MZN', cost: '120 MZN', provinces: 'Todas as províncias' },
  { range: 'Acima de 7.500 MZN', cost: 'Grátis', provinces: 'Todas as províncias', highlight: true },
]

export default function EntregaPage() {
  const [selectedProvince, setSelectedProvince] = useState('')

  const getEstimatedDelivery = () => {
    const province = deliveryTimes.find(p => p.province === selectedProvince)
    if (province) {
      return `${province.days} dias úteis`
    }
    return 'Selecione uma província'
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
              Política de Entrega
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
              <Truck size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Política de Entrega
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Conheça os prazos e condições de entrega para todo o território nacional.
          </p>
        </div>

        {/* Resumo Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Prazos Rápidos</h3>
              <p className="text-gray-400 text-sm">Entregas em até 9 dias úteis para todo o país</p>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Frete Grátis</h3>
              <p className="text-gray-400 text-sm">Para compras acima de 7.500 MZN</p>
            </div>
          </div>

          <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Rastreamento</h3>
              <p className="text-gray-400 text-sm">Acompanhe seu pedido em tempo real</p>
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
                    <Clock size={22} className="text-blue-400" />
                    Prazos de Entrega por Província
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Os prazos são contados em dias úteis após a confirmação do pagamento.
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {deliveryTimes.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-blue-500/10">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={item.color} />
                            <span className="text-gray-300">{item.province}</span>
                          </div>
                          <span className="text-blue-400 font-medium">{item.days} dias úteis</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculadora de Entrega */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar size={22} className="text-blue-400" />
                    Simule seu Prazo de Entrega
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Selecione sua província para estimar o prazo de entrega.
                  </p>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Selecione sua Província
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    >
                      <option value="">Selecione uma província</option>
                      {deliveryTimes.map((item) => (
                        <option key={item.province} value={item.province}>
                          {item.province}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedProvince && (
                    <div className="bg-linear-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                      <div className="flex items-center gap-3">
                        <Truck size={24} className="text-blue-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Prazo estimado para {selectedProvince}</p>
                          <p className="text-2xl font-bold text-blue-400">{getEstimatedDelivery()}</p>
                          <p className="text-xs text-gray-500 mt-1">*Após confirmação do pagamento</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de Frete */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign size={22} className="text-blue-400" />
                    Tabela de Fretes
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Valores de frete baseados no valor total do pedido.
                  </p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-blue-500/20">
                          <th className="text-left py-3 text-gray-400 font-medium">Valor do Pedido</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Valor do Frete</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Cobertura</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shippingCosts.map((item, index) => (
                          <tr key={index} className={`border-b border-blue-500/10 ${item.highlight ? 'bg-blue-500/5' : ''}`}>
                            <td className="py-3 text-gray-300">{item.range}</td>
                            <td className={`py-3 font-medium ${item.highlight ? 'text-green-400' : 'text-blue-400'}`}>
                              {item.cost}
                            </td>
                            <td className="py-3 text-gray-400 text-sm">{item.provinces}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
                    <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">
                      <span className="text-green-400 font-medium">Frete Grátis</span> para compras acima de 7.500 MZN em todo o território nacional!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção de Processo de Entrega */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package size={22} className="text-blue-400" />
                    Processo de Entrega
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Confirmação do Pagamento</h3>
                        <p className="text-gray-400 text-sm">Após a confirmação do pagamento, seu pedido é separado e preparado para envio.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-400 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Envio e Rastreamento</h3>
                        <p className="text-gray-400 text-sm">Você receberá um e-mail com o código de rastreamento para acompanhar sua entrega.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-400 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Transporte</h3>
                        <p className="text-gray-400 text-sm">Sua encomenda é transportada por transportadoras parceiras com segurança e eficiência.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-blue-400 font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Entrega</h3>
                        <p className="text-gray-400 text-sm">O entregador entrará em contato pelo telefone informado. Tenha os documentos em mãos para recebimento.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Importantes */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
                <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertCircle size={22} className="text-blue-400" />
                    Informações Importantes
                  </h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Os prazos de entrega são contados em <strong className="text-white">dias úteis</strong> (segunda a sexta, exceto feriados).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Entregas são realizadas em <strong className="text-white">horário comercial</strong> (8h às 18h).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">É necessário ter um <strong className="text-white">responsável no endereço</strong> para receber a encomenda e assinar o comprovante.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Em caso de <strong className="text-white">ausência</strong>, será realizada uma segunda tentativa de entrega.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">Para regiões de difícil acesso, o prazo pode ser estendido em <strong className="text-white">2 a 3 dias úteis</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Atendimento */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Headphones size={20} className="text-blue-400" />
                  Dúvidas sobre Entrega?
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Entre em contato com nossa central de atendimento:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-blue-400" />
                    <span className="text-gray-300">(+258) 84 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-blue-400" />
                    <span className="text-gray-300">entregas@inovacoessolares.co.mz</span>
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

            {/* Rastreamento */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Package size={20} className="text-blue-400" />
                  Acompanhe seu Pedido
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail.
                </p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Digite o código de rastreio"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all pr-12"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-linear-to-r from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={20} className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Dicas para Recebimento</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>Confira se o endereço está completo com ponto de referência</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>Tenha um documento de identificação para retirada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>Verifique a integridade da embalagem ao receber</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                    <span>Em caso de avaria, registre no ato da entrega</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Badge Solar */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                  <Sun size={48} className="relative text-blue-400 mx-auto animate-spin-slow" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Energia Solar</h3>
                <p className="text-gray-400 text-sm">
                  Entregamos a energia do futuro na sua casa. Sustentabilidade e economia com qualidade garantida!
                </p>
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
            <Link href="/trocas" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Política de Trocas e Devoluções
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