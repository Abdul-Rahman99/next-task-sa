import { OrderDetails } from "@/components/features/orders/OrderDetails";

export default function OrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <OrderDetails orderId={params.id} />
    </div>
  );
}
