import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListSkeleton } from '../../src/components/SkeletonLoader';
import { useCart } from '../../src/contexts/CartContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useUser } from '../../src/contexts/UserContext';

interface Favorito {
  id: number;
  produto_id: number;
  produto_nome: string;
  produto_preco: number;
  produto_imagem: string;
  produto_estoque: number;
  data_favorito: string;
}

export default function FavoritosScreen() {
  const { user, getFavorites, removeFromFavorites, loading } = useUser();
  const { addToCart } = useCart();
  const { colors } = useTheme();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      carregarFavoritos();
    }
  }, [user]);

  const carregarFavoritos = async () => {
    try {
      const favoritosData = await getFavorites();
      setFavoritos(favoritosData);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarFavoritos();
    setRefreshing(false);
  };

  const handleRemoverFavorito = async (produtoId: number) => {
    Alert.alert(
      'Remover Favorito',
      'Tem certeza que deseja remover este produto dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await removeFromFavorites(produtoId);
              if (result.success) {
                setFavoritos(prev => prev.filter(fav => fav.produto_id !== produtoId));
                Alert.alert('Sucesso', 'Produto removido dos favoritos');
              } else {
                Alert.alert('Erro', result.error || 'Erro ao remover favorito');
              }
            } catch (error) {
              console.error('Erro ao remover favorito:', error);
              Alert.alert('Erro', 'Erro inesperado ao remover favorito');
            }
          }
        }
      ]
    );
  };

  const handleAdicionarAoCarrinho = (produto: Favorito) => {
    if (produto.produto_estoque <= 0) {
      Alert.alert('Produto Indisponível', 'Este produto está fora de estoque.');
      return;
    }

    addToCart({
      produto_id: produto.produto_id,
      nome: produto.produto_nome,
      preco: produto.produto_preco,
      imagem_url: produto.produto_imagem,
      estoque: produto.produto_estoque
    });

    Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
  };

  const renderFavorito = ({ item }: { item: Favorito }) => (
    <View style={styles.favoritoCard}>
      <TouchableOpacity 
        style={styles.produtoInfo}
        onPress={() => router.push(`/produto/${item.produto_id}` as any)}
      >
        <Image 
          source={{ uri: item.produto_imagem || 'https://via.placeholder.com/100x100' }} 
          style={styles.produtoImagem}
        />
        <View style={styles.produtoDetalhes}>
          <Text style={styles.produtoNome} numberOfLines={2}>
            {item.produto_nome}
          </Text>
          <Text style={styles.produtoPreco}>
            {item.produto_preco.toFixed(2)} MZN
          </Text>
          <Text style={styles.produtoEstoque}>
            {item.produto_estoque > 0 ? 
              `${item.produto_estoque} em estoque` : 
              'Fora de estoque'
            }
          </Text>
          <Text style={styles.dataFavorito}>
            Adicionado em {new Date(item.data_favorito).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.acoes}>
        <TouchableOpacity 
          style={[
            styles.acaoButton,
            item.produto_estoque <= 0 && styles.acaoButtonDisabled
          ]}
          onPress={() => handleAdicionarAoCarrinho(item)}
          disabled={item.produto_estoque <= 0}
        >
          <Text style={[
            styles.acaoButtonText,
            item.produto_estoque <= 0 && styles.acaoButtonTextDisabled
          ]}>
            🛒 Adicionar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.acaoButton, styles.removerButton]}
          onPress={() => handleRemoverFavorito(item.produto_id)}
        >
          <Text style={[styles.acaoButtonText, styles.removerButtonText]}>
            ❤️ Remover
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyFavoritos = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyTitle}>Nenhum Favorito</Text>
      <Text style={styles.emptyText}>
        Você ainda não adicionou nenhum produto aos favoritos.
      </Text>
      <TouchableOpacity 
        style={styles.explorarButton}
        onPress={() => router.push('/(tabs)/produtos' as any)}
      >
        <Text style={styles.explorarButtonText}>Explorar Produtos</Text>
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Faça login para ver seus favoritos</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/cadastro' as any)}
          >
            <Text style={styles.loginButtonText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Meus Favoritos</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Favoritos */}
      {loading ? (
        <ListSkeleton count={3} />
      ) : (
        <FlatList
          data={favoritos}
          renderItem={renderFavorito}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.favoritosList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']}
              tintColor="#007bff"
            />
          }
          ListEmptyComponent={renderEmptyFavoritos}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#f8f9fa',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 18,
    color: '#007bff',
  },
  favoritosList: {
    padding: 20,
  },
  favoritoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  produtoInfo: {
    flexDirection: 'row',
    padding: 15,
  },
  produtoImagem: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
  },
  produtoDetalhes: {
    flex: 1,
    justifyContent: 'center',
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  produtoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  produtoEstoque: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 5,
  },
  dataFavorito: {
    fontSize: 12,
    color: '#999',
  },
  acoes: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 10,
  },
  acaoButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  acaoButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  acaoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  acaoButtonTextDisabled: {
    color: '#ccc',
  },
  removerButton: {
    backgroundColor: '#dc3545',
  },
  removerButtonText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  explorarButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  explorarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
