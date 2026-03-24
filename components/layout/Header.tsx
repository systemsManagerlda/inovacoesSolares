/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  Sun,
  Zap,
  Sparkles,
  XCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import UserMenu from "./UserMenu";

// Interface para categoria do WooCommerce
interface WooCategory {
  id: number;
  name: string;
  slug: string;
  image?: {
    src: string;
    alt?: string;
  };
  count: number;
}

// Mapeamento de ícones baseado no nome da categoria
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("painel") || name.includes("placa")) return Sun;
  if (name.includes("inversor")) return Zap;
  if (name.includes("bateria")) return Sparkles;
  if (name.includes("controlador")) return Zap;
  if (name.includes("ilumina") || name.includes("lamp")) return Sun;
  if (name.includes("acessorio") || name.includes("acessórios")) return Sparkles;
  if (name.includes("kit")) return Zap;
  return Sun; // ícone padrão
};

// Função para buscar categorias da API
async function fetchCategories(): Promise<WooCategory[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `/api/woocommerce?endpoint=products/categories&per_page=50&hide_empty=true&_=${timestamp}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      }
    );
    
    if (!response.ok) {
      console.error('Erro ao buscar categorias:', response.status);
      return [];
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Componente de Modal de Busca
function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);

    try {
      // Buscar produtos da API WooCommerce
      const response = await fetch(
        `/api/woocommerce?endpoint=products&search=${encodeURIComponent(searchTerm)}&per_page=10&_=${Date.now()}`,
        {
          cache: 'no-store',
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 animate-fade-in-up">
        <div className="relative bg-linear-to-b from-gray-900 to-black rounded-2xl border border-blue-500/20 shadow-2xl shadow-blue-500/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500/20 bg-blue-500/5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Search size={20} className="text-blue-400" />
              Buscar Produtos
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formulário de Busca */}
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome do produto..."
                className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-blue-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="mt-3 w-full py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {/* Resultados da Busca */}
          <div className="max-h-96 overflow-y-auto p-4 pt-0 border-t border-blue-500/20">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="text-blue-400 animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">
                  {searchResults.length} resultado(s) encontrado(s)
                </p>
                {searchResults.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-blue-500/10 rounded-lg transition-colors group"
                  >
                    {product.images?.[0]?.src ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-contain bg-gray-900 rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Sun size={20} className="text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-blue-400">
                        {new Intl.NumberFormat("pt-MZ", {
                          style: "currency",
                          currency: "MZN",
                        }).format(parseFloat(product.price))}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-500 group-hover:text-blue-400 transition-colors"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              searchTerm && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search size={24} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400">Nenhum produto encontrado</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Tente usar outros termos de busca
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<WooCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { items, toggleCart } = useCart();

  // Buscar categorias do WooCommerce
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      const data = await fetchCategories();
      setCategories(data);
      setIsLoadingCategories(false);
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Impedir scroll do body quando os modais estiverem abertos
  useEffect(() => {
    if (isSearchOpen || isUserMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen, isUserMenuOpen]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    console.log("Usuário desconectado");
    setIsUserMenuOpen(false);
  };

  // Categorias a serem exibidas (limitadas a 6 para o menu)
  const displayedCategories = categories.slice(0, 6);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-blue-500/20 shadow-lg shadow-blue-500/5"
            : "bg-transparent"
        }`}
      >
        {/* Efeito de luz no topo */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo solar */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Efeito de brilho no logo */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src="/images/inovacoes.png"
                    alt="Inovações Solares"
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="font-display text-xl font-bold bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                  Inovações Solares
                </span>
                <span className="text-xs text-gray-500">
                  Energia que ilumina
                </span>
              </div>
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {isLoadingCategories ? (
                // Loading state
                <div className="flex items-center gap-2 px-4 py-2">
                  <Loader2 size={16} className="text-blue-400 animate-spin" />
                  <span className="text-gray-400 text-sm">Carregando...</span>
                </div>
              ) : displayedCategories.length > 0 ? (
                displayedCategories.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  return (
                    <Link
                      key={category.id}
                      href={`/categorias/${category.slug}`}
                      className="relative group px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors font-medium flex items-center gap-2"
                    >
                      <Icon
                        size={16}
                        className="text-blue-500/50 group-hover:text-blue-400 transition-colors"
                      />
                      <span>{category.name}</span>

                      {/* Efeito de hover */}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </Link>
                  );
                })
              ) : (
                // Fallback se não houver categorias
                <span className="text-gray-500 text-sm px-4">Nenhuma categoria</span>
              )}
            </nav>

            {/* Ícones à direita */}
            <div className="flex items-center gap-2">
              {/* Botão Buscar */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="relative group p-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                <Search size={20} className="relative z-10" />
                <span className="sr-only">Buscar</span>
              </button>

              {/* Botão Usuário */}
              <button
                onClick={() => setIsUserMenuOpen(true)}
                className="relative group p-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                <User size={20} className="relative z-10" />
                <span className="sr-only">Minha Conta</span>
              </button>

              {/* Botão Carrinho */}
              <button
                onClick={toggleCart}
                className="relative group p-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                <ShoppingBag size={20} className="relative z-10" />

                {itemCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center px-1 animate-pulse">
                    <span className="text-xs font-bold text-black">
                      {itemCount}
                    </span>
                  </div>
                )}
              </button>

              {/* Botão Menu Mobile */}
              <button
                className="lg:hidden relative group p-2 text-gray-400 hover:text-blue-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              isMobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-4 pb-6 border-t border-blue-500/20">
              <nav className="flex flex-col space-y-1">
                {isLoadingCategories ? (
                  // Loading state no mobile
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 size={20} className="text-blue-400 animate-spin" />
                    <span className="text-gray-400">Carregando categorias...</span>
                  </div>
                ) : displayedCategories.length > 0 ? (
                  displayedCategories.map((category) => {
                    const Icon = getCategoryIcon(category.name);
                    return (
                      <Link
                        key={category.id}
                        href={`/categorias/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-500/20 rounded-lg text-white hover:text-blue-200 transition-all group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon
                          size={18}
                          className="text-blue-200 group-hover:text-white"
                        />
                        <span className="font-medium">{category.name}</span>

                        {/* Efeito de brilho no hover */}
                        <span className="ml-auto w-1 h-6 bg-linear-to-b from-blue-400 to-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })
                ) : (
                  <span className="text-gray-500 text-center py-4">
                    Nenhuma categoria disponível
                  </span>
                )}
              </nav>

              {/* Opções mobile adicionais */}
              <div className="mt-4 pt-4 border-t border-blue-400/30 px-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsUserMenuOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/30 rounded-lg text-white hover:bg-blue-500/50 transition-colors"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">Minha Conta</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/30 rounded-lg text-white hover:bg-blue-500/50 transition-colors"
                  >
                    <Search size={18} />
                    <span className="text-sm font-medium">Buscar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso sutil */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
      </header>

      {/* Modal de Busca */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Menu do Usuário */}
      <UserMenu
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}