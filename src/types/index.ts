export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
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

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "credit_card" | "paypal";

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export type ProductFiltersType = {
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  search: string;
};

export interface ProductSortOptions {
  field: string;
  order: "asc" | "desc";
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface AuthResponse {
  data: LoginResponse;
  status: number;
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  loading?: boolean;
  error?: string | null;
}
