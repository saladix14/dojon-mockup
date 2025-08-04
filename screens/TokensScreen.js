// screens/TokensScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { connectWallet } from '../utils/connectWallet';
import {
  getConnectedWalletTokenBalance,
  sendToken,
} from '../utils/contract';
import TokenRadar from '../components/TokenRadar';
import { tokens as mockTokens } from '../data/mockData';

export default function TokensScreen() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // 1) Conectar wallet
        const result = await connectWallet();
        if (!result) throw new Error('No se pudo conectar la wallet');
        setWallet(result.address);

        // 2) Obtener saldo real de ERC‑20
        const b = await getConnectedWalletTokenBalance();
        setBalance(b);

        // 3) Cargar datos del radar (mockData o real)
        setTokens(mockTokens);
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSend = async () => {
    setSending(true);
    try {
      const hash = await sendToken(to, amt);
      Alert.alert('Enviado', `Tx Hash:\n${hash}`);
      const b2 = await getConnectedWalletTokenBalance();
      setBalance(b2);
      setTo('');
      setAmt('');
    } catch (e) {
      Alert.alert('Error al enviar', e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff1a1a" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Wallet Info */}
      <Text style={styles.title}>Tokens Dashboard</Text>
      <Text style={styles.label}>Wallet: {wallet}</Text>
      <Text style={styles.label}>Balance: {balance} tokens</Text>

      {/* Radar de Tokens */}
      <View style={styles.radarContainer}>
        <TokenRadar
          tokens={tokens}
          onSelect={t => Alert.alert(t.symbol, `Valor: ${t.value}`)}
        />
      </View>

      {/* Enviar Token */}
      <Text style={styles.subtitle}>Enviar Tokens</Text>
      <TextInput
        style={styles.input}
        placeholder="Dirección destino"
        placeholderTextColor="#888"
        value={to}
        onChangeText={setTo}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        placeholderTextColor="#888"
        keyboardType="decimal-pad"
        value={amt}
        onChangeText={setAmt}
      />
      <Button
        title={sending ? 'Enviando...' : 'Enviar'}
        onPress={handleSend}
        disabled={sending || !to || !amt}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
  },
  radarContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 12,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});
