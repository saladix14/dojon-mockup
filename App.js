// App.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --- Importa tu SplashScreen que creaste en screens/SplashScreen.js
import SplashScreen from './screens/SplashScreen';

import { ethers } from 'ethers';
import { connectWallet } from './utils/wallet';
import { provider } from './utils/ethers';

import ProductsScreen from "./screens/ProductsScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import SuccessScreen from "./screens/SuccessScreen";
import TokensScreen from './screens/TokensScreen';
import NFTsScreen from './screens/NFTsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  // Control de Splash
  const [showSplash, setShowSplash] = useState(true);

  // Lógica de Splash: oculta tras 2 segundos
  useEffect(() => {
    const timeout = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Mientras showSplash sea true, mostramos solo la SplashScreen
  if (showSplash) {
    return <SplashScreen />;
  }

  // A partir de aquí va tu código tal y como lo tienes ahora
  const [walletAddress, setWalletAddress] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [error, setError] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const block = await provider.getBlockNumber();
        setBlockNumber(block);
      } catch (err) {
        setError(err.message);
      }
    };
    loadBlockchainData();
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {walletAddress ? (
          <Text style={styles.wallet}>✅ Wallet: {walletAddress}</Text>
        ) : (
          <Button title="Conectar Wallet" onPress={handleConnectWallet} />
        )}

        <Text style={styles.title}>Polygon Block Info</Text>
        {error ? (
          <Text style={styles.error}>❌ Error: {error}</Text>
        ) : blockNumber !== null ? (
          <Text style={styles.block}>✅ Último bloque: {blockNumber}</Text>
        ) : (
          <ActivityIndicator size="large" color="#2196F3" />
        )}
      </View>

      <Tab.Navigator initialRouteName="Products">
        <Tab.Screen name="Products" component={ProductsScreen} />
        <Tab.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
        <Tab.Screen name="Success" component={SuccessScreen} options={{ title: 'Success' }} />
        <Tab.Screen name="Tokens" component={TokensScreen} />
        <Tab.Screen name="NFTs" component={NFTsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff',
  },
  wallet: {
    fontSize: 16,
    color: '#0f0',
    marginBottom: 10,
  },
  block: {
    fontSize: 18,
    color: '#0f0',
  },
  error: {
    fontSize: 16,
    color: '#f00',
  },
});
