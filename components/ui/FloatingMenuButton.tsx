import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useMenu } from '../../src/contexts/MenuContext';
import { useUser } from '../../src/contexts/UserContext';

export default function FloatingMenuButton() {
  const { openMenu } = useMenu();
  const { user } = useUser();
  const { isAuthenticated: isAdminAuth } = useAuth();

  // Só mostra se o usuário estiver logado
  if (!user && !isAdminAuth) {
    return null;
  }

  const handlePress = () => {
    const menuType = isAdminAuth ? 'admin' : 'user';
    openMenu(menuType);
  };

  return (
    <TouchableOpacity 
      style={styles.floatingButton} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>☰</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

