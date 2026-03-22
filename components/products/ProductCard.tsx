"use client";

import { useState, memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Heart,
  Star,
  Eye,
  Check,
  AlertCircle,
  Sun,
  Zap,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { WooProduct } from "@/types";

interface ProductCardProps {
  product: WooProduct;
  priority?: boolean;
  onQuickView?: (product: WooProduct) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  priority = false,
  onQuickView,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const { addItem } = useCart();

  // Memoized calculations
  const {
    imageUrl,
    price,
    originalPrice,
    discount,
    isOutOfStock,
    mainCategory,
    rating,
  } = useMemo(() => {
    const imageUrl =
      !imageError && product.images[0]?.src
        ? product.images[0].src
        : "/images/placeholder-product.jpg";

    const price = formatPrice(product.price);
    const originalPrice = product.on_sale
      ? formatPrice(product.regular_price)
      : null;

    const discount =
      product.on_sale && product.regular_price
        ? Math.round(
            (1 -
              parseFloat(product.price ?? "0") /
                parseFloat(product.regular_price ?? "0")) *
              100,
          )
        : 0;

    const isOutOfStock = product.stock_status === "outofstock";

    const mainCategory = product.categories[0]?.name || "Produto";

    const rating = {
      average: parseFloat(product.average_rating ?? "0"),
      count: product.review_count ?? 0,
      stars: Math.round(parseFloat(product.average_rating ?? "0")),
    };

    return {
      imageUrl,
      price,
      originalPrice,
      discount,
      isOutOfStock,
      mainCategory,
      rating,
    };
  }, [product, imageError]);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    setIsAddingToCart(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    addItem(product);

    // Show feedback
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 2000);

    setIsAddingToCart(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div
      className="group relative bg-linear-to-b from-gray-900 to-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-500/10 hover:border-blue-400/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Produto: ${product.name}`}
    >
      {/* Efeito de brilho solar no hover */}
      <div
        className={`absolute inset-0 bg-linear-to-tr from-blue-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />

      {/* Partículas de luz */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-300/30 rounded-full blur-sm animate-ping" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-blue-300/30 rounded-full blur-sm animate-ping delay-300" />
      </div>

      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-square bg-linear-to-br from-gray-800 to-gray-900 overflow-hidden"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-contain p-4 transition-all duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          priority={priority}
          onError={() => setImageError(true)}
          quality={85}
        />

        {/* Overlay com ações rápidas */}
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickView}
              className="w-full py-2.5 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black font-medium rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              aria-label={`Visualização rápida de ${product.name}`}
            >
              <Eye size={16} />
              Visualização Rápida
            </button>
          </div>
        </div>

        {/* Badges Container */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {/* Discount Badge - Solar Style */}
          {discount > 0 && (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-sm animate-pulse" />
              <span className="relative bg-linear-to-r from-blue-500 to-blue-600 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Zap size={12} />-{discount}% OFF
              </span>
            </div>
          )}

          {/* Stock Status Badge */}
          {isOutOfStock && (
            <span className="bg-gray-800/90 backdrop-blur-sm text-gray-300 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-gray-700">
              <AlertCircle size={12} />
              Esgotado
            </span>
          )}

          {/* Featured Badge - Solar Style */}
          {product.featured && (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-sm animate-pulse" />
              <span className="relative bg-linear-to-r from-blue-500 to-blue-600 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={12} />
                Destaque Solar
              </span>
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
            isWishlisted
              ? "bg-red-500/20 text-red-400 border border-red-500/30"
              : "bg-gray-800/80 backdrop-blur-sm text-gray-300 hover:text-blue-400 border border-blue-500/20 hover:border-blue-400/40"
          }`}
          aria-label={
            isWishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={isWishlisted}
        >
          <Heart size={18} className={isWishlisted ? "fill-red-400" : ""} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 relative">
        {/* Ícone solar decorativo */}
        <div className="absolute top-2 right-2 opacity-10">
          <Sun size={32} className="text-blue-500" />
        </div>

        {/* Category & Tags */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/categories/${product.categories[0]?.slug}`}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors flex items-center gap-1"
            aria-label={`Categoria: ${mainCategory}`}
          >
            <Sun size={12} />
            {mainCategory}
          </Link>

          {product.tags && product.tags.length > 0 && (
            <span className="text-xs text-gray-500">
              #{product.tags[0]?.name}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="block group/title">
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover/title:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {rating.count > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`transition-colors ${
                    i < rating.stars
                      ? "text-blue-400 fill-current drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                      : "text-gray-600"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({rating.count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
            {price}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-600 line-through">
              {originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button with Feedback */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={`w-full relative overflow-hidden px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            showAddedFeedback
              ? "bg-linear-to-r from-green-500 to-emerald-500 text-white"
              : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-black"
          }`}
        >
          {/* Efeito de brilho */}
          <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />

          <div className="relative z-10 flex items-center justify-center gap-2">
            {showAddedFeedback ? (
              <>
                <Check size={18} />
                <span>Adicionado!</span>
              </>
            ) : isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Adicionando...</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>{isOutOfStock ? "Indisponível" : "Adicionar"}</span>
              </>
            )}
          </div>
        </button>

        {/* Free Shipping Badge */}
        {parseFloat(product.price) > 299 && (
          <p className="text-xs text-blue-400/80 mt-2 flex items-center gap-1">
            <Check size={12} />
            Frete grátis
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
});

// Display name for debugging
ProductCard.displayName = "ProductCard";

export default ProductCard;
