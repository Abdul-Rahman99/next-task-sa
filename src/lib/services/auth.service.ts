import { AuthResponse } from "@/types";
import { BaseApiService } from "./base.service";
import { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { ProfileFormData } from "../validations/profile";

export class AuthService extends BaseApiService {
  static async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      // Store both token and user immediately after successful response
      if (response.data.access_token && response.data.user) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Also set the Authorization header for subsequent requests
        this.instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;
      }

      return response;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      throw new Error("Login failed");
    }
  }

  static async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>("/auth/register", data);
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      return response;
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  static async updateProfile(data: ProfileFormData) {
    try {
      return await this.put<AuthResponse>("/users/profile", data);
    } catch (error) {
      throw new Error("Profile update failed");
    }
  }

  static logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    delete this.instance?.defaults.headers.common["Authorization"];
  }

  static getStoredAuth(): { access_token: string | null; user: any | null } {
    if (typeof window === "undefined") {
      return { access_token: null, user: null };
    }
    const access_token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { access_token, user };
  }
}
