import { Platform, StyleSheet, View } from 'react-native';

export default function TabBarBackground() {
  if (Platform.OS === 'ios') {
    return <View style={styles.container} />;
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    height: 1,
  },
});
