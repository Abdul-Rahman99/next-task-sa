import { useEffect, useState } from "react";
import { ProductFiltersType } from "@/types";
import { ProductService } from "@/lib/services/product.service";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: ProductFiltersType) => void;
}

export function ProductFilters({
  filters,
  onFilterChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Search</h3>
        <div className="mt-4">
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            placeholder="Search products..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                onFilterChange({ ...filters, minPrice: e.target.value })
              }
              placeholder="Min"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                onFilterChange({ ...filters, maxPrice: e.target.value })
              }
              placeholder="Max"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Sort By</h3>
        <select
          title="sort"
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({ ...filters, sortBy: e.target.value })
          }
          className="mt-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
