/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Boxes,
  CircleAlert,
  Edit3,
  FileText,
  LoaderCircle,
  Package,
  Plus,
  Printer,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  History,
  Truck,
  ClipboardCheck,
} from "lucide-react";

type Produto = {
  _id: string;
  nomeEmpresa: string;
  nomeProduto: string;
  quantidadeInicial: string | number;

  quantidadeEstoque: string | number;
  codigoProduto: string;
  stockSeguranca: string | number;

  validadeProduto: string;
  precoAquisicao: string | number;
  precoVenda: string | number;

  nomeFornecedor: string;
  contactoFornecedor: string;
  totalVendido?: string | number;

  categoriaNovo?: string;
  imgSRC?: string;
};

type Funcionario = {
  _id: string;
  nomeEmpresa: string;
  nomeFuncionario: string;
  cargo?: string;
  departamento?: string;
  status?: string;
  contactos?: string;
  email?: string;
};

type Movimento = {
  _id: string;
  nomeEmpresa: string;
  produtoId: string;
  nomeProduto: string;
  codigoProduto: string;

  tipo: "entrada" | "saida" | "ajuste";
  quantidade: number;
  saldoAnterior: number;
  saldoPosterior: number;

  tecnicoResponsavel?: string;
  clienteNome?: string;
  clienteContacto?: string;
  destino?: string;

  finalidade?: string;
  documentoTipo?: string;
  gestorStock?: string;
  assinaturaGestor?: string;

  observacoes?: string;
  createdAt: string;
};

type Encomenda = {
  _id: string;
  numero: string;
  fornecedor: string;
  contactoFornecedor?: string;
  dataNecessaria?: string;
  solicitante: string;
  estado: string;
  observacoes?: string;
  itens: {
    produtoId: string;
    nomeProduto: string;
    codigoProduto: string;
    quantidade: number;
    precoUnitario: number;
  }[];
  total: number;
  createdAt: string;
};

type FormProduto = {
  nomeProduto: string;
  quantidadeInicial: string;
  quantidadeEstoque: string;
  codigoProduto: string;
  stockSeguranca: string;
  validadeProduto: string;
  precoAquisicao: string;
  precoVenda: string;
  nomeFornecedor: string;
  contactoFornecedor: string;
  categoriaNovo: string;
};

type FormMovimento = {
  quantidade: string;
  tecnicoResponsavel: string;
  clienteNome: string;
  clienteContacto: string;
  destino: string;
  finalidade: string;
  documentoTipo: "nenhum" | "guia-transporte" | "guia-remessa";
  gestorStock: string;
  assinaturaGestor: string;
  observacoes: string;
};

type ItemEncomenda = {
  produtoId: string;
  nomeProduto: string;
  codigoProduto: string;
  quantidade: string;
  precoUnitario: string;
};

const EMPRESA = "Inovacoes Solares";

const EMPRESA_FUNCIONARIOS = "Inovacoes Solares, Lda";

const STOCK_USER = "INO-1773";

const STOCK_PASSWORD = "Ln3co#HsVdjj";

const STOCK_SESSION_KEY = "inovacoes_stock_auth";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https\://desktop-api-4f850b3f9733.herokuapp.com"
).replace(/\/$/, "");

const emptyForm: FormProduto = {
  nomeProduto: "",
  quantidadeInicial: "0",
  quantidadeEstoque: "0",
  codigoProduto: "",
  stockSeguranca: "0",
  validadeProduto: "",
  precoAquisicao: "0",
  precoVenda: "0",
  nomeFornecedor: "",
  contactoFornecedor: "",
  categoriaNovo: "Geral",
};

const emptyMovement: FormMovimento = {
  quantidade: "1",
  tecnicoResponsavel: "",
  clienteNome: "",
  clienteContacto: "",
  destino: "",
  finalidade: "",
  documentoTipo: "nenhum",
  gestorStock: "",
  assinaturaGestor: "",
  observacoes: "",
};

const numberOf = (value: string | number | undefined) => {
  const n = Number(String(value ?? "0").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 2,
  }).format(value);

const dateTime = (v?: string) =>
  v ? new Date(v).toLocaleString("pt-MZ") : "—";

