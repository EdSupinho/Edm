import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListSkeleton } from '../../src/components/SkeletonLoader';
import { getApiUrl } from '../../src/config/api';
import { useAuth } from '../../src/contexts/AuthContext';

const API_BASE_URL = getApiUrl();

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  is_admin: boolean;
  data_criacao: string;
  data_nascimento?: string;
  genero?: string;
  avatar_url?: string;
  ativo: boolean;
  total_pedidos: number;
}

export default function AdminUsuariosScreen() {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Erro ao carregar usuários');
        Alert.alert('Erro', 'Não foi possível carregar os usuários');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsuarios();
    setRefreshing(false);
  };

  const handleToggleStatus = async (usuario: Usuario) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/usuarios/${usuario.id}/ativo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ativo: !usuario.ativo }),
      });

      if (response.ok) {
        // Atualizar o estado local
        setUsuarios(usuarios.map(u => 
          u.id === usuario.id ? { ...u, ativo: !u.ativo } : u
        ));
        Alert.alert('Sucesso', `Usuário ${!usuario.ativo ? 'ativado' : 'desativado'} com sucesso`);
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.erro || 'Não foi possível atualizar o status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <View style={styles.usuarioCard}>
      <View style={styles.usuarioHeader}>
        <View style={styles.usuarioInfo}>
          <Text style={styles.usuarioNome}>{item.nome}</Text>
          <Text style={styles.usuarioEmail}>{item.email}</Text>
        </View>
        {item.is_admin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        )}
      </View>

      <View style={styles.usuarioDetails}>
        {item.telefone && (
          <Text style={styles.detailText}>📞 {item.telefone}</Text>
        )}
        <Text style={styles.detailText}>📦 {item.total_pedidos} pedidos</Text>
        <Text style={styles.detailText}>📅 Criado em: {formatDate(item.data_criacao)}</Text>
      </View>

      <View style={styles.usuarioActions}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>
            {item.ativo ? '✅ Ativo' : '❌ Inativo'}
          </Text>
          <Switch
            value={item.ativo}
            onValueChange={() => handleToggleStatus(item)}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={item.ativo ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>
    </View>
  );

  const renderEmptyUsuarios = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>Nenhum Usuário</Text>
      <Text style={styles.emptyText}>Não há usuários cadastrados</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Usuários</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{usuarios.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {usuarios.filter(u => u.ativo).length}
          </Text>
          <Text style={styles.statLabel}>Ativos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {usuarios.filter(u => u.is_admin).length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      {/* Lista de Usuários */}
      {loading ? (
        <ListSkeleton count={3} />
      ) : (
        <FlatList
          data={usuarios}
          renderItem={renderUsuario}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.usuariosList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']}
              tintColor="#007bff"
            />
          }
          ListEmptyComponent={renderEmptyUsuarios}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  usuariosList: {
    padding: 20,
  },
  usuarioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  usuarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#666',
  },
  adminBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  usuarioDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginVertical: 2,
  },
  usuarioActions: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

