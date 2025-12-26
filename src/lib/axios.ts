import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiError {
  status: number | null;
  message: string;
  data: any;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  _retryDelay?: number;
}

const globalConfig = {
  retry: 3,
  retryDelay: 1000,
};

class Api {
  private axiosInstance: AxiosInstance;
  private getAccessToken?: () => string | null;
  private setAccessToken?: (token: string) => void;
  private onAuthError?: () => void;

  constructor(baseURL: string = "http://localhost:3001/") {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: defaultHeaders,
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = this.getAccessToken?.() || null;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response),
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              if (!refreshToken) {
                const noTokenError: any = {
                  response: {
                    status: 401,
                    data: {
                      message: "No refresh token available",
                    },
                  },
                  message: "No refresh token available",
                };
                throw noTokenError;
              }

              const response = await this.axiosInstance.post<{
                accessToken: string;
              }>(`${this.axiosInstance.defaults.baseURL}refresh`, {
                refreshToken,
              });

              const { accessToken } = response.data;

              if (this.setAccessToken) {
                this.setAccessToken(accessToken);
              }

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }

              return this.axiosInstance(originalRequest);
            } catch (refreshError: unknown) {
              console.error("Token refresh failed:", refreshError);

              this.clearTokens();

              if (this.onAuthError) {
                this.onAuthError();
              }

              if (axios.isAxiosError(refreshError)) {
                return Promise.reject(this.handleError(refreshError));
              }

              return Promise.reject(this.handleError(refreshError as any));
            }
          }
        }

        const config = originalRequest as RetryConfig;

        if (config._retryCount === undefined) {
          config._retryCount = globalConfig.retry;
          config._retryDelay = globalConfig.retryDelay;
        }

        config._retryCount = config._retryCount - 1;

        if (!config || config._retryCount < 0) {
          return Promise.reject(this.handleError(error));
        }

        const shouldRetry =
          !error.response ||
          (error.response.status >= 500 && error.response.status <= 599);

        if (!shouldRetry) {
          return Promise.reject(this.handleError(error));
        }

        console.log(`Retrying request... attempts left: ${config._retryCount}`);

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, config._retryDelay || 1000);
        });

        return this.axiosInstance(config);
      }
    );
  }

  public setAuthCallbacks(callbacks: {
    getAccessToken: () => string | null;
    setAccessToken: (token: string) => void;
    onAuthError: () => void;
  }) {
    this.getAccessToken = callbacks.getAccessToken;
    this.setAccessToken = callbacks.setAccessToken;
    this.onAuthError = callbacks.onAuthError;
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      const formattedError: ApiError = {
        status: error.response?.status ?? null,
        message:
          (error.response?.data as any)?.message ||
          error.message ||
          "An unknown error occurred",
        data: error.response?.data ?? null,
      };
      throw formattedError;
    }

    if (error && typeof error === "object" && "response" in error) {
      const formattedError: ApiError = {
        status: error.response?.status ?? null,
        message:
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred",
        data: error.response?.data ?? null,
      };
      throw formattedError;
    }

    const formattedError: ApiError = {
      status: null,
      message: error?.message || "An unknown error occurred",
      data: null,
    };
    throw formattedError;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, {
      ...config,
      withCredentials: true,
    });
    return response.data;
  }

  public async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
      },
    });
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, {
      ...config,
      withCredentials: true,
    });
    return response.data;
  }

  public async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, {
      ...config,
      withCredentials: true,
    });
    return response.data;
  }

  public async patch<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, {
      ...config,
      withCredentials: true,
    });
    return response.data;
  }

  public clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
    }
  }
}

let api: Api | undefined;
if (typeof window !== "undefined") {
  api = new Api();
}

export default api as Api;
