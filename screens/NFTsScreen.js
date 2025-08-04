// screens/NFTsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Button,
  Alert
} from 'react-native';
import { connectWallet } from '../utils/wallet';

export default function NFTsScreen() {
  const [address, setAddress] = useState(null);
  const [nfts, setNfts]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Tu API Key de Moralis
  const MORALIS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJu...O3Tg';

  // Función para conectar y traer NFTs
  const loadNFTs = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) Conectar la wallet
      const result = await connectWallet();
      if (!result) throw new Error('Conexión fallida');
      setAddress(result.address);

      // 2) Llamar a Moralis
      const url = `https://deep-index.moralis.io/api/v2/${result.address}/nft?chain=polygon&format=decimal`;
      const res = await fetch(url, {
        headers: { 'X-API-Key': MORALIS_KEY }
      });
      const json = await res.json();
      if (!json.result) throw new Error('Respuesta inválida');

      // 3) Parsear metadata
      const parsed = json.result
        .map(n => {
          let meta = {};
          try {
            meta = typeof n.metadata === 'string'
              ? JSON.parse(n.metadata)
              : n.metadata || {};
          } catch {}
          return {
            tokenId: n.token_id,
            name: meta.name || `#${n.token_id}`,
            description: meta.description || '',
            image: meta.image?.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${meta.image.slice(7)}`
              : meta.image,
            tokenAddress: n.token_address,
          };
        })
        .filter(item => item.image); // solo los que tienen imagen

      setNfts(parsed);
    } catch (e) {
      console.error(e);
      setError(e.message);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto: no auto-load aquí, dejamos control al usuario
  useEffect(() => {}, []);

  // Si no conectaste aún, mostrar botón
  if (!address) {
    return (
      <View style={styles.center}>
        {loading
          ? <ActivityIndicator size="large" color="#b59d35" />
          : <Button title="Conectar Wallet y cargar NFTs" onPress={loadNFTs} />
        }
      </View>
    );
  }

  // Si está cargando después de conectar
  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" color="#b59d35" />;
  }

  // Pantalla de NFTs
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎴 NFTs de {address}</Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}

      {nfts.length === 0 && (
        <Text style={styles.empty}>No se encontraron NFTs.</Text>
      )}

      {nfts.map((nft, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() =>
            Linking.openURL(
              `https://polygonscan.com/token/${nft.tokenAddress}?a=${nft.tokenId}`
            )
          }
        >
          <Image source={{ uri: nft.image }} style={styles.image} />
          <Text style={styles.name}>{nft.name}</Text>
          {nft.description.length > 0 && (
            <Text style={styles.description}>{nft.description}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#111'
  },
  container: {
    flex:1,
    backgroundColor:'#111',
    padding:10
  },
  title: {
    color:'#fff',
    fontSize:20,
    marginBottom:12,
    textAlign:'center'
  },
  error: {
    color:'#f00',
    textAlign:'center',
    marginBottom:12
  },
  empty: {
    color:'#ccc',
    textAlign:'center',
    marginTop:20
  },
  card: {
    backgroundColor:'#222',
    borderRadius:8,
    padding:10,
    marginBottom:12,
    borderColor:'#b59d35',
    borderWidth:1
  },
  image: {
    width:'100%',
    height:200,
    borderRadius:6,
    marginBottom:8
  },
  name: {
    color:'#fffa1a',
    fontSize:16,
    fontWeight:'bold'
  },
  description: {
    color:'#ccc',
    marginTop:4
  }
});
