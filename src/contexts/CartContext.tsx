import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: number;
  produto_id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem_url: string;
  categoria_nome: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (produto: any) => void;
  removeFromCart: (produtoId: number) => void;
  updateQuantity: (produtoId: number, quantidade: number) => void;
  clearCart: () => void;
  isInCart: (produtoId: number) => boolean;
  getItemQuantity: (produtoId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carregar carrinho do AsyncStorage ao inicializar
  useEffect(() => {
    loadCartFromStorage();
  }, []);

  // Salvar carrinho no AsyncStorage sempre que houver mudanças
  useEffect(() => {
    saveCartToStorage();
  }, [items]);

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do storage:', error);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar carrinho no storage:', error);
    }
  };

  const addToCart = (produto: any) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.produto_id === produto.id);
      
      if (existingItem) {
        // Se o item já existe, aumenta a quantidade
        return prevItems.map(item =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        // Se é um novo item, adiciona ao carrinho
        const newItem: CartItem = {
          id: Date.now(), // ID único para o item do carrinho
          produto_id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          imagem_url: produto.imagem_url,
          categoria_nome: produto.categoria_nome
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (produtoId: number) => {
    setItems(prevItems => prevItems.filter(item => item.produto_id !== produtoId));
  };

  const updateQuantity = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.produto_id === produtoId
          ? { ...item, quantidade }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (produtoId: number): boolean => {
    return items.some(item => item.produto_id === produtoId);
  };

  const getItemQuantity = (produtoId: number): number => {
    const item = items.find(item => item.produto_id === produtoId);
    return item ? item.quantidade : 0;
  };

  // Calcular total do carrinho
  const total = items.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

  // Contar total de itens
  const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0);

  const value: CartContextType = {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
