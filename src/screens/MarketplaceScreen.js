import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const BACKEND = 'http://localhost:3000';
export default function MarketplaceScreen() {
  const connector = useWalletConnect();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch(\`\${BACKEND}/marketplace/listings\`)
      .then(r => r.json())
      .then(setListings)
      .catch(console.error);
  }, []);

  const buy = async (item) => {
    if (!connector.connected) await connector.connect();
    const provider = new ethers.providers.Web3Provider(connector);
    const signer = provider.getSigner();
    try {
      const tx = await signer.sendTransaction({
        to: item.seller,
        value: ethers.BigNumber.from(item.price),
      });
      await tx.wait();
      Alert.alert('Compra exitosa', tx.hash);
    } catch (e) {
      Alert.alert('Error en compra', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NFTs Marketplace</Text>
      <FlatList
        data={listings}
        keyExtractor={i => i.tokenId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>ID: {item.tokenId}</Text>
            <Text>Precio: {ethers.utils.formatEther(item.price)} ETH</Text>
            <Button title="Comprar" onPress={() => buy(item)} />
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: '#fff' }}>No hay listados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#0a0a0a' },
  header: { fontSize:18, fontWeight:'bold', marginBottom:12, color:'#ff1a1a' },
  card: { backgroundColor:'#1a1a1a', padding:12, marginBottom:10, borderRadius:8, borderColor:'#b59d35', borderWidth:1 },
});
