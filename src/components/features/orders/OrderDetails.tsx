"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { fetchOrderById } from "@/store/slices/orderSlice";
import { formatCurrency } from "@/lib/utils/format";
import Image from "next/image";

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading } = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [dispatch, orderId]);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!currentOrder) {
    return <div>Order not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Order #{currentOrder.id}</h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Total: {formatCurrency(currentOrder.total)}
            </p>
            <p
              className={`text-sm ${
                currentOrder.status === "delivered"
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {currentOrder.status.charAt(0).toUpperCase() +
                currentOrder.status.slice(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium">Items</h3>
          <ul className="mt-4 divide-y divide-gray-200">
            {currentOrder.items.map((item) => (
              <li key={item.productId} className="py-4 flex">
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

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium">Shipping Address</h3>
        <div className="mt-4 text-sm text-gray-500">
          <p>{currentOrder.shippingAddress.street}</p>
          <p>
            {currentOrder.shippingAddress.city},{" "}
            {currentOrder.shippingAddress.state}{" "}
            {currentOrder.shippingAddress.zipCode}
          </p>
          <p>{currentOrder.shippingAddress.country}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium">Payment Information</h3>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Payment Method:{" "}
            {currentOrder.paymentMethod === "credit_card"
              ? "Credit Card"
              : "PayPal"}
          </p>
        </div>
      </div>
    </div>
  );
}
