export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface IAuthService {
  getStoredToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  removeToken(): Promise<void>;
  fetchUserData(): Promise<UserData>;
  logout(): Promise<void>;
}
