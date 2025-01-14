"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/store";
import { addItem, toggleCart } from "@/store/slices/cartSlice";
import { ProductService } from "@/lib/services/product.service";
import { Product } from "@/types";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/20/solid";
import { formatCurrency } from "@/lib/utils/format";

export default function ProductPage({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await ProductService.getProduct(params.id);
        setProduct(response.data);
        setSelectedImage(response.data.images[0]);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    dispatch(addItem({ product, quantity: 1 }));
    dispatch(toggleCart());
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          {/* Image gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
              <Image
                src={selectedImage}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-lg ${
                    selectedImage === image
                      ? "ring-2 ring-indigo-600"
                      : "ring-1 ring-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    width={100}
                    height={100}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="mt-4">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={`h-5 w-5 ${
                        rating < product.averageRating
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  {product.ratings.length} reviews
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <p className="text-base text-gray-900">{product.description}</p>
            </div>

            {/* Stock status */}
            <div className="mt-6">
              <p className="text-sm text-gray-700">
                {product.stock > 0 ? (
                  <>
                    <span className="font-medium text-green-600">In stock</span>
                    {product.stock < 10 && (
                      <span className="ml-2 text-red-500">
                        Only {product.stock} left!
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-medium text-red-600">Out of stock</span>
                )}
              </p>
            </div>

            {/* Add to cart button */}
            <div className="mt-10 flex">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex max-w-xl flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
              >
                Add to cart
              </button>
            </div>

            {/* Reviews section */}
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900">Reviews</h3>
              <div className="mt-6 space-y-6 divide-y divide-gray-200">
                {product.ratings.map((rating) => (
                  <div key={rating.id} className="pt-6">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star < rating.rating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="ml-3 text-sm text-gray-700">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-gray-700">
                      {rating.review || "No written review"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
