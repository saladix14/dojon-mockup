// screens/Send.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { provider, getSigner } from '../utils/ethers';

export default function Send() {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  
  const handleSend = async () => {
    try {
      // Aquí asumimos que ya tenemos un signer (p.ej. WalletConnect o MetaMask conectado)
      const signer = getSigner(provider); 
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.utils.parseEther(amount)
      });
      Alert.alert("Transacción enviada", `Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error enviando:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Tokens</Text>
      <Text>Dirección destino:</Text>
      <TextInput
        style={styles.input}
        placeholder="0x..."
        value={toAddress}
        onChangeText={setToAddress}
      />
      <Text>Cantidad (MATIC):</Text>
      <TextInput
        style={styles.input}
        placeholder="0.0"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <Button title="Enviar MATIC" onPress={handleSend} />
      {/* Para enviar ERC-20 habría que usar Contract y transfer */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8 },
});
