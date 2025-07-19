import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a Dojon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#111',
    alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontSize: 24, color: '#fff',
  },
});
