import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import BottomMenu from '../components/ui/BottomMenu';
import { AuthProvider } from '../src/contexts/AuthContext';
import { CartProvider } from '../src/contexts/CartContext';
import { MenuProvider, useMenu } from '../src/contexts/MenuContext';
import { OrderProvider } from '../src/contexts/OrderContext';
import { ThemeProvider as AppThemeProvider } from '../src/contexts/ThemeContext';
import { UserProvider } from '../src/contexts/UserContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { isMenuOpen, menuType, closeMenu } = useMenu();
  
  return (
    <>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="produto/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="cadastro" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="perfil" options={{ headerShown: false }} />
        </Stack>
      {/* Status bar escura (para fundo branco) */}
      <StatusBar style="dark" />
    </ThemeProvider>
    
    {/* Bottom Menu Global */}
    {menuType && (
      <BottomMenu 
        visible={isMenuOpen} 
        onClose={closeMenu} 
        type={menuType}
      />
    )}
  </>
);
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <UserProvider>
          <MenuProvider>
            <CartProvider>
              <OrderProvider>
                <AppContent />
              </OrderProvider>
            </CartProvider>
          </MenuProvider>
        </UserProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
