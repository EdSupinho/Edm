import { router } from 'expo-router';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useAuth } from '../../src/contexts/AuthContext';
import { useTheme } from '../../src/contexts/ThemeContext';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

export default function AdminSideMenu({ visible, onClose }: SideMenuProps) {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊', route: '/(tabs)/admin-dashboard' },
    { id: 'produtos', title: 'Gerenciar Produtos', icon: '📦', route: '/(tabs)/admin-produtos' },
    { id: 'categorias', title: 'Gerenciar Categorias', icon: '🏷️', route: '/(tabs)/admin-categorias' },
    { id: 'pedidos', title: 'Ver Pedidos', icon: '📋', route: '/(tabs)/pedidos' },
    { id: 'usuarios', title: 'Gerenciar Usuários', icon: '👥', route: '/(tabs)/admin-usuarios' },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLogout = () => {
    onClose();
    logout();
    router.replace('/(tabs)/admin-login' as any);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={[styles.menuContainer, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Administrador
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {admin?.username}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuContent}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, { borderBottomColor: colors.border }]}
                onPress={() => handleNavigation(item.route)}
              >
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuItemArrow, { color: colors.textSecondary }]}>
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.themeButton, { backgroundColor: colors.primary }]}
              onPress={toggleTheme}
            >
              <Text style={styles.themeButtonText}>
                {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.logoutButton, { borderColor: colors.border }]}
              onPress={handleLogout}
            >
              <Text style={[styles.logoutButtonText, { color: '#ff4444' }]}>
                🚪 Sair
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  menuContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
  },
  menuItemArrow: {
    fontSize: 24,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  themeButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

