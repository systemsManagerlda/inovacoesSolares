import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Sun,
  Zap,
  Sparkles,
  Loader2,
} from "lucide-react";

// Interface para categoria do WooCommerce
interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Função para buscar categorias da API
async function fetchCategories(): Promise<WooCategory[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/products/categories?per_page=20&hide_empty=true&consumer_key=${process.env.WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${process.env.WOOCOMMERCE_CONSUMER_SECRET}&_=${timestamp}`,
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
  return Sun;
};

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Buscar categorias no servidor
  const categories = await fetchCategories();
  
  // Categorias principais para exibir (limitadas a 6)
  const mainCategories = categories.slice(0, 6);

  return (
    <footer className="relative bg-black text-gray-300 overflow-hidden border-t border-blue-500/20">
      {/* Elementos de luz solar */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Raios de sol de fundo */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

        {/* Partículas de luz */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-blue-300/20 rounded-full blur-sm animate-ping" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-300/20 rounded-full blur-sm animate-ping delay-300" />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-blue-300/20 rounded-full blur-sm animate-ping delay-700" />
      </div>

      {/* Linha decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About - Inovações Solares */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full" />
                <Image
                  src="/images/inovacoes.png"
                  alt="Inovações Solares"
                  width={50}
                  height={50}
                  className="relative object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-bold bg-linear-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
                Inovações Solares
              </h3>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Iluminando o futuro com tecnologia solar inovadora e sustentável.
              Energia limpa para um mundo melhor.
            </p>

            <div className="flex gap-3">
              <Link
                href="#"
                className="p-2 bg-gray-800/50 border border-blue-500/20 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400/40 hover:bg-gray-800 transition-all group"
                aria-label="Facebook"
              >
                <Facebook
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link>
              <Link
                href="#"
                className="p-2 bg-gray-800/50 border border-blue-500/20 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400/40 hover:bg-gray-800 transition-all group"
                aria-label="Instagram"
              >
                <Instagram
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link>
              <Link
                href="#"
                className="p-2 bg-gray-800/50 border border-blue-500/20 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400/40 hover:bg-gray-800 transition-all group"
                aria-label="Twitter"
              >
                <Twitter
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Produtos - Categorias dinâmicas do WooCommerce */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-blue-400" />
              Produtos
            </h4>
            {mainCategories.length > 0 ? (
              <ul className="space-y-2">
                {mainCategories.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  return (
                    <li key={category.id}>
                      <Link
                        href={`/categorias/${category.slug}`}
                        className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1 h-1 bg-blue-500/50 rounded-full group-hover:bg-blue-400 transition-colors" />
                        <Icon size={14} className="text-blue-500/50 group-hover:text-blue-400" />
                        {category.name}
                        {category.count > 0 && (
                          <span className="text-xs text-gray-600 group-hover:text-blue-400/70">
                            ({category.count})
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="space-y-2">
                {/* Fallback estático caso não carregue categorias */}
                {[
                  { name: "Painéis Solares", href: "/categorias/paineis-solares", icon: Sun },
                  { name: "Inversores", href: "/categorias/inversores", icon: Zap },
                  { name: "Baterias", href: "/categorias/baterias", icon: Sparkles },
                  { name: "Controladores", href: "/categorias/controladores", icon: Zap },
                  { name: "Iluminação Solar", href: "/categorias/iluminacao-solar", icon: Sun },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-blue-500/50 rounded-full group-hover:bg-blue-400 transition-colors" />
                      <item.icon size={14} className="text-blue-500/50 group-hover:text-blue-400" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-400" />
              Suporte
            </h4>
            <ul className="space-y-2">
              {[
                { name: "FAQ - Dúvidas Frequentes", href: "/faq" },
                { name: "Política de Entregas", href: "/entrega" },
                { name: "Trocas e Devoluções", href: "/trocas" },
                { name: "Garantia Estendida", href: "/garantia" },
                { name: "Fale Conosco", href: "/contato" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500/50 rounded-full group-hover:bg-blue-400 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sun size={18} className="text-blue-400" />
              Contato
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3 group hover:text-blue-400 transition-colors">
                <div className="p-2 bg-gray-800/50 border border-blue-500/20 rounded-lg group-hover:border-blue-400/40">
                  <Phone size={16} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Telefone</span>
                  <p className="text-sm">(+258) 84 113 8173 - 87 113 8173</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group hover:text-blue-400 transition-colors">
                <div className="p-2 bg-gray-800/50 border border-blue-500/20 rounded-lg group-hover:border-blue-400/40">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Email</span>
                  <p className="text-sm">comercial@inovacoessolares.co.mz</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group hover:text-blue-400 transition-colors">
                <div className="p-2 bg-gray-800/50 border border-blue-500/20 rounded-lg group-hover:border-blue-400/40">
                  <MapPin size={16} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Endereço</span>
                  <p className="text-sm">Av.Trabalho perto da Moçambique, Maputo, Mozambique</p>
                </div>
              </li>
            </ul>

            {/* Badge de energia solar */}
            <div className="mt-4 p-3 bg-linear-to-r from-blue-500/10 to-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Sun size={14} className="text-blue-400 animate-pulse" />
                Energia 100% limpa e renovável
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter simplificada */}
        <div className="mt-8 p-4 bg-gray-900/50 border border-blue-500/20 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-blue-400" />
              <p className="text-sm text-gray-300">
                Receba novidades e ofertas exclusivas
              </p>
            </div>
            <div className="flex w-full sm:w-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 sm:w-64 px-4 py-2 bg-gray-800 border border-blue-500/30 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
              />
              <button className="px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 text-black font-medium rounded-r-lg hover:from-blue-400 hover:to-blue-500 transition-all">
                Inscrever
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Inovações Solares. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <Link
              href="/politica-privacidade"
              className="hover:text-blue-400 transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-uso"
              className="hover:text-blue-400 transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>

      {/* Linha decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
    </footer>
  );
}