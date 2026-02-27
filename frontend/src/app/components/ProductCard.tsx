"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

export default function ProductCard({ product, priority }: ProductCardProps) {
  const { language } = useLanguage();

  const displayName =
    language !== "en" && product.nameNative ? product.nameNative : product.name;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition ${
        priority ? "ring-2 ring-blue-200" : ""
      }`}
    >
      <div className="h-48 bg-gray-200 relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0].url}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}
        {priority && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            From your country
          </span>
        )}
        {product.isHalal && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Halal
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1 line-clamp-2" dir="auto">
          {displayName}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{product.vendor?.businessName}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(product.salePrice || product.basePrice, product.currency)}
          </p>
          {product.spiceLevel && (
            <span className="text-orange-500">
              {"🌶️".repeat(product.spiceLevel)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
