/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Download,
  Filter,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  Target,
  Trash2,
  UserRound,
  Zap,
} from 'lucide-react'

type LeadStatus =
  | 'Novo'
  | 'Em Contacto'
  | 'Proposta'
  | 'Negociação'
  | 'Convertido'
  | 'Perdido'

type Priority =
  | 'Baixa'
  | 'Média'
  | 'Alta'
  | 'Urgente'

type Lead = {
  id: string
  nome: string
  telefone: string
  email: string
  localizacao: string
  origem: string
  servico: string
  potencia: number
  orcamento: number
  estado: LeadStatus
  prioridade: Priority
  notas: string
  criadoEm: string
  atualizadoEm: string
  utilizador: string
  ultimoContacto: string
}

const statuses: LeadStatus[] = [
  'Novo',
  'Em Contacto',
  'Proposta',
  'Negociação',
  'Convertido',
  'Perdido',
]

const origins = [
  'Facebook Ads',
  'Instagram',
  'WhatsApp Direto',
  'Indicação',
  'Website',
  'Outro',
]

const services = [
  'Residencial',
  'Comercial',
  'Industrial',
  'Baterias',
  'Manutenção',
]

const priorities: Priority[] = [
  'Baixa',
  'Média',
  'Alta',
  'Urgente',
]

const seed: Lead[] = [
  {
    id: '1',
    nome: 'João Manuel',
    telefone: '+258 84 000 0001',
    email: 'joao@example.com',
    localizacao: 'Maputo',
    origem: 'Facebook Ads',
    servico: 'Residencial',
    potencia: 8,
    orcamento: 420000,
    estado: 'Novo',
    prioridade: 'Alta',
    notas: 'Solicitou sistema híbrido para residência.',
    criadoEm: '2026-09-12',
    atualizadoEm: '2026-09-12',
    utilizador: 'Demo1',
    ultimoContacto: '',
  },
  {
    id: '2',
    nome: 'Agro Verde Lda',
    telefone: '+258 82 000 0002',
    email: 'compras@agroverde.co.mz',
    localizacao: 'Boane',
    origem: 'Indicação',
    servico: 'Industrial',
    potencia: 50,
    orcamento: 3100000,
    estado: 'Proposta',
    prioridade: 'Urgente',
    notas: 'A aguardar reunião técnica.',
    criadoEm: '2026-09-09',
    atualizadoEm: '2026-09-14',
    utilizador: 'Demo1',
    ultimoContacto: '2026-09-14',
  },
  {
    id: '3',
    nome: 'Maria Costa',
    telefone: '+258 86 000 0003',
    email: 'maria@example.com',
    localizacao: 'Matola',
    origem: 'WhatsApp Direto',
    servico: 'Baterias',
    potencia: 5,
    orcamento: 280000,
    estado: 'Negociação',
    prioridade: 'Média',
    notas: 'Comparar duas opções de bateria.',
    criadoEm: '2026-09-03',
    atualizadoEm: '2026-09-13',
    utilizador: 'Demo1',
    ultimoContacto: '2026-09-13',
  },
]

const money = (value: number) =>
  new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    maximumFractionDigits: 0,
  }).format(value)

const today = () =>
  new Date().toISOString().slice(0, 10)

function Guard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (
      sessionStorage.getItem('inovacoes_crm_auth') !== 'true'
    ) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  return ready ? <>{children}</> : null
}

export default function DashboardPage() {
  return (
    <Guard>
      <CRM />
    </Guard>
  )
}

