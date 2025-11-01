import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl } from '../../src/config/api';
import { useUser } from '../../src/contexts/UserContext';
import { useCarrinho } from '../../src/hooks/useCarrinho';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria_nome: string;
  estoque: number;
}

const API_BASE_URL = getApiUrl();

export default function ProdutoScreen() {
  const { id } = useLocalSearchParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarItem } = useCarrinho();
  const { user } = useUser();

  useEffect(() => {
    if (id) {
      carregarProduto();
    }
  }, [id]);

  const carregarProduto = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
      const data = await response.json();
      setProduto(data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      Alert.alert('Erro', 'Não foi possível carregar o produto');
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = async () => {
    if (!produto) return;

    if (!user) {
      Alert.alert(
        'Login Necessário',
        'Faça login para adicionar produtos ao carrinho.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer Login', onPress: () => router.push('/login' as any) }
        ]
      );
      return;
    }

    if (quantidade > produto.estoque) {
      Alert.alert('Estoque Insuficiente', `Apenas ${produto.estoque} unidades disponíveis`);
      return;
    }

    const novoItem = {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: quantidade,
      imagem_url: produto.imagem_url,
      estoque: produto.estoque
    };

    const sucesso = await adicionarItem(novoItem);
    
    if (sucesso) {
      Alert.alert(
        'Produto Adicionado',
        `${produto.nome} foi adicionado ao carrinho!`,
        [
          { text: 'Continuar Comprando', onPress: () => router.back() },
          { text: 'Ver Carrinho', onPress: () => router.push('../../(tabs)/carrinho') }
        ]
      );
    } else {
      Alert.alert('Erro', 'Não foi possível adicionar o produto ao carrinho');
    }
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(preco);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando produto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!produto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Produto não encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/produtos' as any)}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header com botão voltar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/produtos' as any)}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Imagem do Produto */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: produto.imagem_url }}
            style={styles.productImage}
            resizeMode="cover"
            defaultSource={require('../../assets/images/icon.png')}
            onError={() => console.log('Erro ao carregar imagem:', produto.imagem_url)}
          />
        </View>

        {/* Informações do Produto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{produto.nome}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>{formatarPreco(produto.preco)}</Text>
            <Text style={styles.productCategory}>{produto.categoria_nome}</Text>
          </View>

          <View style={styles.stockContainer}>
            <Text style={styles.stockLabel}>Estoque:</Text>
            <Text style={[
              styles.stockValue,
              { color: produto.estoque > 0 ? '#28a745' : '#dc3545' }
            ]}>
              {produto.estoque > 0 ? `${produto.estoque} unidades disponíveis` : 'Fora de estoque'}
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{produto.descricao}</Text>
          </View>
        </View>

        {/* Seletor de Quantidade */}
        {produto.estoque > 0 && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantidade:</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={[styles.quantityButton, quantidade <= 1 && styles.quantityButtonDisabled]}
                onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                disabled={quantidade <= 1}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.quantityInput}
                value={quantidade.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 1;
                  setQuantidade(Math.min(Math.max(1, value), produto.estoque));
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
              
              <TouchableOpacity
                style={[styles.quantityButton, quantidade >= produto.estoque && styles.quantityButtonDisabled]}
                onPress={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                disabled={quantidade >= produto.estoque}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Resumo do Pedido */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Produto:</Text>
            <Text style={styles.summaryValue}>{produto.nome}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Quantidade:</Text>
            <Text style={styles.summaryValue}>{quantidade}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Preço unitário:</Text>
            <Text style={styles.summaryValue}>{formatarPreco(produto.preco)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatarPreco(produto.preco * quantidade)}</Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          {produto.estoque > 0 ? (
            <>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={adicionarAoCarrinho}
              >
                <Text style={styles.addToCartButtonText}>
                  🛒 Adicionar ao Carrinho
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.buyNowButton}
                onPress={() => {
                  adicionarAoCarrinho();
                  router.push('../../(tabs)/carrinho');
                }}
              >
                <Text style={styles.buyNowButtonText}>
                  💳 Comprar Agora
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.outOfStockContainer}>
              <Text style={styles.outOfStockText}>
                😞 Produto fora de estoque
              </Text>
              <TouchableOpacity
                style={styles.notifyButton}
                onPress={() => Alert.alert('Notificação', 'Você será notificado quando o produto estiver disponível!')}
              >
                <Text style={styles.notifyButtonText}>
                  🔔 Notificar quando disponível
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  productInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
  },
  productCategory: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '500',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stockLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 10,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
  },
  quantityContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quantityButtonDisabled: {
    backgroundColor: '#e9ecef',
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  quantityInput: {
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  actionsContainer: {
    padding: 20,
    marginTop: 10,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyNowButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outOfStockContainer: {
    alignItems: 'center',
    padding: 20,
  },
  outOfStockText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 15,
  },
  notifyButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 10,
    paddingHorizontal: 30,
  },
  notifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
