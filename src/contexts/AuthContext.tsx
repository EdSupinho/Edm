import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getApiUrl } from '../config/api';

interface Admin {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (username: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = getApiUrl();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('admin_token');
      const storedAdmin = await AsyncStorage.getItem('admin_data');
      
      if (storedToken && storedAdmin) {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
        
        // Verificar se o token ainda é válido
        const isValid = await verifyToken(storedToken);
        if (!isValid) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async (tokenToVerify: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  };

  const login = async (username: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, senha }),
      });

      // Verificar o tipo de conteúdo da resposta
      const contentType = response.headers.get('content-type');
      
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        // Salvar no AsyncStorage
        await AsyncStorage.setItem('admin_token', data.token);
        await AsyncStorage.setItem('admin_data', JSON.stringify(data.admin));
        
        setToken(data.token);
        setAdmin(data.admin);
        
        return true;
      } else {
        // Tentar obter mensagem de erro
        let errorMessage = 'Erro ao fazer login';
        
        try {
          const text = await response.text();
          
          // Tentar parsear como JSON
          if (contentType && contentType.includes('application/json')) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.erro || errorMessage;
            } catch (e) {
              console.error('Erro ao parsear JSON:', e);
              errorMessage = text.substring(0, 100);
            }
          } else {
            console.error('Resposta não é JSON:', text.substring(0, 200));
            errorMessage = 'Servidor não acessível. Verifique se o backend está rodando.';
          }
        } catch (textError) {
          console.error('Erro ao ler resposta:', textError);
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        
        console.error('Erro no login:', errorMessage);
        Alert.alert('Erro ao Fazer Login', errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('admin_token');
      await AsyncStorage.removeItem('admin_data');
      
      setToken(null);
      setAdmin(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value: AuthContextType = {
    admin,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!admin && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
