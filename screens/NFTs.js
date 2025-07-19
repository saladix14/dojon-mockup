// screens/NFTs.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function NFTs() {
  const [address, setAddress] = useState("0xA..."); // Dirección del usuario
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    async function fetchNFTs() {
      if (!address) return;
      const PROJECT_ID = '61fd4076ff1a46e4bb3c902b0bb24927';
      const PROJECT_SECRET = '<INFURA_SECRET>'; // Reemplazar con el secret
      const chainId = "137"; // ID de Polygon Mainnet
      const url = `https://nft.api.infura.io/networks/${chainId}/accounts/${address}/assets/nfts`;
      try {
        const response = await axios.get(url, {
          auth: { username: PROJECT_ID, password: PROJECT_SECRET }
        });
        setNFTs(response.data.assets);
      } catch (error) {
        console.error("Error al obtener NFTs:", error);
      }
    }
    fetchNFTs();
  }, []);

  const renderItem = ({ item }) => {
    const { metadata } = item;
    return (
      <View style={styles.card}>
        <Image source={{ uri: metadata.image }} style={styles.image} />
        <Text style={styles.name}>{metadata.name}</Text>
        {/* Mostrar más datos si se desea */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis NFTs</Text>
      <FlatList
        data={nfts}
        keyExtractor={(item) => item.tokenId + item.contract}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 12 },
  card: { marginBottom: 16, alignItems: 'center' },
  image: { width: 200, height: 200, marginBottom: 8 },
  name: { fontSize: 16 },
});
