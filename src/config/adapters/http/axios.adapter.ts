import axios, { type AxiosInstance } from "axios";
import { HttpAdapter } from "./http.adapter";

interface Options {
  baseUrl: string;
  params: Record<string, string>;
  withCredentials?: boolean;
}

export class AxiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(options: Options) {
    this.axiosInstance = axios.create({
      baseURL: options.baseUrl,
      params: options.params,
      withCredentials: options.withCredentials,
    });

    // Add request interceptor - only add auth headers if not using API key params
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Only use Bearer auth if no api_key parameter is present (for non-TMDB APIs)
        if (!config.params?.api_key) {
          const token = localStorage.getItem("authToken");
          if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Method to set Authorization header
  setAuthToken(token: string | null) {
    if (token) {
      this.axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete this.axiosInstance.defaults.headers.common["Authorization"];
    }
  }

  // Method to get the axios instance for external access
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  async get<T>(
    url: string,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.get<T>(url, options);

      return data;
    } catch {
      throw new Error(`Error fetching get: ${url} `);
    }
  }

  async post<T>(
    url: string,
    body: any,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.post<T>(url, body, options);
      return data;
    } catch (error: any) {
      // Preserve axios error information
      if (error.response) {
        // Server responded with error status
        const apiError = new Error(
          `HTTP ${error.response.status}: ${error.response.statusText}`
        );
        (apiError as any).status = error.response.status;
        (apiError as any).statusText = error.response.statusText;
        (apiError as any).data = error.response.data;
        (apiError as any).url = url;
        throw apiError;
      } else if (error.request) {
        // Request was made but no response received
        const networkError = new Error(
          `Network error: No response from ${url}`
        );
        (networkError as any).isNetworkError = true;
        (networkError as any).url = url;
        throw networkError;
      } else {
        // Something else happened
        throw new Error(`Error on post request: ${url} - ${error.message}`);
      }
    }
  }

  async put<T>(
    url: string,
    body: any,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.put<T>(url, body, options);
      return data;
    } catch {
      throw new Error(`Error on put request: ${url}`);
    }
  }

  async delete<T>(
    url: string,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.delete<T>(url, options);
      return data;
    } catch {
      throw new Error(`Error on delete request: ${url}`);
    }
  }

  async patch<T>(
    url: string,
    body: any,
    options?: Record<string, unknown> | undefined
  ): Promise<T> {
    try {
      const { data } = await this.axiosInstance.patch<T>(url, body, options);
      return data;
    } catch {
      throw new Error(`Error on patch request: ${url}`);
    }
  }
}
