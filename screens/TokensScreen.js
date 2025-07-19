// screens/TokensScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';
import { connectWallet } from '../utils/wallet';
import {
  getConnectedWalletTokenBalance,
  sendToken
} from '../utils/contract';

export default function TokensScreen() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { address } = await connectWallet();
        setWallet(address);
        const b = await getConnectedWalletTokenBalance();
        setBalance(b);
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSend = async () => {
    try {
      const hash = await sendToken(to, amt);
      Alert.alert('Enviado', `Tx Hash:\n${hash}`);
      const b2 = await getConnectedWalletTokenBalance();
      setBalance(b2);
    } catch (e) {
      Alert.alert('Error al enviar', e.message);
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Cargando datos…</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Radar de Tokens</Text>
      <Text style={styles.label}>Wallet: {wallet}</Text>
      <Text style={styles.label}>Balance: {balance} tokens</Text>

      <Text style={styles.subtitle}>Enviar Tokens</Text>
      <TextInput
        style={styles.input}
        placeholder="Dirección destino"
        value={to}
        onChangeText={setTo}
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={amt}
        onChangeText={setAmt}
      />
      <Button title="Enviar" onPress={handleSend} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  title: {
    fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20,
  },
  subtitle: {
    fontSize: 20, color: '#fff', marginTop: 20, marginBottom: 10,
  },
  label: {
    color: '#fff', marginBottom: 10,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});

