import { ApiResponse, Product, ProductFiltersType } from "@/types";

export class ProductService {
  private static async getBaseService() {
    const { BaseApiService } = await import("./base.service");
    return BaseApiService;
  }

  static async getProducts(filters: ProductFiltersType) {
    const BaseService = await this.getBaseService();
    const response = await BaseService.get<Product[]>("/products", {
      params: filters,
    });
    // Transform the response to match ApiResponse type
    return {
      data: response,
      status: 200,
    };
  }

  static async getProduct(id: string) {
    const BaseService = await this.getBaseService();
    const response = await BaseService.get<Product>(`/products/${id}`);
    return {
      data: response,
      status: 200,
    };
  }

  static async createProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) {
    const BaseService = await this.getBaseService();
    return BaseService.post<ApiResponse<Product>>("/products", product);
  }

  static async updateProduct(id: string, product: Partial<Product>) {
    const BaseService = await this.getBaseService();
    return BaseService.put<ApiResponse<Product>>(`/products/${id}`, product);
  }

  static async deleteProduct(id: string) {
    const BaseService = await this.getBaseService();
    return BaseService.delete<ApiResponse<void>>(`/products/${id}`);
  }
}
