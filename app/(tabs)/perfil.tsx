import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiUrl } from '../../src/config/api';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useUser } from '../../src/contexts/UserContext';

interface Pedido {
  id: number;
  total: number;
  status: string;
  data_pedido: string;
  itens: {
    produto_id: number;
    produto_nome: string;
    quantidade: number;
    preco_unitario: number;
  }[];
}

const API_BASE_URL = getApiUrl();

export default function PerfilScreen() {
  const { user, logout } = useUser();
  const { colors } = useTheme();
  const [usuario, setUsuario] = useState(user || {
    id: 1,
    nome: 'Usuário',
    email: 'email@example.com',
    telefone: '',
    endereco: ''
  });
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [dadosEditaveis, setDadosEditaveis] = useState(usuario);

  useEffect(() => {
    if (user) {
      setUsuario({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone || '',
        endereco: user.endereco || ''
      });
      carregarPedidos();
    }
  }, [user]);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('Token não encontrado');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/usuarios/historico`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao carregar pedidos:', response.status, errorData);
        
        // Se o token estiver inválido, redirecionar para login
        if (response.status === 401 || response.status === 422) {
          Alert.alert('Sessão Expirada', 'Por favor, faça login novamente', [
            {
              text: 'OK',
              onPress: async () => {
                await logout();
                router.replace('/login' as any);
              }
            }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos');
    } finally {
      setLoading(false);
    }
  };


  const salvarPerfil = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEditaveis),
      });

      if (response.ok) {
        setUsuario(dadosEditaveis);
        setEditandoPerfil(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicao = () => {
    setDadosEditaveis(usuario);
    setEditandoPerfil(false);
  };

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(preco);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return '#ffc107';
      case 'processando':
        return '#17a2b8';
      case 'enviado':
        return '#007bff';
      case 'entregue':
        return '#28a745';
      case 'cancelado':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header com Avatar */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{usuario.nome.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Meu Perfil</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{usuario.email}</Text>
        </View>

        {/* Informações do Usuário */}
        <View style={[styles.profileContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Pessoais</Text>
            {!editandoPerfil && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditandoPerfil(true)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {editandoPerfil ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={dadosEditaveis.nome}
                onChangeText={(text) => setDadosEditaveis(prev => ({ ...prev, nome: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={dadosEditaveis.email}
                onChangeText={(text) => setDadosEditaveis(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={dadosEditaveis.telefone}
                onChangeText={(text) => setDadosEditaveis(prev => ({ ...prev, telefone: text }))}
                keyboardType="phone-pad"
              />
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Endereço"
                value={dadosEditaveis.endereco}
                onChangeText={(text) => setDadosEditaveis(prev => ({ ...prev, endereco: text }))}
                multiline
                numberOfLines={3}
              />

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelarEdicao}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                  onPress={salvarPerfil}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nome:</Text>
                <Text style={styles.infoValue}>{usuario.nome}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{usuario.email}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telefone:</Text>
                <Text style={styles.infoValue}>{usuario.telefone}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Endereço:</Text>
                <Text style={styles.infoValue}>{usuario.endereco}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Meus Pedidos */}
        <View style={styles.ordersContainer}>
          <View style={styles.ordersHeader}>
            <Text style={styles.sectionTitle}>Meus Pedidos</Text>
            <TouchableOpacity onPress={carregarPedidos}>
              <Text style={styles.refreshText}>Atualizar</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Carregando pedidos...</Text>
            </View>
          ) : pedidos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => router.push('../../(tabs)/produtos')}
              >
                <Text style={styles.shopButtonText}>Fazer Primeira Compra</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {pedidos.map((pedido) => (
                <View key={pedido.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Pedido #{pedido.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pedido.status) }]}>
                      <Text style={styles.statusText}>{pedido.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.orderDate}>
                    {formatarData(pedido.data_pedido)}
                  </Text>
                  
                  <Text style={styles.orderTotal}>
                    Total: {formatarPreco(pedido.total)}
                  </Text>
                  
                  <View style={styles.orderItems}>
                    <Text style={styles.orderItemsTitle}>Itens:</Text>
                    {pedido.itens.map((item, index) => (
                      <Text key={index} style={styles.orderItem}>
                        • {item.produto_nome} x{item.quantidade} - {formatarPreco(item.preco_unitario)}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Ações Rápidas */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('../../(tabs)/produtos')}
          >
            <Text style={styles.actionButtonText}>🛍️ Continuar Comprando</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('../../(tabs)/carrinho')}
          >
            <Text style={styles.actionButtonText}>🛒 Ver Carrinho</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
                { 
                  text: 'Cancelar', 
                  style: 'cancel' 
                },
                { 
                  text: 'Sair', 
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    router.replace('/login' as any);
                  }
                }
              ]);
            }}
          >
            <Text style={styles.actionButtonText}>🚪 Sair da Conta</Text>
          </TouchableOpacity>
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
  header: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
  profileContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  editForm: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  profileInfo: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#6c757d',
    flex: 1,
  },
  ordersContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  refreshText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ordersList: {
    marginTop: 10,
  },
  orderCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderDate: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 10,
  },
  orderItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  orderItem: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  actionsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
});
