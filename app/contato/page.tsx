'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronRight, 
  Sun, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  Headphones,
  Sparkles
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

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContatoPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    // Simular envio do formulário
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Aqui você pode adicionar a lógica real de envio para um serviço de email
    console.log('Dados do formulário:', formData)
    
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Resetar formulário após 5 segundos
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }, 5000)
  }

  // Informações de contato
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      details: ['(+258) 84 113 8173', '(+258) 87 113 8173'],
      action: 'Ligar agora',
      href: 'tel:+258841138173'
    },
    {
      icon: Mail,
      title: 'E-mail',
      details: ['comercial@inovacoessolares.co.mz', 'suporte@inovacoessolares.co.mz'],
      action: 'Enviar e-mail',
      href: 'mailto:comercial@inovacoessolares.co.mz'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      details: ['Av.Trabalho perto da Moçambique , Maputo, Mozambique'],
      action: 'Ver no mapa',
      href: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      details: ['Segunda a Sexta: 8h às 18h', 'Sábado: 9h às 13h', 'Domingo: Fechado'],
      action: null,
      href: null
    }
  ]

  // Redes Sociais
  const socialLinks = [
    { icon: Facebook, name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100077453455388', color: 'hover:text-blue-600' },
    { icon: Instagram, name: 'Instagram', href: 'https://instagram.com', color: 'hover:text-pink-500' },
    { icon: Twitter, name: 'Twitter', href: 'https://twitter.com', color: 'hover:text-blue-400' },
    { icon: Linkedin, name: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:text-blue-700' },
    { icon: Youtube, name: 'YouTube', href: 'https://youtube.com', color: 'hover:text-red-600' },
  ]

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
              Contato
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
              <MessageCircle size={40} className="text-black" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Entre em Contato
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Estamos aqui para ajudar! Entre em contato conosco e tire suas dúvidas sobre energia solar.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div
                key={index}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all text-center">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-400 text-sm mb-1">{detail}</p>
                  ))}
                  {info.action && info.href && (
                    <Link
                      href={info.href}
                      className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {info.action} →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Formulário de Contato */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Mail size={24} className="text-blue-400" />
                  Envie uma Mensagem
                </h2>

                {submitted ? (
                  <div className="bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Mensagem Enviada!</h3>
                    <p className="text-gray-400">
                      Agradecemos pelo seu contato. Responderemos em breve.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
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
                          className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="84 123 4567"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Assunto *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                        >
                          <option value="">Selecione o assunto</option>
                          <option value="Dúvida sobre produtos">Dúvida sobre produtos</option>
                          <option value="Orçamento">Solicitar Orçamento</option>
                          <option value="Suporte Técnico">Suporte Técnico</option>
                          <option value="Reclamação">Reclamação</option>
                          <option value="Parcerias">Parcerias</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Mensagem *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                        placeholder="Digite sua mensagem aqui..."
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

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
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Enviar Mensagem</span>
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Informações Adicionais */}
          <div className="space-y-8">
            {/* Redes Sociais */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe size={20} className="text-blue-400" />
                  Redes Sociais
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Siga-nos nas redes sociais e fique por dentro das novidades e promoções.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 bg-gray-800/50 border border-blue-500/20 rounded-xl text-gray-400 ${social.color} hover:border-blue-400/40 hover:bg-gray-800 transition-all group/social`}
                        aria-label={social.name}
                      >
                        <Icon size={20} className="group-hover/social:scale-110 transition-transform" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Atendimento */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Headphones size={20} className="text-blue-400" />
                  Atendimento Prioritário
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Para clientes com contratos de manutenção, oferecemos atendimento prioritário.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Phone size={16} className="text-blue-400" />
                    <span>WhatsApp: (+258) 87 113 8173</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <Mail size={16} className="text-blue-400" />
                    <span>comercial@inovacoessolares.co.mz</span>
                  </div>
                </div>
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
                <h3 className="text-lg font-semibold text-white mb-2">Energia Solar</h3>
                <p className="text-gray-400 text-sm">
                  Transforme a luz do sol em economia e sustentabilidade. Conte com nossa equipe especializada!
                </p>
                <div className="mt-4 flex items-center justify-center gap-1">
                  <Sparkles size={14} className="text-blue-400" />
                  <span className="text-xs text-blue-400">Instalação certificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-16">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 overflow-hidden">
              <div className="p-6 border-b border-blue-500/20">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin size={24} className="text-blue-400" />
                  Nossa Localização
                </h3>
                <p className="text-gray-400 text-sm mt-1">Av. Julius Nyerere, 1234 - Maputo, Moçambique</p>
              </div>
              <div className="h-75 bg-gray-800 relative">
                {/* Placeholder do mapa - substitua pelo embed do Google Maps */}
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <MapPin size={48} className="text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-400">Mapa interativo - Av. Julius Nyerere, 1234</p>
                    <p className="text-gray-500 text-sm mt-1">Maputo, Moçambique</p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Abrir no Google Maps →
                    </a>
                  </div>
                </div>
                {/* Para adicionar o mapa real, descomente e substitua a chave da API:
                <iframe
                  src="https://www.google.com/maps/embed?pb=..."
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                */}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Ainda tem dúvidas? Consulte nossas perguntas frequentes.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>Ver FAQ</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
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