import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ApiClientType } from '../api';
import { IAuthService, UserData } from './types';

export class AuthServiceImpl implements IAuthService {
  private readonly TOKEN_KEY = '@EMem:token';
  private readonly api: ApiClientType;

  constructor(apiClient: ApiClientType = api) {
    this.api = apiClient;
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
    return this.api.get<UserData>('/auth/users/me/');
  }

  async logout(): Promise<void> {
    await this.api.post<void>('/auth/token/logout');
    await this.removeToken();
  }
}

export const authService = new AuthServiceImpl(api);
