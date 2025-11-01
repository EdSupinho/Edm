import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getApiUrl } from '../config/api';

export interface OrderItem {
  produto_id: number;
  quantidade: number;
  preco: number;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  data_pedido: string;
  data_atualizacao: string;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string;
  endereco_entrega: string;
  cidade_entrega: string;
  cep_entrega: string;
  observacoes?: string;
  itens: {
    id: number;
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
    produto_nome: string;
    produto_imagem?: string;
  }[];
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: any) => Promise<{ success: boolean; orderId?: number; error?: string }>;
  loadOrders: () => Promise<void>;
  getOrderById: (orderId: number) => Promise<Order | null>;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar pedidos do AsyncStorage ao inicializar
  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  const loadOrdersFromStorage = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orders');
      if (ordersData) {
        const parsedOrders = JSON.parse(ordersData);
        setOrders(parsedOrders);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos do storage:', error);
    }
  };

  const saveOrdersToStorage = async (ordersToSave: Order[]) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Erro ao salvar pedidos no storage:', error);
    }
  };

  const createOrder = async (orderData: any): Promise<{ success: boolean; orderId?: number; error?: string }> => {
    try {
      setLoading(true);
      
      // Obter token do AsyncStorage para associar o pedido ao usuário
      const token = await AsyncStorage.getItem('userToken');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${getApiUrl()}/pedidos`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        
        const newOrder: Order = {
          id: result.pedido.id,
          total: result.pedido.total,
          status: result.pedido.status,
          data_pedido: result.pedido.data_pedido,
          data_atualizacao: result.pedido.data_pedido,
          nome_cliente: orderData.nome_cliente,
          email_cliente: orderData.email_cliente,
          telefone_cliente: orderData.telefone_cliente,
          endereco_entrega: orderData.endereco_entrega,
          cidade_entrega: orderData.cidade_entrega,
          cep_entrega: orderData.cep_entrega,
          observacoes: orderData.observacoes || '',
          itens: orderData.itens.map((item: any) => ({
            id: 0, // Será preenchido pelo backend
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            preco_unitario: item.preco,
            produto_nome: item.nome || 'Produto',
            produto_imagem: item.imagem_url || ''
          }))
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        await saveOrdersToStorage(updatedOrders);

        return { success: true, orderId: result.pedido.id };
      } else {
        let errorMessage = 'Erro ao criar pedido';
        try {
          const errorData = await response.json();
          errorMessage = errorData.erro || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error('Erro detalhado:', errorText);
        }
        console.error(`Erro HTTP ${response.status}: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${getApiUrl()}/pedidos`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Resposta não é JSON válido:', contentType);
          return;
        }
        
        const ordersData = await response.json();
        setOrders(ordersData);
        await saveOrdersToStorage(ordersData);
      } else {
        console.error(`Erro ao carregar pedidos: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (orderId: number): Promise<Order | null> => {
    try {
      const response = await fetch(`${getApiUrl()}/pedidos/${orderId}`);
      
      if (response.ok) {
        const orderData = await response.json();
        return orderData;
      } else {
        console.error('Erro ao obter pedido');
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter pedido:', error);
      return null;
    }
  };

  const getStatusColor = (status: string): string => {
    const statusColors: { [key: string]: string } = {
      'pendente': '#ffc107',
      'processando': '#17a2b8',
      'enviado': '#007bff',
      'entregue': '#28a745',
      'cancelado': '#dc3545'
    };
    return statusColors[status] || '#6c757d';
  };

  const getStatusText = (status: string): string => {
    const statusTexts: { [key: string]: string } = {
      'pendente': 'Pendente',
      'processando': 'Processando',
      'enviado': 'Enviado',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    return statusTexts[status] || status;
  };

  const value: OrderContextType = {
    orders,
    loading,
    createOrder,
    loadOrders,
    getOrderById,
    getStatusColor,
    getStatusText
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders deve ser usado dentro de um OrderProvider');
  }
  return context;
};