function CRM() {
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Todos')
  const [priority, setPriority] = useState('Todas')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState<
    Partial<Lead>
  >({
    estado: 'Novo',
    prioridade: 'Média',
    origem: 'WhatsApp Direto',
    servico: 'Residencial',
    potencia: 0,
    orcamento: 0,
  })

  useEffect(() => {
    const saved = localStorage.getItem(
      'inovacoes_leads'
    )

    setLeads(
      saved
        ? JSON.parse(saved)
        : seed
    )
  }, [])

  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem(
        'inovacoes_leads',
        JSON.stringify(leads)
      )
    }
  }, [leads])

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const text = (
        lead.nome +
        ' ' +
        lead.telefone +
        ' ' +
        lead.email +
        ' ' +
        lead.localizacao
      ).toLowerCase()

      return (
        text.includes(search.toLowerCase()) &&
        (status === 'Todos' ||
          lead.estado === status) &&
        (priority === 'Todas' ||
          lead.prioridade === priority)
      )
    })
  }, [
    leads,
    search,
    status,
    priority,
  ])

  const total = leads.length

  const converted = leads.filter(
    (lead) => lead.estado === 'Convertido'
  ).length

  const power = leads.reduce(
    (sum, lead) => sum + lead.potencia,
    0
  )

  const value = leads.reduce(
    (sum, lead) => sum + lead.orcamento,
    0
  )

  const conversion =
    total > 0
      ? Math.round(
          (converted / total) * 100
        )
      : 0

  const stale = leads.filter((lead) => {
    if (
      lead.estado === 'Convertido' ||
      lead.estado === 'Perdido'
    ) {
      return false
    }

    if (!lead.ultimoContacto) {
      return true
    }

    const days =
      (Date.now() -
        new Date(
          lead.ultimoContacto
        ).getTime()) /
      86400000

    return days > 7
  }).length

  function saveLead(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const date = today()

    const lead: Lead = {
      id: crypto.randomUUID(),

      nome: String(form.nome || ''),
      telefone: String(form.telefone || ''),
      email: String(form.email || ''),
      localizacao: String(
        form.localizacao || ''
      ),

      origem: String(
        form.origem || origins[0]
      ),

      servico: String(
        form.servico || services[0]
      ),

      potencia: Number(
        form.potencia || 0
      ),

      orcamento: Number(
        form.orcamento || 0
      ),

      estado:
        (form.estado ||
          'Novo') as LeadStatus,

      prioridade:
        (form.prioridade ||
          'Média') as Priority,

      notas: String(
        form.notas || ''
      ),

      criadoEm: date,
      atualizadoEm: date,

      utilizador:
        sessionStorage.getItem(
          'inovacoes_crm_user'
        ) || 'Demo1',

      ultimoContacto: '',
    }

    setLeads((current) => [
      lead,
      ...current,
    ])

    setShowForm(false)

    setForm({
      estado: 'Novo',
      prioridade: 'Média',
      origem: 'WhatsApp Direto',
      servico: 'Residencial',
      potencia: 0,
      orcamento: 0,
    })
  }

  function updateLead(
    id: string,
    patch: Partial<Lead>
  ) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              ...patch,
              atualizadoEm: today(),
            }
          : lead
      )
    )
  }

  function deleteLead(id: string) {
    if (
      !confirm(
        'Deseja eliminar este lead?'
      )
    ) {
      return
    }

    setLeads((current) =>
      current.filter(
        (lead) => lead.id !== id
      )
    )
  }

  function exportCsv() {
    const headers = [
      'Nome',
      'Telefone',
      'Email',
      'Localização',
      'Origem',
      'Serviço',
      'Potência kWp',
      'Orçamento',
      'Estado',
      'Prioridade',
      'Criado em',
      'Atualizado em',
      'Utilizador',
      'Notas',
    ]

    const rows = leads.map(
      (lead) => [
        lead.nome,
        lead.telefone,
        lead.email,
        lead.localizacao,
        lead.origem,
        lead.servico,
        lead.potencia,
        lead.orcamento,
        lead.estado,
        lead.prioridade,
        lead.criadoEm,
        lead.atualizadoEm,
        lead.utilizador,
        lead.notas,
      ]
    )

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(';')
      )
      .join('\n')

    const blob = new Blob(
      ['\ufeff' + csv],
      {
        type: 'text/csv;charset=utf-8',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url
    link.download =
      'leads-inovacoes-solares.csv'

    link.click()

    URL.revokeObjectURL(url)
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

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">

          <div>
            <p className="text-blue-400 text-sm font-semibold">
              INOVAÇÕES SOLARES
            </p>

            <h1 className="text-3xl font-bold mt-1">
              Dashboard de Leads
            </h1>

            <p className="text-gray-400 mt-1">
              Gestão operacional do funil comercial.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() =>
                router.push('/admin')
              }
              className="px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 flex items-center gap-2"
            >
              <BarChart3 size={17} />
              Administrativo
            </button>

            <button
              onClick={exportCsv}
              className="px-4 py-2 rounded-xl border border-gray-700 flex items-center gap-2"
            >
              <Download size={17} />
              Exportar
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-red-500/20 text-red-300 flex items-center gap-2"
            >
              <LogOut size={17} />
              Sair
            </button>

          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <Kpi
            title="Total de Leads"
            value={String(total)}
            icon={<Target size={20} />}
          />

          <Kpi
            title="Conversão"
            value={`${conversion}%`}
            icon={<CheckCircle2 size={20} />}
          />

          <Kpi
            title="Potência Pipeline"
            value={`${power} kWp`}
            icon={<Zap size={20} />}
          />

          <Kpi
            title="Valor Pipeline"
            value={money(value)}
            icon={<BarChart3 size={20} />}
          />

        </div>

        {stale > 0 && (
          <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 flex items-center gap-3">
            <AlertTriangle
              className="text-yellow-400"
              size={20}
            />

            <div>
              <p className="font-semibold text-yellow-300">
                {stale} lead(s) precisam de acompanhamento
              </p>

              <p className="text-sm text-yellow-200/70">
                Existem leads sem contacto recente.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 mb-6">

          <div className="flex flex-col lg:flex-row gap-3">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Pesquisar por nome, telefone, email ou localização..."
                className="w-full rounded-xl bg-gray-950 border border-gray-800 pl-10 pr-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-xl bg-gray-950 border border-gray-800 px-4 py-3"
            >
              <option>Todos</option>

              {statuses.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="rounded-xl bg-gray-950 border border-gray-800 px-4 py-3"
            >
              <option>Todas</option>

              {priorities.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="rounded-xl bg-blue-500 text-black px-5 py-3 font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Novo Lead
            </button>

          </div>
        </div>

        <div className="grid lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

          {statuses.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-800 bg-gray-900 p-4"
            >
              <p className="text-xs text-gray-500">
                {item}
              </p>

              <p className="text-2xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.estado === item
                  ).length
                }
              </p>
            </div>
          ))}

        </div>

        <div className="grid gap-4">

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center">
              <Filter
                size={32}
                className="mx-auto text-gray-600 mb-3"
              />

              <p className="text-gray-400">
                Nenhum lead encontrado.
              </p>
            </div>
          ) : (
            filtered.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                updateLead={updateLead}
                deleteLead={deleteLead}
              />
            ))
          )}

        </div>

      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-950 p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  Novo Lead
                </h2>

                <p className="text-sm text-gray-500">
                  Registe um novo potencial cliente.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={saveLead}
              className="grid md:grid-cols-2 gap-4"
            >

              <Field
                label="Nome"
                required
                value={form.nome || ''}
                onChange={(value) =>
                  setForm({
                    ...form,
                    nome: value,
                  })
                }
              />

              <Field
                label="Telefone"
                required
                value={form.telefone || ''}
                onChange={(value) =>
                  setForm({
                    ...form,
                    telefone: value,
                  })
                }
              />

              <Field
                label="Email"
                value={form.email || ''}
                onChange={(value) =>
                  setForm({
                    ...form,
                    email: value,
                  })
                }
              />

              <Field
                label="Localização"
                value={form.localizacao || ''}
                onChange={(value) =>
                  setForm({
                    ...form,
                    localizacao: value,
                  })
                }
              />

              <SelectField
                label="Origem"
                value={form.origem || origins[0]}
                options={origins}
                onChange={(value) =>
                  setForm({
                    ...form,
                    origem: value,
                  })
                }
              />

              <SelectField
                label="Serviço"
                value={form.servico || services[0]}
                options={services}
                onChange={(value) =>
                  setForm({
                    ...form,
                    servico: value,
                  })
                }
              />

              <Field
                label="Potência estimada (kWp)"
                type="number"
                value={String(
                  form.potencia || 0
                )}
                onChange={(value) =>
                  setForm({
                    ...form,
                    potencia: Number(value),
                  })
                }
              />

              <Field
                label="Orçamento estimado (MT)"
                type="number"
                value={String(
                  form.orcamento || 0
                )}
                onChange={(value) =>
                  setForm({
                    ...form,
                    orcamento: Number(value),
                  })
                }
              />

              <SelectField
                label="Estado"
                value={form.estado || 'Novo'}
                options={statuses}
                onChange={(value) =>
                  setForm({
                    ...form,
                    estado: value as LeadStatus,
                  })
                }
              />

              <SelectField
                label="Prioridade"
                value={
                  form.prioridade || 'Média'
                }
                options={priorities}
                onChange={(value) =>
                  setForm({
                    ...form,
                    prioridade:
                      value as Priority,
                  })
                }
              />

              <div className="md:col-span-2">

                <label className="text-sm text-gray-400">
                  Notas
                </label>

                <textarea
                  value={form.notas || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notas: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Histórico, necessidades do cliente, observações..."
                />

              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="px-5 py-3 rounded-xl border border-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-blue-500 text-black font-semibold"
                >
                  Registar Lead
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

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

      <div className="flex justify-between text-gray-400">
        <span className="text-sm">
          {title}
        </span>

        <span className="text-blue-400">
          {icon}
        </span>
      </div>

      <p className="text-2xl font-bold mt-3">
        {value}
      </p>

    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 outline-none focus:border-blue-500"
      />

    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">

      <span className="text-sm text-gray-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </label>
  )
}

