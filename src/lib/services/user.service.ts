import { ApiResponse, User } from "@/types";

export class UserService {
  private static async getBaseService() {
    const { BaseApiService } = await import("./base.service");
    return BaseApiService;
  }

  static async getUsers() {
    const BaseService = await this.getBaseService();
    return BaseService.get<ApiResponse<User[]>>("/users");
  }

  static async updateUserStatus(userId: string, isActive: boolean) {
    const BaseService = await this.getBaseService();
    return BaseService.put<ApiResponse<User>>(`/users/${userId}/status`, {
      isActive,
    });
  }

  static async updateUserRole(userId: string, role: string) {
    const BaseService = await this.getBaseService();
    return BaseService.put<ApiResponse<User>>(`/users/${userId}/role`, {
      role,
    });
  }

  static async deleteUser(userId: string) {
    const BaseService = await this.getBaseService();
    return BaseService.delete<ApiResponse<void>>(`/users/${userId}`);
  }
}
