import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useUser } from '../../src/contexts/UserContext';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  disabled?: boolean;
  submenu?: MenuItem[];
}

interface BottomMenuProps {
  visible: boolean;
  onClose: () => void;
  type: 'user' | 'admin';
}

export default function BottomMenu({ visible, onClose, type }: BottomMenuProps) {
  const { user, logout } = useUser();
  const { logout: adminLogout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuPress = (item: MenuItem) => {
    if (item.submenu) {
      // Expandir/Collapsar submenu
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else if (item.action) {
      item.action();
      onClose();
    } else if (item.route) {
      router.push(item.route as any);
      onClose();
    }
  };

  const userMenuItems: MenuItem[] = [
    {
      id: 'profile',
      title: 'Meu Perfil',
      icon: '👤',
      route: '/(tabs)/perfil',
    },
    {
      id: 'orders',
      title: 'Meus Pedidos',
      icon: '📦',
      route: '/(tabs)/pedidos',
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      icon: '❤️',
      route: '/(tabs)/favoritos',
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: '⚙️',
      submenu: [
        { id: 'edit-profile', title: 'Editar Perfil', icon: '✏️', route: '/(tabs)/perfil' },
        { id: 'notifications', title: 'Notificações', icon: '🔔' },
        { id: 'privacy', title: 'Privacidade', icon: '🔒' },
      ],
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      icon: '❓',
      submenu: [
        { id: 'faq', title: 'Perguntas Frequentes', icon: '📝' },
        { id: 'contact', title: 'Contatar Suporte', icon: '📧' },
        { id: 'about', title: 'Sobre o App', icon: 'ℹ️' },
      ],
    },
    {
      id: 'logout',
      title: 'Sair da Conta',
      icon: '🚪',
      action: async () => {
        await logout();
      },
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      route: '/(tabs)/admin-dashboard',
    },
    {
      id: 'products',
      title: 'Produtos',
      icon: '📦',
      route: '/(tabs)/admin-produtos',
    },
    {
      id: 'categories',
      title: 'Categorias',
      icon: '🏷️',
      route: '/(tabs)/admin-categorias',
    },
    {
      id: 'orders',
      title: 'Pedidos',
      icon: '📋',
      submenu: [
        { id: 'all-orders', title: 'Todos os Pedidos', icon: '📦' },
        { id: 'pending', title: 'Pendentes', icon: '⏳' },
        { id: 'completed', title: 'Concluídos', icon: '✅' },
      ],
    },
    {
      id: 'users',
      title: 'Usuários',
      icon: '👥',
      submenu: [
        { id: 'all-users', title: 'Todos os Usuários', icon: '👤' },
        { id: 'new-users', title: 'Novos Usuários', icon: '🆕' },
      ],
    },
    {
      id: 'reports',
      title: 'Relatórios',
      icon: '📈',
      submenu: [
        { id: 'sales', title: 'Vendas', icon: '💰' },
        { id: 'products-report', title: 'Produtos', icon: '📊' },
        { id: 'users-report', title: 'Usuários', icon: '👥' },
      ],
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: '⚙️',
      submenu: [
        { id: 'general', title: 'Geral', icon: '🔧' },
        { id: 'email', title: 'Email', icon: '📧' },
        { id: 'security', title: 'Segurança', icon: '🔒' },
      ],
    },
    {
      id: 'logout',
      title: 'Sair (Admin)',
      icon: '🚪',
      action: async () => {
        await adminLogout();
      },
    },
  ];

  const menuItems = type === 'admin' ? adminMenuItems : userMenuItems;

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubmenu = !!item.submenu;
    const isExpanded = expandedMenu === item.id;
    const submenuItems = item.submenu || [];

    return (
      <View key={item.id} style={styles.menuItemContainer}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            level > 0 && styles.submenuItem,
            item.disabled && styles.menuItemDisabled,
          ]}
          onPress={() => !item.disabled && handleMenuPress(item)}
          disabled={item.disabled}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={[styles.menuTitle, level > 0 && styles.submenuTitle]}>
              {item.title}
            </Text>
          </View>
          {hasSubmenu && (
            <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
          )}
        </TouchableOpacity>

        {hasSubmenu && isExpanded && (
          <View style={styles.submenu}>
            {submenuItems.map((subItem) => renderMenuItem(subItem, level + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar}>
            <View style={styles.handle} />
          </View>

          {/* Menu header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {type === 'admin' ? '🏛️ Menu Admin' : '👤 Menu'}
            </Text>
            {user && (
              <Text style={styles.headerSubtitle}>
                {type === 'admin' ? 'Administrador' : user.nome}
              </Text>
            )}
          </View>

          {/* Menu items */}
          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => renderMenuItem(item))}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: Dimensions.get('window').height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#d1d5db',
    borderRadius: 3,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  menuItemContainer: {
    marginBottom: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  submenuItem: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
    paddingLeft: 12,
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  submenuTitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  expandIcon: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 10,
  },
  submenu: {
    marginTop: 5,
    marginLeft: 30,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 10,
  },
});