function LeadCard({
  lead,
  updateLead,
  deleteLead,
}: {
  lead: Lead
  updateLead: (
    id: string,
    patch: Partial<Lead>
  ) => void
  deleteLead: (id: string) => void
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

      <div className="flex flex-col xl:flex-row gap-5">

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h2 className="text-lg font-bold">
              {lead.nome}
            </h2>

            <span className="text-xs rounded-full px-3 py-1 bg-blue-500/10 text-blue-300">
              {lead.estado}
            </span>

            <span className="text-xs rounded-full px-3 py-1 bg-gray-800 text-gray-300">
              {lead.prioridade}
            </span>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-sm">

            <Info
              label="Telefone"
              value={lead.telefone}
            />

            <Info
              label="Email"
              value={lead.email || '—'}
            />

            <Info
              label="Localização"
              value={lead.localizacao || '—'}
            />

            <Info
              label="Origem"
              value={lead.origem}
            />

            <Info
              label="Serviço"
              value={lead.servico}
            />

            <Info
              label="Potência"
              value={`${lead.potencia} kWp`}
            />

            <Info
              label="Orçamento"
              value={money(
                lead.orcamento
              )}
            />

            <Info
              label="Utilizador"
              value={lead.utilizador}
            />

          </div>

          {lead.notas && (
            <div className="mt-4 rounded-xl bg-gray-950 p-3 text-sm text-gray-400">
              {lead.notas}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-600">
            Criado: {lead.criadoEm}
            {' • '}
            Atualizado: {lead.atualizadoEm}
          </div>

        </div>

        <div className="flex xl:flex-col gap-2 xl:w-44">

          <select
            value={lead.estado}
            onChange={(e) =>
              updateLead(
                lead.id,
                {
                  estado:
                    e.target.value as LeadStatus,
                }
              )
            }
            className="flex-1 rounded-xl bg-gray-950 border border-gray-800 px-3 py-2 text-sm"
          >
            {statuses.map(
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

          <select
            value={lead.prioridade}
            onChange={(e) =>
              updateLead(
                lead.id,
                {
                  prioridade:
                    e.target.value as Priority,
                }
              )
            }
            className="flex-1 rounded-xl bg-gray-950 border border-gray-800 px-3 py-2 text-sm"
          >
            {priorities.map(
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

          <button
            onClick={() =>
              updateLead(
                lead.id,
                {
                  ultimoContacto: today(),
                }
              )
            }
            className="rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 px-3 py-2 text-sm flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            Contactado
          </button>

          <a
            href={`https://wa.me/${lead.telefone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-green-500 text-black px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>

          <button
            onClick={() =>
              deleteLead(lead.id)
            }
            className="rounded-xl border border-red-500/20 text-red-300 px-3 py-2 text-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Eliminar
          </button>

        </div>

      </div>

    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <span className="block text-xs text-gray-600">
        {label}
      </span>

      <span className="block text-gray-300 mt-1 break-words">
        {value}
      </span>
    </div>
  )
}