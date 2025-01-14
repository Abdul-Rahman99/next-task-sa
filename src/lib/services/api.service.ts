import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "@/store";

export class ApiService {
  private static instance: AxiosInstance;

  private static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Request interceptor
      this.instance.interceptors.request.use(
        (config) => {
          const access_token = store.getState().auth.access_token;
          if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor
      this.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            store.dispatch({ type: "auth/logout" });
          }
          return Promise.reject(error);
        }
      );
    }
    return this.instance;
  }

  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().get<T>(url, config);
    return response.data;
  }

  static async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.getInstance().post<T>(url, data, config);
    return response.data;
  }

  static async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.getInstance().put<T>(url, data, config);
    return response.data;
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.getInstance().delete<T>(url, config);
    return response.data;
  }
}
