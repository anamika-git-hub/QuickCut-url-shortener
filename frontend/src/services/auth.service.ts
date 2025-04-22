import api from './api';
import { setToken, setUser, removeToken, removeUser } from '../utils/localStorage';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  accessToken: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  const { user, accessToken } = response.data;
  
  setToken(accessToken);
  setUser(user);
  
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  const { user, accessToken } = response.data;
  
  setToken(accessToken);
  setUser(user);
  
  return response.data;
};

export const logout = (): void => {
  removeToken();
  removeUser();
};