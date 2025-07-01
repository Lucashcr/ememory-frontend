import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://ememory.up.railway.app',
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
          await AsyncStorage.multiRemove(['@EMem:token', '@EMem:subjects', '@EMem:reviews']);
          router.replace("/(auth)/login");
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