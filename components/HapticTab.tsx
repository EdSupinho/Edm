import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { delayLongPress, ...touchableProps } = props;
  return <TouchableOpacity {...(touchableProps as TouchableOpacityProps)} />;
}
