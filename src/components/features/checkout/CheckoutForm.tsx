"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import {
  checkoutFormSchema,
  type CheckoutFormData,
} from "@/lib/validations/checkout";
import { useRouter } from "next/navigation";
import { createOrder } from "@/store/slices/orderSlice";
import { clearCart } from "@/store/slices/cartSlice";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils/format";
import { OrderStatus } from "@/types";

export function CheckoutForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
  });

  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const onSubmit = async (data: CheckoutFormData) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your order");
      // return;
    }

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          product: item.product,
        })),
        total,
        status: "pending" as OrderStatus,
        shippingAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Shipping Information</h2>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>
                <input
                  {...register("street")}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    {...register("city")}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    {...register("state")}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP Code
                  </label>
                  <input
                    {...register("zipCode")}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <input
                    {...register("country")}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium">Payment Method</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  {...register("paymentMethod")}
                  type="radio"
                  value="credit_card"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Credit Card
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("paymentMethod")}
                  type="radio"
                  value="paypal"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium">Order Summary</h2>
        <div className="mt-6 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
          <div className="flow-root">
            <ul className="-my-4 divide-y divide-gray-200">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center space-x-4 py-4"
                >
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-base font-medium text-gray-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">
                {formatCurrency(total)}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
