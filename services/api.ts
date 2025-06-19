import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.15.127:8000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          Toast.error("Parece que você não está logado! Que tal fazer login novamente?")
          // Unauthorized - Clear storage and redirect to login
          await AsyncStorage.multiRemove(['@EMem:token', '@EMem:subjects', '@EMem:reviews']);
          break;
        case 403:
          // Forbidden
          Toast.error("Parece que você não tem acesso a este recurso!")
          console.error('Forbidden request:', error.response.data);
          break;
        case 404:
          // Not Found
          Toast.error("Não encontramos este recurso!")
          console.error('Resource not found:', error.response.data);
          break;
        case 500:
          // Server Error
          Toast.error("Aconteceu um erro inesperado!")
          console.error('Server error:', error.response.data);
          break;
      }
    } else if (error.request) {
      // Network error
      Toast.error("Estamos com problemas de conexão! Tente novamente mais tarde!")
      console.error('Network error:', error.request);
    } else {
      // Other errors
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;