import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdvancedSearch } from '../../src/components/AdvancedSearch';
import { Pagination } from '../../src/components/Pagination';
import { ProductSkeleton } from '../../src/components/SkeletonLoader';
import { getApiUrl } from '../../src/config/api';
import { useAuth } from '../../src/contexts/AuthContext';
import { useCart } from '../../src/contexts/CartContext';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useUser } from '../../src/contexts/UserContext';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria_nome: string;
  estoque: number;
}

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

const API_BASE_URL = getApiUrl();

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const { isAuthenticated, admin } = useAuth();
  const { addToCart, isInCart, getItemQuantity, itemCount } = useCart();
  const { user, addToFavorites, removeFromFavorites, checkFavoriteStatus } = useUser();
  const { colors } = useTheme();
  
  // Estados para melhorias na interface
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [refreshing, setRefreshing] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    precoMin: '',
    precoMax: '',
    categoriaId: null as number | null,
    disponibilidade: 'todos' as 'todos' | 'disponivel' | 'indisponivel',
    ordenacao: 'nome' as 'nome' | 'preco_asc' | 'preco_desc' | 'data_desc'
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (categorias.length > 0) { // Só busca quando as categorias estão carregadas
      buscarProdutos();
    }
  }, [categoriaSelecionada, busca, categorias, filters]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Aqui você pode implementar carregamento de página específica
  };

  // Calcular produtos paginados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProdutos = produtos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(produtos.length / itemsPerPage);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [produtosRes, categoriasRes] = await Promise.all([
        fetch(`${API_BASE_URL}/produtos`),
        fetch(`${API_BASE_URL}/categorias`)
      ]);
      
      const produtosData = await produtosRes.json();
      const categoriasData = await categoriasRes.json();
      
      setProdutos(produtosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua rede.');
    } finally {
      setLoading(false);
    }
  };

  const buscarProdutos = async () => {
    try {
      let url = `${API_BASE_URL}/produtos`;
      const params = new URLSearchParams();
      
      if (busca.trim()) {
        params.append('busca', busca.trim());
      }
      
      if (categoriaSelecionada) {
        params.append('categoria_id', categoriaSelecionada.toString());
      }
      
      // Aplicar filtros avançados
      if (filters.categoriaId) {
        params.append('categoria_id', filters.categoriaId.toString());
      }
      
      if (filters.precoMin) {
        params.append('preco_min', filters.precoMin);
      }
      
      if (filters.precoMax) {
        params.append('preco_max', filters.precoMax);
      }
      
      if (filters.disponibilidade !== 'todos') {
        params.append('disponibilidade', filters.disponibilidade);
      }
      
      if (filters.ordenacao) {
        params.append('ordenacao', filters.ordenacao);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleAddToCart = (produto: Produto) => {
    // Verificar se o usuário está logado
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

    if (produto.estoque <= 0) {
      Alert.alert('Produto Indisponível', 'Este produto está fora de estoque.');
      return;
    }
    addToCart(produto);
    Alert.alert('Adicionado ao Carrinho', `${produto.nome} foi adicionado ao carrinho!`);
  };

  const handleToggleFavorite = async (produto: Produto) => {
    if (!user) {
      Alert.alert('Login Necessário', 'Faça login para adicionar produtos aos favoritos.');
      return;
    }

    try {
      const isFavorito = favoritos.has(produto.id);
      
      if (isFavorito) {
        const result = await removeFromFavorites(produto.id);
        if (result.success) {
          setFavoritos(prev => {
            const newSet = new Set(prev);
            newSet.delete(produto.id);
            return newSet;
          });
        } else {
          Alert.alert('Erro', result.error || 'Erro ao remover dos favoritos');
        }
      } else {
        const result = await addToFavorites(produto.id);
        if (result.success) {
          setFavoritos(prev => new Set([...prev, produto.id]));
        } else {
          Alert.alert('Erro', result.error || 'Erro ao adicionar aos favoritos');
        }
      }
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Erro inesperado ao alterar favorito');
    }
  };

  const renderProduto = ({ item }: { item: Produto }) => {
    const inCart = isInCart(item.id);
    const quantity = getItemQuantity(item.id);
    const isFavorito = favoritos.has(item.id);
    
    return (
      <TouchableOpacity 
        style={styles.produtoCard}
        onPress={() => router.push(`/produto/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            handleToggleFavorite(item);
          }}
        >
          <Text style={[styles.favoriteIcon, isFavorito && styles.favoriteIconActive]}>
            {isFavorito ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        
        <Image 
          source={{ uri: item.imagem_url }} 
          style={styles.produtoImagem}
        />
        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.produtoCategoria}>{item.categoria_nome}</Text>
          <Text style={styles.produtoPreco}>{item.preco.toFixed(2)} MZN</Text>
          <Text style={styles.produtoEstoque}>
            {item.estoque > 0 ? `${item.estoque} em estoque` : 'Fora de estoque'}
          </Text>
          
          {/* Botões do Carrinho */}
          <View style={styles.cartButtons}>
            {inCart ? (
              <View style={styles.cartStatus}>
                <Text style={styles.cartStatusText}>
                  {quantity} no carrinho
                </Text>
                <TouchableOpacity
                  style={styles.cartItemButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  <Text style={styles.cartItemButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  item.estoque <= 0 && styles.addToCartButtonDisabled
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                disabled={item.estoque <= 0}
              >
                <Text style={[
                  styles.addToCartButtonText,
                  item.estoque <= 0 && styles.addToCartButtonTextDisabled
                ]}>
                  {item.estoque <= 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoria = ({ item }: { item: Categoria }) => (
    <TouchableOpacity
      style={[
        styles.categoriaButton,
        categoriaSelecionada === item.id && styles.categoriaButtonActive
      ]}
      onPress={() => setCategoriaSelecionada(
        categoriaSelecionada === item.id ? null : item.id
      )}
    >
      <Text style={[
        styles.categoriaButtonText,
        categoriaSelecionada === item.id && styles.categoriaButtonTextActive
      ]}>
        {item.nome}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando produtos...</Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Produtos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/(tabs)/carrinho' as any)}
          >
            <Text style={styles.cartButtonText}>🛒</Text>
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => router.push('/admin-dashboard' as any)}
            >
              <Text style={styles.adminButtonText}> Admin</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/admin-login' as any)}
            >
              <Text style={styles.loginButtonText}> Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barra de Busca */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar produtos..."
          value={busca}
          onChangeText={setBusca}
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowAdvancedSearch(true)}
        >
          <Text style={styles.filterButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de Categoria */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoriaButton,
              categoriaSelecionada === null && styles.categoriaButtonActive
            ]}
            onPress={() => setCategoriaSelecionada(null)}
          >
            <Text style={[
              styles.categoriaButtonText,
              categoriaSelecionada === null && styles.categoriaButtonTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              style={[
                styles.categoriaButton,
                categoriaSelecionada === categoria.id && styles.categoriaButtonActive
              ]}
              onPress={() => setCategoriaSelecionada(
                categoriaSelecionada === categoria.id ? null : categoria.id
              )}
            >
              <Text style={[
                styles.categoriaButtonText,
                categoriaSelecionada === categoria.id && styles.categoriaButtonTextActive
              ]}>
                {categoria.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Produtos */}
      {loading ? (
        <View style={styles.productsList}>
          <View style={styles.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={paginatedProdutos}
          renderItem={renderProduto}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          key={`${categoriaSelecionada}-${busca}-${currentPage}`} 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']}
              tintColor="#007bff"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            </View>
          }
        />
      )}

      {/* Paginação */}
      {!loading && produtos.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={produtos.length}
        />
      )}

      {/* Busca Avançada Modal */}
      <AdvancedSearch
        visible={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onApplyFilters={handleApplyFilters}
        categorias={categorias}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  adminButton: {
    backgroundColor: '#2963a7ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#007bff',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersScroll: {
    paddingHorizontal: 20,
  },
  categoriaButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoriaButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoriaButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoriaButtonTextActive: {
    color: '#fff',
  },
  productsList: {
    padding: 20,
  },
  produtoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 5,
    flex: 1,
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  favoriteIconActive: {
    fontSize: 20,
  },
  produtoImagem: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
    backgroundColor: '#f5f5f5',
  },
  produtoInfo: {
    padding: 12,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  produtoCategoria: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  produtoPreco: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 4,
  },
  produtoEstoque: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  // Estilos do carrinho
  cartButtons: {
    marginTop: 10,
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartButtonTextDisabled: {
    color: '#fff',
  },
  cartStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartStatusText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  cartItemButton: {
    backgroundColor: '#28a745',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Estilos do header
  cartButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    position: 'relative',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Estilos para skeleton
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});