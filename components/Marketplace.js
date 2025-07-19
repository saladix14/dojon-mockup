import React from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet, Dimensions } from 'react-native';
import { marketplaceItems } from '../mockData';

export default function Marketplace() {
  const numColumns = 2;
  const formatItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>Precio: {item.priceNSQD} NSQD ({item.priceUSD})</Text>
      <Button title="Comprar" onPress={() => { /* acción comprar */ }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Marketplace</Text>
      <FlatList
        data={marketplaceItems}
        renderItem={formatItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    margin: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: (Dimensions.get('window').width / 2) - 40,
    height: 100,
    marginBottom: 5,
  },
  itemName: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
});
