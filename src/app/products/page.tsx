"use client";

import { useState } from "react";
import { ProductList } from "@/components/features/products/ProductList";
import { ProductFiltersType } from "@/types";
import { useAppSelector } from "@/hooks/store";
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function ProductsPage() {
  const { items } = useAppSelector((state) => state.cart);
  const [filters, setFilters] = useState<ProductFiltersType>({
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
    search: "",
  });

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Products
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            {items.length > 0 && (
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                Checkout (${total.toLocaleString()})
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ProductList filters={filters} />
        </div>
      </div>
    </div>
  );
}
