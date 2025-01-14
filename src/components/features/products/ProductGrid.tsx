import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { ProductCard } from "./ProductCard";
import { ProductFiltersType } from "@/types";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  filters: ProductFiltersType;
}

export function ProductGrid({ products, filters }: ProductGridProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-md h-80"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
