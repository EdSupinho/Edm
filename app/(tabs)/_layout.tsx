import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useCarrinho } from '../../src/hooks/useCarrinho';

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

function CartIconWithBadge({ color, count }: { color: string; count: number }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={{ fontSize: 26, color }}>🛒</Text>
      <Badge count={count} />
    </View>
  );
}

export default function TabLayout() {
  const { itens: carrinhoItens } = useCarrinho();
  const { isAuthenticated: isAdminAuth } = useAuth();
  const cartCount = carrinhoItens.reduce((total: number, item: any) => total + item.quantidade, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ff6b35',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}>
      
      {/* HOME - Página principal */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 26, color }}>
              {focused ? '🏠' : '🏡'}
            </Text>
          ),
        }}
      />
      
      {/* SHOP - Todos os Produtos */}
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 26, color }}>
              {focused ? '🛍️' : '🛍️'}
            </Text>
          ),
        }}
      />
      
      {/* CARRINHO - Cart */}
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <CartIconWithBadge color={color} count={cartCount} />
          ),
        }}
      />
      
      {/* FAVORITES - Favoritos */}
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 26, color }}>
              {focused ? '❤️' : '🤍'}
            </Text>
          ),
        }}
      />
      
      {/* ACCOUNT - Minha Conta */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Text style={{ fontSize: 26, color }}>
              {focused ? '👤' : '👥'}
            </Text>
          ),
        }}
      />
      
      {/* ADMIN - Tab só aparece quando admin está logado */}
      {isAdminAuth && (
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: 26, color }}>
                {focused ? '👑' : '👑'}
              </Text>
            ),
          }}
        />
      )}
      
      {/* Tabs ocultas - acessíveis via menu flutuante */}
      <Tabs.Screen
        name="pedidos"
        options={{
          href: null, 
        }}
      />
      
      <Tabs.Screen
        name="admin-login"
        options={{
          href: null, 
        }}
      />
      
      <Tabs.Screen
        name="admin-usuarios"
        options={{
          href: null, 
        }}
      />
      
      {/* Admin tabs ocultas para quando não está logado */}
      {!isAdminAuth && (
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            href: null,
          }}
        />
      )}
      
      {/* Admin tabs sempre ocultas (acessíveis via menu lateral) */}
      <Tabs.Screen
        name="admin-produtos"
        options={{
          href: null,
        }}
      />
      
      <Tabs.Screen
        name="admin-categorias"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    height: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 25 : 8,
    paddingTop: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
