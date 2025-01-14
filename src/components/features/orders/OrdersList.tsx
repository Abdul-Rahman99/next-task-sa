"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { fetchOrders } from "@/store/slices/orderSlice";
import { formatCurrency } from "@/lib/utils/format";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types";

export function OrdersList() {
  const dispatch = useAppDispatch();
  const { orders = [], isLoading } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white rounded-lg shadow-sm p-6"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No orders found</p>
        <Link
          href="/products"
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Filter out orders with empty items
  const validOrders = orders.filter(
    (order) => order.items && order.items.length > 0
  );

  return (
    <div className="space-y-6">
      {validOrders.map((order: Order) => {
        if (!order?.id) return null;

        return (
          <div
            key={order.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-lg font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Order #{order.id}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(order.total || 0)}
                  </p>
                  <p
                    className={`text-sm ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {(order.status || "pending").charAt(0).toUpperCase() +
                      (order.status || "pending").slice(1)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.productId} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
