// screens/Dashboard.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { provider } from '../utils/ethers';
import { ethers } from 'ethers';

export default function Dashboard() {
  const [address, setAddress] = useState(null);
  const [balances, setBalances] = useState({ matic: '0', usdc: '0' });

  useEffect(() => {
    // Ejemplo: dirección fija o proveniente de WalletConnect
    const userAddress = "0xA..."; // Reemplazar con dirección real
    setAddress(userAddress);

    async function fetchBalances() {
      if (!userAddress) return;
      // Obtener balance de MATIC
      const maticBalance = await provider.getBalance(userAddress);
      // Obtener balance de un token ERC-20 (p.ej. USDC en Polygon)
      const usdcContract = new ethers.Contract(
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Dirección USDC en Polygon
        ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
        provider
      );
      const usdcRaw = await usdcContract.balanceOf(userAddress);
      const decimals = await usdcContract.decimals();
      const usdcFormatted = ethers.utils.formatUnits(usdcRaw, decimals);
      setBalances({
        matic: ethers.utils.formatEther(maticBalance),
        usdc: usdcFormatted,
      });
    }
    fetchBalances();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text>Dirección: {address}</Text>
      <Text>Balance MATIC: {balances.matic}</Text>
      <Text>Balance USDC: {balances.usdc}</Text>
      {/* Agregar más tokens según convenga */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 12 },
});