export default function StockPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);

  const [stockAuthenticated, setStockAuthenticated] = useState(false);

  const [loginUser, setLoginUser] = useState("");

  const [loginPassword, setLoginPassword] = useState("");

  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState<Produto[]>([]);

  const [movements, setMovements] = useState<Movimento[]>([]);

  const [orders, setOrders] = useState<Encomenda[]>([]);

  const [employees, setEmployees] = useState<Funcionario[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [search, setSearch] = useState("");

  const [stockFilter, setStockFilter] = useState("todos");

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  const [showProductForm, setShowProductForm] = useState(false);

  const [editing, setEditing] = useState<Produto | null>(null);

  const [productForm, setProductForm] = useState<FormProduto>(emptyForm);

  const [movementProduct, setMovementProduct] = useState<Produto | null>(null);

  const [movementType, setMovementType] = useState<"entrada" | "saida">(
    "saida",
  );

  const [movementForm, setMovementForm] =
    useState<FormMovimento>(emptyMovement);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderSupplier, setOrderSupplier] = useState("");

  const [orderContact, setOrderContact] = useState("");

  const [orderDate, setOrderDate] = useState("");

  const [orderRequester, setOrderRequester] = useState("");

  const [orderNotes, setOrderNotes] = useState("");

  const [orderItems, setOrderItems] = useState<ItemEncomenda[]>([
    {
      produtoId: "",
      nomeProduto: "",
      codigoProduto: "",
      quantidade: "1",
      precoUnitario: "0",
    },
  ]);

  const [historyProduct, setHistoryProduct] = useState<Produto | null>(null);

  const [docMovement, setDocMovement] = useState<Movimento | null>(null);

  const [docKind, setDocKind] = useState<"guia-transporte" | "guia-remessa">(
    "guia-remessa",
  );

  const [filterFrom, setFilterFrom] = useState("");

  const [filterTo, setFilterTo] = useState("");

  // Paginação independente para cada tabela.
  const [pageSize, setPageSize] = useState(10);
  const [productsPage, setProductsPage] = useState(1);
  const [exitsPage, setExitsPage] = useState(1);
  const [movementsPage, setMovementsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);

  useEffect(() => {
    const authenticated = sessionStorage.getItem(STOCK_SESSION_KEY) === "true";

    setStockAuthenticated(authenticated);
    setReady(authenticated);
  }, []);

  function handleStockLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loginUser.trim() === STOCK_USER && loginPassword === STOCK_PASSWORD) {
      sessionStorage.setItem(STOCK_SESSION_KEY, "true");
      setStockAuthenticated(true);
      setReady(true);
      setLoginError("");
      setLoginPassword("");
    } else setLoginError("Utilizador ou senha incorrectos.");
  }

  const request = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok || body?.status === "error")
      throw new Error(
        body.message || body.error || `Erro HTTP ${response.status}`,
      );

    return body;
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request(
        `/produtosEspecificos?nomeEmpresa=${encodeURIComponent(EMPRESA)}`,
      );

      const list = Array.isArray(result)
        ? result
        : result.data || result.produtos || [];

      setProducts(
        list.filter(
          (p: Produto) =>
            p.nomeEmpresa?.trim().toLowerCase() === EMPRESA.toLowerCase(),
        ),
      );
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Não foi possível carregar o stock.";
      if (msg.toLowerCase().includes("nenhum produto")) {
        setProducts([]);
        setError("");
      } else setError(msg);
    } finally {
      setLoading(false);
    }
  }, [request]);

  const loadEmployees = useCallback(async () => {
    setLoadingEmployees(true);

    try {
      const result = await request(
        `/funcionariosEmpresa?nomeEmpresa=${encodeURIComponent(EMPRESA_FUNCIONARIOS)}`,
      );

      const list: Funcionario[] = Array.isArray(result.funcionarios)
        ? result.funcionarios
        : [];

      setEmployees(
        list.filter(
          (f) =>
            f.nomeEmpresa?.trim() === EMPRESA_FUNCIONARIOS &&
            f.status?.trim().toLowerCase() === "activo",
        ),
      );
    } catch (e) {
      setEmployees([]);
      setError(
        e instanceof Error
          ? `Erro ao carregar funcionários: ${e.message}`
          : "Erro ao carregar funcionários.",
      );
    } finally {
      setLoadingEmployees(false);
    }
  }, [request]);

  const loadMovements = useCallback(async () => {
    try {
      const params = new URLSearchParams({ nomeEmpresa: EMPRESA });

      if (filterFrom) params.set("de", filterFrom);

      if (filterTo) params.set("ate", filterTo);

      const result = await request(`/stock/movimentos?${params.toString()}`);

      setMovements(Array.isArray(result.movimentos) ? result.movimentos : []);
    } catch (e) {
      setMovements([]);
      setError(
        e instanceof Error
          ? `Histórico indisponível: ${e.message}`
          : "Histórico indisponível. Confirme a instalação das rotas adicionais no backend.",
      );
    }
  }, [request, filterFrom, filterTo]);

  const loadOrders = useCallback(async () => {
    try {
      const result = await request(
        `/stock/encomendas?nomeEmpresa=${encodeURIComponent(EMPRESA)}`,
      );
      setOrders(Array.isArray(result.encomendas) ? result.encomendas : []);
    } catch (e) {
      setOrders([]);
      setError(
        e instanceof Error
          ? `Ordens de compra indisponíveis: ${e.message}`
          : "Ordens de compra indisponíveis.",
      );
    }
  }, [request]);

  useEffect(() => {
    if (ready) {
      void loadProducts();
      void loadEmployees();
      void loadMovements();
      void loadOrders();
    }
  }, [ready, loadProducts, loadEmployees, loadMovements, loadOrders]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const term = search.trim().toLowerCase();

        const matches =
          !term ||
          [
            p.nomeProduto,
            p.codigoProduto,
            p.categoriaNovo,
            p.nomeFornecedor,
          ].some((v) =>
            String(v || "")
              .toLowerCase()
              .includes(term),
          );

        const qty = numberOf(p.quantidadeEstoque);
        const safety = numberOf(p.stockSeguranca);

        return (
          matches &&
          (stockFilter === "todos" ||
            (stockFilter === "baixo" && qty <= safety) ||
            (stockFilter === "esgotado" && qty <= 0))
        );
      }),
    [products, search, stockFilter],
  );

  const summary = useMemo(
    () =>
      products.reduce(
        (a, p) => {
          const q = numberOf(p.quantidadeEstoque);
          a.items++;
          a.units += q;
          a.value += q * numberOf(p.precoAquisicao);
          if (q <= numberOf(p.stockSeguranca)) a.low++;
          return a;
        },
        { items: 0, units: 0, value: 0, low: 0 },
      ),
    [products],
  );

  const filteredMovements = useMemo(
    () =>
      movements.filter(
        (m) =>
          (!filterFrom || m.createdAt.slice(0, 10) >= filterFrom) &&
          (!filterTo || m.createdAt.slice(0, 10) <= filterTo),
      ),
    [movements, filterFrom, filterTo],
  );

  const exits = filteredMovements.filter((m) => m.tipo === "saida");

  const productsPageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const exitsPageCount = Math.max(1, Math.ceil(exits.length / pageSize));
  const movementsPageCount = Math.max(1, Math.ceil(filteredMovements.length / pageSize));
  const ordersPageCount = Math.max(1, Math.ceil(orders.length / pageSize));

  const paginatedProducts = filtered.slice((productsPage - 1) * pageSize, productsPage * pageSize);
  const paginatedExits = exits.slice((exitsPage - 1) * pageSize, exitsPage * pageSize);
  const paginatedMovements = filteredMovements.slice((movementsPage - 1) * pageSize, movementsPage * pageSize);
  const paginatedOrders = orders.slice((ordersPage - 1) * pageSize, ordersPage * pageSize);

  // Evita permanecer numa página que deixou de existir após pesquisar ou filtrar.
  useEffect(() => {
    setProductsPage(1);
  }, [search, stockFilter, pageSize]);

  useEffect(() => {
    setExitsPage(1);
    setMovementsPage(1);
  }, [filterFrom, filterTo, pageSize]);

  useEffect(() => {
    setOrdersPage((page) => Math.min(page, ordersPageCount));
  }, [ordersPageCount]);

  useEffect(() => {
    setProductsPage((page) => Math.min(page, productsPageCount));
  }, [productsPageCount]);

  useEffect(() => {
    setExitsPage((page) => Math.min(page, exitsPageCount));
  }, [exitsPageCount]);

  useEffect(() => {
    setMovementsPage((page) => Math.min(page, movementsPageCount));
  }, [movementsPageCount]);

  function openCreate() {
    setEditing(null);
    setProductForm({ ...emptyForm });
    setShowProductForm(true);
    setError("");
    setNotice("");
  }

  function openEdit(p: Produto) {
    setEditing(p);
    setProductForm({
      nomeProduto: p.nomeProduto || "",
      quantidadeInicial: String(p.quantidadeInicial ?? 0),
      quantidadeEstoque: String(p.quantidadeEstoque ?? 0),
      codigoProduto: p.codigoProduto || "",
      stockSeguranca: String(p.stockSeguranca ?? 0),
      validadeProduto: p.validadeProduto || "",
      precoAquisicao: String(p.precoAquisicao ?? 0),
      precoVenda: String(p.precoVenda ?? 0),
      nomeFornecedor: p.nomeFornecedor || "",
      contactoFornecedor: p.contactoFornecedor || "",
      categoriaNovo: p.categoriaNovo || "Geral",
    });
    setShowProductForm(true);
    setError("");
    setNotice("");
  }

  async function saveProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...productForm,
        nomeEmpresa: EMPRESA,
        quantidadeInicial: String(numberOf(productForm.quantidadeInicial)),
        quantidadeEstoque: String(numberOf(productForm.quantidadeEstoque)),
        stockSeguranca: String(numberOf(productForm.stockSeguranca)),
        precoAquisicao: String(numberOf(productForm.precoAquisicao)),
        precoVenda: String(numberOf(productForm.precoVenda)),
        validadeProduto: productForm.validadeProduto.trim() || "Não aplicável",
        nomeFornecedor: productForm.nomeFornecedor.trim() || "Não indicado",
        contactoFornecedor:
          productForm.contactoFornecedor.trim() || "Não indicado",
      };

      if (editing) {
        const { quantidadeEstoque, ...details } = payload;

        await request(`/editarProduto/${encodeURIComponent(editing._id)}`, {
          method: "PATCH",
          body: JSON.stringify({ ...details, nomeEmpresa: EMPRESA }),
        });

        const oldQty = numberOf(editing.quantidadeEstoque);
        const newQty = numberOf(quantidadeEstoque);

        if (oldQty !== newQty) {
          await request(`/stock/movimentos`, {
            method: "POST",
            body: JSON.stringify({
              nomeEmpresa: EMPRESA,
              produtoId: editing._id,
              tipo: newQty > oldQty ? "entrada" : "saida",
              quantidade: Math.abs(newQty - oldQty),
              tecnicoResponsavel: newQty < oldQty ? "Ajuste de stock" : "",
              clienteNome: newQty < oldQty ? "Ajuste manual" : "",
              gestorStock: "Gestor de Stock",
              assinaturaGestor: "Gestor de Stock",
              finalidade: "Ajuste efectuado na edição do produto",
            }),
          });
        }

        setNotice("Produto actualizado com sucesso.");
      } else {
        await request("/novoProduto", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        await loadProducts();

        const created =
          products.find((p) => p.codigoProduto === payload.codigoProduto) ||
          null; // A lista React pode ainda conter o estado anterior; procura novamente na API para obter o ID criado.

        const freshResult = await request(
          `/produtosEspecificos?nomeEmpresa=${encodeURIComponent(EMPRESA)}`,
        );

        const freshList: Produto[] = Array.isArray(freshResult)
          ? freshResult
          : freshResult.data || freshResult.produtos || [];

        const createdProduct =
          freshList.find(
            (p) =>
              p.codigoProduto === payload.codigoProduto &&
              p.nomeEmpresa?.trim().toLowerCase() === EMPRESA.toLowerCase(),
          ) || created;

        if (createdProduct && numberOf(payload.quantidadeEstoque) >= 0) {
          await request("/stock/movimentos/inicial", {
            method: "POST",
            body: JSON.stringify({
              nomeEmpresa: EMPRESA,
              produtoId: createdProduct._id,
              quantidade: numberOf(payload.quantidadeEstoque),
              gestorStock: "Registo inicial",
              assinaturaGestor: "Registo inicial",
            }),
          });
        }

        setNotice(
          "Produto registado com sucesso e saldo inicial adicionado ao histórico.",
        );
      }

      setShowProductForm(false);
      await loadProducts();
      await loadMovements();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível guardar o produto.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(p: Produto) {
    if (!confirm(`Deseja eliminar “${p.nomeProduto}” do stock da ${EMPRESA}?`))
      return;

    try {
      await request(`/removerProduto/${encodeURIComponent(p._id)}`, {
        method: "DELETE",
      });
      setProducts((c) => c.filter((x) => x._id !== p._id));
      setNotice("Produto eliminado com sucesso.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível eliminar o produto.",
      );
    }
  }

  function openMovement(p: Produto, type: "entrada" | "saida") {
    setMovementProduct(p);
    setMovementType(type);

    setMovementForm({
      ...emptyMovement,
      quantidade: "1",
      tecnicoResponsavel: "",
      gestorStock: "",
      assinaturaGestor: "",
      documentoTipo: type === "saida" ? "guia-remessa" : "nenhum",
    });

    setError("");
    setNotice("");
  }

  async function saveMovement(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Impede submissões repetidas.
    if (saving) return;

    if (!movementProduct?._id) {
      setError("Seleccione um produto válido.");
      return;
    }

    const quantidade = numberOf(movementForm.quantidade);
    const gestorStock = movementForm.gestorStock.trim();

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
      setError("A quantidade deve ser superior a zero.");
      return;
    }

    if (!gestorStock) {
      setError("Indique o nome do gestor de stock.");
      return;
    }

    if (
      movementType === "saida" &&
      quantidade > numberOf(movementProduct.quantidadeEstoque)
    ) {
      setError(
        `Stock insuficiente. Disponível: ${movementProduct.quantidadeEstoque}.`,
      );
      return;
    }

    if (movementType === "saida" && !movementForm.tecnicoResponsavel.trim()) {
      setError("Seleccione o técnico responsável.");
      return;
    }

    if (movementType === "saida" && !movementForm.clienteNome.trim()) {
      setError("Indique o cliente ou destinatário do material.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...movementForm,
      nomeEmpresa: EMPRESA,
      produtoId: movementProduct._id,
      tipo: movementType,
      quantidade,
      gestorStock,
      tecnicoResponsavel: movementForm.tecnicoResponsavel.trim(),
      clienteNome: movementForm.clienteNome.trim(),
      clienteContacto: movementForm.clienteContacto.trim(),
      destino: movementForm.destino.trim(),
      finalidade: movementForm.finalidade.trim(),
      observacoes: movementForm.observacoes.trim(),
    };

    try {
      // 1. Registar o movimento no backend.
      const result = await request("/stock/movimentos", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // 2. Confirmar o sucesso do registo.
      setNotice(
        movementType === "entrada"
          ? "Entrada de stock registada com sucesso."
          : "Saída de stock registada com sucesso.",
      );

      // 3. Preparar o documento, caso tenha sido seleccionado.
      if (result?.movimento && movementForm.documentoTipo !== "nenhum") {
        setDocMovement(result.movimento);
        setDocKind(movementForm.documentoTipo);
      }

      // 4. Fechar o formulário depois de a API confirmar o registo.
      setMovementProduct(null);

      // 5. Actualizar os dados sem anular o sucesso da gravação.
      try {
        await Promise.all([loadProducts(), loadMovements()]);
      } catch (refreshError) {
        console.error(
          "Movimento registado, mas houve um erro ao actualizar as listas:",
          refreshError,
        );

        setNotice(
          "Movimento registado. Actualize a página para ver o stock actualizado.",
        );
      }
    } catch (err) {
      console.error("Erro ao registar movimento de stock:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível registar o movimento. Verifique a ligação ao servidor.",
      );
    } finally {
      setSaving(false);
    }
  }

  function addOrderItem() {
    setOrderItems((a) => [
      ...a,
      {
        produtoId: "",
        nomeProduto: "",
        codigoProduto: "",
        quantidade: "1",
        precoUnitario: "0",
      },
    ]);
  }

  function updateOrderItem(index: number, productId: string) {
    const p = products.find((x) => x._id === productId);

    setOrderItems((items) =>
      items.map((it, i) =>
        i === index
          ? {
              produtoId: p?._id || "",
              nomeProduto: p?.nomeProduto || "",
              codigoProduto: p?.codigoProduto || "",
              quantidade: it.quantidade || "1",
              precoUnitario: String(numberOf(p?.precoAquisicao)),
            }
          : it,
      ),
    );
  }

  async function saveOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const items = orderItems
        .filter((i) => i.produtoId && numberOf(i.quantidade) > 0)
        .map((i) => ({
          ...i,
          quantidade: numberOf(i.quantidade),
          precoUnitario: numberOf(i.precoUnitario),
        }));

      await request("/stock/encomendas", {
        method: "POST",
        body: JSON.stringify({
          nomeEmpresa: EMPRESA,
          fornecedor: orderSupplier,
          contactoFornecedor: orderContact,
          dataNecessaria: orderDate,
          solicitante: orderRequester,
          observacoes: orderNotes,
          itens: items,
        }),
      });

      setShowOrderForm(false);
      setOrderSupplier("");
      setOrderContact("");
      setOrderDate("");
      setOrderRequester("");
      setOrderNotes("");
      setOrderItems([
        {
          produtoId: "",
          nomeProduto: "",
          codigoProduto: "",
          quantidade: "1",
          precoUnitario: "0",
        },
      ]);
      setNotice("Ordem de compra criada.");
      await loadOrders();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível criar a ordem de compra.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateOrderStatus(order: Encomenda, estado: string) {
    try {
      await request(
        `/stock/encomendas/${encodeURIComponent(order._id)}/estado`,
        { method: "PATCH", body: JSON.stringify({ estado }) },
      );
      await loadOrders();
      setNotice(`Estado da encomenda alterado para ${estado}.`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível actualizar a encomenda.",
      );
    }
  }

  function printArea(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const w = window.open("", "_blank", "width=1000,height=800");
    if (!w) {
      setError(
        "Permita janelas pop-up para imprimir ou guardar o documento em PDF.",
      );
      return;
    }

    w.document.write(
      `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Inovações Solares - Documento de Stock</title><style>body{font-family:Arial,sans-serif;color:#111;padding:28px}h1,h2{margin-bottom:6px}.muted{color:#555;font-size:12px}table{border-collapse:collapse;width:100%;margin-top:18px}th,td{border:1px solid #aaa;padding:8px;text-align:left;font-size:12px}th{background:#eee}.signatures{display:flex;gap:40px;margin-top:70px}.signatures div{border-top:1px solid #555;flex:1;padding-top:8px;text-align:center}.no-print{display:none!important}</style></head><body>${el.innerHTML}</body></html>`,
    );
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      w.close();
    }, 350);
  }

  function logout() {
    sessionStorage.removeItem(STOCK_SESSION_KEY);
    setStockAuthenticated(false);
    setReady(false);
    setProducts([]);
  }

  if (!stockAuthenticated)
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
        <form
          onSubmit={handleStockLogin}
          className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl"
        >
          <p className="text-sm font-semibold tracking-wide text-emerald-400">
            INOVAÇÕES SOLARES
          </p>
          <h1 className="mt-2 text-2xl font-bold">Acesso à Gestão de Stock</h1>
          <p className="mt-2 text-sm text-gray-400">
            Introduza as credenciais autorizadas para continuar.
          </p>
          {loginError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
            >
              {loginError}
            </div>
          )}
          <label className="mt-6 block text-sm text-gray-300">Utilizador</label>
          <input
            autoComplete="username"
            value={loginUser}
            onChange={(e) => setLoginUser(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
          />
          <label className="mt-4 block text-sm text-gray-300">Senha</label>
          <input
            type="password"
            autoComplete="current-password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-gray-950"
          >
            Entrar
          </button>
        </form>
      </main>
    );

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-gray-950 px-4 pb-12 pt-24 text-white">
      <div className="mx-auto max-w-7xl">
           {" "}
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-emerald-400">
              INOVAÇÕES SOLARES
            </p>
            <h1 className="mt-1 text-3xl font-bold">Gestão de Stock</h1>
            <p className="mt-2 text-gray-400">
              Produtos, movimentos, documentos e encomendas de {EMPRESA}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2 hover:bg-gray-900"
            >
              <ArrowLeft size={17} /> Dashboard
            </button>
            <button
              onClick={() => {
                void loadProducts();
                void loadMovements();
                void loadOrders();
                void loadEmployees();
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2"
            >
              <RefreshCw size={17} /> Actualizar
            </button>
            <button
              onClick={logout}
              className="rounded-xl border border-red-500/30 px-4 py-2 text-red-300"
            >
              Sair
            </button>
          </div>
        </header>
           {" "}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200"
          >
            <CircleAlert size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200"
          >
            {notice}
          </div>
        )}
           {" "}
        <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Stat
            title="Referências"
            value={String(summary.items)}
            icon={<Package size={20} />}
          />
          <Stat
            title="Unidades em stock"
            value={String(summary.units)}
            icon={<Boxes size={20} />}
          />
          <Stat
            title="Stock baixo"
            value={String(summary.low)}
            icon={<TrendingDown size={20} />}
          />
          <Stat
            title="Valor de aquisição"
            value={money(summary.value)}
            icon={<TrendingUp size={20} />}
          />
        </section>
           {" "}
        <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ActionCard
            icon={<Printer size={21} />}
            title="Mapa de stock em PDF"
            text="Imprimir ou guardar o mapa actual como PDF."
            onClick={() => printArea("stock-print-area")}
          />
          <ActionCard
            icon={<FileText size={21} />}
            title="Extracto de saídas"
            text={`${exits.length} saída(s) no período seleccionado.`}
            onClick={() =>
              document
                .getElementById("extracto-saidas")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
          <ActionCard
            icon={<History size={21} />}
            title="Histórico de movimentos"
            text={`${filteredMovements.length} movimento(s) registados.`}
            onClick={() =>
              document
                .getElementById("historico-stock")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
          <ActionCard
            icon={<ShoppingCart size={21} />}
            title="Ordem de compra"
            text="Criar e acompanhar pedidos a fornecedores."
            onClick={() => setShowOrderForm(true)}
          />
        </section>
           {" "}
        <section className="mb-5 rounded-2xl border border-gray-800 bg-gray-900 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar produto, código, categoria ou fornecedor..."
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
              />
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3"
            >
              <option value="todos">Todo o stock</option>
              <option value="baixo">Stock baixo</option>
              <option value="esgotado">Esgotados</option>
            </select>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-gray-950"
            >
              <Plus size={18} /> Novo produto
            </button>
          </div>
        </section>
           {" "}
        <section
          id="stock-print-area"
          className="mb-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-5 py-4">
            <div>
              <h2 className="font-semibold">
                Mapa de Stock — Inovações Solares
              </h2>
              <p className="text-xs text-gray-500">
                Gerado em {new Date().toLocaleString("pt-MZ")}
              </p>
            </div>
            <button
              onClick={() => printArea("stock-print-area")}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm"
            >
              <Printer size={16} /> Imprimir / PDF
            </button>
          </div>
          {loading ? (
            <div className="p-10 text-center text-gray-400">
              <LoaderCircle className="mx-auto mb-2 animate-spin" />A carregar
              stock...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-950/70 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Produto</th>
                    <th className="px-4 py-4">Código</th>
                    <th className="px-4 py-4">Categoria</th>
                    <th className="px-4 py-4">Quantidade</th>
                    <th className="px-4 py-4">Stock segurança</th>
                    <th className="px-4 py-4">Preço aquisição</th>
                    <th className="px-4 py-4">Valor em stock</th>
                    <th className="px-4 py-4">Estado</th>
                    <th className="px-5 py-4 no-print text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {paginatedProducts.map((p) => {
                    const qty = numberOf(p.quantidadeEstoque);
                    const low = qty <= numberOf(p.stockSeguranca);
                    return (
                      <tr key={p._id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold">{p.nomeProduto}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {p.nomeFornecedor || "Fornecedor não indicado"}
                          </p>
                        </td>
                        <td className="px-4 py-4 font-mono">
                          {p.codigoProduto}
                        </td>
                        <td className="px-4 py-4">
                          {p.categoriaNovo || "Geral"}
                        </td>
                        <td className="px-4 py-4 font-semibold">{qty}</td>
                        <td className="px-4 py-4">
                          {numberOf(p.stockSeguranca)}
                        </td>
                        <td className="px-4 py-4">
                          {money(numberOf(p.precoAquisicao))}
                        </td>
                        <td className="px-4 py-4">
                          {money(qty * numberOf(p.precoAquisicao))}
                        </td>
                        <td className="px-4 py-4">
                          <span>
                            {qty <= 0
                              ? "Esgotado"
                              : low
                                ? "Stock baixo"
                                : "Disponível"}
                          </span>
                        </td>
                        <td className="px-5 py-4 no-print">
                          <div className="flex justify-end gap-1">
                            <button
                              title="Entrada"
                              onClick={() => openMovement(p, "entrada")}
                              className="rounded-lg p-2 text-emerald-300"
                            >
                              <TrendingUp size={17} />
                            </button>
                            <button
                              title="Saída"
                              onClick={() => openMovement(p, "saida")}
                              className="rounded-lg p-2 text-amber-300"
                            >
                              <TrendingDown size={17} />
                            </button>
                            <button
                              title="Histórico do produto"
                              onClick={() => setHistoryProduct(p)}
                              className="rounded-lg p-2 text-cyan-300"
                            >
                              <History size={17} />
                            </button>
                            <button
                              title="Editar"
                              onClick={() => openEdit(p)}
                              className="rounded-lg p-2 text-blue-300"
                            >
                              <Edit3 size={17} />
                            </button>
                            <button
                              title="Eliminar"
                              onClick={() => void removeProduct(p)}
                              className="rounded-lg p-2 text-red-300"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-5 py-4 font-bold">
                      Total ({filtered.length} referências)
                    </td>
                    <td className="px-4 py-4 font-bold">
                      {filtered.reduce(
                        (s, p) => s + numberOf(p.quantidadeEstoque),
                        0,
                      )}
                    </td>
                    <td colSpan={2}></td>
                    <td className="px-4 py-4 font-bold">
                      {money(
                        filtered.reduce(
                          (s, p) =>
                            s +
                            numberOf(p.quantidadeEstoque) *
                              numberOf(p.precoAquisicao),
                          0,
                        ),
                      )}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          <TablePagination
            total={filtered.length}
            page={productsPage}
            pageSize={pageSize}
            pageCount={productsPageCount}
            onPageChange={setProductsPage}
            onPageSizeChange={setPageSize}
          />
        </section>
           {" "}
        <section
          id="extracto-saidas"
          className="mb-8 rounded-2xl border border-gray-800 bg-gray-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-5 py-4">
            <div>
              <h2 className="font-semibold">Extracto de Saídas</h2>
              <p className="text-sm text-gray-500">
                Movimentos de saída, clientes e técnicos responsáveis.
              </p>
            </div>
            <button
              onClick={() => printArea("extract-print-area")}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm"
            >
              <Printer size={16} /> Exportar PDF
            </button>
          </div>
          <div className="flex flex-wrap gap-3 p-4">
            <label className="text-sm text-gray-400">
              De{" "}
              <input
                type="date"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="ml-2 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
              />
            </label>
            <label className="text-sm text-gray-400">
              Até{" "}
              <input
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="ml-2 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white"
              />
            </label>
            <button
              onClick={() => {
                void loadMovements();
              }}
              className="rounded-lg border border-gray-700 px-3 py-2 text-sm"
            >
              Aplicar datas
            </button>
          </div>
          <div id="extract-print-area" className="overflow-x-auto px-4 pb-4">
            <h2 className="hidden print:block">
              Inovações Solares — Extracto de Saídas
            </h2>
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Data</th>
                  <th className="px-3 py-3">Produto</th>
                  <th className="px-3 py-3">Código</th>
                  <th className="px-3 py-3">Qtd.</th>
                  <th className="px-3 py-3">Cliente</th>
                  <th className="px-3 py-3">Técnico</th>
                  <th className="px-3 py-3">Destino</th>
                  <th className="px-3 py-3">Gestor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedExits.map((m) => (
                  <tr key={m._id}>
                    <td className="px-3 py-3">{dateTime(m.createdAt)}</td>
                    <td className="px-3 py-3">{m.nomeProduto}</td>
                    <td className="px-3 py-3">{m.codigoProduto}</td>
                    <td className="px-3 py-3">{m.quantidade}</td>
                    <td className="px-3 py-3">
                      {m.clienteNome || "—"}
                      <p className="text-xs text-gray-500">
                        {m.clienteContacto}
                      </p>
                    </td>
                    <td className="px-3 py-3">{m.tecnicoResponsavel || "—"}</td>
                    <td className="px-3 py-3">{m.destino || "—"}</td>
                    <td className="px-3 py-3">{m.gestorStock || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {exits.length === 0 && (
              <p className="p-5 text-sm text-gray-500">
                Sem saídas registadas para o período seleccionado.
              </p>
            )}
          </div>
          <TablePagination
            total={exits.length}
            page={exitsPage}
            pageSize={pageSize}
            pageCount={exitsPageCount}
            onPageChange={setExitsPage}
            onPageSizeChange={setPageSize}
          />
        </section>
           {" "}
        <section
          id="historico-stock"
          className="mb-8 rounded-2xl border border-gray-800 bg-gray-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-5 py-4">
            <div>
              <h2 className="font-semibold">Histórico de Movimentos</h2>
              <p className="text-sm text-gray-500">
                Entradas e saídas registadas na base de dados.
              </p>
            </div>
            <button
              onClick={() => printArea("history-print-area")}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm"
            >
              <Printer size={16} /> PDF
            </button>
          </div>
          <div id="history-print-area" className="overflow-x-auto p-4">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">Data</th>
                  <th className="px-3 py-3">Tipo</th>
                  <th className="px-3 py-3">Produto</th>
                  <th className="px-3 py-3">Quantidade</th>
                  <th className="px-3 py-3">Saldo anterior</th>
                  <th className="px-3 py-3">Saldo posterior</th>
                  <th className="px-3 py-3">Responsável / Cliente</th>
                  <th className="px-3 py-3">Documento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedMovements.map((m) => (
                  <tr key={m._id}>
                    <td className="px-3 py-3">{dateTime(m.createdAt)}</td>
                    <td className="px-3 py-3">
                      {m.tipo === "entrada"
                        ? "Entrada"
                        : m.tipo === "saida"
                          ? "Saída"
                          : "Ajuste"}
                    </td>
                    <td className="px-3 py-3">
                      {m.nomeProduto}
                      <p className="text-xs text-gray-500">{m.codigoProduto}</p>
                    </td>
                    <td className="px-3 py-3">{m.quantidade}</td>
                    <td className="px-3 py-3">{m.saldoAnterior}</td>
                    <td className="px-3 py-3">{m.saldoPosterior}</td>
                    <td className="px-3 py-3">
                      {m.tecnicoResponsavel || m.gestorStock || "—"}
                      <p className="text-xs text-gray-500">{m.clienteNome}</p>
                    </td>
                    <td className="px-3 py-3">
                      {m.documentoTipo && m.documentoTipo !== "nenhum" ? (
                        <button
                          onClick={() => {
                            setDocMovement(m);
                            setDocKind(m.documentoTipo as any);
                          }}
                          className="text-emerald-300 underline"
                        >
                          Abrir documento
                        </button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMovements.length === 0 && (
              <p className="p-5 text-sm text-gray-500">
                Ainda não existem movimentos no histórico. Os movimentos antigos
                feitos pelas rotas anteriores não podem ser recuperados
                retroactivamente.
              </p>
            )}
          </div>
          <TablePagination
            total={filteredMovements.length}
            page={movementsPage}
            pageSize={pageSize}
            pageCount={movementsPageCount}
            onPageChange={setMovementsPage}
            onPageSizeChange={setPageSize}
          />
        </section>
           {" "}
        <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-5 py-4">
            <div>
              <h2 className="font-semibold">Ordens de Compra</h2>
              <p className="text-sm text-gray-500">
                Pedidos a fornecedores e estado de acompanhamento.
              </p>
            </div>
            <button
              onClick={() => setShowOrderForm(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-gray-950"
            >
              <Plus size={17} /> Nova ordem
            </button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-3">N.º</th>
                  <th className="px-3 py-3">Data</th>
                  <th className="px-3 py-3">Fornecedor</th>
                  <th className="px-3 py-3">Solicitante</th>
                  <th className="px-3 py-3">Itens</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3">Documento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedOrders.map((o) => (
                  <tr key={o._id}>
                    <td className="px-3 py-3 font-mono">{o.numero}</td>
                    <td className="px-3 py-3">{dateTime(o.createdAt)}</td>
                    <td className="px-3 py-3">{o.fornecedor}</td>
                    <td className="px-3 py-3">{o.solicitante}</td>
                    <td className="px-3 py-3">{o.itens?.length || 0}</td>
                    <td className="px-3 py-3">{money(o.total || 0)}</td>
                    <td className="px-3 py-3">
                      <select
                        value={o.estado}
                        onChange={(e) =>
                          void updateOrderStatus(o, e.target.value)
                        }
                        className="rounded-lg border border-gray-700 bg-gray-950 px-2 py-1"
                      >
                        <option>Pendente</option>
                        <option>Enviada</option>
                        <option>Recebida</option>
                        <option>Cancelada</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => printArea(`order-${o._id}`)}
                        className="text-emerald-300 underline"
                      >
                        Imprimir
                      </button>
                      <div id={`order-${o._id}`} className="hidden">
                        <h1>INOVAÇÕES SOLARES — ORDEM DE COMPRA</h1>
                        <p>N.º: {o.numero}</p>
                        <p>
                          Fornecedor: {o.fornecedor} — {o.contactoFornecedor}
                        </p>
                        <p>Solicitante: {o.solicitante}</p>
                        <p>
                          Data necessária: {o.dataNecessaria || "Não indicada"}
                        </p>
                        <table>
                          <thead>
                            <tr>
                              <th>Produto</th>
                              <th>Código</th>
                              <th>Quantidade</th>
                              <th>Preço unitário</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.itens.map((it, i) => (
                              <tr key={i}>
                                <td>{it.nomeProduto}</td>
                                <td>{it.codigoProduto}</td>
                                <td>{it.quantidade}</td>
                                <td>{money(it.precoUnitario)}</td>
                                <td>
                                  {money(it.quantidade * it.precoUnitario)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <h2>Total: {money(o.total)}</h2>
                        <p>Observações: {o.observacoes || "—"}</p>
                        <div className="signatures">
                          <div>Solicitante</div>
                          <div>Aprovação / Gestor</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="p-5 text-sm text-gray-500">
                Nenhuma ordem de compra registada.
              </p>
            )}
          </div>
          <TablePagination
            total={orders.length}
            page={ordersPage}
            pageSize={pageSize}
            pageCount={ordersPageCount}
            onPageChange={setOrdersPage}
            onPageSizeChange={setPageSize}
          />
        </section>
         {" "}
      </div>
       {" "}
      {showProductForm && (
        <Modal
          title={editing ? "Editar produto" : "Novo produto"}
          onClose={() => setShowProductForm(false)}
        >
          <form
            onSubmit={saveProduct}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Field
              label="Nome do produto"
              required
              value={productForm.nomeProduto}
              onChange={(v) =>
                setProductForm({ ...productForm, nomeProduto: v })
              }
            />
            <Field
              label="Código do produto"
              required
              value={productForm.codigoProduto}
              onChange={(v) =>
                setProductForm({ ...productForm, codigoProduto: v })
              }
            />
            <Field
              label="Categoria"
              value={productForm.categoriaNovo}
              onChange={(v) =>
                setProductForm({ ...productForm, categoriaNovo: v })
              }
            />
            <Field
              label="Quantidade inicial"
              type="number"
              min="0"
              required
              value={productForm.quantidadeInicial}
              onChange={(v) =>
                setProductForm({ ...productForm, quantidadeInicial: v })
              }
            />
            <Field
              label="Quantidade actual"
              type="number"
              min="0"
              required
              value={productForm.quantidadeEstoque}
              onChange={(v) =>
                setProductForm({ ...productForm, quantidadeEstoque: v })
              }
            />
            <Field
              label="Stock de segurança"
              type="number"
              min="0"
              required
              value={productForm.stockSeguranca}
              onChange={(v) =>
                setProductForm({ ...productForm, stockSeguranca: v })
              }
            />
            <Field
              label="Preço de aquisição (MT)"
              type="number"
              min="0"
              step="0.01"
              required
              value={productForm.precoAquisicao}
              onChange={(v) =>
                setProductForm({ ...productForm, precoAquisicao: v })
              }
            />
            <Field
              label="Preço de venda (MT)"
              type="number"
              min="0"
              step="0.01"
              required
              value={productForm.precoVenda}
              onChange={(v) =>
                setProductForm({ ...productForm, precoVenda: v })
              }
            />
            <Field
              label="Fornecedor"
              value={productForm.nomeFornecedor}
              onChange={(v) =>
                setProductForm({ ...productForm, nomeFornecedor: v })
              }
            />
            <Field
              label="Contacto do fornecedor"
              value={productForm.contactoFornecedor}
              onChange={(v) =>
                setProductForm({ ...productForm, contactoFornecedor: v })
              }
            />
            <Field
              label="Validade"
              value={productForm.validadeProduto}
              onChange={(v) =>
                setProductForm({ ...productForm, validadeProduto: v })
              }
            />
            <div className="flex gap-3 sm:col-span-2">
              <button
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-gray-950"
              >
                {saving
                  ? "A guardar..."
                  : editing
                    ? "Guardar alterações"
                    : "Registar produto"}
              </button>
              <button
                type="button"
                onClick={() => setShowProductForm(false)}
                className="rounded-xl border border-gray-700 px-4 py-3"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
       {" "}
      {movementProduct && (
        <Modal
          title={
            movementType === "entrada"
              ? "Registar entrada de stock"
              : "Registar saída de stock"
          }
          onClose={() => setMovementProduct(null)}
        >
          <div className="mb-4 rounded-xl border border-gray-800 bg-gray-900 p-3">
            <p className="font-semibold">{movementProduct.nomeProduto}</p>
            <p className="text-sm text-gray-400">
              Código: {movementProduct.codigoProduto} · Disponível:{" "}
              {movementProduct.quantidadeEstoque}
            </p>
          </div>
          <form
            onSubmit={saveMovement}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Field
              label="Quantidade"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={movementForm.quantidade}
              onChange={(v) =>
                setMovementForm({ ...movementForm, quantidade: v })
              }
            />
            <Field
              label="Gestor de stock"
              required
              value={movementForm.gestorStock}
              onChange={(v) =>
                setMovementForm({ ...movementForm, gestorStock: v })
              }
            />
            <SignaturePad
              value={movementForm.assinaturaGestor}
              onChange={(v) =>
                setMovementForm({ ...movementForm, assinaturaGestor: v })
              }
            />
            {movementType === "saida" && (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm text-gray-400">
                    Técnico responsável *
                  </span>
                  <select
                    required
                    value={movementForm.tecnicoResponsavel}
                    onChange={(e) =>
                      setMovementForm({
                        ...movementForm,
                        tecnicoResponsavel: e.target.value,
                      })
                    }
                    disabled={loadingEmployees}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-3 text-white"
                  >
                    <option value="">
                      {loadingEmployees
                        ? "A carregar funcionários..."
                        : "Seleccione o técnico"}
                    </option>
                    {employees.map((f) => (
                      <option key={f._id} value={f.nomeFuncionario}>
                        {f.nomeFuncionario}
                        {f.cargo ? ` — ${f.cargo}` : ""}
                      </option>
                    ))}
                  </select>
                  {employees.length === 0 && !loadingEmployees && (
                    <span className="mt-1 block text-xs text-amber-300">
                      Sem funcionários activos em {EMPRESA_FUNCIONARIOS}.
                    </span>
                  )}
                </label>
                <Field
                  label="Nome do cliente / destinatário"
                  required
                  value={movementForm.clienteNome}
                  onChange={(v) =>
                    setMovementForm({ ...movementForm, clienteNome: v })
                  }
                />
                <Field
                  label="Contacto do cliente"
                  value={movementForm.clienteContacto}
                  onChange={(v) =>
                    setMovementForm({ ...movementForm, clienteContacto: v })
                  }
                />
                <Field
                  label="Destino / local de entrega"
                  value={movementForm.destino}
                  onChange={(v) =>
                    setMovementForm({ ...movementForm, destino: v })
                  }
                />
                <Field
                  label="Finalidade / projecto"
                  value={movementForm.finalidade}
                  onChange={(v) =>
                    setMovementForm({ ...movementForm, finalidade: v })
                  }
                />
                <label className="block">
                  <span className="mb-2 block text-sm text-gray-400">
                    Documento a gerar
                  </span>
                  <select
                    value={movementForm.documentoTipo}
                    onChange={(e) =>
                      setMovementForm({
                        ...movementForm,
                        documentoTipo: e.target
                          .value as FormMovimento["documentoTipo"],
                      })
                    }
                    className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-3"
                  >
                    <option value="nenhum">Nenhum</option>
                    <option value="guia-transporte">Guia de transporte</option>
                    <option value="guia-remessa">Guia de remessa</option>
                  </select>
                </label>
              </>
            )}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm text-gray-400">
                Observações
              </span>
              <textarea
                value={movementForm.observacoes}
                onChange={(e) =>
                  setMovementForm({
                    ...movementForm,
                    observacoes: e.target.value,
                  })
                }
                rows={3}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-3"
              />
            </label>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving || !movementProduct}
                className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "A registar..." : "Confirmar movimento"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setMovementProduct(null);
                  setError("");
                }}
                className="rounded-xl border border-gray-700 px-4 py-3 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
       {" "}
      {showOrderForm && (
        <Modal
          title="Criar ordem de compra"
          onClose={() => setShowOrderForm(false)}
          wide
        >
          <form onSubmit={saveOrder} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Fornecedor"
                required
                value={orderSupplier}
                onChange={setOrderSupplier}
              />
              <Field
                label="Contacto do fornecedor"
                value={orderContact}
                onChange={setOrderContact}
              />
              <Field
                label="Data necessária"
                type="date"
                value={orderDate}
                onChange={setOrderDate}
              />
              <label className="block">
                <span className="mb-1 block text-sm text-gray-400">
                  Solicitante *
                </span>
                <select
                  required
                  value={orderRequester}
                  onChange={(e) => setOrderRequester(e.target.value)}
                  disabled={loadingEmployees || employees.length === 0}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {loadingEmployees
                      ? "A carregar colaboradores..."
                      : employees.length === 0
                        ? "Nenhum colaborador activo disponível"
                        : "Seleccione o colaborador solicitante"}
                  </option>
                  {employees.map((f) => (
                    <option key={f._id} value={f.nomeFuncionario}>
                      {f.nomeFuncionario}
                      {f.cargo ? ` — ${f.cargo}` : ""}
                    </option>
                  ))}
                </select>
                {employees.length === 0 && !loadingEmployees && (
                  <span className="mt-1 block text-xs text-amber-400">
                    Confirme se existem colaboradores activos em{" "}
                    {EMPRESA_FUNCIONARIOS}.
                  </span>
                )}
              </label>
            </div>
            <div className="rounded-xl border border-gray-800 p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Produtos encomendados</h3>
                <button
                  type="button"
                  onClick={addOrderItem}
                  className="flex items-center gap-1 rounded-lg border border-gray-700 px-3 py-2 text-sm"
                >
                  <Plus size={15} /> Adicionar item
                </button>
              </div>
              {orderItems.map((item, i) => (
                <div
                  key={i}
                  className="mb-3 grid grid-cols-1 gap-3 border-b border-gray-800 pb-3 sm:grid-cols-4"
                >
                  <label className="sm:col-span-2">
                    <span className="mb-1 block text-xs text-gray-400">
                      Produto
                    </span>
                    <select
                      value={item.produtoId}
                      onChange={(e) => updateOrderItem(i, e.target.value)}
                      className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2"
                    >
                      <option value="">Seleccione um produto</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.nomeProduto} ({p.codigoProduto})
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Quantidade"
                    type="number"
                    min="1"
                    required
                    value={item.quantidade}
                    onChange={(v) =>
                      setOrderItems((a) =>
                        a.map((x, j) =>
                          j === i ? { ...x, quantidade: v } : x,
                        ),
                      )
                    }
                  />
                  <Field
                    label="Preço unitário (MT)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.precoUnitario}
                    onChange={(v) =>
                      setOrderItems((a) =>
                        a.map((x, j) =>
                          j === i ? { ...x, precoUnitario: v } : x,
                        ),
                      )
                    }
                  />
                </div>
              ))}
              <p className="text-right font-semibold">
                Total estimado:{" "}
                {money(
                  orderItems.reduce(
                    (s, i) =>
                      s + numberOf(i.quantidade) * numberOf(i.precoUnitario),
                    0,
                  ),
                )}
              </p>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-gray-400">
                Observações
              </span>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-3"
              />
            </label>
            <div className="flex gap-3">
              <button
                disabled={saving}
                className="flex-1 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-gray-950"
              >
                {saving ? "A guardar..." : "Guardar ordem de compra"}
              </button>
              <button
                type="button"
                onClick={() => setShowOrderForm(false)}
                className="rounded-xl border border-gray-700 px-4 py-3"
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      )}
       {" "}
      {historyProduct && (
        <Modal
          title={`Histórico — ${historyProduct.nomeProduto}`}
          onClose={() => setHistoryProduct(null)}
          wide
        >
          {(() => {
            const productMovements = movements
              .filter((m) => m.produtoId === historyProduct._id)
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime(),
              );
            const totalEntradas = productMovements
              .filter((m) => m.tipo === "entrada")
              .reduce((s, m) => s + numberOf(m.quantidade), 0);
            const totalSaidas = productMovements
              .filter((m) => m.tipo === "saida")
              .reduce((s, m) => s + numberOf(m.quantidade), 0);
            const saldoInicial = productMovements.length
              ? numberOf(productMovements[0].saldoAnterior)
              : numberOf(historyProduct.quantidadeInicial);
            return (
              <>
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">
                      Saldo inicial registado
                    </p>
                    <p className="text-lg font-bold">{saldoInicial}</p>
                  </div>
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Total de entradas</p>
                    <p className="text-lg font-bold text-emerald-300">
                      {totalEntradas}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Total de saídas</p>
                    <p className="text-lg font-bold text-amber-300">
                      {totalSaidas}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-800 p-3">
                    <p className="text-xs text-gray-400">Saldo actual</p>
                    <p className="text-lg font-bold">
                      {numberOf(historyProduct.quantidadeEstoque)}
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-xs text-gray-500">
                  Movimentos encontrados: {productMovements.length}. Os registos
                  anteriores à activação do histórico não podem ser
                  reconstruídos automaticamente.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="text-gray-400">
                      <tr>
                        <th className="p-2">Data</th>
                        <th className="p-2">Tipo</th>
                        <th className="p-2">Quantidade</th>
                        <th className="p-2">Saldo anterior</th>
                        <th className="p-2">Saldo posterior</th>
                        <th className="p-2">Responsável</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productMovements.map((m) => (
                        <tr key={m._id} className="border-t border-gray-800">
                          <td className="p-2">{dateTime(m.createdAt)}</td>
                          <td className="p-2">{m.tipo}</td>
                          <td className="p-2">{m.quantidade}</td>
                          <td className="p-2">{m.saldoAnterior}</td>
                          <td className="p-2">{m.saldoPosterior}</td>
                          <td className="p-2">
                            {m.tecnicoResponsavel || m.gestorStock || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {productMovements.length === 0 && (
                    <p className="p-4 text-sm text-gray-400">
                      Sem movimentos registados para este produto. O saldo
                      inicial apresentado é o valor actual do campo de cadastro
                      e não representa um histórico comprovado.
                    </p>
                  )}
                </div>
              </>
            );
          })()}
        </Modal>
      )}
       {" "}
      {docMovement && (
        <Modal
          title={
            docKind === "guia-transporte"
              ? "Guia de transporte"
              : "Guia de remessa"
          }
          onClose={() => setDocMovement(null)}
        >
          <div
            id="document-print-area"
            className="rounded-xl bg-white p-6 text-gray-950"
          >
            <h1 className="text-xl font-bold">INOVAÇÕES SOLARES</h1>
            <p className="text-sm">
              {docKind === "guia-transporte"
                ? "GUIA DE TRANSPORTE"
                : "GUIA DE REMESSA"}
            </p>
            <p className="mt-3 text-xs">
              Documento associado ao movimento registado em{" "}
              {dateTime(docMovement.createdAt)} · Ref.{" "}
              {docMovement._id.slice(-8).toUpperCase()}
            </p>
            <hr className="my-4 border-gray-300" />
            <p>
              <b>Cliente/destinatário:</b> {docMovement.clienteNome || "—"}
            </p>
            <p>
              <b>Contacto:</b> {docMovement.clienteContacto || "—"}
            </p>
            <p>
              <b>Destino:</b> {docMovement.destino || "—"}
            </p>
            <p>
              <b>Técnico responsável:</b>{" "}
              {docMovement.tecnicoResponsavel || "—"}
            </p>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Produto</th>
                  <th className="border p-2 text-left">Código</th>
                  <th className="border p-2 text-left">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">{docMovement.nomeProduto}</td>
                  <td className="border p-2">{docMovement.codigoProduto}</td>
                  <td className="border p-2">{docMovement.quantidade}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4">
              <b>Finalidade:</b> {docMovement.finalidade || "—"}
            </p>
            <p>
              <b>Observações:</b> {docMovement.observacoes || "—"}
            </p>
            <div className="mt-16 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="border-t border-gray-500 pt-2">
                {docMovement.gestorStock || "Gestor de Stock"}
                <br />
                Assinatura do gestor
                <br />
                {docMovement.assinaturaGestor?.startsWith("data:image/") ? (
                  <img
                    src={docMovement.assinaturaGestor}
                    alt="Assinatura do gestor"
                    className="mx-auto mt-2 h-14 max-w-full object-contain"
                  />
                ) : (
                  docMovement.assinaturaGestor || ""
                )}
              </div>
              <div className="border-t border-gray-500 pt-2">
                {docMovement.tecnicoResponsavel || "Técnico responsável"}
                <br />
                Assinatura / recepção
              </div>
            </div>
            <p className="mt-8 text-center text-xs">
              Documento gerado pelo sistema de Gestão de Stock — Inovações
              Solares.
            </p>
          </div>
          <button
            onClick={() => printArea("document-print-area")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-gray-950"
          >
            <Printer size={17} /> Imprimir / Guardar como PDF
          </button>
        </Modal>
      )}
       {" "}
    </main>
  );
}

function SignaturePad({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value.startsWith("data:image/")) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      hasInk.current = true;
    };
    image.src = value;
  }, [value]);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }
  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    drawing.current = true;
    canvas.setPointerCapture(event.pointerId);
    const p = point(event);
    context.beginPath();
    context.moveTo(p.x, p.y);
    hasInk.current = true;
  }
  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const p = point(event);
    context.lineTo(p.x, p.y);
    context.stroke();
  }
  function finish() {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas && hasInk.current) onChange(canvas.toDataURL("image/png"));
  }
  function clear() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    onChange("");
  }
  return (
    <div className="sm:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Assinatura manuscrita do gestor
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-amber-300 underline"
        >
          Limpar assinatura
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={700}
        height={180}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={finish}
        onPointerLeave={finish}
        className="w-full touch-none rounded-xl border border-gray-700 bg-white"
        aria-label="Área para assinatura manuscrita"
      />
      <p className="mt-1 text-xs text-gray-500">
        Assine com o rato ou com o dedo num ecrã táctil.
      </p>
    </div>
  );
}

function TablePagination({
  total,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-800 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-gray-400">
        <span>{start}–{end} de {total} registo(s)</span>
        <label className="flex items-center gap-2">
          <span>Por página</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="rounded-lg border border-gray-700 bg-gray-950 px-2 py-1.5 text-white"
            aria-label="Registos por página"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="rounded-lg border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Primeira página"
        >«</button>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >Anterior</button>
        <span className="px-3 py-2 text-gray-300">Página {page} de {pageCount}</span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="rounded-lg border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >Seguinte</button>
        <button
          type="button"
          onClick={() => onPageChange(pageCount)}
          disabled={page >= pageCount}
          className="rounded-lg border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Última página"
        >»</button>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <span className="text-emerald-300">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-gray-800 bg-gray-900 p-4 text-left transition hover:border-emerald-500/60 hover:bg-gray-900/80"
    >
      <span className="mb-3 inline-flex rounded-lg bg-emerald-400/10 p-2 text-emerald-300">
        {icon}
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{text}</p>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <label className="block min-w-0 w-full">
      <span className="mb-2 block text-sm text-gray-400">{label}</span>
      <input
        type={type}
        min={min}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="box-border block min-w-0 w-full max-w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-3 text-base text-white outline-none focus:border-emerald-500"
      />
    </label>
  );
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full ${wide ? "max-w-5xl" : "max-w-2xl"} overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 p-5 sm:p-6`}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
