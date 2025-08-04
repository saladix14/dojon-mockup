// screens/WalletScreen.js
import React, { useState } from 'react';
import { 
  View, Text, Button, StyleSheet, ActivityIndicator, Alert 
} from 'react-native';
import { connectWallet } from '../utils/connectWallet';

export default function WalletScreen() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const result = await connectWallet();
      if (result) {
        setAddress(result.address);
        // Obtener saldo de MATIC
        const bal = await result.provider.getBalance(result.address);
        const matic = (bal / 1e18).toFixed(4);
        setBalance(matic);
      } else {
        Alert.alert('Error', 'No se pudo conectar la wallet');
      }
    } catch (e) {
      Alert.alert('Error al conectar', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ff1a1a" />
      ) : address ? (
        <>
          <Text style={styles.label}>Dirección:</Text>
          <Text selectable style={styles.address}>{address}</Text>
          <Text style={styles.label}>Saldo MATIC:</Text>
          <Text style={styles.balance}>{balance} MATIC</Text>
          <Button title="Actualizar Saldo" onPress={handleConnect} />
        </>
      ) : (
        <Button title="Conectar Wallet" onPress={handleConnect} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    backgroundColor:'#111', 
    padding:20, 
    justifyContent:'center',
    alignItems:'center'
  },
  label: {
    color:'#fff', 
    fontSize:16, 
    marginTop:20
  },
  address: {
    color:'#0f0', 
    fontSize:14, 
    marginTop:8, 
    textAlign:'center'
  },
  balance: {
    color:'#ff1a1a', 
    fontSize:20, 
    marginTop:8
  }
});
