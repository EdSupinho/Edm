import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';

export interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  data_nascimento?: string;
  genero?: string;
  avatar_url?: string;
  data_criacao: string;
  is_admin: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  getPurchaseHistory: () => Promise<any[]>;
  addToFavorites: (produtoId: number) => Promise<{ success: boolean; error?: string }>;
  removeFromFavorites: (produtoId: number) => Promise<{ success: boolean; error?: string }>;
  getFavorites: () => Promise<any[]>;
  checkFavoriteStatus: (produtoId: number) => Promise<boolean>;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  genero?: string;
  avatar_url?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar usuário do AsyncStorage ao inicializar
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('userToken');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do storage:', error);
    }
  };

  const saveUserToStorage = async (userData: User, token: string) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
    }
  };

  const clearUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
    }
  };

  const login = async (email: string, senha: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${getApiUrl()}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.usuario);
        await saveUserToStorage(result.usuario, result.token);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.erro || 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${getApiUrl()}/usuarios/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.erro || 'Erro ao cadastrar usuário' };
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      await clearUserFromStorage();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return { success: false, error: 'Token não encontrado' };
      }

      const response = await fetch(`${getApiUrl()}/usuarios/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.usuario);
        await AsyncStorage.setItem('user', JSON.stringify(result.usuario));
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.erro || 'Erro ao atualizar perfil' };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const getPurchaseHistory = async (): Promise<any[]> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return [];
      }

      const response = await fetch(`${getApiUrl()}/usuarios/historico`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Erro ao obter histórico de compras');
        return [];
      }
    } catch (error) {
      console.error('Erro ao obter histórico de compras:', error);
      return [];
    }
  };

  const addToFavorites = async (produtoId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return { success: false, error: 'Token não encontrado' };
      }

      const response = await fetch(`${getApiUrl()}/favoritos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ produto_id: produtoId }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.erro || 'Erro ao adicionar aos favoritos' };
      }
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const removeFromFavorites = async (produtoId: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return { success: false, error: 'Token não encontrado' };
      }

      const response = await fetch(`${getApiUrl()}/favoritos/${produtoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.erro || 'Erro ao remover dos favoritos' };
      }
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const getFavorites = async (): Promise<any[]> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return [];
      }

      const response = await fetch(`${getApiUrl()}/favoritos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Erro ao obter favoritos');
        return [];
      }
    } catch (error) {
      console.error('Erro ao obter favoritos:', error);
      return [];
    }
  };

  const checkFavoriteStatus = async (produtoId: number): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        return false;
      }

      const response = await fetch(`${getApiUrl()}/favoritos/${produtoId}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.is_favorito;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar status do favorito:', error);
      return false;
    }
  };

  const value: UserContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getPurchaseHistory,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    checkFavoriteStatus,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
