import React, { createContext, ReactNode, useContext, useState } from 'react';

interface MenuContextType {
  isMenuOpen: boolean;
  menuType: 'user' | 'admin' | null;
  openMenu: (type: 'user' | 'admin') => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuType, setMenuType] = useState<'user' | 'admin' | null>(null);

  const openMenu = (type: 'user' | 'admin') => {
    setMenuType(type);
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuType(null);
  };

  return (
    <MenuContext.Provider value={{ isMenuOpen, menuType, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

