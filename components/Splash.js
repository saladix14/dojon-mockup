// components/Splash.js
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';

export default function Splash() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <LottieView
        source={require('../assets/animations/splash.json')} // Animación Lottie de ejemplo
        autoPlay
        loop
        style={styles.logo}
      />
      <Text style={styles.title}>Dojøn Web3 Ninja</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',  // fondo negro
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200, // tamaño de ejemplo para el logo animado
  },
  title: {
    color: '#ccc', // texto plateado/clear
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
    textShadowColor: '#0ff', 
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 1,
  },
});

