import { Text } from 'react-native';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
}

export function IconSymbol({ name, size = 24, color = '#000' }: IconSymbolProps) {
  const iconMap: Record<string, string> = {
    'house.fill': '🏠',
    'bag.fill': '🛍️',
    'cart.fill': '🛒',
    'person.fill': '👤',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '❓'}
    </Text>
  );
}
