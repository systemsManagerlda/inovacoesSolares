/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  BarChart3,
  LogOut,
  PieChart,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'

type Lead = {
  id: string
  nome: string
  origem: string
  servico: string
  potencia: number
  orcamento: number
  estado: string
  utilizador: string
  criadoEm: string
}

const money = (value: number) =>
  new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    maximumFractionDigits: 0,
  }).format(value)

function Guard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (
      sessionStorage.getItem(
        'inovacoes_crm_auth'
      ) !== 'true'
    ) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  return ready ? <>{children}</> : null
}

export default function AdminPage() {
  return (
    <Guard>
      <Admin />
    </Guard>
  )
}

function Admin() {
  const router = useRouter()

  const [leads, setLeads] =
    useState<Lead[]>([])

  const [user, setUser] =
    useState('Todos')

  useEffect(() => {
    const saved =
      localStorage.getItem(
        'inovacoes_leads'
      )

    setLeads(
      saved
        ? JSON.parse(saved)
        : []
    )
  }, [])

  const users = Array.from(
    new Set(
      leads.map(
        (lead) =>
          lead.utilizador
      )
    )
  )

  const data = useMemo(
    () =>
      user === 'Todos'
        ? leads
        : leads.filter(
            (lead) =>
              lead.utilizador ===
              user
          ),
    [leads, user]
  )

  const total = data.length

  const converted = data.filter(
    (lead) =>
      lead.estado ===
      'Convertido'
  ).length

  const power = data.reduce(
    (sum, lead) =>
      sum + lead.potencia,
    0
  )

  const value = data.reduce(
    (sum, lead) =>
      sum + lead.orcamento,
    0
  )

  const conversion =
    total > 0
      ? Math.round(
          (converted /
            total) *
            100
        )
      : 0

  const group = (
    key: keyof Lead
  ): [string, number][] => {
    const result: Record<
      string,
      number
    > = {}

    data.forEach((lead) => {
      const value =
        String(lead[key])

      result[value] =
        (result[value] || 0) + 1
    })

    return Object.entries(result)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
  }

  function logout() {
    sessionStorage.removeItem(
      'inovacoes_crm_auth'
    )

    sessionStorage.removeItem(
      'inovacoes_crm_user'
    )

    router.replace('/login')
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white pt-24 pb-12 px-4">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

          <div>
            <p className="text-blue-400 text-sm font-semibold">
              INOVAÇÕES SOLARES
            </p>

            <h1 className="text-3xl font-bold mt-1">
              Dashboard Administrativo
            </h1>

            <p className="text-gray-400 mt-1">
              Visão estratégica do desempenho comercial.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() =>
                router.push(
                  '/dashboard'
                )
              }
              className="px-4 py-2 rounded-xl border border-gray-700 flex gap-2 items-center"
            >
              <ArrowLeft size={17} />
              Leads
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-red-500/20 text-red-300 flex gap-2 items-center"
            >
              <LogOut size={17} />
              Sair
            </button>

          </div>

        </div>

        <div className="flex items-center gap-3 mb-6">

          <Users
            size={18}
            className="text-gray-500"
          />

          <select
            value={user}
            onChange={(e) =>
              setUser(
                e.target.value
              )
            }
            className="rounded-xl bg-gray-900 border border-gray-800 px-4 py-2"
          >
            <option value="Todos">
              Todos os utilizadores
            </option>

            {users.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <Kpi
            title="Total de Leads"
            value={String(total)}
            icon={<Users size={20} />}
          />

          <Kpi
            title="Taxa de Conversão"
            value={`${conversion}%`}
            icon={
              <TrendingUp
                size={20}
              />
            }
          />

          <Kpi
            title="Potência Pipeline"
            value={`${power} kWp`}
            icon={
              <Zap size={20} />
            }
          />

          <Kpi
            title="Valor Pipeline"
            value={money(value)}
            icon={
              <BarChart3
                size={20}
              />
            }
          />

        </div>

        <div className="grid lg:grid-cols-3 gap-5">

          <Stat
            title="Leads por origem"
            icon={
              <PieChart
                size={18}
              />
            }
            items={group(
              'origem'
            )}
          />

          <Stat
            title="Leads por serviço"
            icon={
              <Zap size={18} />
            }
            items={group(
              'servico'
            )}
          />

          <Stat
            title="Leads por estado"
            icon={
              <BarChart3
                size={18}
              />
            }
            items={group(
              'estado'
            )}
          />

        </div>

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <h2 className="font-semibold mb-4">
            Resumo Comercial
          </h2>

          <div className="grid md:grid-cols-4 gap-4 text-sm">

            <Summary
              title="Novos"
              value={
                data.filter(
                  (lead) =>
                    lead.estado ===
                    'Novo'
                ).length
              }
            />

            <Summary
              title="Propostas"
              value={
                data.filter(
                  (lead) =>
                    lead.estado ===
                    'Proposta'
                ).length
              }
            />

            <Summary
              title="Negociações"
              value={
                data.filter(
                  (lead) =>
                    lead.estado ===
                    'Negociação'
                ).length
              }
            />

            <Summary
              title="Convertidos"
              value={converted}
            />

          </div>

        </div>

      </div>

    </main>
  )
}

function Kpi({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

      <div className="flex justify-between text-gray-400 text-sm">

        <span>
          {title}
        </span>

        <span className="text-blue-400">
          {icon}
        </span>

      </div>

      <b className="block text-2xl mt-3">
        {value}
      </b>

    </div>
  )
}

function Summary({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="bg-gray-950 rounded-xl p-4">

      <span className="text-gray-500">
        {title}
      </span>

      <b className="block mt-1 text-xl">
        {value}
      </b>

    </div>
  )
}

function Stat({
  title,
  icon,
  items,
}: {
  title: string
  icon: React.ReactNode
  items: [string, number][]
}) {
  const max = Math.max(
    ...items.map(
      (item) => item[1]
    ),
    1
  )

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

      <h2 className="font-semibold flex gap-2 items-center">
        {icon}
        {title}
      </h2>

      <div className="space-y-4 mt-5">

        {items.length > 0 ? (
          items.map(
            ([name, count]) => (
              <div key={name}>

                <div className="flex justify-between text-sm mb-1">

                  <span className="text-gray-300">
                    {name}
                  </span>

                  <span className="text-gray-500">
                    {count}
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        (count /
                          max) *
                        100
                      }%`,
                    }}
                  />

                </div>

              </div>
            )
          )
        ) : (
          <p className="text-gray-500 text-sm">
            Sem dados.
          </p>
        )}

      </div>

    </section>
  )
}