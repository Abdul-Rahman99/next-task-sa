import { ApiResponse, Order, OrderStatus, Product } from "@/types";
import { BaseApiService } from "./base.service";

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
    price: number;
    product: Product;
  }[];
  total: number;
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: "credit_card" | "paypal";
  createdAt: string;
  updatedAt: string;
}

export class OrderService extends BaseApiService {
  static async createOrder(orderData: CreateOrderInput) {
    const calculatedTotal = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (orderData.total !== calculatedTotal) {
      throw new Error("Order total mismatch");
    }

    return this.post<ApiResponse<Order>>("/orders", orderData);
  }

  static async getOrders() {
    return this.get<ApiResponse<Order[]>>("/orders");
  }

  static async getOrder(id: string) {
    return this.get<ApiResponse<Order>>(`/orders/${id}`);
  }
}
