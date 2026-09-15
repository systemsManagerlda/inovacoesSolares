'use client'

import { FormEvent, useEffect, useState } from 'react'
import { LockKeyhole, LogIn, Sun, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('inovacoes_crm_auth') === 'true') {
      router.replace('/dashboard')
    }
  }, [router])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    setTimeout(() => {
      if (username === 'Demo1' && password === 'Demo1') {
        sessionStorage.setItem('inovacoes_crm_auth', 'true')
        sessionStorage.setItem('inovacoes_crm_user', username)

        router.replace('/dashboard')
      } else {
        setError(
          'Credenciais inválidas. Utilize Demo1 / Demo1 para demonstração.'
        )
        setLoading(false)
      }
    }, 400)
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,.10),transparent_30%)]" />

      <div className="relative w-full max-w-md">

        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center">
            <Sun className="text-blue-400" size={34} />
          </div>

          <h1 className="text-3xl font-bold">
            Área Comercial
          </h1>

          <p className="text-gray-400 mt-2">
            Acesso protegido ao CRM da Inovações Solares
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-blue-500/20 bg-gray-950/90 p-6 shadow-2xl"
        >
          <div className="space-y-5">

            <label className="block">
              <span className="text-sm text-gray-300">
                Utilizador
              </span>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Utilizador"
                className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-300">
                Palavra-passe
              </span>

              <div className="relative mt-2">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Palavra-passe"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900 pl-10 pr-4 py-3 outline-none focus:border-blue-500"
                />
              </div>
            </label>

          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-linear-to-r from-blue-500 to-blue-600 px-4 py-3 font-semibold text-black flex items-center justify-center gap-2 hover:from-blue-400 hover:to-blue-500 disabled:opacity-60"
          >
            <LogIn size={18} />

            {loading
              ? 'A autenticar...'
              : 'Entrar no Dashboard'}
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck
              size={14}
              className="text-blue-400"
            />

            Sessão expira ao fechar o navegador
          </div>

          <p className="mt-3 text-center text-xs text-gray-600">
            Demo: Demo1 / Demo1
          </p>

        </form>
      </div>
    </main>
  )
}