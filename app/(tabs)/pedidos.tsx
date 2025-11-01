import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListSkeleton } from '../../src/components/SkeletonLoader';
import { useAuth } from '../../src/contexts/AuthContext';
import { Order, useOrders } from '../../src/contexts/OrderContext';
import { useUser } from '../../src/contexts/UserContext';

export default function PedidosScreen() {
  const { orders, loading, loadOrders, getStatusColor, getStatusText } = useOrders();
  const { user, getPurchaseHistory } = useUser();
  const { isAuthenticated: isAdminAuth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAdminAuth) {
      
      loadOrders();
    } else if (user) {
      
      carregarPedidosUsuario();
    }
  }, [user, isAdminAuth]);

  const carregarPedidosUsuario = async () => {
    try {
      const historico = await getPurchaseHistory();
      setUserOrders(historico);
    } catch (error) {
      console.error('Erro ao carregar pedidos do usuário:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (isAdminAuth) {
      await loadOrders();
    } else if (user) {
      await carregarPedidosUsuario();
    }
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderPress = (order: Order) => {
    
    router.push(`/pedido/${order.id}` as any);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => handleOrderPress(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.orderDate}>{formatDate(item.data_pedido)}</Text>
      <Text style={styles.orderTotal}>Total: {item.total.toFixed(2)} MZN</Text>
      
      <View style={styles.orderItems}>
        <Text style={styles.orderItemsTitle}>Itens:</Text>
        {item.itens.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.orderItem}>
            • {item.produto_nome} (x{item.quantidade})
          </Text>
        ))}
        {item.itens.length > 2 && (
          <Text style={styles.orderItem}>
            • +{item.itens.length - 2} outros itens
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>Nenhum Pedido</Text>
      <Text style={styles.emptyText}>Você ainda não fez nenhum pedido</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push('/(tabs)/produtos' as any)}
      >
        <Text style={styles.shopButtonText}>Fazer Primeira Compra</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {isAdminAuth ? 'Todos os Pedidos (Admin)' : user ? 'Meus Pedidos' : 'Pedidos'}
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Pedidos */}
      {loading ? (
        <ListSkeleton count={3} />
      ) : (
        <FlatList
          data={isAdminAuth ? orders : user ? userOrders : []}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']}
              tintColor="#007bff"
            />
          }
          ListEmptyComponent={renderEmptyOrders}
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
  ordersList: {
    padding: 20,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 12,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  orderItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
