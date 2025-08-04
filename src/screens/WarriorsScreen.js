import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { ethers } from 'ethers';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

export default function WarriorsScreen() {
  const connector = useWalletConnect();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/marketplace/listings')
      .then(res => res.json())
      .then(setListings)
      .catch(console.error);
  }, []);

  const buy = async item => {
    if (!connector.connected) await connector.connect();
    try {
      const provider = new ethers.providers.Web3Provider(connector);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: item.seller,
        value: ethers.BigNumber.from(item.price),
      });
      await tx.wait();
      Alert.alert('Éxito', 'Compra realizada: ' + tx.hash);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo completar la compra');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NFTs Warriors – Marketplace P2P</Text>
      <FlatList
        data={listings}
        keyExtractor={i => i.tokenId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>ID: {item.tokenId}</Text>
            <Text>Vendedor: {item.seller}</Text>
            <Text>Precio: {ethers.utils.formatEther(item.price)} ETH</Text>
            <Button title="Comprar" onPress={() => buy(item)} />
          </View>
        )}
        ListEmptyComponent={<Text style={{color:'#fff'}}>No hay listados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#0a0a0a' },
  header: { fontSize:18, fontWeight:'bold', marginBottom:12, color:'#ff1a1a' },
  card: {
    backgroundColor:'#1a1a1a',
    padding:12,
    marginBottom:10,
    borderRadius:8,
    borderColor:'#b59d35',
    borderWidth:1
  },
});
