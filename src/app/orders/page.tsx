import { OrdersList } from "@/components/features/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <OrdersList />
    </div>
  );
}
