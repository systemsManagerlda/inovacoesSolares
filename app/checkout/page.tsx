'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle,
  Sun,
  Zap,
  Sparkles,
  Shield,
  Lock,
  ChevronRight,
  AlertCircle,
  Building2,
  Home,
  Landmark
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface CheckoutFormData {
  // Informações pessoais
  firstName: string
  lastName: string
  email: string
  phone: string
  nif: string
  // Endereço
  province: string
  district: string
  address: string
  number: string
  complement: string
  reference: string
  // Pagamento
  paymentMethod: 'credit_card' | 'boleto' | 'pix' | 'mpesa' | 'cash'
  // Cartão de crédito
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
  installments: number
  // M-Pesa
  mpesaNumber: string
}

// Províncias de Moçambique
const provinces = [
  'Cabo Delgado',
  'Gaza',
  'Inhambane',
  'Manica',
  'Maputo Cidade',
  'Maputo Província',
  'Nampula',
  'Niassa',
  'Sofala',
  'Tete',
  'Zambézia'
]

// Distritos por província (simplificado)
const districtsByProvince: Record<string, string[]> = {
  'Maputo Cidade': [
    'KaMpfumo',
    'KaMaxakeni',
    'KaMavota',
    'KaMubukwana',
    'KaTembe',
    'KaNyaka'
  ],
  'Maputo Província': [
    'Matola',
    'Boane',
    'Magude',
    'Manhiça',
    'Marracuene',
    'Matutuíne',
    'Moamba',
    'Namaacha'
  ],
  'Sofala': [
    'Beira',
    'Búzi',
    'Caia',
    'Chemba',
    'Cheringoma',
    'Chibabava',
    'Dondo',
    'Gorongosa',
    'Machanga',
    'Maringué',
    'Marromeu',
    'Muanza',
    'Nhamatanda'
  ],
  'Nampula': [
    'Nampula',
    'Angoche',
    'Eráti',
    'Ilha de Moçambique',
    'Lalaua',
    'Malema',
    'Meconta',
    'Mecubúri',
    'Memba',
    'Mogincual',
    'Mogovolas',
    'Moma',
    'Monapo',
    'Mossuril',
    'Muecate',
    'Murrupula',
    'Nacala-a-Velha',
    'Nacarôa',
    'Rapale',
    'Ribaué'
  ],
  'Inhambane': [
    'Inhambane',
    'Funhalouro',
    'Govuro',
    'Homoíne',
    'Jangamo',
    'Mabote',
    'Massinga',
    'Morrumbene',
    'Panda',
    'Vilanculos',
    'Zavala'
  ],
  'Gaza': [
    'Xai-Xai',
    'Bilene',
    'Chibuto',
    'Chicualacuala',
    'Chigubo',
    'Chókwè',
    'Guijá',
    'Mabalane',
    'Manjacaze',
    'Massangena',
    'Massingir'
  ],
  'Manica': [
    'Chimoio',
    'Bárue',
    'Gondola',
    'Guro',
    'Macate',
    'Machaze',
    'Macossa',
    'Manica',
    'Mossurize',
    'Sussundenga',
    'Tambara'
  ],
  'Tete': [
    'Tete',
    'Angónia',
    'Cahora-Bassa',
    'Changara',
    'Chifunde',
    'Chiuta',
    'Doa',
    'Macanga',
    'Magoé',
    'Marara',
    'Moatize',
    'Mutarara',
    'Tsangano',
    'Zumbo'
  ],
  'Zambézia': [
    'Quelimane',
    'Alto Molócuè',
    'Chinde',
    'Gilé',
    'Gurúè',
    'Ile',
    'Inhassunge',
    'Luabo',
    'Lugela',
    'Maganja da Costa',
    'Milange',
    'Mocuba',
    'Mocubela',
    'Molumbo',
    'Mopeia',
    'Morrumbala',
    'Mulevala',
    'Namacurra',
    'Namarroi',
    'Nicoloadala',
    'Pebane'
  ],
  'Cabo Delgado': [
    'Pemba',
    'Ancuabe',
    'Balama',
    'Chiúre',
    'Ibo',
    'Macomia',
    'Mecúfi',
    'Meluco',
    'Mocímboa da Praia',
    'Montepuez',
    'Mueda',
    'Muidumbe',
    'Namuno',
    'Nangade',
    'Palma',
    'Quissanga'
  ],
  'Niassa': [
    'Lichinga',
    'Cuamba',
    'Lago',
    'Majune',
    'Mandimba',
    'Marrupa',
    'Maúa',
    'Mavago',
    'Mecanhelas',
    'Mecula',
    'Metarica',
    'Muembe',
    'Ngauma',
    'Nipepe',
    'Sanga'
  ]
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nif: '',
    province: '',
    district: '',
    address: '',
    number: '',
    complement: '',
    reference: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    installments: 1,
    mpesaNumber: ''
  })

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({})
  const [shippingCost, setShippingCost] = useState(0)
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)

  // Usar useMemo para distritos disponíveis baseado na província atual
  const availableDistricts = useMemo(() => {
    if (!formData.province) return []
    return districtsByProvince[formData.province] || []
  }, [formData.province])

  // Redirecionar se o carrinho estiver vazio
  useEffect(() => {
    if (items.length === 0 && !orderCompleted) {
      router.push('/')
    }
  }, [items, router, orderCompleted])

  // Resetar distrito quando a província mudar
  useEffect(() => {
    if (formData.province && formData.district) {
      // Se o distrito atual não está mais na lista da nova província, resetar
      const districts = districtsByProvince[formData.province] || []
      if (!districts.includes(formData.district)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({ ...prev, district: '' }))
      }
    }
  }, [formData.province, formData.district])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro do campo ao digitar
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const calculateShipping = useCallback(async (province: string) => {
    if (!province) return
    
    setIsCalculatingShipping(true)
    
    // Simulação de cálculo de frete baseado na província
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Frete grátis para valores acima de 7.500 MZN
    if (total > 7500) {
      setShippingCost(0)
    } else {
      // Tabela de fretes por região (em Meticais)
      const shippingTable: Record<string, number> = {
        'Maputo Cidade': 150,
        'Maputo Província': 180,
        'Gaza': 220,
        'Inhambane': 280,
        'Manica': 320,
        'Sofala': 350,
        'Tete': 380,
        'Zambézia': 420,
        'Nampula': 450,
        'Niassa': 520,
        'Cabo Delgado': 550
      }
      
      setShippingCost(shippingTable[province] || 400)
    }
    
    setIsCalculatingShipping(false)
  }, [total])

  const handleProvinceChange = useCallback((province: string) => {
    setFormData(prev => ({ ...prev, province, district: '' }))
    calculateShipping(province)
  }, [calculateShipping])

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<CheckoutFormData> = {}
    
    if (!formData.firstName) newErrors.firstName = 'Nome é obrigatório'
    if (!formData.lastName) newErrors.lastName = 'Apelido é obrigatório'
    if (!formData.email) newErrors.email = 'E-mail é obrigatório'
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.province) newErrors.province = 'Província é obrigatória'
    if (!formData.district) newErrors.district = 'Distrito é obrigatório'
    if (!formData.address) newErrors.address = 'Endereço é obrigatório'
    if (!formData.number) newErrors.number = 'Número é obrigatório'
    
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Número do cartão é obrigatório'
      if (!formData.cardName) newErrors.cardName = 'Nome no cartão é obrigatório'
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Data de validade é obrigatória'
      if (!formData.cardCvv) newErrors.cardCvv = 'CVV é obrigatório'
    }
    
    if (formData.paymentMethod === 'mpesa') {
      if (!formData.mpesaNumber) newErrors.mpesaNumber = 'Número do M-Pesa é obrigatório'
      if (formData.mpesaNumber && !/^8[2-9]\d{7}$/.test(formData.mpesaNumber.replace(/\s/g, ''))) {
        newErrors.mpesaNumber = 'Número inválido. Ex: 84xxxxxxx ou 85xxxxxxx'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simular envio do pedido
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Gerar número de pedido no formato moçambicano
    const newOrderNumber = `SOL-MZ-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setOrderNumber(newOrderNumber)
    setOrderCompleted(true)
    clearCart()
    
    setIsSubmitting(false)
  }

  const subtotal = total
  const totalWithShipping = subtotal + shippingCost

  // Partículas de luz
  const lightParticles = [
    { top: 10, left: 15, delay: 0.5 },
    { top: 25, left: 80, delay: 1.2 },
    { top: 45, left: 30, delay: 0.8 },
    { top: 60, left: 70, delay: 1.5 },
    { top: 75, left: 20, delay: 0.3 },
  ]

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden mt-20">
        {/* Elementos de luz */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
          {lightParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-[2px] animate-ping"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-blue-500/30 blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={48} className="text-black" />
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                Pedido Confirmado!
              </span>
            </h1>
            
            <p className="text-gray-400 mb-6">
              O seu pedido foi recebido com sucesso. Em breve receberá um e-mail com os detalhes da encomenda.
            </p>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 mb-8">
              <p className="text-sm text-gray-400 mb-2">Número do Pedido</p>
              <p className="text-2xl font-mono font-bold text-blue-400">{orderNumber}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="relative overflow-hidden group px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-black font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <Sun size={18} />
                  Continuar Comprando
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden mt-20">
      {/* Elementos de luz solar */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        {lightParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-[2px] animate-ping"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/carrinho" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Voltar ao Carrinho</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400">Compra 100% Segura</span>
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl font-display font-bold mb-8">
          <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
            Finalizar Pedido
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-400" />
                  Informações Pessoais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.firstName ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Apelido *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.lastName ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                    )}
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
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.email ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
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
                      placeholder="84 123 4567"
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.phone ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      NIF (Opcional)
                    </label>
                    <input
                      type="text"
                      name="nif"
                      value={formData.nif}
                      onChange={handleInputChange}
                      placeholder="Número de Identificação Fiscal"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-blue-400" />
                  Endereço de Entrega
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Província *
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.province ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    >
                      <option value="">Selecione a província</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-400 text-xs mt-1">{errors.province}</p>
                    )}
                    {isCalculatingShipping && (
                      <p className="text-blue-400 text-xs mt-1">Calculando frete...</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Distrito/Cidade *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.province}
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.district ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all disabled:opacity-50`}
                    >
                      <option value="">Selecione o distrito</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-red-400 text-xs mt-1">{errors.district}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Endereço (Rua/Avenida) *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Nome da rua ou avenida"
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.address ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    />
                    {errors.address && (
                      <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      placeholder="Nº da casa/edifício"
                      className={`w-full px-4 py-2 bg-gray-800/50 border ${
                        errors.number ? 'border-red-500' : 'border-blue-500/30'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                    />
                    {errors.number && (
                      <p className="text-red-400 text-xs mt-1">{errors.number}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      placeholder="Apartamento, bloco, etc"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ponto de Referência
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleInputChange}
                      placeholder="Próximo ao mercado, escola, etc"
                      className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-400" />
                  Forma de Pagamento
                </h2>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span>Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mpesa"
                        checked={formData.paymentMethod === 'mpesa'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="flex items-center gap-1">
                        <Landmark size={16} />
                        M-Pesa
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span>Pagamento na Entrega</span>
                    </label>
                  </div>
                  
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="space-y-4 pt-4 border-t border-blue-500/20">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Número do Cartão *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          className={`w-full px-4 py-2 bg-gray-800/50 border ${
                            errors.cardNumber ? 'border-red-500' : 'border-blue-500/30'
                          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Nome no Cartão *
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          placeholder="Como aparece no cartão"
                          className={`w-full px-4 py-2 bg-gray-800/50 border ${
                            errors.cardName ? 'border-red-500' : 'border-blue-500/30'
                          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                        />
                        {errors.cardName && (
                          <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Validade *
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            className={`w-full px-4 py-2 bg-gray-800/50 border ${
                              errors.cardExpiry ? 'border-red-500' : 'border-blue-500/30'
                            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                          />
                          {errors.cardExpiry && (
                            <p className="text-red-400 text-xs mt-1">{errors.cardExpiry}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className={`w-full px-4 py-2 bg-gray-800/50 border ${
                              errors.cardCvv ? 'border-red-500' : 'border-blue-500/30'
                            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                          />
                          {errors.cardCvv && (
                            <p className="text-red-400 text-xs mt-1">{errors.cardCvv}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Número de Parcelas
                        </label>
                        <select
                          name="installments"
                          value={formData.installments}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        >
                          <option value={1}>1x de {formatPrice(totalWithShipping)}</option>
                          <option value={2}>2x de {formatPrice(totalWithShipping / 2)}</option>
                          <option value={3}>3x de {formatPrice(totalWithShipping / 3)}</option>
                          <option value={4}>4x de {formatPrice(totalWithShipping / 4)}</option>
                          <option value={5}>5x de {formatPrice(totalWithShipping / 5)}</option>
                          <option value={6}>6x de {formatPrice(totalWithShipping / 6)}</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'mpesa' && (
                    <div className="space-y-4 pt-4 border-t border-blue-500/20">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Número M-Pesa *
                        </label>
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleInputChange}
                          placeholder="84 123 4567"
                          className={`w-full px-4 py-2 bg-gray-800/50 border ${
                            errors.mpesaNumber ? 'border-red-500' : 'border-blue-500/30'
                          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all`}
                        />
                        {errors.mpesaNumber && (
                          <p className="text-red-400 text-xs mt-1">{errors.mpesaNumber}</p>
                        )}
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Zap size={20} className="text-blue-400 mt-0.5" />
                          <p className="text-sm text-gray-300">
                            Após a confirmação do pedido, receberá uma notificação para confirmar o pagamento via M-Pesa.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'cash' && (
                    <div className="pt-4 border-t border-blue-500/20">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Truck size={20} className="text-blue-400 mt-0.5" />
                          <p className="text-sm text-gray-300">
                            Pagamento em dinheiro no momento da entrega. O valor total será pago ao entregador.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Botão de Finalizar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative overflow-hidden group w-full py-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      <span>Finalizar Pedido</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-blue-400" />
                Resumo do Pedido
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-blue-500/20">
                    <div className="relative w-16 h-16 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                      <p className="text-sm text-blue-400">{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t border-blue-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frete</span>
                  {isCalculatingShipping ? (
                    <span className="text-blue-400">Calculando...</span>
                  ) : (
                    <span className={shippingCost === 0 ? 'text-green-400' : 'text-white'}>
                      {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                    {formatPrice(totalWithShipping)}
                  </span>
                </div>
              </div>
              
              {total > 7500 && (
                <div className="mt-4 p-3 bg-linear-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-400 flex items-center gap-1">
                    <Truck size={12} />
                    Frete grátis garantido!
                  </p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-blue-500/20">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock size={12} />
                  <span>Pagamento 100% seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}