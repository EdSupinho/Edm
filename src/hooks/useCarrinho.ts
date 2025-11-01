import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem_url: string;
  estoque: number;
}

export const useCarrinho = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarCarrinho = async () => {
    try {
      setLoading(true);
      const carrinhoData = await AsyncStorage.getItem('carrinho');
      if (carrinhoData) {
        const itensCarrinho = JSON.parse(carrinhoData);
        setItens(itensCarrinho);
      } else {
        setItens([]);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setItens([]);
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = async (produto: ItemCarrinho) => {
    try {
      const carrinhoAtual = await AsyncStorage.getItem('carrinho');
      let itens = carrinhoAtual ? JSON.parse(carrinhoAtual) : [];

      // Verificar se o produto já está no carrinho
      const itemExistente = itens.find((item: ItemCarrinho) => item.id === produto.id);
      
      if (itemExistente) {
        // Se já existe, atualizar quantidade
        itemExistente.quantidade += produto.quantidade;
      } else {
        // Se não existe, adicionar novo item
        itens.push(produto);
      }

      // Salvar carrinho atualizado
      await AsyncStorage.setItem('carrinho', JSON.stringify(itens));
      setItens(itens);
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      return false;
    }
  };

  const atualizarQuantidade = async (id: number, novaQuantidade: number) => {
    try {
      if (novaQuantidade <= 0) {
        await removerItem(id);
        return;
      }

      const novosItens = itens.map(item =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      );
      
      setItens(novosItens);
      await AsyncStorage.setItem('carrinho', JSON.stringify(novosItens));
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const removerItem = async (id: number) => {
    try {
      const novosItens = itens.filter(item => item.id !== id);
      setItens(novosItens);
      await AsyncStorage.setItem('carrinho', JSON.stringify(novosItens));
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const limparCarrinho = async () => {
    try {
      setItens([]);
      await AsyncStorage.removeItem('carrinho');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const getQuantidadeTotal = () => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  useEffect(() => {
    carregarCarrinho();
  }, []);

  return {
    itens,
    loading,
    carregarCarrinho,
    adicionarItem,
    atualizarQuantidade,
    removerItem,
    limparCarrinho,
    calcularTotal,
    getQuantidadeTotal
  };
};
