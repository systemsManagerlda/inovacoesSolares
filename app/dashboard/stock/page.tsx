/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Boxes, CircleAlert, Edit3, LoaderCircle, Package,
  Plus, RefreshCw, Search, Trash2, TrendingDown, TrendingUp, X,
} from 'lucide-react'

type Produto = {
  _id: string
  nomeEmpresa: string
  nomeProduto: string
  quantidadeInicial: string | number
  quantidadeEstoque: string | number
  codigoProduto: string
  stockSeguranca: string | number
  validadeProduto: string
  precoAquisicao: string | number
  precoVenda: string | number
  nomeFornecedor: string
  contactoFornecedor: string
  totalVendido?: string | number
  categoriaNovo?: string
  imgSRC?: string
}

type FormProduto = Omit<Produto, '_id' | 'nomeEmpresa' | 'totalVendido' | 'imgSRC' | 'quantidadeInicial' | 'quantidadeEstoque' | 'stockSeguranca' | 'precoAquisicao' | 'precoVenda'> & {
  quantidadeInicial: string;
  quantidadeEstoque: string;
  stockSeguranca: string;
  precoAquisicao: string;
  precoVenda: string;
}

const EMPRESA = 'Inovacoes Solares'
const STOCK_USER = 'INO-1773'
const STOCK_PASSWORD = 'Ln3co#HsVdjj'
const STOCK_SESSION_KEY = 'inovacoes_stock_auth'
const API_BASE = 'https://desktop-api-4f850b3f9733.herokuapp.com'
const emptyForm: FormProduto = {
  nomeProduto: '', quantidadeInicial: '0', quantidadeEstoque: '0',
  codigoProduto: '', stockSeguranca: '0', validadeProduto: '',
  precoAquisicao: '0', precoVenda: '0', nomeFornecedor: '',
  contactoFornecedor: '', categoriaNovo: 'Geral',
}
const numberOf = (value: string | number | undefined) => {
  const n = Number(String(value ?? '0').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
const money = (value: number) => new Intl.NumberFormat('pt-MZ', {
  style: 'currency', currency: 'MZN', maximumFractionDigits: 2,
}).format(value)

export default function StockPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [stockAuthenticated, setStockAuthenticated] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('todos')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Produto | null>(null)
  const [form, setForm] = useState<FormProduto>(emptyForm)
  const [movement, setMovement] = useState<{ product: Produto; type: 'entrada' | 'saida' } | null>(null)
  const [movementQty, setMovementQty] = useState('1')

  useEffect(() => {
    const authenticated = sessionStorage.getItem(STOCK_SESSION_KEY) === 'true'
    setStockAuthenticated(authenticated)
    setReady(authenticated)
  }, [])

  function handleStockLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loginUser.trim() === STOCK_USER && loginPassword === STOCK_PASSWORD) {
      sessionStorage.setItem(STOCK_SESSION_KEY, 'true')
      setStockAuthenticated(true)
      setReady(true)
      setLoginError('')
      setLoginPassword('')
    } else {
      setLoginError('Utilizador ou senha incorrectos.')
    }
  }

  const request = useCallback(async (path: string, init?: RequestInit) => {
    if (!API_BASE) {
      throw new Error('Configure NEXT_PUBLIC_API_URL com o endereço da API Express no ambiente da Vercel e no .env.local.')
    }
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.message || body.error || `Erro HTTP ${response.status}`)
    return body
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = `/produtosEspecificos?nomeEmpresa=${encodeURIComponent(EMPRESA)}`
      const result = await request(query)
      const list = Array.isArray(result) ? result : (result.data || [])
      setProducts(list.filter((p: Produto) => p.nomeEmpresa?.trim().toLowerCase() === EMPRESA.toLowerCase()))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Não foi possível carregar o stock.'
      if (message.toLowerCase().includes('nenhum produto')) {
        setProducts([])
        setError('')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (ready) void loadProducts()
  }, [ready, loadProducts])

  const filtered = useMemo(() => products.filter((p) => {
    const term = search.trim().toLowerCase()
    const matches = !term || [p.nomeProduto, p.codigoProduto, p.categoriaNovo, p.nomeFornecedor]
      .some((v) => String(v || '').toLowerCase().includes(term))
    const qty = numberOf(p.quantidadeEstoque)
    const safety = numberOf(p.stockSeguranca)
    const matchesStock = stockFilter === 'todos' ||
      (stockFilter === 'baixo' && qty <= safety) ||
      (stockFilter === 'esgotado' && qty <= 0)
    return matches && matchesStock
  }), [products, search, stockFilter])

  const summary = useMemo(() => products.reduce((acc, p) => {
    const qty = numberOf(p.quantidadeEstoque)
    acc.items += 1
    acc.units += qty
    acc.costValue += qty * numberOf(p.precoAquisicao)
    acc.low += qty <= numberOf(p.stockSeguranca) ? 1 : 0
    return acc
  }, { items: 0, units: 0, costValue: 0, low: 0 }), [products])

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm })
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function openEdit(product: Produto) {
    setEditing(product)
    setForm({
      nomeProduto: product.nomeProduto || '',
      quantidadeInicial: String(product.quantidadeInicial ?? '0'),
      quantidadeEstoque: String(product.quantidadeEstoque ?? '0'),
      codigoProduto: product.codigoProduto || '',
      stockSeguranca: String(product.stockSeguranca ?? '0'),
      validadeProduto: product.validadeProduto || '',
      precoAquisicao: String(product.precoAquisicao ?? '0'),
      precoVenda: String(product.precoVenda ?? '0'),
      nomeFornecedor: product.nomeFornecedor || '',
      contactoFornecedor: product.contactoFornecedor || '',
      categoriaNovo: product.categoriaNovo || 'Geral',
    })
    setShowForm(true)
    setError('')
    setNotice('')
  }

  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const payload = {
        ...form,
        nomeEmpresa: EMPRESA,
        quantidadeInicial: String(numberOf(form.quantidadeInicial)),
        quantidadeEstoque: String(numberOf(form.quantidadeEstoque)),
        stockSeguranca: String(numberOf(form.stockSeguranca)),
        precoAquisicao: String(numberOf(form.precoAquisicao)),
        precoVenda: String(numberOf(form.precoVenda)),
        validadeProduto: form.validadeProduto.trim() || 'Não aplicável',
        nomeFornecedor: form.nomeFornecedor.trim() || 'Não indicado',
        contactoFornecedor: form.contactoFornecedor.trim() || 'Não indicado',
      }
      if (editing) {
        // O endpoint existente de edição recebe o produto completo.
        const { quantidadeEstoque, ...details } = payload
        await request(`/editarProduto/${encodeURIComponent(editing._id)}`, {
          method: 'PATCH', body: JSON.stringify({ ...details, nomeEmpresa: EMPRESA }),
        })
        // Ajusta o saldo separadamente, usando o endpoint de ajuste existente.
        const oldQty = numberOf(editing.quantidadeEstoque)
        const newQty = numberOf(quantidadeEstoque)
        if (oldQty !== newQty) {
          if (newQty > oldQty) {
            await request(`/editarProduto/${encodeURIComponent(editing._id)}`, {
              method: 'PATCH', body: JSON.stringify({ quantidadeEstoque: String(newQty) }),
            })
          } else {
            await request(`/reduzirProduto/${encodeURIComponent(editing.codigoProduto)}`, {
              method: 'PATCH', body: JSON.stringify({ nomeEmpresa: EMPRESA, quantidadeEstoque: String(oldQty - newQty) }),
            })
          }
        }
        setNotice('Produto actualizado com sucesso.')
      } else {
        await request('/novoProduto', { method: 'POST', body: JSON.stringify(payload) })
        setNotice('Produto registado com sucesso.')
      }
      setShowForm(false)
      await loadProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível guardar o produto.')
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(product: Produto) {
    if (!confirm(`Deseja eliminar “${product.nomeProduto}” do stock da ${EMPRESA}?`)) return
    setError('')
    setNotice('')
    try {
      await request(`/removerProduto/${encodeURIComponent(product._id)}`, { method: 'DELETE' })
      setProducts((current) => current.filter((p) => p._id !== product._id))
      setNotice('Produto eliminado com sucesso.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível eliminar o produto.')
    }
  }

  async function saveMovement(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!movement) return
    const qty = numberOf(movementQty)
    if (qty <= 0) {
      setError('Introduza uma quantidade superior a zero.')
      return
    }
    const current = numberOf(movement.product.quantidadeEstoque)
    if (movement.type === 'saida' && qty > current) {
      setError(`Stock insuficiente. Disponível: ${current}.`)
      return
    }
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (movement.type === 'entrada') {
        await request(`/editarProduto/${encodeURIComponent(movement.product._id)}`, {
          method: 'PATCH', body: JSON.stringify({ quantidadeEstoque: String(current + qty) }),
        })
      } else {
        await request(`/reduzirProduto/${encodeURIComponent(movement.product.codigoProduto)}`, {
          method: 'PATCH', body: JSON.stringify({ nomeEmpresa: EMPRESA, quantidadeEstoque: String(qty) }),
        })
      }
      setMovement(null)
      setMovementQty('1')
      setNotice(`Movimento de ${movement.type} registado com sucesso.`)
      await loadProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível actualizar o stock.')
    } finally {
      setSaving(false)
    }
  }

  function logout() {
    sessionStorage.removeItem(STOCK_SESSION_KEY)
    setStockAuthenticated(false)
    setReady(false)
    setProducts([])
    setShowForm(false)
    setEditing(null)
  }

  if (!stockAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
        <form onSubmit={handleStockLogin} className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
          <p className="text-sm font-semibold tracking-wide text-emerald-400">INOVAÇÕES SOLARES</p>
          <h1 className="mt-2 text-2xl font-bold">Acesso à Gestão de Stock</h1>
          <p className="mt-2 text-sm text-gray-400">Introduza as credenciais autorizadas para continuar.</p>
          {loginError && <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{loginError}</div>}
          <label className="mt-6 block text-sm text-gray-300">Utilizador</label>
          <input autoComplete="username" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} required className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Código de utilizador" />
          <label className="mt-4 block text-sm text-gray-300">Senha</label>
          <input type="password" autoComplete="current-password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Introduza a senha" />
          <button type="submit" className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-gray-950 hover:bg-emerald-300">Entrar</button>
        </form>
      </main>
    )
  }

  if (!ready) return null

  return (
    <main className="min-h-screen bg-gray-950 px-4 pb-12 pt-24 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-400">INOVAÇÕES SOLARES</p>
            <h1 className="mt-1 text-3xl font-bold">Gestão de Stock</h1>
            <p className="mt-2 text-gray-400">Produtos e movimentos exclusivos de {EMPRESA}.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 hover:bg-gray-900"><ArrowLeft size={17}/> Voltar ao dashboard</button>
            <button onClick={() => void loadProducts()} className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 hover:bg-gray-900"><RefreshCw size={17}/> Actualizar</button>
            <button onClick={logout} className="rounded-xl border border-red-500/30 px-4 py-2 text-red-300 hover:bg-red-500/10">Sair</button>
          </div>
        </header>

        {error && <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200"><CircleAlert size={20} className="mt-0.5 shrink-0"/><p className="text-sm">{error}</p></div>}
        {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{notice}</div>}

        {!API_BASE && <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">Para ligar esta área à sua API Express, configure <code>NEXT_PUBLIC_API_URL</code> com o endereço base do servidor e volte a publicar o website.</div>}

        <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Stat title="Referências" value={String(summary.items)} icon={<Package size={20}/>} />
          <Stat title="Unidades em stock" value={String(summary.units)} icon={<Boxes size={20}/>} />
          <Stat title="Abaixo do stock de segurança" value={String(summary.low)} icon={<TrendingDown size={20}/>} />
          <Stat title="Valor de aquisição em stock" value={money(summary.costValue)} icon={<TrendingUp size={20}/>} />
        </section>

        <section className="mb-5 rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por produto, código, categoria ou fornecedor..." className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 outline-none focus:border-emerald-500"/></div>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3"><option value="todos">Todo o stock</option><option value="baixo">Stock baixo</option><option value="esgotado">Esgotados</option></select>
            <button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-gray-950 hover:bg-emerald-300"><Plus size={18}/> Novo produto</button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
          <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4"><h2 className="font-semibold">Produtos da Inovações Solares</h2><span className="text-sm text-gray-500">{filtered.length} registo(s)</span></div>
          {loading ? <div className="flex items-center justify-center gap-3 p-12 text-gray-400"><LoaderCircle className="animate-spin" size={20}/> A carregar stock...</div> : filtered.length === 0 ? <div className="p-12 text-center"><Package size={34} className="mx-auto mb-3 text-gray-600"/><p className="text-gray-300">Nenhum produto encontrado.</p><p className="mt-1 text-sm text-gray-500">Registe um produto ou altere os filtros de pesquisa.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="bg-gray-950/70 text-xs uppercase text-gray-500"><tr><th className="px-5 py-4">Produto</th><th className="px-4 py-4">Código</th><th className="px-4 py-4">Categoria</th><th className="px-4 py-4">Quantidade</th><th className="px-4 py-4">Stock segurança</th><th className="px-4 py-4">Preço venda</th><th className="px-4 py-4">Estado</th><th className="px-5 py-4 text-right">Acções</th></tr></thead><tbody className="divide-y divide-gray-800">{filtered.map((p) => { const qty = numberOf(p.quantidadeEstoque); const low = qty <= numberOf(p.stockSeguranca); return <tr key={p._id} className="hover:bg-gray-800/40"><td className="px-5 py-4"><p className="font-semibold text-white">{p.nomeProduto}</p><p className="mt-1 text-xs text-gray-500">{p.nomeFornecedor || 'Fornecedor não indicado'}</p></td><td className="px-4 py-4 font-mono text-gray-300">{p.codigoProduto}</td><td className="px-4 py-4 text-gray-300">{p.categoriaNovo || 'Geral'}</td><td className="px-4 py-4 font-semibold">{qty}</td><td className="px-4 py-4 text-gray-300">{numberOf(p.stockSeguranca)}</td><td className="px-4 py-4 text-gray-300">{money(numberOf(p.precoVenda))}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${qty <= 0 ? 'bg-red-500/10 text-red-300' : low ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{qty <= 0 ? 'Esgotado' : low ? 'Stock baixo' : 'Disponível'}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button title="Entrada" onClick={() => {setMovement({product:p,type:'entrada'});setMovementQty('1');setError('')}} className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"><TrendingUp size={17}/></button><button title="Saída" onClick={() => {setMovement({product:p,type:'saida'});setMovementQty('1');setError('')}} className="rounded-lg p-2 text-amber-300 hover:bg-amber-500/10"><TrendingDown size={17}/></button><button title="Editar" onClick={() => openEdit(p)} className="rounded-lg p-2 text-blue-300 hover:bg-blue-500/10"><Edit3 size={17}/></button><button title="Eliminar" onClick={() => void removeProduct(p)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"><Trash2 size={17}/></button></div></td></tr>})}</tbody></table></div>}
        </section>
      </div>

      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold">{editing ? 'Editar produto' : 'Novo produto'}</h2><p className="mt-1 text-sm text-gray-500">Empresa: {EMPRESA}</p></div><button onClick={() => setShowForm(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-800"><X size={20}/></button></div><form onSubmit={saveProduct} className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome do produto" required value={form.nomeProduto} onChange={(v) => setForm({...form,nomeProduto:v})}/><Field label="Código do produto" required value={form.codigoProduto} onChange={(v) => setForm({...form,codigoProduto:v})}/><Field label="Categoria" value={form.categoriaNovo || ''} onChange={(v) => setForm({...form,categoriaNovo:v})}/><Field label="Quantidade inicial" type="number" min="0" required value={form.quantidadeInicial} onChange={(v) => setForm({...form,quantidadeInicial:v})}/><Field label="Quantidade actual em stock" type="number" min="0" required value={form.quantidadeEstoque} onChange={(v) => setForm({...form,quantidadeEstoque:v})}/><Field label="Stock de segurança" type="number" min="0" required value={form.stockSeguranca} onChange={(v) => setForm({...form,stockSeguranca:v})}/><Field label="Preço de aquisição (MT)" type="number" min="0" step="0.01" required value={form.precoAquisicao} onChange={(v) => setForm({...form,precoAquisicao:v})}/><Field label="Preço de venda (MT)" type="number" min="0" step="0.01" required value={form.precoVenda} onChange={(v) => setForm({...form,precoVenda:v})}/><Field label="Fornecedor" value={form.nomeFornecedor} onChange={(v) => setForm({...form,nomeFornecedor:v})}/><Field label="Contacto do fornecedor" value={form.contactoFornecedor} onChange={(v) => setForm({...form,contactoFornecedor:v})}/><Field label="Validade" value={form.validadeProduto} onChange={(v) => setForm({...form,validadeProduto:v})}/>
        <div className="flex items-end gap-3 sm:col-span-2"><button disabled={saving} type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-gray-950 disabled:opacity-50">{saving && <LoaderCircle size={17} className="animate-spin"/>}{editing ? 'Guardar alterações' : 'Registar produto'}</button><button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-gray-700 px-5 py-3">Cancelar</button></div></form></div></div>}

      {movement && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-6"><div className="mb-5 flex items-start justify-between"><div><h2 className="text-xl font-bold">{movement.type === 'entrada' ? 'Entrada de stock' : 'Saída de stock'}</h2><p className="mt-1 text-sm text-gray-400">{movement.product.nomeProduto}</p><p className="mt-1 text-xs text-gray-500">Disponível: {numberOf(movement.product.quantidadeEstoque)} unidades</p></div><button onClick={() => setMovement(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-800"><X size={20}/></button></div><form onSubmit={saveMovement} className="space-y-4"><Field label="Quantidade" type="number" min="1" required value={movementQty} onChange={setMovementQty}/>{error && <p className="text-sm text-red-300">{error}</p>}<button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-gray-950 disabled:opacity-50" type="submit">{saving && <LoaderCircle size={17} className="animate-spin"/>}Confirmar {movement.type === 'entrada' ? 'entrada' : 'saída'}</button></form></div></div>}
    </main>
  )
}

function Stat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-gray-400">{title}</p><span className="text-emerald-300">{icon}</span></div><p className="text-2xl font-bold">{value}</p></div>
}

function Field({ label, value, onChange, type = 'text', required = false, min, step }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string; step?: string }) {
  return <label className="block min-w-0 w-full"><span className="mb-2 block text-sm text-gray-400">{label}</span><input type={type} min={min} step={step} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="box-border block min-w-0 w-full max-w-full appearance-none rounded-xl border border-gray-800 bg-gray-900 px-3 sm:px-4 py-3 text-base text-white outline-none focus:border-emerald-500"/></label>
}
