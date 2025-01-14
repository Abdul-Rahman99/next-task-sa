"use client";

import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Updated product images from Apple's website
  const productImages = {
    "MacBook Pro 16-inch":
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1671304673202",
    "iPhone 15 Pro":
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-black-titanium-select?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1692875661780",
    "iPad Pro":
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210?wid=452&hei=420&fmt=jpeg&qlt=95&.v=1664411207213",
    // Add more product images as needed
  };

  const productImage =
    productImages[product.name] || "/images/product-placeholder.jpg";

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <Image
          src={productImage}
          alt={product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">
            ${product.price.toLocaleString()}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
