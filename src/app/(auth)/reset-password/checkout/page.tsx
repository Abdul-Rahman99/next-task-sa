import { CheckoutForm } from "@/components/features/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
          Checkout
        </h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
