import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export class BaseApiService {
  protected static baseURL = "http://localhost:3001";
  private static instance: AxiosInstance;

  // Initialize the Axios instance
  private static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: this.baseURL,
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.instance.interceptors.request.use(
        (config) => {
          const access_token =
            typeof window !== "undefined"
              ? localStorage.getItem("access_token")
              : null;
          if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      this.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/sign-in";
          }
          return Promise.reject(error);
        }
      );
    }
    return this.instance;
  }

  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().get(
      url,
      config
    );
    return response.data;
  }

  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().post(
      url,
      data,
      config
    );
    return response.data;
  }

  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().put(
      url,
      data,
      config
    );
    return response.data;
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.getInstance().delete(
      url,
      config
    );
    return response.data;
  }
}
