"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/store";
import { CheckoutForm } from "@/components/features/checkout/CheckoutForm";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    console.log("Checkout auth state:", isAuthenticated);

    // if (!isAuthenticated) {
    //   const currentPath = encodeURIComponent("/checkout");
    //   router.replace(`/sign-in?redirect=${currentPath}`);
    //   return;
    // }

    if (items.length === 0) {
      router.replace("/products");
      return;
    }
  }, [isAuthenticated, items.length, router]);

  // Don't render anything while redirecting
//   if (!isAuthenticated || items.length === 0) {
//     return null;
//   }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
