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
} from 'react-native';
import { connectWallet } from '../utils/wallet';

export default function NFTsScreen() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MORALIS_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU2ZDFlNWQ1LTFmMDQtNDI4NC04NjBhLWNlYWU5MTRhZjFjNiIsIm9yZ0lkIjoiNDU5NTg2IiwidXNlcklkIjoiNDcyODMwIiwidHlwZUlkIjoiNDExMWM0YzUtNmMwYy00ZWU5LTk4ZTItZjQzOGM2ZGQ5NGIxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NTI2NTA2ODIsImV4cCI6NDkwODQxMDY4Mn0.1NaDgyz9_AF9qmr9DLUEYPYK79HKcgpaoax41__O3Tg';

  useEffect(() => {
    (async () => {
      try {
        const { address } = await connectWallet();
        const res = await fetch(
          `https://deep-index.moralis.io/api/v2/${address}/nft?chain=polygon&format=decimal`,
          { headers: { 'X-API-Key': MORALIS_KEY } }
        );
        const { result } = await res.json();
        const parsed = result.map(n => {
          let meta = {};
          try {
            meta = typeof n.metadata === 'string' ? JSON.parse(n.metadata) : n.metadata;
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
        }).filter(x => x.image);
        setNfts(parsed);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" color="#fff" />;
  }
  if (error) {
    return <Text style={styles.error}>❌ {error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Galería NFT</Text>
      {nfts.map((nft, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() =>
            Linking.openURL(`https://polygonscan.com/token/${nft.tokenAddress}?a=${nft.tokenId}`)
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
  center: { flex: 1, justifyContent: 'center' },
  container: { padding: 10, backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  card: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderColor: '#b59d35',
    borderWidth: 1,
  },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 8 },
  name: { color: '#fff1a1', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  description: { color: '#ccc', fontSize: 14 },
  error: { color: '#f00', padding: 20, textAlign: 'center' },
});

