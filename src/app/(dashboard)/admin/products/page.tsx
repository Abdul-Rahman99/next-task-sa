"use client";

import { AdminProductList } from "@/components/features/admin/products/AdminProductList";
import { AdminProductModal } from "@/components/features/admin/products/AdminProductModal";
import { useState } from "react";

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Products
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Add Product
          </button>
        </div>
      </div>

      <AdminProductList
        onEdit={(productId) => {
          setEditingProduct(productId);
          setIsModalOpen(true);
        }}
      />

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        productId={editingProduct}
      />
    </div>
  );
}
