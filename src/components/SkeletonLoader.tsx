import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Componente para skeleton de produto
export const ProductSkeleton: React.FC = () => (
  <View style={styles.productSkeleton}>
    <SkeletonLoader width="100%" height={120} borderRadius={12} />
    <View style={styles.productInfo}>
      <SkeletonLoader width="80%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="60%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="40%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="70%" height={12} borderRadius={4} />
    </View>
  </View>
);

// Componente para skeleton de lista
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <View style={styles.listSkeleton}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.listItem}>
        <SkeletonLoader width={60} height={60} borderRadius={8} />
        <View style={styles.listItemInfo}>
          <SkeletonLoader width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="50%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="40%" height={16} borderRadius={4} />
        </View>
      </View>
    ))}
  </View>
);

// Componente para skeleton de card
export const CardSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <SkeletonLoader width="100%" height={200} borderRadius={12} />
    <View style={styles.cardContent}>
      <SkeletonLoader width="90%" height={20} borderRadius={4} style={{ marginBottom: 12 }} />
      <SkeletonLoader width="60%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="80%" height={16} borderRadius={4} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
  productSkeleton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 5,
    flex: 1,
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productInfo: {
    padding: 12,
  },
  listSkeleton: {
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cardSkeleton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginTop: 15,
  },
});
