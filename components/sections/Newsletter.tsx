'use client'

import { useState } from 'react'
import { Mail, Send, Sun, Sparkles, CheckCircle } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simula envio
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubscribed(true)
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <section className="relative py-16 overflow-hidden bg-black">
      {/* Elementos de luz solar */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Raios de sol principais */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-linear-to-b from-blue-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Partículas de luz */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-blue-300/30 rounded-full blur-sm animate-ping" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300/30 rounded-full blur-sm animate-ping delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-300/30 rounded-full blur-sm animate-ping delay-500" />
        
        {/* Feixes de luz */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-32 bg-linear-to-b from-blue-500/40 to-transparent" />
        <div className="absolute top-0 right-1/4 w-0.5 h-24 bg-linear-to-b from-blue-500/30 to-transparent rotate-12" />
        <div className="absolute top-0 left-1/4 w-0.5 h-24 bg-linear-to-b from-blue-500/30 to-transparent -rotate-12" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Ícone solar animado */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-full h-full flex items-center justify-center">
              <Sun 
                size={64} 
                className="text-blue-400 animate-[spin_12s_linear_infinite]" 
              />
            </div>
          </div>

          {/* Título */}
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-center mb-3">
            <span className="bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
              Receba Luz no seu Email
            </span>
          </h2>
          
          <p className="text-gray-400 text-center mb-8 text-lg">
            Inscreva-se para receber ofertas exclusivas e novidades que vão iluminar seu dia
          </p>

          {subscribed ? (
            /* Mensagem de sucesso com tema solar */
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/50 to-blue-500/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-linear-to-r from-gray-900 to-black rounded-xl p-8 text-center border border-blue-500/30">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-blue-600 rounded-full mb-4">
                  <CheckCircle size={32} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Inscrição Confirmada! 🌞
                </h3>
                <p className="text-gray-300">
                  Agora você vai receber todas as novidades em primeira mão. Fique de olho no seu email!
                </p>
                <button
                  onClick={() => setSubscribed(false)}
                  className="mt-6 text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
                >
                  Inscrever outro email
                </button>
              </div>
            </div>
          ) : (
            /* Formulário com tema solar */
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-500/30 to-blue-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
              <form 
                onSubmit={handleSubmit} 
                className="relative bg-linear-to-br from-gray-900 to-black rounded-2xl p-8 border border-blue-500/20"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Mail 
                      size={18} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/60" 
                    />
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all disabled:opacity-50"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden group/btn px-8 py-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/20"
                  >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Inscrever</span>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* Mensagem de privacidade */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Ao se inscrever, você concorda em receber comunicações da Inovações Solares. 
                  Prometemos não enviar spam e você pode cancelar a qualquer momento.
                </p>

                {/* Badges decorativos */}
                <div className="flex justify-center gap-3 mt-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">
                    <Sparkles size={12} />
                    Ofertas exclusivas
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">
                    <Sun size={12} />
                    Lançamentos
                  </span>
                </div>
              </form>
            </div>
          )}

          {/* Benefícios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-full mb-2">
                <Sparkles size={18} className="text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white">Ofertas exclusivas</p>
              <p className="text-xs text-gray-500">para assinantes</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-full mb-2">
                <Sun size={18} className="text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white">Novidades primeiro</p>
              <p className="text-xs text-gray-500">lançamentos em 1ª mão</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-full mb-2">
                <Mail size={18} className="text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white">Conteúdo relevante</p>
              <p className="text-xs text-gray-500">dicas e novidades</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}