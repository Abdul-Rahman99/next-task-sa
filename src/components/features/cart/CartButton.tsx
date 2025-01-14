"use client";

import { useAppSelector } from "@/hooks/store";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export function CartButton() {
  const { items } = useAppSelector((state) => state.cart);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative">
      <ShoppingCartIcon className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
          {itemCount}
        </span>
      )}
    </div>
  );
}
