import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { IAuthService, UserData } from './types';

export class AuthServiceImpl implements IAuthService {
  private readonly TOKEN_KEY = '@EMem:token';
  private readonly api;

  constructor(api: typeof import('../api').default) {
    this.api = api;
  }

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TOKEN_KEY);
  }

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(this.TOKEN_KEY, token);
  }

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
  }

  async fetchUserData(): Promise<UserData> {
    const response = await this.api.get('/auth/users/me/');
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/token/logout');
    await this.removeToken();
  }
}

// Singleton instance for convenience
export const authService = new AuthServiceImpl(api);
