import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { ProductFiltersType } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  filters: ProductFiltersType;
}

export function ProductList({ filters }: ProductListProps) {
  const dispatch = useAppDispatch();
  const { products = [], isLoading } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg h-96"
          ></div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
