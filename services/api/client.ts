import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { ApiError } from './errors';
import { ApiErrorResponse } from './types';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://ememory.up.railway.app',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('@EMem:token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError<ApiErrorResponse>) => {
        const apiError = new ApiError(error);

        // Handle 401 Unauthorized errors
        if (apiError.statusCode === 401) {
          await AsyncStorage.removeItem('@EMem:token');
          router.replace('/(auth)/login');
          Toast.error('Sessão expirada. Por favor, faça login novamente.');
        } else {
          // Handle other errors
          Toast.error(apiError.message);
        }

        return Promise.reject(apiError);
      }
    );
  }

  private async handleResponse<T>(promise: Promise<AxiosResponse>): Promise<T> {
    const response = await promise;
    return response.data;
  }

  async get<T>(url: string): Promise<T> {
    return this.handleResponse<T>(this.api.get(url));
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.handleResponse<T>(this.api.post(url, data));
  }

  async put<T>(url: string, data: any): Promise<T> {
    return this.handleResponse<T>(this.api.put(url, data));
  }

  async patch<T>(url: string, data: any): Promise<T> {
    return this.handleResponse<T>(this.api.patch(url, data));
  }

  async delete<T>(url: string): Promise<T> {
    return this.handleResponse<T>(this.api.delete(url));
  }
}

// Export the ApiClient type for service dependencies
export type ApiClientType = ApiClient;

export const api = new ApiClient();
