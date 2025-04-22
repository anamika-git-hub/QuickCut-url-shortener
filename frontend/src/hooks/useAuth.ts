import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../services/auth.service';
import { LoginData, RegisterData } from '../services/auth.service';

export const useAuth = () => {
  const auth = useContext(AuthContext);

  const login = async (data: LoginData) => {
    try {
      const response = await loginApi(data);
      auth.setAuth(response.user, response.accessToken);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await registerApi(data);
      auth.setAuth(response.user, response.accessToken);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutApi();
    auth.clearAuth();
  };

  return {
    ...auth,
    login,
    register,
    logout,
  };
};