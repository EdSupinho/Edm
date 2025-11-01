import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl } from '../../src/config/api';
import { useTheme } from '../../src/contexts/ThemeContext';
import { borderRadius, colors, commonStyles, shadows, spacing, typography } from '../../src/styles/designSystem';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria_nome: string;
}

interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

const API_BASE_URL = getApiUrl();

export default function HomeScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const { colors: themeColors } = useTheme();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [produtosRes, categoriasRes] = await Promise.all([
        fetch(`${API_BASE_URL}/produtos`),
        fetch(`${API_BASE_URL}/categorias`)
      ]);
      
      const produtosData = await produtosRes.json();
      const categoriasData = await categoriasRes.json();
      
      setProdutos(produtosData.slice(0, 6)); // Mostrar apenas 6 produtos na home
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const buscarProdutos = async () => {
    try {
      const url = busca 
        ? `${API_BASE_URL}/produtos?busca=${encodeURIComponent(busca)}`
        : `${API_BASE_URL}/produtos`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProdutos(data.slice(0, 6));
    } catch (error) {
      console.error('Erro na busca:', error);
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
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Loja Online</Text>
          <Text style={styles.subtitle}>Encontre os melhores produtos</Text>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={buscarProdutos}
          />
          <TouchableOpacity style={styles.searchButton} onPress={buscarProdutos}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Categorias - Linha horizontal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.id}
                style={styles.categoryCard}
                onPress={() => router.push('../../(tabs)/produtos')}
              >
                <Text style={styles.categoryName}>{categoria.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Produtos em Destaque - Organizados em Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
            <TouchableOpacity onPress={() => router.push('../../(tabs)/produtos')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {produtos.map((produto) => (
              <TouchableOpacity
                key={produto.id}
                style={styles.productCardGrid}
                onPress={() => router.push(`/produto/${produto.id}` as any)}
              >
                <Image
                  source={{ uri: produto.imagem_url }}
                  style={styles.productImageGrid}
                  resizeMode="cover"
                  defaultSource={require('../../assets/images/icon.png')}
                  onError={() => console.log('Erro ao carregar imagem:', produto.imagem_url)}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {produto.nome}
                  </Text>
                  <Text style={styles.productPrice}>
                    {formatarPreco(produto.preco)}
                  </Text>
                  <Text style={styles.productCategory}>
                    {produto.categoria_nome}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botão para ver todos os produtos */}
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => router.push('../../(tabs)/produtos')}
        >
          <Text style={styles.seeAllButtonText}>Ver Todos os Produtos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - spacing.md * 3) / 2;

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...commonStyles.textSecondary,
    marginTop: spacing.sm,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  title: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize['3xl'],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    fontSize: typography.fontSize.base,
    backgroundColor: colors.surfaceSecondary,
  },
  searchButton: {
    marginLeft: spacing.sm,
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  searchButtonText: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...commonStyles.textHeading,
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.sm,
  },
  seeAllText: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 100,
    alignItems: 'center',
    ...shadows.md,
  },
  categoryName: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  productCard: {
    backgroundColor: colors.surface,
    marginRight: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: 180,
    overflow: 'hidden',
    ...shadows.lg,
  },
  productCardGrid: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: cardWidth,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray100,
  },
  productImageGrid: {
    width: '100%',
    height: 160,
    backgroundColor: colors.gray100,
  },
  productInfo: {
    padding: spacing.md,
  },
  productName: {
    ...commonStyles.textPrimary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.tight * typography.fontSize.sm,
  },
  productPrice: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  productCategory: {
    ...commonStyles.textSecondary,
    fontSize: typography.fontSize.xs,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seeAllButton: {
    ...commonStyles.button,
    ...commonStyles.buttonPrimary,
    margin: spacing.lg,
  },
  seeAllButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  categoriesContainer: {
    paddingRight: spacing.md,
  },
});
